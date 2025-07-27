"use client"

import {
  StudentDuesReport,
  useGetDuePayments,
} from "@/backend/actions/analytics/due-payments"
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
import { Skeleton } from "@/components/ui/fallbacks"
import { useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { formatPrintDocumentCurrency } from "@/utils/currency"
import { formatDateFromTimestamp, returnDateDue } from "@/utils/date-convert"
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
  AlertTriangle,
  Calendar,
  Clock,
  Download,
  Eye,
  Printer,
} from "lucide-react"
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
  },
  content: {
    paddingBottom: 0,
  },
  report: {
    width: "100%",
    margin: "0 auto",
    padding: 15,
    backgroundColor: "#ffffff",
  },
  header: {
    textAlign: "center",
    marginBottom: 0,
    paddingBottom: 0,
    marginHorizontal: 10,
  },
  headerImage: {
    width: "100%",
    height: "auto",
    maxHeight: 100,
    marginBottom: 10,
    marginTop: 3,
    objectFit: "contain",
  },
  schoolTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000000",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 11,
    marginBottom: 8,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  reportPeriod: {
    fontSize: 9,
    marginTop: 5,
    color: "#000000",
  },
  section: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#ffffff",
    border: "1px solid #000000",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
    backgroundColor: "#ffffff",
    padding: 6,
    borderBottom: "1px solid #000000",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    padding: 6,
    backgroundColor: "#ffffff",
    border: "1px solid #000000",
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000000",
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000000",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 6,
    borderBottom: "2px solid #000000",
    marginTop: 8,
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
  },
  tableHeaderLeft: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "left",
    paddingLeft: 4,
  },
  tableHeaderCenter: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    padding: 4,
    borderBottom: "0.5px solid #000000",
    minHeight: 20,
  },
  tableCell: {
    fontSize: 8,
    color: "#000000",
    textAlign: "center",
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  tableCellLeft: {
    fontSize: 8,
    color: "#000000",
    textAlign: "left",
    paddingVertical: 2,
    paddingLeft: 4,
  },
  overdueRow: {
    flexDirection: "row",
    padding: 4,
    borderBottom: "0.5px solid #000000",
    backgroundColor: "#ffffff",
    minHeight: 20,
  },
  dueRow: {
    flexDirection: "row",
    padding: 4,
    borderBottom: "0.5px solid #000000",
    backgroundColor: "#ffffff",
    minHeight: 20,
  },
  footer: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 7,
    color: "#000000",
    fontStyle: "italic",
    paddingTop: 4,
    borderTop: "1px solid #000000",
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
})

