import { IgpType, SalesData } from "./sales-report-types"

export function generateMockSalesData(): SalesData[] {
  const igpTypes: IgpType[] = [
    "lockerRental",
    "waterVendo",
    "merchandise",
    "buttonPins",
    "tshirts",
    "ecoBags",
  ]

  const itemNames: Record<IgpType, string[]> = {
    lockerRental: ["Small Locker", "Medium Locker", "Large Locker"],
    waterVendo: ["500ml Refill", "1L Refill", "5L Refill"],
    merchandise: ["College Jacket", "ID Lace", "Department Shirt"],
    buttonPins: ["Small Pin", "Medium Pin", "Large Pin"],
    tshirts: ["Kalibulong Tshirt", "Campus Tshirt", "Department Tshirt"],
    ecoBags: ["Small Eco Bag", "Medium Eco Bag", "Large Eco Bag"],
  }

  const unitPrices: Record<IgpType, number[]> = {
    lockerRental: [100, 150, 200],
    waterVendo: [10, 20, 50],
    merchandise: [800, 150, 350],
    buttonPins: [20, 30, 50],
    tshirts: [300, 350, 400],
    ecoBags: [120, 150, 200],
  }

  const costPrices: Record<IgpType, number[]> = {
    lockerRental: [30, 45, 60],
    waterVendo: [2, 5, 15],
    merchandise: [500, 70, 200],
    buttonPins: [10, 15, 25],
    tshirts: [180, 200, 250],
    ecoBags: [60, 80, 120],
  }

  const result: SalesData[] = []
  const today = new Date()

  // Generate data for the past 12 months
  for (let i = 0; i < 365; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)

    // Generate 2-10 sales per day
    const salesPerDay = Math.floor(Math.random() * 8) + 2

    for (let j = 0; j < salesPerDay; j++) {
      const igpType = igpTypes[
        Math.floor(Math.random() * igpTypes.length)
      ] as IgpType
      const itemIndex = Math.floor(Math.random() * 3)
      const itemName = itemNames[igpType][itemIndex] || "Unknown Item"
      const unitPrice = unitPrices[igpType][itemIndex] || 0
      const costPrice = costPrices[igpType][itemIndex] || 0
      const quantity = Math.floor(Math.random() * 5) + 1
      const totalAmount = quantity * unitPrice
      const profit = totalAmount - quantity * costPrice

      result.push({
        id: `SALE-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}-${Math.floor(
          Math.random() * 1000,
        )
          .toString()
          .padStart(3, "0")}`,
        date: new Date(date),
        igpType,
        itemName,
        quantity,
        unitPrice,
        totalAmount,
        costPrice,
        profit,
      })
    }
  }

  return result
}
