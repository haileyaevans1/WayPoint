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

const toneColors: Record<
  AlertTone,
  {
    badge: [string, string];
    statusBg: string;
    statusText: string;
    cardBorder: string;
  }
> = {
  warning: {
    badge: ["#F6D3BE", "#EFA774"],
    statusBg: "rgba(239,167,116,0.16)",
    statusText: "#A76139",
    cardBorder: "rgba(239,167,116,0.22)",
  },
  critical: {
    badge: ["#F5C5BF", "#E28A6E"],
    statusBg: "rgba(226,138,110,0.18)",
    statusText: "#9B4E3D",
    cardBorder: "rgba(226,138,110,0.24)",
  },
  info: {
    badge: ["#DCE8F5", "#B8CCE5"],
    statusBg: "rgba(184,204,229,0.22)",
    statusText: "#607C97",
    cardBorder: "rgba(184,204,229,0.22)",
  },
  success: {
    badge: ["#D8E59C", "#B9CD62"],
    statusBg: "rgba(185,205,98,0.18)",
    statusText: "#617228",
    cardBorder: "rgba(185,205,98,0.22)",
  },
};

export function AlertsScreen({
  onAlertPress,
  onViewJourney: _onViewJourney,
}: AlertsScreenProps) {
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

        {alertSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
            </View>

            <View style={styles.alertList}>
              {section.alerts.map((alert) => {
                const colors = toneColors[alert.tone];

                return (
                  <View
                    key={alert.id}
                    style={[styles.alertCard, { borderColor: colors.cardBorder }]}
                  >
                    <View style={styles.alertTopRow}>
                      <View style={styles.alertHeadingWrap}>
                        <LinearGradient
                          colors={colors.badge}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.iconBadge}
                        >
                          <Text style={styles.iconText}>{alert.icon}</Text>
                        </LinearGradient>
                        <View style={styles.alertCopy}>
                          <Text style={styles.alertTitle}>{alert.title}</Text>
                          <Text style={styles.alertTimestamp}>
                            {alert.timestamp}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={[
                          styles.statusPill,
                          { backgroundColor: colors.statusBg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusPillText,
                            { color: colors.statusText },
                          ]}
                        >
                          {alert.status}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.alertMessage}>{alert.message}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
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
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "800",
    color: theme.colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: theme.colors.textSoft,
  },
  alertList: {
    gap: 12,
  },
  alertCard: {
    borderRadius: 28,
    backgroundColor: "rgba(255,252,249,0.98)",
    padding: 18,
    gap: 12,
    borderWidth: 1,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  alertTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  alertHeadingWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 20,
  },
  alertCopy: {
    flex: 1,
    minWidth: 0,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.text,
  },
  alertTimestamp: {
    marginTop: 4,
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  statusPill: {
    alignSelf: "flex-start",
    borderRadius: theme.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: "800",
  },
  alertMessage: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.textSoft,
  },
});
