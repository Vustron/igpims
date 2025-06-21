"use client"

import {
  Document,
  Page,
  PDFDownloadLink,
  pdf,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer"
import { Download, Eye, Printer, TrendingDown, TrendingUp } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/buttons"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialogs"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawers"
import { useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
  },
  report: {
    width: "100%",
    margin: "0 auto",
    border: "2px solid #000000",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: "2px solid #000000",
  },
  schoolTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000000",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 8,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  reportPeriod: {
    fontSize: 10,
    marginTop: 5,
    color: "#666666",
  },
  section: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: "#ffffff",
    border: "1px solid #000000",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    borderBottom: "1px solid #000000",
    paddingBottom: 4,
    textAlign: "center",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderBottom: "1px solid #000000",
    borderTop: "1px solid #000000",
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
  },
  tableHeaderTextLeft: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "left",
    width: "25%",
  },
  tableHeaderTextCenter: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    width: "15%",
  },
  tableRow: {
    flexDirection: "row",
    padding: 6,
    borderBottom: "0.5px solid #cccccc",
    minHeight: 25,
  },
  tableCell: {
    fontSize: 9,
    color: "#000000",
    textAlign: "center",
    width: "15%",
    paddingVertical: 2,
  },
  tableCellLeft: {
    fontSize: 9,
    color: "#000000",
    textAlign: "left",
    width: "25%",
    paddingVertical: 2,
  },
  totalRow: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#e5e5e5",
    borderTop: "2px solid #000000",
    borderBottom: "1px solid #000000",
    marginTop: 5,
    minHeight: 30,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "left",
    width: "25%",
  },
  totalValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    width: "15%",
  },
  summarySection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
    border: "2px solid #000000",
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000000",
    textAlign: "center",
    textTransform: "uppercase",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#000000",
    fontWeight: "bold",
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
  },
  netProfitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingTop: 15,
    paddingHorizontal: 10,
    borderTop: "2px solid #000000",
  },
  netProfitLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
  },
  netProfitValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 8,
    color: "#666666",
    fontStyle: "italic",
    paddingTop: 10,
    borderTop: "1px solid #cccccc",
  },
})

const profitLossData = {
  reportPeriod: "January 1, 2024 - December 31, 2024",
  dateGenerated: new Date().toLocaleDateString(),
  igpData: [
    {
      igpType: "Locker Rental",
      revenue: 125000,
      costOfGoods: 35000,
      grossProfit: 90000,
      expenses: 15000,
      netProfit: 75000,
    },
    {
      igpType: "Water Vendo",
      revenue: 89500,
      costOfGoods: 22000,
      grossProfit: 67500,
      expenses: 18500,
      netProfit: 49000,
    },
    {
      igpType: "Merchandise",
      revenue: 67800,
      costOfGoods: 28000,
      grossProfit: 39800,
      expenses: 12000,
      netProfit: 27800,
    },
    {
      igpType: "Button Pins",
      revenue: 18500,
      costOfGoods: 8200,
      grossProfit: 10300,
      expenses: 3500,
      netProfit: 6800,
    },
    {
      igpType: "T-shirts",
      revenue: 45600,
      costOfGoods: 25000,
      grossProfit: 20600,
      expenses: 7800,
      netProfit: 12800,
    },
    {
      igpType: "Eco Bags",
      revenue: 32100,
      costOfGoods: 15800,
      grossProfit: 16300,
      expenses: 5200,
      netProfit: 11100,
    },
  ],
}

