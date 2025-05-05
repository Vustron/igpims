// change color badge function
export const getPercentageChangeColor = (percentageChange: string) => {
  const value = Number.parseFloat(percentageChange)
  return value >= 0
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400"
}
