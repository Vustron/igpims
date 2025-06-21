"use client"

import { RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alerts"
import { Button } from "@/components/ui/buttons"

interface TableErrorStateProps {
  error: Error | null
  onRetry: () => void
}

export const TableErrorState = ({ error, onRetry }: TableErrorStateProps) => {
  return (
    <div className="mt-2">
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load data: {error?.message || "Unknown error"}
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="ml-2"
          >
            <RefreshCw className="mr-1 h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}
