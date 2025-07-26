"use client"

import {
  FinancialDataResponse,
  useGetFinancialData,
} from "@/backend/actions/analytics/get-financial-data"
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
import { formatPrintDocumentCurrency } from "@/utils/currency"
import { formatDateFromTimestamp } from "@/utils/date-convert"
import {
  Document,
  Image,
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

const renderIgpContent = (igp: any) => (
  <>
    {/* IGP Information Grid */}
    <View style={styles.infoGrid}>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Start Date:</Text>
        <Text style={styles.infoValue}>
          {formatDateFromTimestamp(igp.startDate)}
        </Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>End Date:</Text>
        <Text style={styles.infoValue}>
          {formatDateFromTimestamp(igp.endDate)}
        </Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Total Transactions:</Text>
        <Text style={styles.infoValue}>{igp.totalTransactions}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Avg. Transaction:</Text>
        <Text style={styles.infoValue}>{igp.averageTransaction}</Text>
      </View>
    </View>

    {/* Financial Summary */}
    <View style={styles.summaryGrid}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Total Revenue</Text>
        <Text style={[styles.summaryValue, { color: "#059669" }]}>
          {igp.totalRevenue}
        </Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Total Expenses</Text>
        <Text style={[styles.summaryValue, { color: "#DC2626" }]}>
          {igp.totalExpenses}
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
          {igp.netProfit}
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

      {igp.transactions?.map((transaction: any, idx: any) => (
        <View key={idx} style={styles.tableRow}>
          <Text style={styles.tableCell}>
            {formatDateFromTimestamp(transaction.date)}
          </Text>
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
            {transaction.amount}
          </Text>
        </View>
      ))}
    </View>
  </>
)

const IgpFinancialDocument = ({
  financialData,
}: { financialData: FinancialDataResponse }) => {
  const reportData = financialData || {
    reportPeriod: "",
    dateGenerated: 0,
    igps: [],
  }
  return (
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
                {formatDateFromTimestamp(reportData.reportPeriod)}
              </Text>
            </View>

            {reportData.igps[0] && (
              <View style={styles.igpSection}>
                <Text style={styles.igpTitle}>
                  {reportData.igps[0].name} Financial Report
                </Text>
                {renderIgpContent(reportData.igps[0])}
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

      {reportData.igps.slice(1).map((igp: any, index: number) => (
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
}

export const IgpFinancialReportDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "printIgpFinancialReport"
  const { data: response, isLoading, error } = useGetFinancialData()
  const financialData = response

  const handlePrint = async () => {
    if (!financialData) {
      toast.error("No financial data available to print")
      return
    }

    try {
      const blob = await pdf(
        <IgpFinancialDocument financialData={financialData} />,
      ).toBlob()
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

  const renderPreview = () => {
    if (!financialData) {
      return <div>No data available</div>
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center py-10">
          <p className="text-red-500">Error loading financial data</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please try again later
          </p>
        </div>
      )
    }

    if (!financialData) {
      return (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No financial data available</p>
        </div>
      )
    }

    return (
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
                {formatDateFromTimestamp(financialData.reportPeriod)}
              </p>
            </div>

            <div className="p-6">
              {financialData.igps.map((igp: any, index: number) => (
                <div key={index} className="mb-8">
                  <div className="mb-4 rounded bg-gray-100 p-2 text-center">
                    <h4 className="font-bold text-sm uppercase tracking-wide">
                      {igp.name} Financial Report
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-xs font-medium">
                        Start Date:
                      </span>
                      <span className="text-xs font-bold">
                        {formatDateFromTimestamp(igp.startDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-xs font-medium">
                        End Date:
                      </span>
                      <span className="text-xs font-bold">
                        {formatDateFromTimestamp(igp.endDate)}
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
                        {formatPrintDocumentCurrency(igp.averageTransaction)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2 rounded mb-4">
                    <div className="text-center">
                      <p className="text-gray-600 text-xs">Total Revenue</p>
                      <p className="text-green-600 text-sm font-bold">
                        {formatPrintDocumentCurrency(igp.totalRevenue)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 text-xs">Total Expenses</p>
                      <p className="text-red-600 text-sm font-bold">
                        {formatPrintDocumentCurrency(igp.totalExpenses)}
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
                        {formatPrintDocumentCurrency(igp.netProfit)}
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
                          {igp.transactions?.map(
                            (transaction: any, idx: number) => (
                              <tr key={idx}>
                                <td className="border border-gray-300 p-1 text-center">
                                  {formatDateFromTimestamp(transaction.date)}
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
                                  {formatPrintDocumentCurrency(
                                    transaction.amount,
                                  )}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="w-full mt-50">
              <NextImage
                src="/images/footer_letter_a4.png"
                alt="footer"
                width={550}
                height={50}
                className="w-full max-h-24 object-contain mx-auto"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderFooter = () => {
    if (isLoading || error || !financialData) {
      return (
        <div className="flex w-full gap-3">
          <Button variant="outline" className="flex-1" disabled>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button className="flex-1" disabled>
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
        </div>
      )
    }

    return (
      <div className="flex w-full gap-3">
        <PDFDownloadLink
          document={<IgpFinancialDocument financialData={financialData} />}
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
  }

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
