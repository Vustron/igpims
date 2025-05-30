<#
.SYNOPSIS
PowerShell script to remove specified folders recursively with detailed progress reporting.

.DESCRIPTION
This script searches for and removes specified folders (like node_modules) with real-time progress,
size calculations, and comprehensive statistics. Supports dry-run mode for safety.
Handles different PowerShell versions for optimized scanning.

.PARAMETER Path
The root directory to search (defaults to current directory).

.PARAMETER DryRun
Simulates the operation without actually deleting anything.

.PARAMETER Verbose
Shows detailed processing information.

.PARAMETER Folders
Comma-separated string of folder names to target for removal (e.g., "node_modules,.cache").

.PARAMETER ParallelThrottleLimit
Defines the maximum number of parallel threads for counting operations (PowerShell 7+).

.EXAMPLE
.\cleanup.ps1 -Path "C:\Projects" -Folders "node_modules,.next" -DryRun

.EXAMPLE
.\cleanup.ps1 -Folders "target,build" -ParallelThrottleLimit 3

.NOTES
Requires PowerShell 7+ for parallel scanning optimization in Get-TotalWork.
Falls back to sequential scanning on older PowerShell versions.
Robocopy is used for faster size calculation if available; otherwise, Get-ChildItem is used.
#>

param (
    [ValidateScript({ Test-Path $_ -PathType Container })]
    [string]$Path = (Get-Location),
    [switch]$DryRun = $false,
    [switch]$Verbose = $false,
    [string]$Folders = "",
    [int]$ParallelThrottleLimit = 5 # Added parameter for throttle limit
)

# Enhanced console output setup
$host.UI.RawUI.WindowTitle = "Folder Cleanup Utility"
$ErrorActionPreference = "Stop"

# Improved size formatting with color coding
function Format-Size {
    param ([long]$size)
    if ($size -gt 1TB) { return ("{0:N2} TB" -f ($size / 1TB), 'Magenta') }
    elseif ($size -gt 1GB) { return ("{0:N2} GB" -f ($size / 1GB), 'Cyan') }
    elseif ($size -gt 1MB) { return ("{0:N2} MB" -f ($size / 1MB), 'Green')}
    elseif ($size -gt 1KB) { return ("{0:N2} KB" -f ($size / 1KB), 'Yellow')}
    else { return ("$size Bytes", 'White') }
}

# Initialize statistics with more detailed tracking
$stats = @{
    TotalSize = 0L
    TotalFolders = 0
    ProcessedItems = 0 # This will count directories scanned in Remove-Folders
    FoundTargetFolders = 0 # Specifically for folders that are matches and processed (deleted or identified in dry-run)
    FailedItems = 0
    CurrentFile = ""
    StartTime = [datetime]::Now
    LastUpdate = [datetime]::Now
}

$processedPaths = New-Object System.Collections.Generic.HashSet[string]

# Enhanced folder input handling
function Get-FoldersToRemove {
    Write-Host "`n┌──────────────────────────────────────────────────────┐" -ForegroundColor DarkCyan
    Write-Host "│         Folder Cleanup Utility - Configuration         │" -ForegroundColor DarkCyan
    Write-Host "└──────────────────────────────────────────────────────┘" -ForegroundColor DarkCyan
    
    if (-not [string]::IsNullOrWhiteSpace($Folders)) {
        $userFolders = $Folders -split ",\s*" | Where-Object { $_ -ne "" } | ForEach-Object { $_.Trim() }
        Write-Host " Using predefined folders: $($userFolders -join ', ')" -ForegroundColor Cyan
        return $userFolders
    }

    Write-Host " Enter folders to remove (comma-separated, e.g., node_modules,.next,.turbo):" -ForegroundColor Cyan
    $userInput = Read-Host " Folders"
    return $userInput -split ",\s*" | Where-Object { $_ -ne "" } | ForEach-Object { $_.Trim() }
}

# Optimized folder existence check
function Test-FoldersExist {
    param ([string[]]$folderNames, [string]$basePath)
    
    Write-Host "`n🔍 Checking for folder existence in '$basePath'..." -ForegroundColor Cyan
    $foundFolders = [System.Collections.Generic.List[string]]::new()
    $notFoundFolders = [System.Collections.Generic.List[string]]::new()
    
    $folderNames | ForEach-Object {
        $folder = $_
        # Check for existence of at least one instance
        $exists = Get-ChildItem -Path $basePath -Recurse -Directory -Force -ErrorAction SilentlyContinue -Filter $folder |
                  Select-Object -First 1
        
        if ($exists) {
            $foundFolders.Add($folder)
            Write-Host "   ✓ Found instances of: $folder" -ForegroundColor Green
        } else {
            $notFoundFolders.Add($folder)
            Write-Host "   ✗ Not found: $folder" -ForegroundColor DarkGray
        }
    }

    return @{
        Found = $foundFolders
        NotFound = $notFoundFolders
    }
}

