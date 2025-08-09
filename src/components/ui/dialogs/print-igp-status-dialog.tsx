"use client"

import {
  IgpStatusReport,
  useIgpStatus,
} from "@/backend/actions/analytics/igp-status"
import { Badge } from "@/components/ui/badges"
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
import {
  CheckCircle,
  Download,
  Eye,
  Printer,
  Target,
  Wrench,
} from "lucide-react"
import NextImage from "next/image"
import { usePathname } from "next/navigation"
import toast from "react-hot-toast"

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 8,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    lineHeight: 1.3,
  },
  pageContainer: {
    position: "relative",
    height: "100%",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerImage: {
    width: "100%",
    height: "auto",
    maxHeight: 100,
    marginBottom: 10,
    objectFit: "contain",
  },
  report: {
    paddingHorizontal: 20,
  },
  header: {
    textAlign: "center",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: "1pt solid #000",
  },
  schoolTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#000",
  },
  subtitle: {
    fontSize: 9,
    marginBottom: 4,
    color: "#000",
    textTransform: "uppercase",
  },
  reportTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 4,
    color: "#000",
    textTransform: "uppercase",
  },
  reportPeriod: {
    fontSize: 8,
    marginTop: 2,
    color: "#666",
  },
  statusSection: {
    marginBottom: 10,
    padding: 6,
    backgroundColor: "#fff",
    border: "0.5pt solid #000",
  },
  statusTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#000",
    textAlign: "center",
    paddingBottom: 4,
    borderBottom: "0.5pt solid #000",
  },
  igpItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
    borderBottom: "0.25pt solid #000",
  },
  igpName: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#000",
    width: "40%",
  },
  igpType: {
    fontSize: 7,
    color: "#444",
    width: "30%",
    textAlign: "center",
  },
  igpDetails: {
    fontSize: 7,
    color: "#000",
    width: "30%",
    textAlign: "right",
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    padding: 6,
    backgroundColor: "#fff",
    border: "0.5pt solid #000",
  },
  summaryItem: {
    width: "32%",
    textAlign: "center",
  },
  summaryLabel: {
    fontSize: 7,
    color: "#666",
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000",
  },
  footer: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 6,
    color: "#666",
    fontStyle: "italic",
    paddingTop: 6,
    borderTop: "0.5pt solid #ccc",
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
  },
  footerImage: {
    width: "100%",
    height: "auto",
    maxHeight: 60,
  },
})

const IgpStatusDocument = ({ data }: { data: IgpStatusReport }) => {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.pageContainer}>
          <View style={styles.content}>
            <Image
              style={styles.headerImage}
              src="/images/header_letter_a4.png"
            />

            <View style={styles.report}>
              <View style={styles.header}>
                <Text style={styles.reportTitle}>IGP Status Report</Text>
                <Text style={styles.reportPeriod}>{data.reportPeriod}</Text>
              </View>

              {/* Active IGPs Section */}
              <View style={styles.statusSection}>
                <Text style={[styles.statusTitle]}>
                  ACTIVE IGPs ({data.active.length})
                </Text>

                {data.active.map((igp, index) => (
                  <View key={index} style={styles.igpItem}>
                    <Text style={styles.igpName}>{igp.name}</Text>
                    <Text style={styles.igpType}>{igp.type}</Text>
                    <Text style={styles.igpDetails}>{igp.revenue}</Text>
                  </View>
                ))}
              </View>

              {/* Objectives Section */}
              <View style={styles.statusSection}>
                <Text style={[styles.statusTitle]}>
                  OBJECTIVES / IN PROGRESS ({data.objectives.length})
                </Text>

                {data.objectives.map((obj, index) => (
                  <View key={index} style={styles.igpItem}>
                    <Text style={styles.igpName}>{obj.name}</Text>
                    <Text style={styles.igpType}>{obj.progress}% Complete</Text>
                    <Text style={styles.igpDetails}>{obj.igpRevenue}</Text>
                  </View>
                ))}
              </View>

              {/* For Repair Section */}
              <View style={styles.statusSection}>
                <Text style={[styles.statusTitle]}>
                  FOR REPAIR / MAINTENANCE ({data.forRepair.length})
                </Text>

                {data.forRepair.map((repair, index) => (
                  <View key={index} style={styles.igpItem}>
                    <Text style={styles.igpName}>{repair.name}</Text>
                    <Text style={styles.igpType}>{repair.status}</Text>
                    <Text style={styles.igpDetails}>
                      Last: {repair.lastRevenue}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Summary */}
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Total Active</Text>
                  <Text style={[styles.summaryValue]}>
                    {data.active.length}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>In Development</Text>
                  <Text style={[styles.summaryValue]}>
                    {data.objectives.length}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Under Repair</Text>
                  <Text style={[styles.summaryValue]}>
                    {data.forRepair.length}
                  </Text>
                </View>
              </View>
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
    </Document>
  )
}

