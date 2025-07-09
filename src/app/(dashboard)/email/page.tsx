"use client"

import { Card } from "@/components/ui/cards"
import { EmailTemplate } from "@/components/ui/email/email-template"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/separators"
import { renderAsync } from "@react-email/components"
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
  } as const

  const templates = Object.keys(previewData) as Array<keyof typeof previewData>

  function EmailPreview({ template, data }: { template: string; data: any }) {
    const [html, setHtml] = useState<string | null>(null)

    useEffect(() => {
      const loadTemplate = async () => {
        const result = await renderAsync(
          <EmailTemplate {...data} type={template} />,
        )
        setHtml(result)
      }
      loadTemplate()
    }, [template, data])

    if (!html) return <div>Loading email preview...</div>

    return (
      <iframe
        srcDoc={html}
        className="h-full w-full border-none"
        sandbox="allow-same-origin"
        title={`Email template preview for ${template.replace("-", " ")}`}
      />
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 font-bold text-3xl">Email Template Preview</h1>

      <Tabs defaultValue="verify" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <TabsTrigger key={template} value={template} className="capitalize">
              {template.replace("-", " ")}
            </TabsTrigger>
          ))}
        </TabsList>

        {templates.map((template) => (
          <TabsContent key={template} value={template}>
            <Card className="flex h-[900px] w-full flex-col items-center justify-center overflow-auto p-6">
              <EmailPreview template={template} data={previewData[template]} />
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