const DueOverdueDocument = ({ data }: { data: StudentDuesReport }) => {
  const reportPeriod = data?.reportPeriod
    ? new Date(data.reportPeriod)
    : new Date()

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
              <Text style={styles.reportTitle}>
                Due & Overdue Payments Report
              </Text>
              <Text style={styles.reportPeriod}>
                {formatDateFromTimestamp(reportPeriod)}
              </Text>
            </View>

            <View style={styles.report}>
              {/* Overdue Students Section */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle]}>
                  Overdue Payments ({data?.overdueStudents?.length || 0}{" "}
                  Students)
                </Text>

                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderLeft, { width: "25%" }]}>
                    Student Details
                  </Text>
                  <Text style={[styles.tableHeaderCenter, { width: "12%" }]}>
                    Course
                  </Text>
                  <Text style={[styles.tableHeaderCenter, { width: "15%" }]}>
                    IGP Type
                  </Text>
                  <Text style={[styles.tableHeaderCenter, { width: "12%" }]}>
                    Amount
                  </Text>
                  <Text style={[styles.tableHeaderCenter, { width: "15%" }]}>
                    Due Date
                  </Text>
                  <Text style={[styles.tableHeaderCenter, { width: "21%" }]}>
                    Days Overdue
                  </Text>
                </View>

                {data?.overdueStudents?.map((student: any, index: number) => (
                  <View key={index} style={styles.overdueRow}>
                    <View style={[styles.tableCellLeft, { width: "25%" }]}>
                      <Text style={{ fontSize: 8, fontWeight: "bold" }}>
                        {student.studentName}
                      </Text>
                    </View>
                    <Text style={[styles.tableCell, { width: "12%" }]}>
                      {student.courseAndSet}
                    </Text>
                    <Text style={[styles.tableCell, { width: "15%" }]}>
                      {student.igpType}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        { fontWeight: "bold", width: "12%" },
                      ]}
                    >
                      {student.amountDue}
                    </Text>
                    <Text style={[styles.tableCell, { width: "15%" }]}>
                      {formatDateFromTimestamp(student.dateDue)}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        { fontWeight: "bold", width: "21%" },
                      ]}
                    >
                      {returnDateDue(student.dateDue)} days
                    </Text>
                  </View>
                ))}
              </View>

              {/* Due Students Section */}
              <View style={[styles.section, { marginTop: 15 }]}>
                <Text style={[styles.sectionTitle]}>
                  Upcoming Due Payments ({data?.dueStudents?.length || 0}{" "}
                  Students)
                </Text>

                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderLeft, { width: "25%" }]}>
                    Student Details
                  </Text>
                  <Text style={[styles.tableHeaderCenter, { width: "12%" }]}>
                    Course
                  </Text>
                  <Text style={[styles.tableHeaderCenter, { width: "15%" }]}>
                    IGP Type
                  </Text>
                  <Text style={[styles.tableHeaderCenter, { width: "12%" }]}>
                    Amount
                  </Text>
                  <Text style={[styles.tableHeaderCenter, { width: "15%" }]}>
                    Due Date
                  </Text>
                  <Text style={[styles.tableHeaderCenter, { width: "21%" }]}>
                    Days Until Due
                  </Text>
                </View>

                {data?.dueStudents?.map((student: any, index: number) => (
                  <View key={index} style={styles.dueRow}>
                    <View style={[styles.tableCellLeft, { width: "25%" }]}>
                      <Text style={{ fontSize: 8, fontWeight: "bold" }}>
                        {student.studentName}
                      </Text>
                    </View>
                    <Text style={[styles.tableCell, { width: "12%" }]}>
                      {student.courseAndSet}
                    </Text>
                    <Text style={[styles.tableCell, { width: "15%" }]}>
                      {student.igpType}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        { fontWeight: "bold", width: "12%" },
                      ]}
                    >
                      {student.amountDue}
                    </Text>
                    <Text style={[styles.tableCell, { width: "15%" }]}>
                      {formatDateFromTimestamp(student.dateDue)}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        { fontWeight: "bold", width: "21%" },
                      ]}
                    >
                      {returnDateDue(student.dateDue)} days
                    </Text>
                  </View>
                ))}
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