export const PrintIgpStatusDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "printIgpStatus"
  const pathname = usePathname()
  const fetchIgpStatus = pathname === "/report"
  const { data, isLoading, error } = useIgpStatus({
    isEnabled: fetchIgpStatus,
  })

  const handlePrint = async () => {
    if (!data) return

    try {
      const blob = await pdf(<IgpStatusDocument data={data} />).toBlob()
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
    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          Loading IGP status data...
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex justify-center py-8">
          Error loading IGP status data
        </div>
      )
    }

    if (!data) {
      return (
        <div className="flex justify-center py-8">
          No IGP status data available
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
            <Eye className="h-4 w-4" />
            IGP Status Report Preview
          </div>
          <p className="text-muted-foreground text-sm">
            Overview of all IGP statuses including active, objectives, and
            repair status
          </p>
        </div>

        <div className="w-full max-w-4xl">
          <div className="mx-auto rounded-lg border-2 border-gray-300 bg-white p-0 shadow-lg relative min-h-[15in]">
            {/* Header Image */}
            <div className="relative h-24 w-full">
              <NextImage
                src="/images/header_letter_a4.png"
                alt="DNSC Header"
                fill
                className="object-contain"
              />
            </div>

            <div className="p-6">
              <div className="mb-6 border-black border-b-2 pb-4 text-center">
                <p className="mt-2 font-bold text-lg uppercase tracking-wide">
                  IGP Status Report
                </p>
                <p className="mt-1 text-gray-600 text-xs">
                  {data.reportPeriod}
                </p>
              </div>

              {/* Active IGPs */}
              <div className="mb-6">
                <div className="mb-4 flex items-center gap-2 rounded bg-green-50 p-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h4 className="font-bold text-green-800 text-lg">
                    ACTIVE IGPs ({data.active.length})
                  </h4>
                </div>
                <div className="space-y-2">
                  {data.active.map((igp, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-gray-200 border-b py-2"
                    >
                      <div className="flex-1">
                        <span className="font-medium text-sm">{igp.name}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {igp.type}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-green-600 text-sm">
                          {formatPrintDocumentCurrency(igp.revenue)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Objectives */}
              <div className="mb-6">
                <div className="mb-4 flex items-center gap-2 rounded bg-yellow-50 p-3">
                  <Target className="h-5 w-5 text-yellow-600" />
                  <h4 className="font-bold text-lg text-yellow-800">
                    OBJECTIVES / IN PROGRESS ({data.objectives.length})
                  </h4>
                </div>
                <div className="space-y-2">
                  {data.objectives.map((obj, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-gray-200 border-b py-2"
                    >
                      <div className="flex-1">
                        <span className="font-medium text-sm">{obj.name}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {obj.progress}% Complete
                        </Badge>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-sm text-yellow-600">
                          {formatPrintDocumentCurrency(obj.igpRevenue)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* For Repair */}
              <div className="mb-6">
                <div className="mb-4 flex items-center gap-2 rounded bg-red-50 p-3">
                  <Wrench className="h-5 w-5 text-red-600" />
                  <h4 className="font-bold text-lg text-red-800">
                    FOR REPAIR / MAINTENANCE ({data.forRepair.length})
                  </h4>
                </div>
                <div className="space-y-2">
                  {data.forRepair.map((repair, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-gray-200 border-b py-2"
                    >
                      <div className="flex-1">
                        <span className="font-medium text-sm">
                          {repair.name}
                        </span>
                        <Badge variant="destructive" className="ml-2 text-xs">
                          {repair.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-red-600 text-sm">
                          Last:{" "}
                          {formatPrintDocumentCurrency(repair.lastRevenue)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 grid grid-cols-3 gap-4 rounded bg-gray-50 p-4">
                <div className="text-center">
                  <p className="font-bold text-2xl text-green-600">
                    {data.active.length}
                  </p>
                  <p className="text-gray-600 text-sm">Total Active</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-2xl text-yellow-600">
                    {data.objectives.length}
                  </p>
                  <p className="text-gray-600 text-sm">In Development</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-2xl text-red-600">
                    {data.forRepair.length}
                  </p>
                  <p className="text-gray-600 text-sm">Under Repair</p>
                </div>
              </div>
            </div>

            {/* Footer Image */}
            <div className="absolute bottom-0 w-full p-0">
              <NextImage
                src="/images/footer_letter_a4.png"
                alt="footer"
                width={2000}
                height={50}
                className="w-full max-h-24 object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderFooter = () => {
    if (!data) return null

    return (
      <div className="flex w-full gap-3">
        <PDFDownloadLink
          document={<IgpStatusDocument data={data} />}
          fileName={`igp-status-report-${new Date().toISOString().split("T")[0]}.pdf`}
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
        <DialogContent className="max-h-[90vh] min-w-[1000px] max-w-[1200px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Print IGP Status Report
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
            <CheckCircle className="h-5 w-5" />
            Print IGP Status Report
          </DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-4">
          {renderPreview()}
          <div className="mt-6">{renderFooter()}</div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
