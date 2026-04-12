import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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