export const DueOverduePaymentsDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "printDueOverduePayments"
  const { data, isLoading } = useGetDuePayments()

  const handlePrint = async () => {
    try {
      const blob = await pdf(<DueOverdueDocument data={data!} />).toBlob()
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

  const totalOverdueAmount =
    data?.overdueStudents?.reduce(
      (sum: number, student: any) => sum + student.amountDue,
      0,
    ) || 0

  const totalDueAmount =
    data?.dueStudents?.reduce(
      (sum: number, student: any) => sum + student.amountDue,
      0,
    ) || 0

  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center space-y-6">
          <div className="text-center">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
              <Eye className="h-4 w-4" />
              Due & Overdue Payments Preview
            </div>
            <p className="text-muted-foreground text-sm">
              Loading payment data...
            </p>
          </div>

          <div className="w-full max-w-6xl">
            <div
              className="mx-auto bg-white shadow-lg"
              style={{ width: "8.5in", minHeight: "11in" }}
            >
              <div className="p-6 space-y-6">
                {/* Loading skeletons for summary cards */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-lg" />
                  ))}
                </div>

                {/* Loading skeleton for total outstanding */}
                <Skeleton className="h-20 rounded-lg" />

                {/* Loading skeletons for tables */}
                <div className="space-y-6">
                  <Skeleton className="h-10 w-1/3 rounded" />
                  <Skeleton className="h-64 rounded" />
                  <Skeleton className="h-10 w-1/3 rounded" />
                  <Skeleton className="h-64 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    const reportPeriod = new Date(data?.reportPeriod || Date.now())

    return (
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
            <Eye className="h-4 w-4" />
            Due & Overdue Payments Preview
          </div>
          <p className="text-muted-foreground text-sm">
            Preview of students with due and overdue payment obligations
          </p>
        </div>

        <div className="w-full max-w-6xl">
          <div
            className="mx-auto bg-white shadow-lg relative min-h-[11in]"
            style={{ width: "8.5in" }}
          >
            {/* Header Image */}
            <div>
              <div className="relative h-24 w-full">
                <NextImage
                  src="/images/header_letter_a4.png"
                  alt="DNSC Header"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="pb-4 text-center">
                <p className="mt-2 font-bold text-lg uppercase tracking-wide">
                  Due & Overdue Payments Report
                </p>
                <p className="mt-1 text-gray-600 text-xs">
                  {formatDateFromTimestamp(reportPeriod)}
                </p>
              </div>
            </div>

            <div className="p-6 pb-24">
              {/* Summary Cards */}
              <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
                  <div className="flex items-center justify-center gap-1 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-bold text-sm">Overdue</span>
                  </div>
                  <p className="font-bold text-lg text-red-700">
                    {data?.overdueStudents?.length || 0}
                  </p>
                  <p className="text-red-600 text-xs">Students</p>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
                  <span className="font-bold text-red-600 text-sm">Amount</span>
                  <p className="font-bold text-lg text-red-700">
                    {formatPrintDocumentCurrency(totalOverdueAmount)}
                  </p>
                  <p className="text-red-600 text-xs">Overdue</p>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center">
                  <div className="flex items-center justify-center gap-1 text-amber-600">
                    <Clock className="h-4 w-4" />
                    <span className="font-bold text-sm">Due Soon</span>
                  </div>
                  <p className="font-bold text-amber-700 text-lg">
                    {data?.dueStudents?.length || 0}
                  </p>
                  <p className="text-amber-600 text-xs">Students</p>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center">
                  <span className="font-bold text-amber-600 text-sm">
                    Amount
                  </span>
                  <p className="font-bold text-amber-700 text-lg">
                    {formatPrintDocumentCurrency(totalDueAmount)}
                  </p>
                  <p className="text-amber-600 text-xs">Due</p>
                </div>
              </div>

              {/* Total Outstanding */}
              <div className="mb-6 rounded-lg border-2 border-gray-300 bg-gray-100 p-4 text-center">
                <span className="font-bold text-gray-700">
                  TOTAL OUTSTANDING AMOUNT
                </span>
                <p className="font-bold text-2xl text-gray-900">
                  {formatPrintDocumentCurrency(
                    totalOverdueAmount + totalDueAmount,
                  )}
                </p>
              </div>

              {/* Overdue Students Table */}
              {data?.overdueStudents?.length ? (
                <div className="mb-6">
                  <div className="mb-3 flex items-center gap-2 rounded bg-red-100 p-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <h4 className="font-bold text-red-800 uppercase">
                      Overdue Payments ({data.overdueStudents.length} Students)
                    </h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="bg-red-100">
                          <th className="border border-gray-300 p-2 text-left">
                            Student Details
                          </th>
                          <th className="border border-gray-300 p-2">Course</th>
                          <th className="border border-gray-300 p-2">
                            IGP Type
                          </th>
                          <th className="border border-gray-300 p-2">Amount</th>
                          <th className="border border-gray-300 p-2">
                            Due Date
                          </th>
                          <th className="border border-gray-300 p-2">
                            Days Overdue
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.overdueStudents.map(
                          (student: any, index: number) => (
                            <tr
                              key={index}
                              className="bg-red-50 hover:bg-red-100"
                            >
                              <td className="border border-gray-300 p-2">
                                <div>
                                  <p className="font-bold">
                                    {student.studentName}
                                  </p>
                                </div>
                              </td>
                              <td className="border border-gray-300 p-2 text-center">
                                {student.courseAndSet}
                              </td>
                              <td className="border border-gray-300 p-2 text-center">
                                {student.igpType}
                              </td>
                              <td className="border border-gray-300 p-2 text-center font-bold text-red-600">
                                {formatPrintDocumentCurrency(student.amountDue)}
                              </td>
                              <td className="border border-gray-300 p-2 text-center">
                                {formatDateFromTimestamp(student.dateDue)}
                              </td>
                              <td className="border border-gray-300 p-2 text-center font-bold text-red-600">
                                {returnDateDue(student.dateDue)} days
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                  <p className="text-gray-500">No overdue payments found</p>
                </div>
              )}

              {/* Due Students Table */}
              {data?.dueStudents?.length ? (
                <div className="mb-6">
                  <div className="mb-3 flex items-center gap-2 rounded bg-amber-100 p-3">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <h4 className="font-bold text-amber-800 uppercase">
                      Upcoming Due Payments ({data.dueStudents.length} Students)
                    </h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="bg-amber-100">
                          <th className="border border-gray-300 p-2 text-left">
                            Student Details
                          </th>
                          <th className="border border-gray-300 p-2">Course</th>
                          <th className="border border-gray-300 p-2">
                            IGP Type
                          </th>
                          <th className="border border-gray-300 p-2">Amount</th>
                          <th className="border border-gray-300 p-2">
                            Due Date
                          </th>
                          <th className="border border-gray-300 p-2">
                            Days Until Due
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.dueStudents.map((student: any, index: number) => (
                          <tr
                            key={index}
                            className="bg-amber-50 hover:bg-amber-100"
                          >
                            <td className="border border-gray-300 p-2">
                              <div>
                                <p className="font-bold">
                                  {student.studentName}
                                </p>
                              </div>
                            </td>
                            <td className="border border-gray-300 p-2 text-center">
                              {student.courseAndSet}
                            </td>
                            <td className="border border-gray-300 p-2 text-center">
                              {student.igpType}
                            </td>
                            <td className="border border-gray-300 p-2 text-center font-bold text-amber-600">
                              {formatPrintDocumentCurrency(student.amountDue)}
                            </td>
                            <td className="border border-gray-300 p-2 text-center">
                              {formatDateFromTimestamp(student.dateDue)}
                            </td>
                            <td className="border border-gray-300 p-2 text-center font-bold text-amber-600">
                              {returnDateDue(student.dateDue)} days
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                  <p className="text-gray-500">
                    No upcoming due payments found
                  </p>
                </div>
              )}
            </div>

            {/* Footer Image */}
            <div className="absolute bottom-0 w-full">
              <NextImage
                src="/images/footer_letter_a4.png"
                alt="footer"
                width={1000}
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

  const renderFooter = () => (
    <div className="flex w-full gap-3">
      <PDFDownloadLink
        document={<DueOverdueDocument data={data!} />}
        fileName={`due-overdue-payments-${new Date().toISOString().split("T")[0]}.pdf`}
        className="flex-1"
      >
        {({ loading }) => (
          <Button
            variant="outline"
            className="w-full"
            disabled={loading || isLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            {loading ? "Generating PDF..." : "Download PDF"}
          </Button>
        )}
      </PDFDownloadLink>

      <Button className="flex-1" onClick={handlePrint} disabled={isLoading}>
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
              <Calendar className="h-5 w-5" />
              Print Due & Overdue Payments Report
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
            <Calendar className="h-5 w-5" />
            Print Due & Overdue Payments Report
          </DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-4">{renderPreview()}</div>
        <DrawerFooter className="pt-2">{renderFooter()}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
