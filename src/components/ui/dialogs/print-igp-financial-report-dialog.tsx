"use client"

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialogs"
import {
  Drawer,
  DrawerTitle,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
} from "@/components/ui/drawers"
import {
  Printer,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/buttons"

import { useMediaQuery } from "@/hooks/use-media-query"
import { useDialog } from "@/hooks/use-dialog"

import {
  pdf,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer"

import toast from "react-hot-toast"

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 20,
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
  igpSection: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: "#ffffff",
    border: "2px solid #000000",
    pageBreakInside: "avoid",
    breakInside: "avoid",
  },
  igpTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderBottom: "1px solid #000000",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  infoItem: {
    width: "48%",
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 4,
    borderBottom: "0.5px solid #cccccc",
  },
  infoLabel: {
    fontSize: 10,
    color: "#666666",
    fontWeight: "bold",
  },
  infoValue: {
    fontSize: 10,
    color: "#000000",
    fontWeight: "bold",
  },
  transactionSection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    border: "1px solid #cccccc",
  },
  transactionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000000",
    textAlign: "center",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e5e5e5",
    padding: 6,
    borderBottom: "1px solid #000000",
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    padding: 4,
    borderBottom: "0.5px solid #cccccc",
    minHeight: 20,
  },
  tableCell: {
    fontSize: 8,
    color: "#000000",
    textAlign: "center",
    flex: 1,
    paddingVertical: 2,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    padding: 8,
    backgroundColor: "#f0f0f0",
    border: "1px solid #000000",
  },
  summaryItem: {
    width: "30%",
    textAlign: "center",
  },
  summaryLabel: {
    fontSize: 9,
    color: "#666666",
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 11,
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
  pageBreak: {
    pageBreakBefore: "always",
    breakBefore: "page",
  },
})

