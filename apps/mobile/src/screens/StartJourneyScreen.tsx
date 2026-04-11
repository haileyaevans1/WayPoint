import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Header } from "../components/Header";
import { theme } from "../styles/theme";

type JourneyType = "walk" | "run" | "hike" | "bike";
type TripMeasure = "distance" | "duration";

const journeyTypes = [
  { key: "walk", label: "Walk", icon: "🚶‍♀️" },
  { key: "run", label: "Run", icon: "🏃‍♀️" },
  { key: "hike", label: "Hike", icon: "🥾" },
  { key: "bike", label: "Bike", icon: "🚴‍♀️" },
];

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

        {/* Journey Types */}
        <View>
          {journeyTypes.map((item) => (
            <Text
              key={item.key}
              onPress={() => setJourneyType(item.key as JourneyType)}
            >
              {item.icon} {item.label}
            </Text>
          ))}
        </View>

        {/* Measure Toggle */}
        <View>
          <Text onPress={() => setMeasureType("distance")}>Distance</Text>
          <Text onPress={() => setMeasureType("duration")}>Duration</Text>
        </View>

      </ScrollView>
    </LinearGradient>
  );
}