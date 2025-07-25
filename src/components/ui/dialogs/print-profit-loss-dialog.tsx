"use client"

import { useFindTotalProfit } from "@/backend/actions/analytics/find-total-profit"
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
import { Download, Eye, Printer, TrendingDown, TrendingUp } from "lucide-react"
import NextImage from "next/image"
import toast from "react-hot-toast"

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 0,
    fontFamily: "Helvetica",
  },
  pageContainer: {
    position: "relative",
    height: "100%",
    paddingHorizontal: 0,
    width: "100%",
  },
  content: {
    paddingBottom: 40,
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
    paddingLeft: 0,
    paddingRight: 0,
    objectFit: "contain",
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 10,
  },
  reportPeriod: {
    fontSize: 10,
    marginTop: 20,
    marginBottom: 20,
    color: "#666666",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottom: "1px solid #e5e5e5",
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
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottom: "1px solid #f0f0f0",
    minHeight: 25,
    alignItems: "center",
  },
  tableCell: {
    fontSize: 9,
    color: "#000000",
    textAlign: "center",
    width: "15%",
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  tableCellLeft: {
    fontSize: 9,
    color: "#000000",
    textAlign: "left",
    width: "25%",
    paddingVertical: 4,
    paddingHorizontal: 5,
  },
  totalRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
    marginTop: 5,
    minHeight: 30,
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "left",
    width: "25%",
  },
  totalValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    width: "15%",
  },
  summarySection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
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
    borderTop: "1px solid #e5e5e5",
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
    maxHeight: 120,
    marginBottom: 0,
  },
})

const ProfitLossDocument = ({
  igpData,
  totals,
  reportPeriod,
}: {
  igpData: {
    igpType: string
    revenue: number
    expenses: number
    netProfit: number
  }[]
  totals: {
    revenue: number
    expenses: number
    netProfit: number
  }
  reportPeriod: string
}) => {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.pageContainer}>
          <View style={styles.content}>
            {/* Header with image */}
            <View style={styles.header}>
              <Image
                style={styles.headerImage}
                src="/images/header_letter_a4.png"
              />
              <Text style={styles.reportTitle}>Profit & Loss Report</Text>
              <Text style={styles.reportPeriod}>{reportPeriod}</Text>
            </View>

            {/* Main table */}
            <View style={{ alignItems: "center" }}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderTextLeft}>IGP Type</Text>
                <Text style={styles.tableHeaderTextCenter}>Revenue</Text>
                <Text style={styles.tableHeaderTextCenter}>Expenses</Text>
                <Text style={styles.tableHeaderTextCenter}>Net Profit</Text>
              </View>

              {igpData.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCellLeft}>{item.igpType}</Text>
                  <Text style={styles.tableCell}>{item.revenue}</Text>
                  <Text style={styles.tableCell}>{item.expenses}</Text>
                  <Text style={styles.tableCell}>{item.netProfit}</Text>
                </View>
              ))}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>TOTAL</Text>
                <Text style={styles.totalValue}>{totals.revenue}</Text>
                <Text style={styles.totalValue}>{totals.expenses}</Text>
                <Text style={styles.totalValue}>{totals.netProfit}</Text>
              </View>
            </View>

            {/* Summary section */}
            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>Financial Summary</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Revenue:</Text>
                <Text style={styles.summaryValue}>{totals.revenue}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Total Operating Expenses:
                </Text>
                <Text style={styles.summaryValue}>{totals.expenses}</Text>
              </View>

              <View style={styles.netProfitRow}>
                <Text style={styles.netProfitLabel}>NET PROFIT:</Text>
                <Text style={styles.netProfitValue}>{totals.netProfit}</Text>
              </View>
            </View>
          </View>

          {/* Footer image */}
          <View style={styles.footerContainer}>
            <Image
              style={styles.footerImage}
              src="/images/footer_letter_a4.png"
            />
          </View>
        </View>
      </Page>
    </Document>
  )
}

export const ProfitLossDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "printProfitLoss"
  const { data: profitData } = useFindTotalProfit()

  const igpData =
    profitData?.igpRevenues.map((igp) => ({
      igpType: igp.name,
      revenue: igp.revenue,
      expenses: igp.expenses,
      netProfit: igp.netProfit,
    })) || []

  const totals = igpData.reduce(
    (acc, item) => ({
      revenue: acc.revenue + item.revenue,
      expenses: acc.expenses + item.expenses,
      netProfit: acc.netProfit + item.netProfit,
    }),
    { revenue: 0, expenses: 0, netProfit: 0 },
  )

  const currentDate = new Date()
  const reportPeriod = `January 1, ${currentDate.getFullYear()} - December 31, ${currentDate.getFullYear()}`

  const handlePrint = async () => {
    try {
      const blob = await pdf(
        <ProfitLossDocument
          igpData={igpData}
          totals={totals}
          reportPeriod={reportPeriod}
        />,
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

      <div className="w-full max-w-4xl overflow-hidden">
        <div className="mx-auto rounded-lg border-2 border-gray-300 bg-white p-0 shadow-lg relative">
          {/* Header Image */}
          <div className="w-full">
            <div className="relative h-24 w-full">
              <NextImage
                src="/images/header_letter_a4.png"
                alt="DNSC Header"
                fill
                className="w-full max-h-24 object-contain mx-auto"
                unoptimized
              />
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6 pb-4 text-center">
              <p className="mt-2 font-bold text-lg uppercase tracking-wide">
                Profit & Loss Report
              </p>
              <p className="mt-1 text-gray-600 text-xs">{reportPeriod}</p>
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
                    <th className="border border-gray-300 p-2">Expenses</th>
                    <th className="border border-gray-300 p-2">Net Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {igpData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2 font-medium">
                        {item.igpType}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        {formatPrintDocumentCurrency(item.revenue)}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        {formatPrintDocumentCurrency(item.expenses)}
                      </td>
                      <td
                        className={`border border-gray-300 p-2 text-center font-medium ${
                          item.netProfit >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatPrintDocumentCurrency(item.netProfit)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-200 font-bold">
                    <td className="border-2 border-gray-400 p-2">TOTAL</td>
                    <td className="border-2 border-gray-400 p-2 text-center">
                      {formatPrintDocumentCurrency(totals.revenue)}
                    </td>
                    <td className="border-2 border-gray-400 p-2 text-center">
                      {formatPrintDocumentCurrency(totals.expenses)}
                    </td>
                    <td
                      className={`border-2 border-gray-400 p-2 text-center ${
                        totals.netProfit >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatPrintDocumentCurrency(totals.netProfit)}
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
                    {formatPrintDocumentCurrency(totals.revenue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Expenses:</span>
                  <span className="font-bold">
                    {formatPrintDocumentCurrency(totals.expenses)}
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
                  {formatPrintDocumentCurrency(totals.netProfit)}
                  {totals.netProfit >= 0 ? (
                    <TrendingUp className="ml-2 inline h-4 w-4" />
                  ) : (
                    <TrendingDown className="ml-2 inline h-4 w-4" />
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Image */}
          <div className="w-full">
            <div className="relative h-24 w-full">
              <NextImage
                src="/images/footer_letter_a4.png"
                alt="DNSC Footer"
                fill
                className="w-full max-h-24 cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderFooter = () => (
    <div className="flex w-full gap-3">
      <PDFDownloadLink
        document={
          <ProfitLossDocument
            igpData={igpData}
            totals={totals}
            reportPeriod={reportPeriod}
          />
        }
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