// Calculate totals
const totals = profitLossData.igpData.reduce(
  (acc, item) => ({
    revenue: acc.revenue + item.revenue,
    costOfGoods: acc.costOfGoods + item.costOfGoods,
    grossProfit: acc.grossProfit + item.grossProfit,
    expenses: acc.expenses + item.expenses,
    netProfit: acc.netProfit + item.netProfit,
  }),
  { revenue: 0, costOfGoods: 0, grossProfit: 0, expenses: 0, netProfit: 0 },
)

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const ProfitLossDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.report}>
        <View style={styles.header}>
          <Text style={styles.schoolTitle}>DAVAO DEL NORTE STATE COLLEGE</Text>
          <Text style={styles.subtitle}>Supreme Student Council</Text>
          <Text style={styles.reportTitle}>Profit & Loss Report</Text>
          <Text style={styles.reportPeriod}>{profitLossData.reportPeriod}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Revenue & Profit Analysis by IGP
          </Text>

          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderTextLeft}>IGP Type</Text>
            <Text style={styles.tableHeaderTextCenter}>Revenue</Text>
            <Text style={styles.tableHeaderTextCenter}>Cost of Goods</Text>
            <Text style={styles.tableHeaderTextCenter}>Gross Profit</Text>
            <Text style={styles.tableHeaderTextCenter}>Expenses</Text>
            <Text style={styles.tableHeaderTextCenter}>Net Profit</Text>
          </View>

          {profitLossData.igpData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCellLeft}>{item.igpType}</Text>
              <Text style={styles.tableCell}>
                {formatCurrency(item.revenue)}
              </Text>
              <Text style={styles.tableCell}>
                {formatCurrency(item.costOfGoods)}
              </Text>
              <Text style={styles.tableCell}>
                {formatCurrency(item.grossProfit)}
              </Text>
              <Text style={styles.tableCell}>
                {formatCurrency(item.expenses)}
              </Text>
              <Text style={styles.tableCell}>
                {formatCurrency(item.netProfit)}
              </Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(totals.revenue)}
            </Text>
            <Text style={styles.totalValue}>
              {formatCurrency(totals.costOfGoods)}
            </Text>
            <Text style={styles.totalValue}>
              {formatCurrency(totals.grossProfit)}
            </Text>
            <Text style={styles.totalValue}>
              {formatCurrency(totals.expenses)}
            </Text>
            <Text style={styles.totalValue}>
              {formatCurrency(totals.netProfit)}
            </Text>
          </View>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Financial Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Revenue:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(totals.revenue)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Cost of Goods Sold:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(totals.costOfGoods)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Gross Profit Margin:</Text>
            <Text style={styles.summaryValue}>
              {((totals.grossProfit / totals.revenue) * 100).toFixed(1)}%
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Operating Expenses:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(totals.expenses)}
            </Text>
          </View>

          <View style={styles.netProfitRow}>
            <Text style={styles.netProfitLabel}>NET PROFIT:</Text>
            <Text style={styles.netProfitValue}>
              {formatCurrency(totals.netProfit)}
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Generated on {profitLossData.dateGenerated} | This report contains
          financial data for all Income Generating Projects
        </Text>
      </View>
    </Page>
  </Document>
)

