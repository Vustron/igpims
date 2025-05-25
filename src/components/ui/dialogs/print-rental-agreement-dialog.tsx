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
import { Printer, Download, Eye } from "lucide-react"
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
  signatureLine: {
    borderBottom: "2px solid #000000",
    marginBottom: 8,
    height: 30,
  },
  signatureLabel: {
    fontSize: 9,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "bold",
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

const ReceiptDocument = ({ receipt }: { receipt: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.receipt}>
        <View style={styles.header}>
          <Text style={styles.schoolTitle}>DAVAO DEL NORTE STATE COLLEGE</Text>
          <Text style={styles.subtitle}>Supreme Student Council</Text>
          <Text style={styles.receiptTitle}>Locker Rental Receipt</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>Receipt No.: {receipt.receiptNo}</Text>
          <Text style={styles.metaText}>Date Issued: {receipt.dateIssued}</Text>
        </View>

        <View style={styles.studentSection}>
          <Text style={styles.sectionTitle}>Student Information</Text>
          <Text style={styles.studentText}>Name: {receipt.studentName}</Text>
          <Text style={styles.studentText}>
            Student ID: {receipt.studentId}
          </Text>
          <Text style={styles.studentText}>
            Course & Year: {receipt.course}
          </Text>
        </View>

        <View style={styles.lockerSection}>
          <Text style={styles.sectionTitle}>Locker Information</Text>
          <Text style={styles.infoText}>Locker ID: {receipt.lockerId}</Text>
          <Text style={styles.infoText}>Location: {receipt.location}</Text>
          <Text style={styles.infoText}>Date Rented: {receipt.dateRented}</Text>
          <Text style={styles.infoText}>Date Due: {receipt.dateDue}</Text>
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Details</Text>

          <View style={styles.amountHeader}>
            <Text style={styles.amountHeaderText}>Description</Text>
            <Text style={styles.amountHeaderText}>Amount</Text>
          </View>

          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Locker Rental Fee</Text>
            <Text style={styles.amountValue}>PHP {receipt.rentalFee}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL PAID:</Text>
            <Text style={styles.totalValue}>{receipt.totalPaid}</Text>
          </View>

          <Text style={styles.paymentMethod}>
            Payment Method: {receipt.paymentMethod}
          </Text>
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Student Signature</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>SSC Officer</Text>
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
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "printRentalAgreementReceipt"

  const receipt = {
    receiptNo: "2024-0115001",
    dateIssued: "January 15, 2024",
    studentName: "Michelle G. Uy",
    studentId: "2023-01155",
    course: "BSDRM 2nd Year",
    lockerId: "L-01",
    location: "AB Building, 2nd Floor",
    dateRented: "January 15, 2024",
    dateDue: "May 30, 2024",
    rentalFee: "150.00",
    totalPaid: "PHP 150.00",
    paymentMethod: "Cash",
  }

  const handlePrint = async () => {
    try {
      const blob = await pdf(<ReceiptDocument receipt={receipt} />).toBlob()
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
                  <span className="font-medium">PHP {receipt.rentalFee}</span>
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
                  <div className="mb-2 h-8 w-20 border-black border-b-2" />
                  <p className="font-bold text-xs uppercase">Student</p>
                </div>
                <div className="text-center">
                  <div className="mb-2 h-8 w-20 border-black border-b-2" />
                  <p className="font-bold text-xs uppercase">SSC Officer</p>
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
        document={<ReceiptDocument receipt={receipt} />}
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