// Sample financial data for each IGP
const igpFinancialData = {
  reportPeriod: "January 1, 2024 - December 31, 2024",
  dateGenerated: new Date().toLocaleDateString(),
  igps: [
    {
      name: "Locker Rental",
      type: "Service",
      startDate: "2024-01-15",
      endDate: "2024-12-15",
      assignedOfficers: ["President", "Treasurer"],
      totalRevenue: 125000,
      totalExpenses: 50000,
      netProfit: 75000,
      totalTransactions: 312,
      averageTransaction: 401,
      profitMargin: 60,
      transactions: [
        {
          date: "2024-01-15",
          description: "Small Locker Rental",
          amount: 100,
          type: "Revenue",
        },
        {
          date: "2024-01-16",
          description: "Large Locker Rental",
          amount: 200,
          type: "Revenue",
        },
        {
          date: "2024-01-20",
          description: "Lock Maintenance",
          amount: -1500,
          type: "Expense",
        },
        {
          date: "2024-02-01",
          description: "Medium Locker Rental",
          amount: 150,
          type: "Revenue",
        },
        {
          date: "2024-02-15",
          description: "Security Upgrade",
          amount: -3000,
          type: "Expense",
        },
      ],
    },
    {
      name: "Water Vendo",
      type: "Product",
      startDate: "2024-02-01",
      endDate: "2024-12-31",
      assignedOfficers: ["Vice President", "Secretary"],
      totalRevenue: 89500,
      totalExpenses: 40500,
      netProfit: 49000,
      totalTransactions: 1789,
      averageTransaction: 50,
      profitMargin: 55,
      transactions: [
        {
          date: "2024-02-01",
          description: "500ml Water Refill",
          amount: 10,
          type: "Revenue",
        },
        {
          date: "2024-02-01",
          description: "1L Water Refill",
          amount: 20,
          type: "Revenue",
        },
        {
          date: "2024-02-05",
          description: "Machine Maintenance",
          amount: -2500,
          type: "Expense",
        },
        {
          date: "2024-02-10",
          description: "5L Water Refill",
          amount: 50,
          type: "Revenue",
        },
        {
          date: "2024-02-20",
          description: "Filter Replacement",
          amount: -1800,
          type: "Expense",
        },
      ],
    },
    {
      name: "Merchandise",
      type: "Product",
      startDate: "2024-03-01",
      endDate: "2024-11-30",
      assignedOfficers: ["Auditor", "PRO"],
      totalRevenue: 67800,
      totalExpenses: 40000,
      netProfit: 27800,
      totalTransactions: 156,
      averageTransaction: 435,
      profitMargin: 41,
      transactions: [
        {
          date: "2024-03-01",
          description: "College Jacket Sale",
          amount: 800,
          type: "Revenue",
        },
        {
          date: "2024-03-05",
          description: "ID Lace Sale",
          amount: 150,
          type: "Revenue",
        },
        {
          date: "2024-03-10",
          description: "Inventory Purchase",
          amount: -15000,
          type: "Expense",
        },
        {
          date: "2024-03-15",
          description: "Department Shirt Sale",
          amount: 350,
          type: "Revenue",
        },
        {
          date: "2024-03-20",
          description: "Packaging Materials",
          amount: -2000,
          type: "Expense",
        },
      ],
    },
    {
      name: "Button Pins",
      type: "Product",
      startDate: "2024-04-01",
      endDate: "2024-10-31",
      assignedOfficers: ["Secretary", "Treasurer"],
      totalRevenue: 18500,
      totalExpenses: 11700,
      netProfit: 6800,
      totalTransactions: 617,
      averageTransaction: 30,
      profitMargin: 37,
      transactions: [
        {
          date: "2024-04-01",
          description: "Small Pin Sale",
          amount: 20,
          type: "Revenue",
        },
        {
          date: "2024-04-05",
          description: "Medium Pin Sale",
          amount: 30,
          type: "Revenue",
        },
        {
          date: "2024-04-10",
          description: "Pin Production Cost",
          amount: -5000,
          type: "Expense",
        },
        {
          date: "2024-04-15",
          description: "Large Pin Sale",
          amount: 50,
          type: "Revenue",
        },
        {
          date: "2024-04-20",
          description: "Design Software",
          amount: -1200,
          type: "Expense",
        },
      ],
    },
    {
      name: "T-shirts",
      type: "Product",
      startDate: "2024-05-01",
      endDate: "2024-12-31",
      assignedOfficers: ["President", "Auditor"],
      totalRevenue: 45600,
      totalExpenses: 32800,
      netProfit: 12800,
      totalTransactions: 132,
      averageTransaction: 345,
      profitMargin: 28,
      transactions: [
        {
          date: "2024-05-01",
          description: "Kalibulong Tshirt Sale",
          amount: 300,
          type: "Revenue",
        },
        {
          date: "2024-05-05",
          description: "Campus Tshirt Sale",
          amount: 350,
          type: "Revenue",
        },
        {
          date: "2024-05-10",
          description: "Fabric Purchase",
          amount: -12000,
          type: "Expense",
        },
        {
          date: "2024-05-15",
          description: "Department Tshirt Sale",
          amount: 400,
          type: "Revenue",
        },
        {
          date: "2024-05-20",
          description: "Printing Cost",
          amount: -8000,
          type: "Expense",
        },
      ],
    },
    {
      name: "Eco Bags",
      type: "Product",
      startDate: "2024-06-01",
      endDate: "2024-12-31",
      assignedOfficers: ["Vice President", "PRO"],
      totalRevenue: 32100,
      totalExpenses: 21000,
      netProfit: 11100,
      totalTransactions: 214,
      averageTransaction: 150,
      profitMargin: 35,
      transactions: [
        {
          date: "2024-06-01",
          description: "Small Eco Bag Sale",
          amount: 120,
          type: "Revenue",
        },
        {
          date: "2024-06-05",
          description: "Medium Eco Bag Sale",
          amount: 150,
          type: "Revenue",
        },
        {
          date: "2024-06-10",
          description: "Material Purchase",
          amount: -8000,
          type: "Expense",
        },
        {
          date: "2024-06-15",
          description: "Large Eco Bag Sale",
          amount: 200,
          type: "Revenue",
        },
        {
          date: "2024-06-20",
          description: "Sewing Equipment",
          amount: -3500,
          type: "Expense",
        },
      ],
    },
  ],
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount))
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const renderIgpContent = (igp: any) => (
  <>
    {/* IGP Information Grid */}
    <View style={styles.infoGrid}>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Type:</Text>
        <Text style={styles.infoValue}>{igp.type}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Start Date:</Text>
        <Text style={styles.infoValue}>{formatDate(igp.startDate)}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>End Date:</Text>
        <Text style={styles.infoValue}>{formatDate(igp.endDate)}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Officers:</Text>
        <Text style={styles.infoValue}>{igp.assignedOfficers.join(", ")}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Total Transactions:</Text>
        <Text style={styles.infoValue}>{igp.totalTransactions}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Avg. Transaction:</Text>
        <Text style={styles.infoValue}>
          {formatCurrency(igp.averageTransaction)}
        </Text>
      </View>
    </View>

    {/* Financial Summary */}
    <View style={styles.summaryGrid}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Total Revenue</Text>
        <Text style={[styles.summaryValue, { color: "#059669" }]}>
          {formatCurrency(igp.totalRevenue)}
        </Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Total Expenses</Text>
        <Text style={[styles.summaryValue, { color: "#DC2626" }]}>
          {formatCurrency(igp.totalExpenses)}
        </Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>
          Net Profit ({igp.profitMargin}%)
        </Text>
        <Text
          style={[
            styles.summaryValue,
            { color: igp.netProfit >= 0 ? "#059669" : "#DC2626" },
          ]}
        >
          {formatCurrency(igp.netProfit)}
        </Text>
      </View>
    </View>

    {/* Recent Transactions */}
    <View style={styles.transactionSection}>
      <Text style={styles.transactionTitle}>Recent Transactions</Text>

      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Date</Text>
        <Text style={styles.tableHeaderText}>Description</Text>
        <Text style={styles.tableHeaderText}>Type</Text>
        <Text style={styles.tableHeaderText}>Amount</Text>
      </View>

      {igp.transactions.map((transaction: any, idx: any) => (
        <View key={idx} style={styles.tableRow}>
          <Text style={styles.tableCell}>{formatDate(transaction.date)}</Text>
          <Text style={styles.tableCell}>{transaction.description}</Text>
          <Text style={styles.tableCell}>{transaction.type}</Text>
          <Text
            style={[
              styles.tableCell,
              {
                color: transaction.amount >= 0 ? "#059669" : "#DC2626",
              },
            ]}
          >
            {transaction.amount >= 0 ? "+" : ""}
            {formatCurrency(transaction.amount)}
          </Text>
        </View>
      ))}
    </View>
  </>
)

const IgpFinancialDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.report}>
        <View style={styles.header}>
          <Text style={styles.schoolTitle}>DAVAO DEL NORTE STATE COLLEGE</Text>
          <Text style={styles.subtitle}>Supreme Student Council</Text>
          <Text style={styles.reportTitle}>IGP Financial Report</Text>
          <Text style={styles.reportPeriod}>
            {igpFinancialData.reportPeriod}
          </Text>
        </View>

        {/* First IGP */}
        {igpFinancialData.igps[0] && (
          <View style={styles.igpSection}>
            <Text style={styles.igpTitle}>
              {igpFinancialData.igps[0].name} Financial Report
            </Text>
            {/* IGP content for first item */}
            {renderIgpContent(igpFinancialData.igps[0])}
          </View>
        )}

        <Text style={styles.footer}>
          Generated on {igpFinancialData.dateGenerated} | This report contains
          detailed financial data for each Income Generating Project
        </Text>
      </View>
    </Page>

    {/* Subsequent pages for remaining IGPs */}
    {igpFinancialData.igps.slice(1).map((igp, index) => (
      <Page key={index + 1} size="A4" style={styles.page}>
        <View style={styles.report}>
          {/* Compact header for subsequent pages */}
          <View
            style={[styles.header, { marginBottom: 15, paddingBottom: 10 }]}
          >
            <Text style={[styles.schoolTitle, { fontSize: 14 }]}>
              DAVAO DEL NORTE STATE COLLEGE
            </Text>
            <Text style={[styles.subtitle, { fontSize: 10 }]}>
              Supreme Student Council - IGP Financial Report
            </Text>
          </View>

          <View style={styles.igpSection}>
            <Text style={styles.igpTitle}>{igp.name} Financial Report</Text>
            {renderIgpContent(igp)}
          </View>

          <Text style={styles.footer}>
            Generated on {igpFinancialData.dateGenerated} | Page {index + 2} of{" "}
            {igpFinancialData.igps.length + 1}
          </Text>
        </View>
      </Page>
    ))}
  </Document>
)

