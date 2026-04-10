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
    <View>
      <Text>Start Journey</Text>
    </View>
  );
}