export const ProfitLossDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "printProfitLoss"

  const handlePrint = async () => {
    try {
      const blob = await pdf(<ProfitLossDocument />).toBlob()
      const url = URL.createObjectURL(blob)

      const iframe = document.createElement("iframe")
      iframe.style.display = "none"
      iframe.src = url
      document.body.appendChild(iframe)

      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow?.print()

          const handleAfterPrint = () => {
            setTimeout(() => {
              if (document.body.contains(iframe)) {
                document.body.removeChild(iframe)
              }
              URL.revokeObjectURL(url)
              onClose()
            }, 500)
          }

          iframe.contentWindow?.addEventListener("afterprint", handleAfterPrint)
          iframe.contentWindow?.addEventListener(
            "beforeunload",
            handleAfterPrint,
          )

          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe)
              URL.revokeObjectURL(url)
            }
          }, 60000)
        }, 1000)
      }

      toast.success("Print dialog opened successfully")
    } catch (error) {
      toast.error("Failed to open print dialog")
    }
  }

  const renderPreview = () => (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
          <Eye className="h-4 w-4" />
          Profit & Loss Preview
        </div>
        <p className="text-muted-foreground text-sm">
          Preview of the profit & loss report for all IGP projects
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <div className="mx-auto rounded-lg border-2 border-gray-300 bg-white p-6 shadow-lg">
          <div className="mb-6 border-black border-b-2 pb-4 text-center">
            <h3 className="font-bold text-lg">DAVAO DEL NORTE STATE COLLEGE</h3>
            <p className="text-sm uppercase tracking-wider">
              Supreme Student Council
            </p>
            <p className="mt-2 font-bold text-lg uppercase tracking-wide">
              Profit & Loss Report
            </p>
            <p className="mt-1 text-gray-600 text-xs">
              {profitLossData.reportPeriod}
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">
                    IGP Type
                  </th>
                  <th className="border border-gray-300 p-2">Revenue</th>
                  <th className="border border-gray-300 p-2">Cost of Goods</th>
                  <th className="border border-gray-300 p-2">Gross Profit</th>
                  <th className="border border-gray-300 p-2">Expenses</th>
                  <th className="border border-gray-300 p-2">Net Profit</th>
                </tr>
              </thead>
              <tbody>
                {profitLossData.igpData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2 font-medium">
                      {item.igpType}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {formatCurrency(item.revenue)}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {formatCurrency(item.costOfGoods)}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {formatCurrency(item.grossProfit)}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {formatCurrency(item.expenses)}
                    </td>
                    <td
                      className={`border border-gray-300 p-2 text-center font-medium ${
                        item.netProfit >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(item.netProfit)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-200 font-bold">
                  <td className="border-2 border-gray-400 p-2">TOTAL</td>
                  <td className="border-2 border-gray-400 p-2 text-center">
                    {formatCurrency(totals.revenue)}
                  </td>
                  <td className="border-2 border-gray-400 p-2 text-center">
                    {formatCurrency(totals.costOfGoods)}
                  </td>
                  <td className="border-2 border-gray-400 p-2 text-center">
                    {formatCurrency(totals.grossProfit)}
                  </td>
                  <td className="border-2 border-gray-400 p-2 text-center">
                    {formatCurrency(totals.expenses)}
                  </td>
                  <td
                    className={`border-2 border-gray-400 p-2 text-center ${
                      totals.netProfit >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(totals.netProfit)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <h4 className="mb-4 text-center font-bold uppercase">
              Financial Summary
            </h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex justify-between">
                <span className="font-medium">Total Revenue:</span>
                <span className="font-bold">
                  {formatCurrency(totals.revenue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Cost of Goods:</span>
                <span className="font-bold">
                  {formatCurrency(totals.costOfGoods)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Gross Profit Margin:</span>
                <span className="font-bold">
                  {((totals.grossProfit / totals.revenue) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Expenses:</span>
                <span className="font-bold">
                  {formatCurrency(totals.expenses)}
                </span>
              </div>
            </div>
            <div className="mt-4 flex justify-between border-gray-300 border-t-2 pt-4">
              <span className="font-bold text-lg">NET PROFIT:</span>
              <span
                className={`font-bold text-lg ${
                  totals.netProfit >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(totals.netProfit)}
                {totals.netProfit >= 0 ? (
                  <TrendingUp className="ml-2 inline h-4 w-4" />
                ) : (
                  <TrendingDown className="ml-2 inline h-4 w-4" />
                )}
              </span>
            </div>
          </div>

          <div className="mt-4 border-gray-300 border-t pt-3 text-center text-gray-500 text-xs">
            Generated on {profitLossData.dateGenerated} | Financial data for all
            Income Generating Projects
          </div>
        </div>
      </div>
    </div>
  )

  const renderFooter = () => (
    <div className="flex w-full gap-3">
      <PDFDownloadLink
        document={<ProfitLossDocument />}
        fileName={`profit-loss-report-${new Date().toISOString().split("T")[0]}.pdf`}
        className="flex-1"
      >
        {({ loading }) => (
          <Button variant="outline" className="w-full" disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            {loading ? "Generating PDF..." : "Download PDF"}
          </Button>
        )}
      </PDFDownloadLink>

      <Button className="flex-1" onClick={handlePrint}>
        <Printer className="mr-2 h-4 w-4" />
        Print Report
      </Button>

      <Button variant="outline" className="flex-1" onClick={onClose}>
        Cancel
      </Button>
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] min-w-[1000px] max-w-[1200px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Printer className="h-5 w-5" />
              Print Profit & Loss Report
            </DialogTitle>
          </DialogHeader>
          {renderPreview()}
          <DialogFooter>{renderFooter()}</DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[95vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Print Profit & Loss Report
          </DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-4">{renderPreview()}</div>
        <DrawerFooter className="pt-2">{renderFooter()}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
