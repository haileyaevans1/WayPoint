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
});
