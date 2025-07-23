"use client"

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
import { Image } from "@react-pdf/renderer"
import {
  Document,
  PDFDownloadLink,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer"
import { BarChart3, Download, Eye, Printer } from "lucide-react"
import NextImage from "next/image"
import toast from "react-hot-toast"

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 0,
    fontFamily: "Helvetica",
  },
  header: {
    textAlign: "center",
    marginBottom: 0,
    paddingBottom: 0,
    marginTop: 10,
    marginHorizontal: 10,
  },
  headerImage: {
    width: "100%",
    height: "auto",
    maxHeight: 100,
    marginBottom: 0,
    objectFit: "contain",
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
  },
  pageContainer: {
    position: "relative",
    height: "100%",
  },
  content: {
    paddingBottom: 40,
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    marginBottom: 0,
    paddingBottom: 0,
  },
  footerImage: {
    width: "100%",
    height: "auto",
    maxHeight: 60,
    marginBottom: 0,
  },
  pageBreak: {
    pageBreakBefore: "always",
    breakBefore: "page",
  },
})

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
    <Page size="LETTER" style={styles.page}>
      <View style={styles.pageContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Image
              style={styles.headerImage}
              src="/images/header_letter_a4.png"
            />
            <Text style={styles.reportTitle}>IGP Financial Report</Text>
            <Text style={styles.reportPeriod}>
              {igpFinancialData.reportPeriod}
            </Text>
          </View>

          {igpFinancialData.igps[0] && (
            <View style={styles.igpSection}>
              <Text style={styles.igpTitle}>
                {igpFinancialData.igps[0].name} Financial Report
              </Text>
              {renderIgpContent(igpFinancialData.igps[0])}
            </View>
          )}
        </View>

        <View style={styles.footerContainer}>
          <Image
            style={styles.footerImage}
            src="/images/footer_letter_a4.png"
          />
        </View>
      </View>
    </Page>

    {igpFinancialData.igps.slice(1).map((igp, index) => (
      <Page key={index + 1} size="LETTER" style={styles.page}>
        <View style={styles.pageContainer}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Image
                style={styles.headerImage}
                src="/images/header_letter_a4.png"
              />
              <Text style={styles.reportTitle}>
                IGP Financial Report (Continued)
              </Text>
            </View>

            <View style={styles.igpSection}>
              <Text style={styles.igpTitle}>{igp.name} Financial Report</Text>
              {renderIgpContent(igp)}
            </View>
          </View>

          <View style={styles.footerContainer}>
            <Image
              style={styles.footerImage}
              src="/images/footer_letter_a4.png"
            />
          </View>
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
        <div
          className="mx-auto bg-white shadow-lg"
          style={{ width: "8.5in", minHeight: "11in" }}
        >
          {/* Header */}
          <div className="text-center py-4 px-6 border-b-2 border-black">
            <NextImage
              src="/images/header_letter_a4.png"
              alt="footer"
              width={500}
              height={150}
              className="w-full max-h-24 object-contain mx-auto"
              unoptimized
            />
            <p className="mt-2 font-bold text-lg uppercase tracking-wide">
              IGP Financial Report
            </p>
            <p className="mt-1 text-gray-600 text-xs">
              {igpFinancialData.reportPeriod}
            </p>
          </div>

          <div className="p-6">
            {igpFinancialData.igps.map((igp, index) => (
              <div key={index} className="mb-8">
                <div className="mb-4 rounded bg-gray-100 p-2 text-center">
                  <h4 className="font-bold text-sm uppercase tracking-wide">
                    {igp.name} Financial Report
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-xs font-medium">
                      Type:
                    </span>
                    <span className="text-xs font-bold">{igp.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-xs font-medium">
                      Start Date:
                    </span>
                    <span className="text-xs font-bold">
                      {formatDate(igp.startDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-xs font-medium">
                      End Date:
                    </span>
                    <span className="text-xs font-bold">
                      {formatDate(igp.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-xs font-medium">
                      Officers:
                    </span>
                    <span className="text-xs font-bold">
                      {igp.assignedOfficers.join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-xs font-medium">
                      Transactions:
                    </span>
                    <span className="text-xs font-bold">
                      {igp.totalTransactions}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-xs font-medium">
                      Avg. Amount:
                    </span>
                    <span className="text-xs font-bold">
                      {formatCurrency(igp.averageTransaction)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2 rounded mb-4">
                  <div className="text-center">
                    <p className="text-gray-600 text-xs">Total Revenue</p>
                    <p className="text-green-600 text-sm font-bold">
                      {formatCurrency(igp.totalRevenue)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-xs">Total Expenses</p>
                    <p className="text-red-600 text-sm font-bold">
                      {formatCurrency(igp.totalExpenses)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-xs">
                      Net Profit ({igp.profitMargin}%)
                    </p>
                    <p
                      className={`text-sm font-bold ${
                        igp.netProfit >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(igp.netProfit)}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-2 rounded">
                  <h5 className="text-center text-sm font-bold mb-2">
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
                          <tr key={idx}>
                            <td className="border border-gray-300 p-1 text-center">
                              {formatDate(transaction.date)}
                            </td>
                            <td className="border border-gray-300 p-1 text-center">
                              {transaction.description}
                            </td>
                            <td className="border border-gray-300 p-1 text-center">
                              <span
                                className={`text-xs ${
                                  transaction.type === "Revenue"
                                    ? "text-green-800"
                                    : "text-red-800"
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

          {/* Footer */}
          <div className="w-full">
            <NextImage
              src="/images/footer_letter_a4.png"
              alt="footer"
              width={550}
              height={150}
              className="w-full max-h-24 object-contain mx-auto"
              unoptimized
            />
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
