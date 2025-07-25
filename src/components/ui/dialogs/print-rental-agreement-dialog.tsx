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
import { format } from "date-fns"
import { Download, Eye, Printer } from "lucide-react"
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
import { isRentalReceiptData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { LockerRentalWithLocker } from "@/interfaces/locker"

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 20,
    fontFamily: "Helvetica",
  },
  receipt: {
    maxWidth: 600,
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
    fontSize: 16,
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
  receiptTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingBottom: 12,
    borderBottom: "1px solid #000000",
  },
  metaText: {
    fontSize: 10,
    color: "#000000",
    fontWeight: "bold",
  },
  studentSection: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: "#ffffff",
    border: "1px solid #000000",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    borderBottom: "1px solid #000000",
    paddingBottom: 4,
  },
  studentText: {
    fontSize: 11,
    marginBottom: 4,
    color: "#000000",
    lineHeight: 1.4,
  },
  lockerSection: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: "#ffffff",
    border: "1px solid #000000",
  },
  infoText: {
    fontSize: 11,
    marginBottom: 4,
    color: "#000000",
    lineHeight: 1.4,
  },
  paymentSection: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: "#ffffff",
    border: "1px solid #000000",
  },
  amountHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingBottom: 6,
    borderBottom: "1px solid #000000",
  },
  amountHeaderText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingVertical: 4,
  },
  amountLabel: {
    fontSize: 11,
    color: "#000000",
  },
  amountValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000000",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTop: "2px solid #000000",
    backgroundColor: "#ffffff",
    padding: 10,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
  },
  paymentMethod: {
    marginTop: 8,
    fontSize: 11,
    color: "#000000",
    textAlign: "center",
    fontWeight: "bold",
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingTop: 15,
    borderTop: "2px solid #000000",
  },
  signatureBox: {
    width: "45%",
    textAlign: "center",
  },
  signatureLabel: {
    fontSize: 9,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "bold",
    marginBottom: 0,
    paddingBottom: 0,
    lineHeight: 1,
  },
  signatureLine: {
    borderBottom: "2px solid #000000",
    marginBottom: 8,
    marginTop: 0,
  },
  footer: {
    marginTop: 15,
    textAlign: "center",
    fontSize: 9,
    color: "#000000",
    fontStyle: "italic",
    paddingTop: 12,
    borderTop: "1px solid #000000",
  },
})

interface ReceiptData {
  receiptNo: string
  dateIssued: string
  studentName: string
  studentId: string
  course: string
  lockerId: string
  location: string
  dateRented: string
  dateDue: string
  rentalFee: string
  totalPaid: string
  paymentMethod: string
  sscOfficer: string
}

const ReceiptDocument = ({ receiptData }: { receiptData: ReceiptData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.receipt}>
        <View style={styles.header}>
          <Text style={styles.schoolTitle}>DAVAO DEL NORTE STATE COLLEGE</Text>
          <Text style={styles.subtitle}>Supreme Student Council</Text>
          <Text style={styles.receiptTitle}>Locker Rental Receipt</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            Receipt No.: {receiptData.receiptNo}
          </Text>
          <Text style={styles.metaText}>
            Date Issued: {receiptData.dateIssued}
          </Text>
        </View>

        <View style={styles.studentSection}>
          <Text style={styles.sectionTitle}>Student Information</Text>
          <Text style={styles.studentText}>
            Name: {receiptData.studentName}
          </Text>
          <Text style={styles.studentText}>
            Student ID: {receiptData.studentId}
          </Text>
          <Text style={styles.studentText}>
            Course & Year: {receiptData.course}
          </Text>
        </View>

        <View style={styles.lockerSection}>
          <Text style={styles.sectionTitle}>Locker Information</Text>
          <Text style={styles.infoText}>Locker ID: {receiptData.lockerId}</Text>
          <Text style={styles.infoText}>Location: {receiptData.location}</Text>
          <Text style={styles.infoText}>
            Date Rented: {receiptData.dateRented}
          </Text>
          <Text style={styles.infoText}>Date Due: {receiptData.dateDue}</Text>
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Details</Text>

          <View style={styles.amountHeader}>
            <Text style={styles.amountHeaderText}>Description</Text>
            <Text style={styles.amountHeaderText}>Amount</Text>
          </View>

          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Locker Rental Fee</Text>
            <Text style={styles.amountValue}>{receiptData.rentalFee}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL PAID:</Text>
            <Text style={styles.totalValue}>{receiptData.totalPaid}</Text>
          </View>

          <Text style={styles.paymentMethod}>
            Payment Method: {receiptData.paymentMethod}
          </Text>
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>
              {receiptData.studentName || "Student Signature"}
            </Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>{"Student Signature"}</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>
              {receiptData.sscOfficer || "SSC Officer"}
            </Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>{"SSC Officer"}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          This receipt is valid and serves as proof of payment. Please keep for
          your records.
        </Text>
      </View>
    </Page>
  </Document>
)