export const IgpFinancialReportDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "printIgpFinancialReport"

  const handlePrint = async () => {
    try {
      const blob = await pdf(<IgpFinancialDocument />).toBlob()
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
          IGP Financial Report Preview
        </div>
        <p className="text-muted-foreground text-sm">
          Preview of detailed financial reports for each IGP project
        </p>
      </div>

      <div className="w-full max-w-6xl">
        <div className="mx-auto rounded-lg border-2 border-gray-300 bg-white p-6 shadow-lg">
          <div className="mb-6 border-black border-b-2 pb-4 text-center">
            <h3 className="font-bold text-lg">DAVAO DEL NORTE STATE COLLEGE</h3>
            <p className="text-sm uppercase tracking-wider">
              Supreme Student Council
            </p>
            <p className="mt-2 font-bold text-lg uppercase tracking-wide">
              IGP Financial Report
            </p>
            <p className="mt-1 text-gray-600 text-xs">
              {igpFinancialData.reportPeriod}
            </p>
          </div>

          {/* IGP Cards */}
          <div className="space-y-6">
            {igpFinancialData.igps.map((igp, index) => (
              <div
                key={index}
                className="rounded-lg border-2 border-gray-200 bg-white p-4"
              >
                <div className="mb-4 rounded bg-gray-100 p-3 text-center">
                  <h4 className="font-bold text-lg uppercase tracking-wide">
                    {igp.name} Financial Report
                  </h4>
                </div>

                {/* Info Grid */}
                <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                  <div className="flex justify-between border-gray-200 border-b pb-1">
                    <span className="font-medium text-gray-600 text-xs">
                      Type:
                    </span>
                    <span className="font-bold text-xs">{igp.type}</span>
                  </div>
                  <div className="flex justify-between border-gray-200 border-b pb-1">
                    <span className="font-medium text-gray-600 text-xs">
                      Start Date:
                    </span>
                    <span className="font-bold text-xs">
                      {formatDate(igp.startDate)}
                    </span>
                  </div>
                  <div className="flex justify-between border-gray-200 border-b pb-1">
                    <span className="font-medium text-gray-600 text-xs">
                      End Date:
                    </span>
                    <span className="font-bold text-xs">
                      {formatDate(igp.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between border-gray-200 border-b pb-1">
                    <span className="font-medium text-gray-600 text-xs">
                      Officers:
                    </span>
                    <span className="font-bold text-xs">
                      {igp.assignedOfficers.join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between border-gray-200 border-b pb-1">
                    <span className="font-medium text-gray-600 text-xs">
                      Transactions:
                    </span>
                    <span className="font-bold text-xs">
                      {igp.totalTransactions}
                    </span>
                  </div>
                  <div className="flex justify-between border-gray-200 border-b pb-1">
                    <span className="font-medium text-gray-600 text-xs">
                      Avg. Amount:
                    </span>
                    <span className="font-bold text-xs">
                      {formatCurrency(igp.averageTransaction)}
                    </span>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="mb-4 grid grid-cols-3 gap-4 rounded bg-gray-50 p-3">
                  <div className="text-center">
                    <p className="text-gray-600 text-xs">Total Revenue</p>
                    <p className="font-bold text-green-600">
                      {formatCurrency(igp.totalRevenue)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-xs">Total Expenses</p>
                    <p className="font-bold text-red-600">
                      {formatCurrency(igp.totalExpenses)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-xs">
                      Net Profit ({igp.profitMargin}%)
                    </p>
                    <p
                      className={`font-bold ${igp.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {formatCurrency(igp.netProfit)}
                      {igp.netProfit >= 0 ? (
                        <TrendingUp className="ml-1 inline h-3 w-3" />
                      ) : (
                        <TrendingDown className="ml-1 inline h-3 w-3" />
                      )}
                    </p>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="rounded border border-gray-200 bg-gray-50 p-3">
                  <h5 className="mb-3 text-center font-bold text-sm">
                    Recent Transactions
                  </h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border border-gray-300 p-1 text-center">
                            Date
                          </th>
                          <th className="border border-gray-300 p-1 text-center">
                            Description
                          </th>
                          <th className="border border-gray-300 p-1 text-center">
                            Type
                          </th>
                          <th className="border border-gray-300 p-1 text-center">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {igp.transactions.map((transaction, idx) => (
                          <tr key={idx} className="hover:bg-gray-100">
                            <td className="border border-gray-300 p-1 text-center">
                              {formatDate(transaction.date)}
                            </td>
                            <td className="border border-gray-300 p-1 text-center">
                              {transaction.description}
                            </td>
                            <td className="border border-gray-300 p-1 text-center">
                              <span
                                className={`rounded px-1 py-0.5 text-xs ${
                                  transaction.type === "Revenue"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {transaction.type}
                              </span>
                            </td>
                            <td
                              className={`border border-gray-300 p-1 text-center font-medium ${
                                transaction.amount >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.amount >= 0 ? "+" : ""}
                              {formatCurrency(transaction.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-gray-300 border-t pt-3 text-center text-gray-500 text-xs">
            Generated on {igpFinancialData.dateGenerated} | Detailed financial
            data for each Income Generating Project
          </div>
        </div>
      </div>
    </div>
  )

  const renderFooter = () => (
    <div className="flex w-full gap-3">
      <PDFDownloadLink
        document={<IgpFinancialDocument />}
        fileName={`igp-financial-report-${new Date().toISOString().split("T")[0]}.pdf`}
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
        <DialogContent className="max-h-[90vh] min-w-[1200px] max-w-[1400px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Print IGP Financial Report
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
            <BarChart3 className="h-5 w-5" />
            Print IGP Financial Report
          </DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-4">{renderPreview()}</div>
        <DrawerFooter className="pt-2">{renderFooter()}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
