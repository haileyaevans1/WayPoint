import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Header } from "../components/Header";
import { theme } from "../styles/theme";

type AlertTone = "warning" | "critical" | "info" | "success";

type AlertItem = {
  id: string;
  icon: string;
  title: string;
  message: string;
  timestamp: string;
  status: string;
  tone: AlertTone;
  actionLabel?: string;
};

type AlertSection = {
  title: string;
  subtitle: string;
  alerts: AlertItem[];
};

type AlertsScreenProps = {
  onAlertPress: () => void;
  onViewJourney: () => void;
};

const alertSections: AlertSection[] = [
  {
    title: "Active Alerts",
    subtitle: "Needs your attention",
    alerts: [
      {
        id: "off-route",
        icon: "⚠️",
        title: "Off Route",
        message:
          "You went off route during your journey. Confirm you're safe if this was intentional.",
        timestamp: "2 min ago",
        status: "Action Required",
        tone: "warning",
        actionLabel: "I'm Safe",
      },
      {
        id: "missed-check-in",
        icon: "🚨",
        title: "Missed Check-In",
        message:
          "You missed your check-in window. Your trusted contact was notified automatically.",
        timestamp: "10 min ago",
        status: "Notified",
        tone: "critical",
        actionLabel: "View Journey",
      },
    ],
  },
  {
    title: "Recent Alerts",
    subtitle: "Today",
    alerts: [
      {
        id: "location-shared",
        icon: "📍",
        title: "Location Shared",
        message:
          "Your location was sent to Mom after you requested a safety update.",
        timestamp: "15 min ago",
        status: "Sent",
        tone: "info",
      },
      {
        id: "contact-notified",
        icon: "👥",
        title: "Contact Notified",
        message:
          "Jordan was notified about your journey status and received your latest location.",
        timestamp: "28 min ago",
        status: "Delivered",
        tone: "info",
      },
    ],
  },
  {
    title: "Past Alerts",
    subtitle: "Yesterday",
    alerts: [
      {
        id: "journey-complete",
        icon: "🎉",
        title: "Journey Completed",
        message:
          "You completed your journey safely and your trusted contacts were updated.",
        timestamp: "Yesterday at 6:14 PM",
        status: "Resolved",
        tone: "success",
      },
      {
        id: "safe-confirmation",
        icon: "🫶",
        title: "Safety Confirmed",
        message:
          "You confirmed you were safe after going briefly off route.",
        timestamp: "Yesterday at 5:52 PM",
        status: "Resolved",
        tone: "success",
      },
    ],
  },
];

export function AlertsScreen({
  onAlertPress,
  onViewJourney: _onViewJourney,
}: AlertsScreenProps) {
  const totalAlerts = alertSections.reduce(
    (count, section) => count + section.alerts.length,
    0,
  );

  return (
    <LinearGradient
      colors={[
        theme.colors.background,
        "#F1E7DC",
        theme.colors.backgroundDeep,
      ]}
      locations={[0, 0.5, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Header
          title="Alerts"
          subtitle="Stay updated on your safety and journey activity."
          tagline="Awareness, Full transparency"
          onAlertPress={onAlertPress}
        />

        <View style={styles.summaryCard}>
          <Text style={styles.eyebrow}>Alerts overview</Text>
          <Text style={styles.summaryTitle}>
            {totalAlerts} alerts organized into {alertSections.length} sections
          </Text>
          <Text style={styles.summaryBody}>
            Active, recent, and resolved updates are ready to be brought back in
            progressively.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 180,
    gap: 18,
  },
  summaryCard: {
    borderRadius: 28,
    backgroundColor: "rgba(255,252,249,0.98)",
    padding: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(202,116,73,0.12)",
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: theme.colors.brandDeep,
  },
  summaryTitle: {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "800",
    color: theme.colors.text,
  },
  summaryBody: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.textSoft,
  },
});
