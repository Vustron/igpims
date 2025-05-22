export type NotificationType = "fund_request" | "project_request"

export type NotificationStatus = "unread" | "read"

export type NotificationAction =
  | "created"
  | "updated"
  | "submitted"
  | "reviewed"
  | "approved"
  | "rejected"
  | "checked"
  | "disbursed"
  | "received"
  | "receipted"
  | "validated"
  | "resolution_created"

export interface Notification {
  id: string
  type: NotificationType
  requestId: string
  title: string
  description: string
  timestamp: Date
  status: NotificationStatus
  action: NotificationAction
  actor?: string
  details?: Record<string, any>
}
