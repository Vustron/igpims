"use client"

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
} from "@/components/ui/dialogs"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawers"
import {
  Eye,
  Target,
  Wrench,
  Printer,
  Download,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/buttons"
import { Badge } from "@/components/ui/badges"

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
    fontFamily: "Helvetica",
    fontSize: 8,
    paddingTop: 20,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 20,
    lineHeight: 1.3,
  },
  report: {
    border: "1pt solid #000",
    padding: 10,
    backgroundColor: "#fff",
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
})

// Sample IGP Status Data
const igpStatusData = {
  reportPeriod: "Academic Year 2024-2025",
  dateGenerated: new Date().toLocaleDateString(),
  active: [
    {
      id: "IGP-001",
      name: "Locker Rental",
      type: "Service",
      description: "Student locker rental service",
      startDate: "2024-01-15",
      assignedOfficers: ["President", "Treasurer"],
      revenue: 125000,
      status: "Operational",
    },
    {
      id: "IGP-002",
      name: "Water Vendo",
      type: "Product",
      description: "Automated water refilling station",
      startDate: "2024-02-01",
      assignedOfficers: ["Vice President", "Secretary"],
      revenue: 89500,
      status: "Operational",
    },
    {
      id: "IGP-003",
      name: "T-shirts",
      type: "Product",
      description: "Custom university t-shirts",
      startDate: "2024-05-01",
      assignedOfficers: ["President", "Auditor"],
      revenue: 45600,
      status: "Operational",
    },
    {
      id: "IGP-004",
      name: "Eco Bags",
      type: "Product",
      description: "Eco-friendly reusable bags",
      startDate: "2024-06-01",
      assignedOfficers: ["Vice President", "PRO"],
      revenue: 32100,
      status: "Operational",
    },
    {
      id: "IGP-005",
      name: "Button Pins",
      type: "Product",
      description: "Collectible button pins with designs",
      startDate: "2024-04-01",
      assignedOfficers: ["Secretary", "Treasurer"],
      revenue: 18500,
      status: "Operational",
    },
  ],
  objectives: [
    {
      id: "OBJ-001",
      name: "Campus Food Court",
      type: "Service",
      description: "Establishing a student-operated food court",
      targetDate: "2025-01-15",
      targetRevenue: 200000,
      progress: 65,
      status: "In Planning",
      challenges: ["Space allocation", "Vendor selection"],
    },
    {
      id: "OBJ-002",
      name: "Study Materials Rental",
      type: "Service",
      description: "Textbook and reference material rental service",
      targetDate: "2024-12-01",
      targetRevenue: 75000,
      progress: 80,
      status: "In Development",
      challenges: ["Book inventory", "Digital platform"],
    },
    {
      id: "OBJ-003",
      name: "Campus Merchandise Store",
      type: "Product",
      description: "Physical store for all university merchandise",
      targetDate: "2025-03-01",
      targetRevenue: 150000,
      progress: 40,
      status: "In Planning",
      challenges: ["Location", "Initial investment"],
    },
    {
      id: "OBJ-004",
      name: "Event Photography Service",
      type: "Service",
      description: "Professional photography for campus events",
      targetDate: "2024-11-15",
      targetRevenue: 50000,
      progress: 90,
      status: "Ready to Launch",
      challenges: ["Equipment maintenance"],
    },
  ],
  forRepair: [
    {
      id: "REP-001",
      name: "ID Lace Production",
      type: "Product",
      description: "Custom ID laces with university logo",
      issueDate: "2024-10-15",
      expectedRepair: "2024-11-30",
      lastRevenue: 25000,
      status: "Equipment Repair",
      issues: ["Printing machine malfunction", "Design software update needed"],
    },
    {
      id: "REP-002",
      name: "Coffee Cart",
      type: "Service",
      description: "Mobile coffee cart for campus",
      issueDate: "2024-10-20",
      expectedRepair: "2024-12-15",
      lastRevenue: 15000,
      status: "Under Maintenance",
      issues: ["Cart wheel replacement", "Coffee machine servicing"],
    },
    {
      id: "REP-003",
      name: "University Calendar",
      type: "Product",
      description: "Annual university calendars",
      issueDate: "2024-10-25",
      expectedRepair: "2024-11-20",
      lastRevenue: 12000,
      status: "Design Revision",
      issues: ["Template updates", "Printing quality issues"],
    },
  ],
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// PDF Document Component
const IgpStatusDocument = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.report}>
          <View style={styles.header}>
            <Text style={styles.schoolTitle}>
              DAVAO DEL NORTE STATE COLLEGE
            </Text>
            <Text style={styles.subtitle}>Supreme Student Council</Text>
            <Text style={styles.reportTitle}>IGP Status Report</Text>
            <Text style={styles.reportPeriod}>
              {igpStatusData.reportPeriod}
            </Text>
          </View>

          {/* Active IGPs Section */}
          <View style={styles.statusSection}>
            <Text style={[styles.statusTitle]}>
              ACTIVE IGPs ({igpStatusData.active.length})
            </Text>

            {igpStatusData.active.map((igp, index) => (
              <View key={index} style={styles.igpItem}>
                <Text style={styles.igpName}>{igp.name}</Text>
                <Text style={styles.igpType}>{igp.type}</Text>
                <Text style={styles.igpDetails}>
                  {formatCurrency(igp.revenue)}
                </Text>
              </View>
            ))}
          </View>

          {/* Objectives Section */}
          <View style={styles.statusSection}>
            <Text style={[styles.statusTitle]}>
              OBJECTIVES / IN PROGRESS ({igpStatusData.objectives.length})
            </Text>

            {igpStatusData.objectives.map((obj, index) => (
              <View key={index} style={styles.igpItem}>
                <Text style={styles.igpName}>{obj.name}</Text>
                <Text style={styles.igpType}>{obj.progress}% Complete</Text>
                <Text style={styles.igpDetails}>
                  Target: {formatCurrency(obj.targetRevenue)}
                </Text>
              </View>
            ))}
          </View>

          {/* For Repair Section */}
          <View style={styles.statusSection}>
            <Text style={[styles.statusTitle]}>
              FOR REPAIR / MAINTENANCE ({igpStatusData.forRepair.length})
            </Text>

            {igpStatusData.forRepair.map((repair, index) => (
              <View key={index} style={styles.igpItem}>
                <Text style={styles.igpName}>{repair.name}</Text>
                <Text style={styles.igpType}>{repair.status}</Text>
                <Text style={styles.igpDetails}>
                  Last: {formatCurrency(repair.lastRevenue)}
                </Text>
              </View>
            ))}
          </View>

          {/* Summary */}
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Active</Text>
              <Text style={[styles.summaryValue]}>
                {igpStatusData.active.length}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>In Development</Text>
              <Text style={[styles.summaryValue]}>
                {igpStatusData.objectives.length}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Under Repair</Text>
              <Text style={[styles.summaryValue]}>
                {igpStatusData.forRepair.length}
              </Text>
            </View>
          </View>

          <Text style={styles.footer}>
            Generated on {igpStatusData.dateGenerated} | IGP Status Overview
            Report
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export const PrintIgpStatusDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "printIgpStatus"

  const handlePrint = async () => {
    try {
      const blob = await pdf(<IgpStatusDocument />).toBlob()
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
          IGP Status Report Preview
        </div>
        <p className="text-muted-foreground text-sm">
          Overview of all IGP statuses including active, objectives, and repair
          status
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
              IGP Status Report
            </p>
            <p className="mt-1 text-gray-600 text-xs">
              {igpStatusData.reportPeriod}
            </p>
          </div>

          {/* Active IGPs */}
          <div className="mb-6">
            <div className="mb-4 flex items-center gap-2 rounded bg-green-50 p-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h4 className="font-bold text-green-800 text-lg">
                ACTIVE IGPs ({igpStatusData.active.length})
              </h4>
            </div>
            <div className="space-y-2">
              {igpStatusData.active.map((igp, index) => (
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
                      {formatCurrency(igp.revenue)}
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
                OBJECTIVES / IN PROGRESS ({igpStatusData.objectives.length})
              </h4>
            </div>
            <div className="space-y-2">
              {igpStatusData.objectives.map((obj, index) => (
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
                      Target: {formatCurrency(obj.targetRevenue)}
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
                FOR REPAIR / MAINTENANCE ({igpStatusData.forRepair.length})
              </h4>
            </div>
            <div className="space-y-2">
              {igpStatusData.forRepair.map((repair, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-gray-200 border-b py-2"
                >
                  <div className="flex-1">
                    <span className="font-medium text-sm">{repair.name}</span>
                    <Badge variant="destructive" className="ml-2 text-xs">
                      {repair.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-red-600 text-sm">
                      Last: {formatCurrency(repair.lastRevenue)}
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
                {igpStatusData.active.length}
              </p>
              <p className="text-gray-600 text-sm">Total Active</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-2xl text-yellow-600">
                {igpStatusData.objectives.length}
              </p>
              <p className="text-gray-600 text-sm">In Development</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-2xl text-red-600">
                {igpStatusData.forRepair.length}
              </p>
              <p className="text-gray-600 text-sm">Under Repair</p>
            </div>
          </div>

          <div className="mt-6 border-gray-300 border-t pt-3 text-center text-gray-500 text-xs">
            Generated on {igpStatusData.dateGenerated} | IGP Status Overview
            Report
          </div>
        </div>
      </div>
    </div>
  )

  const renderFooter = () => (
    <div className="flex w-full gap-3">
      <PDFDownloadLink
        document={<IgpStatusDocument />}
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
