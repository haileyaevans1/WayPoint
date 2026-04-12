import { useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Header } from "../components/Header";
import { theme } from "../styles/theme";

type JourneyState = "active" | "offRoute" | "late" | "complete";

type ActiveJourneyScreenProps = {
  onJourneyComplete?: () => void;
};

const readyLime = "#AFCB46";
const warningOrange = "#E58B5B";

export function ActiveJourneyScreen({
  onJourneyComplete,
}: ActiveJourneyScreenProps) {
  const [journeyState, setJourneyState] = useState<JourneyState>("active");

  const isComplete = journeyState === "complete";

  const statusAccent =
    journeyState === "offRoute"
      ? warningOrange
      : journeyState === "late"
        ? theme.colors.brand
        : readyLime;

  const statusLabel =
    journeyState === "offRoute"
      ? "Off Route"
      : journeyState === "late"
        ? "Needs Check-In"
        : journeyState === "complete"
          ? "Journey Complete"
          : "On Track";

  const contactStatuses = [
    { name: "Trusted Contact 1", status: "Notified" },
    { name: "Trusted Contact 2", status: "Connected" },
  ];

  return (
    <LinearGradient
      colors={[theme.colors.background, "#F4E8DA", theme.colors.backgroundDeep]}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Header
          title="Active Journey"
          subtitle="We’re tracking your journey and standing by."
          tagline="Stay calm, Stay connected"
        />
        <View style={{ padding: 16 }}>
          <Text>Status: {statusLabel}</Text>
          {!isComplete && (
            <Text
              onPress={() => setJourneyState("complete")}
              style={{ marginTop: 20 }}
            >
              End Journey
            </Text>
          )}
        </View>
        <View style={{ padding: 16 }}>
          <Text>Elapsed: 12 min</Text>
          <Text>Expected finish: 2:30 PM</Text>
          <Text>Time remaining: 18 min</Text>
        </View>
        {!isComplete ? (
          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>Are you safe?</Text>
            <Text style={styles.sectionTitle}>
              Check in quickly if you need to
            </Text>

            <View style={styles.safetyPromptGrid}>
              <Pressable style={[styles.safetyAction, styles.safeAction]}>
                <Text style={styles.safeActionLabel}>Yes, I’m safe</Text>
              </Pressable>

              <Pressable style={styles.secondarySafetyAction}>
                <Text style={styles.secondarySafetyActionLabel}>
                  Send location to trusted contact
                </Text>
              </Pressable>

              <Pressable style={styles.emergencyAction}>
                <Text style={styles.emergencyActionLabel}>
                  Call emergency services
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}
        <LinearGradient
          colors={["rgba(255,255,255,0.98)", "rgba(255,251,247,0.95)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.deadlineCard}
        >
          <Text style={styles.sectionEyebrow}>Countdown</Text>
          <View style={styles.deadlineRow}>
            <Text style={styles.deadlineValue}>
              {journeyState === "late" ? "00:45" : "18:12"}
            </Text>
            <View>
              <Text style={styles.deadlineLabel}>
                {journeyState === "late"
                  ? "Until contact alert"
                  : "Until next check-in"}
              </Text>
              <Text style={styles.deadlineText}>
                {journeyState === "late"
                  ? "Trusted contacts will be notified after the grace period."
                  : "You’re still within your expected journey window."}
              </Text>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>Trusted contact status</Text>
          <Text style={styles.sectionTitle}>
            Your safety circle is connected
          </Text>

          <View style={styles.contactStatusList}>
            {contactStatuses.map((contact) => (
              <View key={contact.name} style={styles.contactStatusCard}>
                <View>
                  <Text style={styles.contactStatusName}>{contact.name}</Text>
                  <Text style={styles.contactStatusMeta}>{contact.status}</Text>
                </View>
                <View style={styles.contactStatusBadge}>
                  <Text style={styles.contactStatusBadgeText}>
                    {contact.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        {journeyState === "offRoute" ? (
          <View style={[styles.section, styles.warningSection]}>
            <Text style={styles.sectionEyebrow}>Off-route warning</Text>
            <Text style={styles.sectionTitle}>You appear to be off route</Text>
            <Text style={styles.sectionText}>
              Return to your route or confirm you’re safe so your contacts know
              everything is okay.
            </Text>
            <View style={styles.warningActionRow}>
              <Pressable style={styles.warningPrimaryAction}>
                <Text style={styles.warningPrimaryActionText}>I’m okay</Text>
              </Pressable>
              <Pressable style={styles.warningSecondaryAction}>
                <Text style={styles.warningSecondaryActionText}>
                  Send location
                </Text>
              </Pressable>
              <Pressable style={styles.warningSecondaryAction}>
                <Text style={styles.warningSecondaryActionText}>
                  Re-route me
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
  },
  section: {
    backgroundColor: "rgba(255,253,251,0.98)",
    borderRadius: 28,
    padding: 20,
    gap: 14,
  },
  sectionEyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: theme.colors.textMuted,
  },
  sectionTitle: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "800",
    color: theme.colors.text,
  },
  safetyPromptGrid: {
    gap: 12,
  },
  safetyAction: {
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  safeAction: {
    backgroundColor: readyLime,
  },
  safeActionLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#566126",
  },
  secondarySafetyAction: {
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: theme.colors.surfaceSoft,
  },
  secondarySafetyActionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
  },
  emergencyAction: {
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: "#F7D9C9",
  },
  emergencyActionLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: warningOrange,
    textAlign: "center",
  },
  deadlineCard: {
    borderRadius: 28,
    padding: 20,
    gap: 12,
  },
  deadlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  deadlineValue: {
    fontSize: 34,
    lineHeight: 34,
    fontWeight: "900",
    color: theme.colors.text,
    letterSpacing: -1.4,
  },
  deadlineLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.text,
  },
  deadlineText: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.textSoft,
    maxWidth: 180,
  },
  contactStatusList: {
    gap: 12,
  },
  contactStatusCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    padding: 16,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceSoft,
  },
  contactStatusName: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.text,
  },
  contactStatusMeta: {
    marginTop: 4,
    fontSize: 13,
    color: theme.colors.textSoft,
  },
  contactStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(184,207,92,0.18)",
  },
  contactStatusBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#566126",
  },
  warningSection: {
    borderWidth: 1,
    borderColor: "rgba(229,139,91,0.2)",
    backgroundColor: "rgba(255,249,245,0.98)",
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.textSoft,
  },
  warningActionRow: {
    gap: 10,
  },
  warningPrimaryAction: {
    borderRadius: 22,
    paddingVertical: 15,
    paddingHorizontal: 18,
    backgroundColor: warningOrange,
    alignItems: "center",
  },
  warningPrimaryActionText: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.white,
  },
  warningSecondaryAction: {
    borderRadius: 22,
    paddingVertical: 15,
    paddingHorizontal: 18,
    backgroundColor: theme.colors.surfaceSoft,
    alignItems: "center",
  },
  warningSecondaryActionText: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
  },
});