export const RentalAgreementReceiptDialog = () => {
  const { isOpen, onClose, type, data } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "printRentalAgreementReceipt"

  const defaultReceipt: ReceiptData = {
    receiptNo: "N/A",
    dateIssued: format(new Date(), "MMMM d, yyyy"),
    studentName: "N/A",
    studentId: "N/A",
    course: "N/A",
    lockerId: "N/A",
    location: "N/A",
    dateRented: "N/A",
    dateDue: "N/A",
    rentalFee: "150.00",
    totalPaid: "PHP 150.00",
    paymentMethod: "N/A",
    sscOfficer: "N/A",
  }

  let receipt = defaultReceipt

  if (isRentalReceiptData(data) && data.rental) {
    const rental = data.rental as LockerRentalWithLocker
    const locker = rental.locker

    let rentedDate = new Date()
    try {
      const parsedDate = new Date(rental.dateRented)
      if (
        !Number.isNaN(parsedDate.getTime()) &&
        parsedDate.getFullYear() < 2100
      ) {
        rentedDate = parsedDate
      }
    } catch (e) {}

    let dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 1)
    try {
      const parsedDate = new Date(rental.dateDue)
      if (
        !Number.isNaN(parsedDate.getTime()) &&
        parsedDate.getFullYear() < 2100
      ) {
        dueDate = parsedDate
      }
    } catch (e) {}

    receipt = {
      receiptNo: `R-${rental.id.substring(0, 6)}`,
      dateIssued: format(new Date(), "MMMM d, yyyy"),
      studentName: rental.renterName,
      studentId: rental.renterId,
      course: rental.courseAndSet,
      lockerId: locker?.lockerName || rental.lockerId,
      location: locker?.lockerLocation || "Unknown Location",
      dateRented: format(rentedDate, "MMMM d, yyyy"),
      dateDue: format(dueDate, "MMMM d, yyyy"),
      rentalFee: `${locker?.lockerRentalPrice || 150}.00`,
      totalPaid: `PHP ${locker?.lockerRentalPrice || 150}.00`,
      paymentMethod: rental.paymentStatus === "paid" ? "Cash" : "Pending",
      sscOfficer: data.currentUser?.name || "SSC Officer",
    }
  }

  const handlePrint = async () => {
    try {
      const blob = await pdf(<ReceiptDocument receiptData={receipt} />).toBlob()
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
      toast.error(`Failed to open print dialog: ${error}`)
    }
  }

  const renderPreview = () => (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
          <Eye className="h-4 w-4" />
          Receipt Preview
        </div>
        <p className="text-muted-foreground text-sm">
          Preview of the locker rental receipt that will be generated
        </p>
      </div>

      <div className="w-full max-w-md">
        <div className="mx-auto rounded-lg border-2 border-gray-300 bg-white p-6 shadow-lg">
          <div className="mb-6 border-black border-b-2 pb-4 text-center">
            <h3 className="font-bold text-lg">DAVAO DEL NORTE STATE COLLEGE</h3>
            <p className="text-sm uppercase tracking-wider">
              Supreme Student Council
            </p>
            <p className="mt-2 font-bold text-sm uppercase tracking-wide">
              Locker Rental Receipt
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-gray-300 border-b pb-3">
              <span className="font-medium">Receipt No.:</span>
              <span>{receipt.receiptNo}</span>
            </div>
            <div className="flex justify-between border-gray-300 border-b pb-3">
              <span className="font-medium">Date:</span>
              <span>{receipt.dateIssued}</span>
            </div>

            <div className="border border-gray-300 p-3">
              <h4 className="border-gray-300 border-b pb-2 font-bold text-xs uppercase tracking-wide">
                Student Information
              </h4>
              <div className="mt-2 space-y-1 text-xs">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {receipt.studentName}
                </p>
                <p>
                  <span className="font-medium">ID:</span> {receipt.studentId}
                </p>
                <p>
                  <span className="font-medium">Course:</span> {receipt.course}
                </p>
              </div>
            </div>

            <div className="border border-gray-300 p-3">
              <h4 className="border-gray-300 border-b pb-2 font-bold text-xs uppercase tracking-wide">
                Locker Information
              </h4>
              <div className="mt-2 space-y-1 text-xs">
                <p>
                  <span className="font-medium">Locker:</span>{" "}
                  {receipt.lockerId}
                </p>
                <p>
                  <span className="font-medium">Location:</span>{" "}
                  {receipt.location}
                </p>
                <p>
                  <span className="font-medium">Rented:</span>{" "}
                  {receipt.dateRented}
                </p>
                <p>
                  <span className="font-medium">Due:</span> {receipt.dateDue}
                </p>
              </div>
            </div>

            <div className="border border-gray-300 p-3">
              <h4 className="border-gray-300 border-b pb-2 font-bold text-xs uppercase tracking-wide">
                Payment Details
              </h4>
              <div className="mt-2 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Locker Rental Fee:</span>
                  <span className="font-medium">{receipt.rentalFee}</span>
                </div>
                <div className="border-black border-t-2 pt-2">
                  <div className="flex justify-between font-bold">
                    <span>TOTAL PAID:</span>
                    <span>{receipt.totalPaid}</span>
                  </div>
                </div>
                <p className="text-center font-medium">
                  Payment: {receipt.paymentMethod}
                </p>
              </div>
            </div>

            <div className="border-black border-t-2 pt-4">
              <div className="flex justify-between">
                <div className="text-center">
                  <p className="font-bold text-xs uppercase">
                    {receipt.studentName || "Student"}
                  </p>
                  <div className="mb-2 w-20 border-black border-b-2" />
                  <p className="font-bold text-xs uppercase">{"Student"}</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-xs uppercase">
                    {receipt.sscOfficer || "SSC Officer"}
                  </p>
                  <div className="mb-2 w-20 border-black border-b-2" />
                  <p className="font-bold text-xs uppercase">{"SSC Officer"}</p>
                </div>
              </div>
            </div>

            <div className="border-gray-300 border-t pt-3 text-center text-xs italic">
              This receipt serves as proof of payment. Keep for your records.
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderFooter = () => (
    <div className="flex w-full gap-3">
      <PDFDownloadLink
        document={<ReceiptDocument receiptData={receipt} />}
        fileName={`locker-receipt-${receipt.receiptNo}.pdf`}
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
        Print Receipt
      </Button>

      <Button variant="outline" className="flex-1" onClick={onClose}>
        Cancel
      </Button>
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Printer className="h-5 w-5" />
              Print Locker Rental Receipt
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
            Print Locker Rental Receipt
          </DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-4">{renderPreview()}</div>
        <DrawerFooter className="pt-2">{renderFooter()}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
