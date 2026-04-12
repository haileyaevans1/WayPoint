import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
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
});
