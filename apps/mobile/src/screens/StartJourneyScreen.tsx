import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Header } from "../components/Header";
import { theme } from "../styles/theme";

type JourneyType = "walk" | "run" | "hike" | "bike";
type TripMeasure = "distance" | "duration";
type LocationMode = "current" | "custom";

const journeyTypes = [
  { key: "walk", label: "Walk", icon: "🚶‍♀️" },
  { key: "run", label: "Run", icon: "🏃‍♀️" },
  { key: "hike", label: "Hike", icon: "🥾" },
  { key: "bike", label: "Bike", icon: "🚴‍♀️" },
];

const trustedContacts: string[] = [];

export function StartJourneyScreen() {
  const [journeyType, setJourneyType] = useState<JourneyType>("walk");
  const [measureType, setMeasureType] = useState<TripMeasure>("distance");
  const [distanceValue, setDistanceValue] = useState("2");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [locationMode, setLocationMode] = useState<LocationMode>("current");

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>

          <View
            style={[
              styles.locationCard,
              locationMode === "current" && styles.selectedCard,
            ]}
          >
            <Text style={styles.locationLabel}>Current location</Text>
            <Text style={styles.locationValue}>Downtown Tulsa, OK</Text>
            <Text
              style={styles.actionText}
              onPress={() => setLocationMode("current")}
            >
              {locationMode === "current" ? "Selected" : "Use"}
            </Text>
          </View>

          <View
            style={[
              styles.locationCard,
              locationMode === "custom" && styles.selectedCard,
            ]}
          >
            <Text style={styles.locationLabel}>Enter another location</Text>
            <TextInput
              value={destinationLocation}
              onChangeText={(value) => {
                setDestinationLocation(value);
                if (value.length > 0) {
                  setLocationMode("custom");
                }
              }}
              onFocus={() => setLocationMode("custom")}
              placeholder="Destination or meeting point"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.input}
            />
            <Text
              style={styles.actionText}
              onPress={() => setLocationMode("custom")}
            >
              {locationMode === "custom" ? "Selected" : "Use"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.contactsHeader}>
            <View>
              <Text style={styles.sectionTitle}>Trusted Contacts</Text>
              <Text style={styles.sectionText}>
                Choose who should receive updates if something seems off.
              </Text>
            </View>

            <View style={styles.countBadge}>
              <Text style={styles.countValue}>{trustedContacts.length}</Text>
              <Text style={styles.countLabel}>selected</Text>
            </View>
          </View>

          {trustedContacts.length > 0 && (
            <View style={styles.contactRow}>
              {trustedContacts.map((contact) => (
                <View key={contact} style={styles.contactChip}>
                  <Text style={styles.contactChipText}>{contact}</Text>
                </View>
              ))}
            </View>
          )}

          <Pressable style={styles.contactCard}>
            <Text style={styles.contactCardTitle}>Add trusted contacts</Text>
            <Text style={styles.contactCardText}>
              Pick the people you want to keep in the loop during this journey.
            </Text>
          </Pressable>

          <Pressable style={styles.contactCard}>
            <Text style={styles.contactCardTitle}>Add emergency contact</Text>
            <Text style={styles.contactCardText}>
              Optionally add one more person for urgent situations.
            </Text>
          </Pressable>
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
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  sectionText: {
    fontSize: 14,
    color: theme.colors.textSoft,
    lineHeight: 20,
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
  locationCard: {
    backgroundColor: theme.colors.surfaceSoft,
    padding: 14,
    borderRadius: 14,
    gap: 8,
  },
  selectedCard: {
    borderWidth: 1,
    borderColor: theme.colors.brand,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textMuted,
  },
  locationValue: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.brand,
  },
  contactsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  countBadge: {
    backgroundColor: theme.colors.surfaceSoft,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 70,
  },
  countValue: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.brand,
  },
  countLabel: {
    fontSize: 12,
    color: theme.colors.textSoft,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  contactChip: {
    backgroundColor: theme.colors.surfaceSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  contactChipText: {
    color: theme.colors.text,
    fontWeight: "600",
  },
  contactCard: {
    backgroundColor: theme.colors.surfaceSoft,
    padding: 14,
    borderRadius: 14,
    gap: 6,
  },
  contactCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  contactCardText: {
    fontSize: 14,
    color: theme.colors.textSoft,
    lineHeight: 20,
  },
});