"use client"

import { Card } from "@/components/ui/cards"
import { EmailTemplate } from "@/components/ui/email/email-template"
import { ScrollArea, ScrollBar } from "@/components/ui/scrollareas"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/separators"
import { render } from "@react-email/components"
import { useEffect, useState } from "react"

export default function EmailPreviewPage() {
  const previewData = {
    verify: {
      token: "verification_token_123",
      email: "user@example.com",
      recipientName: "John Doe",
    },
    "reset-password": {
      token: "reset_token_456",
      email: "user@example.com",
      recipientName: "John Doe",
    },
    otp: {
      token: "123456",
      email: "user@example.com",
      recipientName: "John Doe",
    },
    "rental-confirmation": {
      email: "user@example.com",
      recipientName: "John Doe",
      lockerDetails: {
        name: "Locker A101",
        location: "Building 1, Floor 1",
      },
      dueDate: "2025-12-31",
      amount: 150,
      paymentDate: "2025-07-01",
      transactionId: "RENT-12345",
    },
    "rental-expiration": {
      email: "user@example.com",
      recipientName: "John Doe",
      lockerDetails: {
        name: "Locker A101",
        location: "Building 1, Floor 1",
      },
      dueDate: "2025-07-01",
    },
    "rental-cancellation": {
      email: "user@example.com",
      recipientName: "John Doe",
      lockerDetails: {
        name: "Locker A101",
        location: "Building 1, Floor 1",
      },
    },
    "payment-reminder": {
      email: "user@example.com",
      recipientName: "John Doe",
      lockerDetails: {
        name: "Locker A101",
        location: "Building 1, Floor 1",
      },
      dueDate: "2025-07-01",
      amount: 1500,
    },
    "payment-success": {
      email: "user@example.com",
      recipientName: "John Doe",
      lockerDetails: {
        name: "Locker A101",
        location: "Building 1, Floor 1",
      },
      transactionId: "123-456-789",
      paymentDate: "2025-07-01",
    },
    "payment-overdue": {
      email: "user@example.com",
      recipientName: "John Doe",
      lockerDetails: {
        name: "Locker A101",
        location: "Building 1, Floor 1",
      },
      transactionId: "123-456-789",
      paymentDate: "2025-07-01",
    },
  } as const

  const templates = Object.keys(previewData) as Array<keyof typeof previewData>

  function EmailPreview({ template, data }: { template: string; data: any }) {
    const [html, setHtml] = useState<string | null>(null)

    useEffect(() => {
      const loadTemplate = async () => {
        try {
          const result = await render(
            <EmailTemplate {...data} type={template} />,
          )
          setHtml(result)
        } catch (error) {
          console.error("Error rendering email template:", error)
          setHtml("<div>Error loading email preview</div>")
        }
      }
      loadTemplate()
    }, [template, data])

    if (!html)
      return (
        <div className="flex h-full items-center justify-center">
          Loading email preview...
        </div>
      )

    return (
      <div className="h-full w-full">
        <iframe
          srcDoc={html}
          className="h-full w-full border-none"
          sandbox="allow-same-origin allow-scripts"
          title={`Email template preview for ${template.replace("-", " ")}`}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-3xl font-bold">Email Template Preview</h1>

      <Tabs defaultValue="verify" className="w-full">
        <ScrollArea className="mb-8 w-full pb-2">
          <ScrollBar orientation="horizontal" />
          <TabsList className="flex w-max space-x-2">
            {templates.map((template) => (
              <TabsTrigger
                key={template}
                value={template}
                className="flex-shrink-0 capitalize"
              >
                {template.replace("-", " ")}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        {templates.map((template) => (
          <TabsContent key={template} value={template}>
            <Card className="flex h-[900px] w-full flex-col overflow-hidden p-0">
              <EmailPreview template={template} data={previewData[template]} />
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
