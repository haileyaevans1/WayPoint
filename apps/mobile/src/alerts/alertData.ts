export type AlertTone = "info" | "warning" | "urgent" | "safe";
export type AlertSectionKey = "active" | "recent";

export type AlertAction = {
  id: string;
  label: string;
  emphasis: "primary" | "secondary";
};

export type JourneyAlert = {
  id: string;
  type:
    | "missed-check-in"
    | "escalation"
    | "off-route"
    | "check-in-complete";
  title: string;
  message: string;
  timestamp: string;
  tone: AlertTone;
  section: AlertSectionKey;
  statusLabel: string;
  actions: AlertAction[];
};

export const initialAlerts: JourneyAlert[] = [
  {
    id: "missed-check-in",
    type: "missed-check-in",
    title: "Missed check-in",
    message: "We haven’t heard from you",
    timestamp: "2 min ago",
    tone: "warning",
    section: "active",
    statusLabel: "Warning",
    actions: [
      { id: "extend", label: "Extend time", emphasis: "primary" },
    ],
  },
  {
    id: "off-route",
    type: "off-route",
    title: "You’re off your route",
    message: "Want to get back on track?",
    timestamp: "5 min ago",
    tone: "warning",
    section: "recent",
    statusLabel: "Warning",
    actions: [
      { id: "recenter", label: "Recenter route", emphasis: "primary" },
      { id: "extend", label: "Extend journey", emphasis: "secondary" },
    ],
  },
];

export function buildMissedCheckInAlert(timestamp: string): JourneyAlert {
  return {
    id: `missed-check-in-${timestamp}`,
    type: "missed-check-in",
    title: "Missed check-in",
    message: "We haven’t heard from you",
    timestamp,
    tone: "warning",
    section: "active",
    statusLabel: "Warning",
    actions: [{ id: "extend", label: "Extend time", emphasis: "primary" }],
  };
}

export function buildEscalationAlert(timestamp: string): JourneyAlert {
  return {
    id: `escalation-${timestamp}`,
    type: "escalation",
    title: "Action needed",
    message: "Your contacts will be notified soon",
    timestamp,
    tone: "urgent",
    section: "active",
    statusLabel: "Urgent",
    actions: [
      { id: "emergency", label: "Call emergency", emphasis: "primary" },
    ],
  };
}
