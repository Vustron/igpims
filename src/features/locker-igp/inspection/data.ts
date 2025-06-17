import type { Inspection } from "@/schemas/inspection"

export const exampleLockerInspections: Inspection[] = [
  {
    id: "v-2024-001",
    dateOfInspection: Date.now() - 1000 * 60 * 60 * 24 * 7,
    dateSet: Date.now() - 1000 * 60 * 60 * 24 * 6,
    violators: [{ id: "2023-45678", name: "John Dela Cruz" }],
    totalFines: 250,
  },
  {
    id: "v-2024-002",
    dateOfInspection: Date.now() - 1000 * 60 * 60 * 24 * 3,
    dateSet: Date.now() - 1000 * 60 * 60 * 24 * 3,
    violators: [{ id: "2023-56789", name: "Maria Garcia" }],
    totalFines: 500,
  },
  {
    id: "v-2024-003",
    dateOfInspection: Date.now() - 1000 * 60 * 60 * 24 * 10,
    dateSet: Date.now() - 1000 * 60 * 60 * 24 * 9,
    violators: [
      { id: "2023-67890", name: "James Reyes" },
      { id: "2023-67891", name: "Rosa Mendez" },
    ],
    totalFines: 300,
  },
  {
    id: "v-2024-004",
    dateOfInspection: Date.now() - 1000 * 60 * 60 * 24 * 5,
    dateSet: Date.now() - 1000 * 60 * 60 * 24 * 5,
    violators: [{ id: "2023-78901", name: "Sofia Mendoza" }],
    totalFines: 100,
  },
  {
    id: "v-2024-005",
    dateOfInspection: Date.now() - 1000 * 60 * 60 * 24 * 2,
    dateSet: Date.now() - 1000 * 60 * 60 * 24 * 2,
    violators: [
      { id: "2023-89012", name: "Antonio Villanueva" },
      { id: "2023-89013", name: "Elena Santos" },
      { id: "2023-89014", name: "Miguel Torres" },
    ],
    totalFines: 400,
  },
]
