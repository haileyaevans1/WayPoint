import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
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
  const [distanceValue, setDistanceValue] = useState("2");

  return (
    <LinearGradient
      colors={[
        theme.colors.background,
        "#F4E8DA",
        theme.colors.backgroundDeep,
      ]}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Header
          title="Start Your Journey"
          subtitle="We’ll keep you connected along the way."
          tagline="Quick setup, Low stress"
        />

        <Text style={styles.pageTitle}>Start Journey</Text>

        {/* Journey Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Journey Type</Text>
          {journeyTypes.map((item) => (
            <Text
              key={item.key}
              style={[
                styles.optionText,
                journeyType === item.key && styles.selectedText,
              ]}
              onPress={() => setJourneyType(item.key as JourneyType)}
            >
              {item.icon} {item.label}
            </Text>
          ))}
        </View>

        {/* Measure Toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Setup</Text>
          <View style={styles.toggleRow}>
            <Text
              style={[
                styles.optionText,
                measureType === "distance" && styles.selectedText,
              ]}
              onPress={() => setMeasureType("distance")}
            >
              Distance
            </Text>
            <Text
              style={[
                styles.optionText,
                measureType === "duration" && styles.selectedText,
              ]}
              onPress={() => setMeasureType("duration")}
            >
              Duration
            </Text>
          </View>

          {measureType === "distance" && (
            <TextInput
              value={distanceValue}
              onChangeText={setDistanceValue}
              placeholder="Enter distance"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.input}
            />
          )}
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
    padding: 16,
    gap: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 16,
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.textSoft,
  },
  selectedText: {
    fontWeight: "700",
    color: theme.colors.brand,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.white,
  },
});