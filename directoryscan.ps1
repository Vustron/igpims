<#
.SYNOPSIS
    Generates an ASCII directory tree excluding specific folders with labeled folders and explanations.
.DESCRIPTION
    This script creates a visual tree structure of directories, excluding .turbo, .husky, .next, and node_modules.
    It adds labels to folders based on their names and provides explanations for each label.
.NOTES
    File Name      : directoryscan.ps1
    Author         : Vustron Vustronus
    Prerequisite   : PowerShell 5.1 or later
#>

function Get-AsciiTree {
    param (
        [string]$rootPath = ".",
        [string]$indent = "",
        [bool]$isLast = $true,
        [bool]$includeExplanations = $true
    )

    # Define folders to exclude
    $excludedFolders = @('.turbo', '.husky', '.next', 'node_modules')

    # Get all child items (directories only)
    $childItems = Get-ChildItem -Path $rootPath -Directory |
                  Where-Object { $excludedFolders -notcontains $_.Name } |
                  Sort-Object Name

    $count = $childItems.Count
    $current = 0

    # Process current folder
    $folderName = Split-Path -Leaf $rootPath
    $labelInfo = Get-FolderLabel -folderName $folderName
    $label = $labelInfo.Label
    $explanation = $labelInfo.Explanation

    $output = "${indent}$(if ($isLast) { '\---' } else { '+---' })"
    if ($label) {
        $output += "[$label] $folderName"
        if ($includeExplanations -and $explanation) {
            $output += " - $explanation"
        }
    } else {
        $output += $folderName
    }

    Write-Output $output

    # Update indent for children
    $newIndent = $indent + $(if ($isLast) { "    " } else { "|   " })

    # Process child items
    foreach ($child in $childItems) {
        $current++
        Get-AsciiTree -rootPath $child.FullName -indent $newIndent -isLast ($current -eq $count) -includeExplanations $includeExplanations
    }
}

