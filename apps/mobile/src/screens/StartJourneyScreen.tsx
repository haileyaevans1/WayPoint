import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Header } from "../components/Header";
import { theme } from "../styles/theme";

type JourneyType = "walk" | "run" | "hike" | "bike";
type TripMeasure = "distance" | "duration";

export function StartJourneyScreen() {
  const [journeyType, setJourneyType] = useState<JourneyType>("walk");
  const [measureType, setMeasureType] = useState<TripMeasure>("distance");

  return (
    <LinearGradient
      colors={[theme.colors.background, "#F4E8DA", theme.colors.backgroundDeep]}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Header
          title="Start Your Journey"
          subtitle="We’ll keep you connected along the way."
        />

        <Text>Start Journey</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const journeyTypes = [
  { key: "walk", label: "Walk", icon: "🚶‍♀️" },
  { key: "run", label: "Run", icon: "🏃‍♀️" },
    { key: "hike", label: "Hike", icon: "🥾" },
    { key: "bike", label: "Bike", icon: "🚴‍♀️" },
];

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});