# High-performance total work calculation (number of target folders to process)
function Get-TotalWork {
    param ([string]$searchPath, [string[]]$targetFolders) # Added targetFolders as parameter
    
    Write-Host "`n🧮 Calculating total number of target folders..." -ForegroundColor Cyan
    $progressActivity = "Pre-scan: Counting target folders"
    $totalMatchingFolders = 0

    #region #*** MODIFICATION START: PowerShell Version Check for Parallelism ***
    if ($PSVersionTable.PSVersion.Major -ge 7) {
        Write-Host " (Using PowerShell 7+ parallel scan with throttle limit: $ParallelThrottleLimit)" -ForegroundColor DarkGray
        
        # Use parallel processing for faster scanning and collect results
        # Note: $using:searchPath and $using:progressActivity are used to pass variables to the parallel scope
        $countsPerFolderType = $targetFolders | ForEach-Object -Parallel {
            $folderName = $_
            $count = (Get-ChildItem -Path $using:searchPath -Recurse -Directory -Force -ErrorAction SilentlyContinue -Filter $folderName).Count
            
            # Progress for individual parallel tasks (indeterminate as they run concurrently)
            Write-Progress -Activity $using:progressActivity -Status "Counting instances of '$folderName'..." -PercentComplete -1 -Id 3
            return $count
        } -ThrottleLimit $ParallelThrottleLimit

        $totalMatchingFolders = ($countsPerFolderType | Measure-Object -Sum).Sum
        Write-Progress -Activity $progressActivity -Completed -Id 3 # Complete the pre-scan progress bar
    } else {
        Write-Host " (Using sequential scan for PowerShell $($PSVersionTable.PSVersion.Major).$($PSVersionTable.PSVersion.Minor). Consider PS7+ for faster pre-scan.)" -ForegroundColor DarkGray
        $currentFolderTypeIndex = 0
        $totalFolderTypesToScan = $targetFolders.Count

        foreach ($folderName in $targetFolders) {
            $currentFolderTypeIndex++
            $percentComplete = if ($totalFolderTypesToScan -gt 0) { ($currentFolderTypeIndex * 100 / $totalFolderTypesToScan) } else { 0 }
            Write-Progress -Activity $progressActivity -Status "Counting '$folderName' ($currentFolderTypeIndex/$totalFolderTypesToScan sequentially)" -PercentComplete $percentComplete -Id 3
            
            $count = (Get-ChildItem -Path $searchPath -Recurse -Directory -Force -ErrorAction SilentlyContinue -Filter $folderName).Count
            $totalMatchingFolders += $count
        }
        Write-Progress -Activity $progressActivity -Completed -Id 3 # Complete the pre-scan progress bar
    }
    #endregion #*** MODIFICATION END ***

    Write-Host "   Found $totalMatchingFolders target folder(s) to process." -ForegroundColor Green
    return $totalMatchingFolders
}

