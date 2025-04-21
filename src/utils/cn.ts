// utils
import { twMerge } from "tailwind-merge"
import { clsx } from "clsx"

// types
import type { ClassValue } from "clsx"

// class name merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
