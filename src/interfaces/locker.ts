export interface Locker {
  id: number
  name: string
  status: string
  location: string
}

export const lockerList: Locker[] = [
  {
    id: 1,
    name: "SM - 01",
    status: "active",
    location: "Academic Building - 1st Floor (Left)",
  },
  {
    id: 2,
    name: "SM - 02",
    status: "inactive",
    location: "Academic Building - 1st Floor (Left)",
  },
  {
    id: 3,
    name: "SM - 03",
    status: "under_maintenance",
    location: "Academic Building - 1st Floor (Left)",
  },
  {
    id: 4,
    name: "SM - 04",
    status: "active",
    location: "Academic Building - 1st Floor (Right)",
  },
  {
    id: 5,
    name: "SM - 05",
    status: "active",
    location: "IC - 1st Floor (Right)",
  },
  {
    id: 6,
    name: "SM - 06",
    status: "active",
    location: "Academic Building - 2nd Floor (Left)",
  },
  {
    id: 7,
    name: "SM - 07",
    status: "active",
    location: "Academic Building - 2nd Floor (Left)",
  },
  {
    id: 8,
    name: "SM - 08",
    status: "active",
    location: "Academic Building - 2nd Floor (Right)",
  },
  {
    id: 9,
    name: "SM - 09",
    status: "active",
    location: "Academic Building - 2nd Floor (Right)",
  },
  {
    id: 10,
    name: "SM - 10",
    status: "active",
    location: "Academic Building - 2nd Floor (Right)",
  },
  {
    id: 11,
    name: "SM - 11",
    status: "inactive",
    location: "IC - 1st Floor (Right)",
  },
  {
    id: 12,
    name: "SM - 12",
    status: "inactive",
    location: "IC - 2nd Floor (Right)",
  },
]