# Main folder removal function with enhanced progress reporting
function Remove-Folders {
    param ([string]$currentPath)

    # Efficiently skip already processed paths (useful for symlinks/junctions creating loops)
    if (-not $processedPaths.Add($currentPath)) { return }

    # Process child directories first (depth-first)
    $childDirectories = Get-ChildItem -Path $currentPath -Directory -Force -ErrorAction SilentlyContinue
    
    foreach ($subDir in $childDirectories) {
        $folderPath = $subDir.FullName
        
        # Update progress information (counting all directories scanned)
        $stats.ProcessedItems++ # Counts every directory entered for scanning
        $stats.CurrentFile = $subDir.Name
        
        # Calculate $currentProgress based on $stats.FoundTargetFolders against $totalWork (total target folders)
        # This makes progress reflect actual targets processed rather than all scanned directories.
        $progress = if ($totalWork -gt 0) { [math]::Min(100, [math]::Round(($stats.FoundTargetFolders / $totalWork) * 100)) } else { 0 }
        
        # Throttle UI updates to prevent flickering
        if (([datetime]::Now - $stats.LastUpdate).TotalMilliseconds -gt 100 -or ($progress -eq 100 -and $stats.FoundTargetFolders -eq $totalWork) ) {
            $stats.LastUpdate = [datetime]::Now
            $sizeInfo = Format-Size $stats.TotalSize
            $timeElapsed = ([datetime]::Now - $stats.StartTime).ToString("hh\:mm\:ss")
            
            # Main Progress Bar (ID 1): Overall progress of identified target folders
            Write-Progress -Id 1 -Activity "🚀 Processing Targets: $($stats.FoundTargetFolders)/$totalWork" `
                             -Status "💾 Freed: $($sizeInfo[0]) | ⏱️ Elapsed: $timeElapsed" `
                             -PercentComplete $progress
            
            # Secondary Progress Bar (ID 2): Current scanning activity
            Write-Progress -Id 2 -Activity "🔍 Scanning: $($stats.CurrentFile)" `
                             -Status "📂 Scanned Dirs: $($stats.ProcessedItems) | ❌ Failed Ops: $($stats.FailedItems)" `
                             -PercentComplete $progress # Linking its % to main progress for consistency
        }

        if ($foldersToRemove -contains $subDir.Name) {
            $stats.FoundTargetFolders++ # Increment when a target folder is identified
            try {
                $folderSize = 0L # Initialize to 0L to ensure it's always a long

                # --- Size Calculation Logic (robocopy with fallback) ---
                $robocopyPath = Get-Command robocopy -ErrorAction SilentlyContinue
                if ($robocopyPath) {
                    $command = "$($robocopyPath.Source) `"$folderPath`" NUL /L /S /NP /BYTES /NFL /NDL /NJH /NJS /XJ /R:0 /W:0"
                    # Suppress errors from robocopy itself during Invoke-Expression for parsing
                    $summaryLines = Invoke-Expression $command -ErrorAction SilentlyContinue 
                    $summaryMatch = $summaryLines | Select-String "Bytes\s*:\s*(\d+)" # Changed variable name for clarity
                    
                    if ($summaryMatch -and $summaryMatch.Matches[0].Groups[1].Value) {
                        $folderSize = [long]$summaryMatch.Matches[0].Groups[1].Value
                    } else { 
                        # Fallback if robocopy output parsing fails or returns no relevant lines
                        $folderItems = Get-ChildItem $folderPath -Recurse -Force -File -ErrorAction SilentlyContinue
                        # .Sum on an empty collection or non-existent path might be $null
                        $measuredSum = ($folderItems | Measure-Object -Property Length -Sum -ErrorAction SilentlyContinue).Sum
                        $folderSize = if ($null -ne $measuredSum) { [long]$measuredSum } else { 0L }
                    }
                } else { 
                    # Fallback if robocopy command is not found
                    $folderItems = Get-ChildItem $folderPath -Recurse -Force -File -ErrorAction SilentlyContinue
                    $measuredSum = ($folderItems | Measure-Object -Property Length -Sum -ErrorAction SilentlyContinue).Sum
                    $folderSize = if ($null -ne $measuredSum) { [long]$measuredSum } else { 0L }
                }
                # Final assurance $folderSize is a long value
                $folderSize = if ($null -eq $folderSize) { 0L } else { [convert]::ToInt64($folderSize) }
                # --- End of Size Calculation ---
                
                $stats.TotalSize += $folderSize
                $sizeInfo = Format-Size $folderSize 
                
                if ($DryRun) {
                    Write-Host "🚧 [DRY RUN] Would remove: $folderPath (Size: $($sizeInfo[0]))" -ForegroundColor DarkYellow 
                    $stats.TotalFolders++ 
                } else {
                    Write-Host "🗑️ Removing: $(Split-Path $folderPath -Leaf) (Size: $($sizeInfo[0]))..." -ForegroundColor "Yellow" -NoNewline
                    Remove-Item -Path $folderPath -Recurse -Force -ErrorAction Stop
                    
                    $doneMessageColor = 'Green'

                    if ($sizeInfo -and ($sizeInfo -is [array]) -and $sizeInfo.Length -ge 2 -and $sizeInfo[1] -is [string]) {
                        if ([System.Enum]::IsDefined([System.ConsoleColor], $sizeInfo[1])) {
                            $doneMessageColor = $sizeInfo[1]
                        } else {
                            Write-Warning "SCRIPT_INTERNAL_DEBUG: Invalid color name '$($sizeInfo[1])' received from Format-Size for '$folderPath'. Defaulting to '$doneMessageColor'."
                        }
                    } else {
                        Write-Warning "SCRIPT_INTERNAL_DEBUG: Variable 'sizeInfo' from Format-Size was not as expected for '$folderPath'. Defaulting color to '$doneMessageColor'. Actual 'sizeInfo' value: $($sizeInfo | ForEach-Object {$_} | Out-String -Stream)"
                    }
                    Write-Host " Done." -ForegroundColor $doneMessageColor
                    $stats.TotalFolders++ 
                }
            } catch {
                $stats.FailedItems++
                Write-Host 
                Write-Host "❌ Error processing/removing '$([System.IO.Path]::GetFileName($folderPath))': $($_.Exception.Message)" -ForegroundColor Red
            }
        } elseif ($Verbose) {
            Write-Host "   ...Scanning sub-directory: $(Split-Path $folderPath -Leaf)" -ForegroundColor DarkGray
        }

        # Recurse into the sub-directory if it wasn't a target folder (or if it was but we want to clean inside it too - current logic doesn't do that)
        # If a folder (e.g. node_modules) is removed, we don't need to recurse into it.
        # So, recursion should happen for non-target folders to find targets deeper.
        if (-not ($foldersToRemove -contains $subDir.Name)) {
             Remove-Folders -currentPath $folderPath
        }
    }
}

# Main execution flow
try {
    $foldersToRemove = Get-FoldersToRemove
    if ($foldersToRemove.Count -eq 0) {
        Write-Host "`n❌ No folder names specified. Exiting..." -ForegroundColor Red
        exit 1
    }

    $existenceCheck = Test-FoldersExist -folderNames $foldersToRemove -basePath $Path
    if ($existenceCheck.NotFound.Count -gt 0 -and $existenceCheck.Found.Count -eq 0) {
        Write-Host "`n⚠️ None of the specified folders were found in '$Path'." -ForegroundColor Yellow
        $existenceCheck.NotFound | ForEach-Object { Write-Host "   - $_" }
        exit
    }
    
    if ($existenceCheck.NotFound.Count -gt 0) {
        Write-Host "`n⚠️ Warning: Some specified folder types were not found in '$Path':" -ForegroundColor Yellow
        $existenceCheck.NotFound | ForEach-Object { Write-Host "   - $_" }
        
        $proceed = Read-Host "`n❓ Continue with found folder types only? ($($existenceCheck.Found -join ', ')) (Y/N)"
        if ($proceed -notmatch '^[yY]') {
            Write-Host "Operation cancelled by user." -ForegroundColor Yellow
            exit
        }
        $foldersToRemove = $existenceCheck.Found # Update to only process found ones
        if ($foldersToRemove.Count -eq 0) {
            Write-Host "No folders to process after filtering. Exiting..." -ForegroundColor Yellow
            exit
        }
    }

    Write-Host "`n🔧 Will process the following folder types:" -ForegroundColor Cyan
    $foldersToRemove | ForEach-Object { Write-Host "   - $_" -ForegroundColor White }

    # Calculate total work based on the *final* list of folders to remove
    $totalWork = Get-TotalWork -searchPath $Path -targetFolders $foldersToRemove
    if ($totalWork -eq 0) {
        Write-Host "`n✅ No instances of the target folders found in '$Path'. Nothing to do." -ForegroundColor Green
        exit
    }
    # Initialize $stats.FoundTargetFolders to 0 before starting the main removal process
    $stats.FoundTargetFolders = 0L

    Write-Host "`n🚀 Starting cleanup in '$Path'..." -ForegroundColor Cyan
    if ($DryRun) { Write-Host "🛑 DRY RUN MODE: No actual deletions will occur." -ForegroundColor Yellow }

    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    Remove-Folders -currentPath $Path # Start scanning from the root path
    $stopwatch.Stop()

    # Final output completion for progress bars
    Write-Progress -Id 1 -Completed
    Write-Progress -Id 2 -Completed

    $sizeInfo = Format-Size $stats.TotalSize
    $timeElapsed = $stopwatch.Elapsed.ToString("hh\:mm\:ss\.fff")

    Write-Host "`n┌──────────────────────────────────────────────────────┐" -ForegroundColor DarkCyan
    Write-Host "│                      Cleanup Summary                     │" -ForegroundColor DarkCyan
    Write-Host "├──────────────────────────────────────────────────────┤" -ForegroundColor DarkCyan
    Write-Host ("│ 🎯 Target Folders {0}: {1} │" -f $(if ($DryRun) {"Identified"} else {"Removed"}), $stats.TotalFolders.ToString().PadRight(21)) -ForegroundColor White
    Write-Host ("│ 💾 Space Reclaimed: {0} │" -f $sizeInfo[0].PadRight(32)) -ForegroundColor $sizeInfo[1]
    Write-Host ("│ ⚠️  Failed operations: {0} │" -f $stats.FailedItems.ToString().PadRight(28)) -ForegroundColor $(if ($stats.FailedItems -gt 0) { 'Red' } else { 'White' })
    Write-Host ("│ ⏱️  Time elapsed: {0} │" -f $timeElapsed.PadRight(33)) -ForegroundColor White
    Write-Host ("│ 📂 Dirs Scanned (approx): {0} │" -f $stats.ProcessedItems.ToString().PadRight(24)) -ForegroundColor White
    Write-Host "└──────────────────────────────────────────────────────┘" -ForegroundColor DarkCyan

    if ($DryRun) {
        Write-Host "`n💡 To perform actual cleanup, run the script again without the -DryRun switch." -ForegroundColor Yellow
    }
}
catch {
    Write-Host "`n❌ FATAL SCRIPT ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Stack Trace: $($_.ScriptStackTrace)" -ForegroundColor DarkRed # Added stack trace for better debugging
    exit 1
}
