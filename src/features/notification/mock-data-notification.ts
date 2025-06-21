import { Notification, NotificationAction } from "./notification-types"

export const generateMockNotifications = (): Notification[] => {
  const notifications: Notification[] = []
  const now = new Date()

  // Fund request notifications
  const fundRequestActions: NotificationAction[] = [
    "created",
    "submitted",
    "reviewed",
    "checked",
    "approved",
    "disbursed",
    "received",
    "receipted",
    "validated",
    "rejected",
  ]

  const projectRequestActions: NotificationAction[] = [
    "submitted",
    "reviewed",
    "resolution_created",
    "approved",
    "rejected",
  ]

  // Generate fund request notifications
  for (let i = 1; i <= 15; i++) {
    const requestId = `FR-2023-${i.toString().padStart(3, "0")}`
    const randomAction =
      fundRequestActions[Math.floor(Math.random() * fundRequestActions.length)]
    const daysAgo = Math.floor(Math.random() * 30)
    const hoursAgo = Math.floor(Math.random() * 24)
    const timestamp = new Date(now)
    timestamp.setDate(timestamp.getDate() - daysAgo)
    timestamp.setHours(timestamp.getHours() - hoursAgo)

    const actor = [
      "John Smith",
      "Maria Garcia",
      "David Chen",
      "Sarah Johnson",
      "Ahmed Hassan",
    ][Math.floor(Math.random() * 5)]

    let title = ""
    let description = ""

    switch (randomAction) {
      case "created":
        title = `New fund request ${requestId} created`
        description = `${actor} has created a new fund request for approval.`
        break
      case "submitted":
        title = `Fund request ${requestId} submitted`
        description = `${actor} has submitted a fund request for review.`
        break
      case "reviewed":
        title = `Fund request ${requestId} reviewed`
        description = `Your fund request has been reviewed by ${actor}.`
        break
      case "checked":
        title = `Fund request ${requestId} checked`
        description = `Fund availability for your request has been checked by ${actor}.`
        break
      case "approved":
        title = `Fund request ${requestId} approved`
        description = `Your fund request has been approved by ${actor}.`
        break
      case "disbursed":
        title = `Fund request ${requestId} disbursed`
        description = `Funds for request ${requestId} have been disbursed by ${actor}.`
        break
      case "received":
        title = `Fund request ${requestId} received`
        description = `${actor} has confirmed receipt of funds for request ${requestId}.`
        break
      case "receipted":
        title = `Receipts submitted for ${requestId}`
        description = `${actor} has submitted receipts for fund request ${requestId}.`
        break
      case "validated":
        title = `Expenses validated for ${requestId}`
        description = `Expenses for fund request ${requestId} have been validated by ${actor}.`
        break
      case "rejected":
        title = `Fund request ${requestId} rejected`
        description = `Your fund request has been rejected by ${actor}. Please check the comments.`
        break
    }

    notifications.push({
      id: `notif-fr-${i}`,
      type: "fund_request",
      requestId,
      title,
      description,
      timestamp,
      status: Math.random() > 0.3 ? "read" : "unread",
      action: randomAction!,
      actor,
      details: {
        amount: Math.floor(Math.random() * 50000) + 5000,
        purpose: [
          "Department Event",
          "Equipment Purchase",
          "Training Program",
          "Office Supplies",
          "Travel Expenses",
        ][Math.floor(Math.random() * 5)],
      },
    })
  }

  // Generate project request notifications
  for (let i = 1; i <= 15; i++) {
    const requestId = `IGP-2023-${i.toString().padStart(3, "0")}`
    const randomAction =
      projectRequestActions[
        Math.floor(Math.random() * projectRequestActions.length)
      ]
    const daysAgo = Math.floor(Math.random() * 30)
    const hoursAgo = Math.floor(Math.random() * 24)
    const timestamp = new Date(now)
    timestamp.setDate(timestamp.getDate() - daysAgo)
    timestamp.setHours(timestamp.getHours() - hoursAgo)

    const actor = [
      "John Smith",
      "Maria Garcia",
      "David Chen",
      "Sarah Johnson",
      "Ahmed Hassan",
    ][Math.floor(Math.random() * 5)]

    let title = ""
    let description = ""

    switch (randomAction) {
      case "submitted":
        title = `IGP proposal ${requestId} submitted`
        description = `${actor} has submitted a new IGP proposal for review.`
        break
      case "reviewed":
        title = `IGP proposal ${requestId} reviewed`
        description = `Your IGP proposal has been reviewed by ${actor}.`
        break
      case "resolution_created":
        title = `Resolution created for ${requestId}`
        description = `A resolution has been created for your IGP proposal by ${actor}.`
        break
      case "approved":
        title = `IGP proposal ${requestId} approved`
        description = `Your IGP proposal has been approved by ${actor}.`
        break
      case "rejected":
        title = `IGP proposal ${requestId} rejected`
        description = `Your IGP proposal has been rejected by ${actor}. Please check the comments.`
        break
    }

    notifications.push({
      id: `notif-pr-${i}`,
      type: "project_request",
      requestId,
      title,
      description,
      timestamp,
      status: Math.random() > 0.3 ? "read" : "unread",
      action: randomAction!,
      actor,
      details: {
        projectTitle: [
          "Student Entrepreneurship Program",
          "Campus Eco-Store",
          "Culinary Arts Products",
          "Digital Services",
          "Agricultural Products",
        ][Math.floor(Math.random() * 5)],
      },
    })
  }

  // Sort by timestamp (newest first)
  return notifications.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
  )
}