function Get-FolderLabel {
    param (
        [string]$folderName
    )

    # Define your folder name to label mappings here with explanations
    $labelMappings = @{
        'src' = @{
            Label = 'SOURCE'
            Explanation = 'Contains the main source code for the application'
        }
        'public' = @{
            Label = 'ASSETS'
            Explanation = 'Public assets accessible by the browser'
        }
        'components' = @{
            Label = 'UI'
            Explanation = 'Reusable UI components'
        }
        'pages' = @{
            Label = 'VIEWS'
            Explanation = 'Page-level components representing routes'
        }
        'utils' = @{
            Label = 'HELPERS'
            Explanation = 'Utility functions and helper code'
        }
        'styles' = @{
            Label = 'CSS'
            Explanation = 'Styling and CSS/SCSS files'
        }
        'scripts' = @{
            Label = 'JS'
            Explanation = 'JavaScript scripts and utilities'
        }
        'config' = @{
            Label = 'SETTINGS'
            Explanation = 'Configuration files and settings'
        }
        'dist' = @{
            Label = 'BUILD'
            Explanation = 'Distribution files for deployment'
        }
        'build' = @{
            Label = 'OUTPUT'
            Explanation = 'Built and compiled files'
        }
        'test' = @{
            Label = 'TESTS'
            Explanation = 'Test files and test suites'
        }
        'docs' = @{
            Label = 'DOCUMENTATION'
            Explanation = 'Documentation files and guides'
        }
        'api' = @{
            Label = 'ENDPOINTS'
            Explanation = 'API endpoints and handlers'
        }
        'lib' = @{
            Label = 'LIBRARY'
            Explanation = 'Library code and shared functionality'
        }
        'types' = @{
            Label = 'TYPESCRIPT'
            Explanation = 'TypeScript type definitions'
        }
        'app' = @{
            Label = 'APPLICATION'
            Explanation = 'Main application logic and structure'
        }
        'backend' = @{
            Label = 'SERVER'
            Explanation = 'Server-side code and functionality'
        }
        'actions' = @{
            Label = 'ACTIONS'
            Explanation = 'Action handlers for forms or API requests'
        }
        'controllers' = @{
            Label = 'CONTROLLERS'
            Explanation = 'Controller logic for handling requests'
        }
        'routes' = @{
            Label = 'ROUTES'
            Explanation = 'Route definitions and handlers'
        }
        'hooks' = @{
            Label = 'HOOKS'
            Explanation = 'Custom React hooks and shared logic'
        }
        'fonts' = @{
            Label = 'FONTS'
            Explanation = 'Font files and typography assets'
        }
        'schemas' = @{
            Label = 'SCHEMAS'
            Explanation = 'Data schemas and validation rules'
        }
        'features' = @{
            Label = 'FEATURES'
            Explanation = 'Feature-based code organization'
        }
        'migrations' = @{
            Label = 'DATABASE'
            Explanation = 'Database migration scripts'
        }
        'meta' = @{
            Label = 'METADATA'
            Explanation = 'Metadata information and configuration'
        }
        'icons' = @{
            Label = 'ICONS'
            Explanation = 'Icon assets and SVG files'
        }
        'images' = @{
            Label = 'IMAGES'
            Explanation = 'Image assets and media files'
        }
        'auth' = @{
            Label = 'AUTH'
            Explanation = 'Authentication related functionality'
        }
        'reset-password' = @{
            Label = 'PASSWORD'
            Explanation = 'Password reset functionality'
        }
        'sign-in' = @{
            Label = 'LOGIN'
            Explanation = 'User login functionality'
        }
        'sign-up' = @{
            Label = 'REGISTER'
            Explanation = 'User registration functionality'
        }
        'verify' = @{
            Label = 'VERIFICATION'
            Explanation = 'Account verification process'
        }
        'root' = @{
            Label = 'ROOT'
            Explanation = 'Root-level application components'
        }
        'email' = @{
            Label = 'EMAIL'
            Explanation = 'Email templates and functionality'
        }
        'user' = @{
            Label = 'USER'
            Explanation = 'User-related functionality and data'
        }
        'slugs' = @{
            Label = 'DYNAMIC'
            Explanation = 'Dynamic route handling'
        }
        'middlewares' = @{
            Label = 'MIDDLEWARE'
            Explanation = 'Request processing middleware'
        }
        'queries' = @{
            Label = 'DATABASE'
            Explanation = 'Database queries and operations'
        }
        'context' = @{
            Label = 'STATE'
            Explanation = 'Application state and context providers'
        }
        'ui' = @{
            Label = 'COMPONENTS'
            Explanation = 'UI component library'
        }
        'interfaces' = @{
            Label = 'TYPES'
            Explanation = 'TypeScript interfaces and type definitions'
        }
        'alerts' = @{
            Label = 'ALERT'
            Explanation = 'Alert and notification components'
        }
        'badges' = @{
            Label = 'BADGE'
            Explanation = 'Badge and indicator components'
        }
        'breadcrumbs' = @{
            Label = 'NAVIGATION'
            Explanation = 'Breadcrumb navigation components'
        }
        'buttons' = @{
            Label = 'BUTTON'
            Explanation = 'Button UI components'
        }
        'cards' = @{
            Label = 'CARD'
            Explanation = 'Card layout components'
        }
        'checkboxes' = @{
            Label = 'INPUT'
            Explanation = 'Checkbox input components'
        }
        'dialogs' = @{
            Label = 'MODAL'
            Explanation = 'Dialog and modal components'
        }
        'drawers' = @{
            Label = 'NAVIGATION'
            Explanation = 'Drawer navigation components'
        }
        'dropdowns' = @{
            Label = 'SELECT'
            Explanation = 'Dropdown selection components'
        }
        'fallbacks' = @{
            Label = 'ERROR'
            Explanation = 'Error fallback components'
        }
        'forms' = @{
            Label = 'FORM'
            Explanation = 'Form components and elements'
        }
        'inputs' = @{
            Label = 'INPUT'
            Explanation = 'Input field components'
        }
        'labels' = @{
            Label = 'LABEL'
            Explanation = 'Label components for forms'
        }
        'paginations' = @{
            Label = 'NAVIGATION'
            Explanation = 'Pagination navigation components'
        }
        'popovers' = @{
            Label = 'OVERLAY'
            Explanation = 'Popover overlay components'
        }
        'progress' = @{
            Label = 'LOADER'
            Explanation = 'Progress and loading indicators'
        }
        'scrollareas' = @{
            Label = 'SCROLL'
            Explanation = 'Scrollable area components'
        }
        'selects' = @{
            Label = 'SELECT'
            Explanation = 'Selection input components'
        }
        'separators' = @{
            Label = 'DIVIDER'
            Explanation = 'Visual separator components'
        }
        'sheets' = @{
            Label = 'OVERLAY'
            Explanation = 'Sheet overlay components'
        }
        'tables' = @{
            Label = 'TABLE'
            Explanation = 'Table display components'
        }
        'tooltips' = @{
            Label = 'TOOLTIP'
            Explanation = 'Tooltip information components'
        }
    }

    # Return the label if found, otherwise return null objects
    $lowerName = $folderName.ToLower()

    # Handle special cases with parentheses and brackets
    $cleanName = $lowerName -replace '[\(\)\[\]]', ''

    foreach ($key in $labelMappings.Keys) {
        if ($cleanName -eq $key.ToLower() -or $cleanName -like "*$($key.ToLower())*") {
            return $labelMappings[$key]
        }
    }

    return @{
        Label = $null
        Explanation = $null
    }
}

# Main execution
Clear-Host
Write-Output "Directory Tree with Labels and Explanations"
Write-Output "=========================================="
Get-AsciiTree -rootPath (Get-Location).Path -includeExplanations $true
