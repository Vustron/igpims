"use client"

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Button } from "@/components/ui/buttons"

interface DynamicPaginationControlsProps {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  isFetching: boolean
  onGoToFirstPage: () => void
  onGoToPreviousPage: () => void
  onGoToNextPage: () => void
  onGoToLastPage: () => void
  onGoToPage: (page: number) => void
}

export const DynamicPaginationControls = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  isFetching,
  onGoToFirstPage,
  onGoToPreviousPage,
  onGoToNextPage,
  onGoToLastPage,
  onGoToPage,
}: DynamicPaginationControlsProps) => {
  if (totalPages <= 1) return null

  const pages = []
  const maxVisiblePages = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <Button
        key={i}
        variant={i === currentPage ? "default" : "outline"}
        size="sm"
        onClick={() => onGoToPage(i)}
        disabled={isFetching}
        className="h-8 w-8 p-0"
      >
        {i}
      </Button>,
    )
  }

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onGoToFirstPage}
          disabled={!hasPrevPage || isFetching}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onGoToPreviousPage}
          disabled={!hasPrevPage || isFetching}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
      </div>

      <div className="flex items-center gap-1">{pages}</div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onGoToNextPage}
          disabled={!hasNextPage || isFetching}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onGoToLastPage}
          disabled={!hasNextPage || isFetching}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
