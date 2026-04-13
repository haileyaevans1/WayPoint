import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Header } from "../components/Header";
import { theme } from "../styles/theme";

type StartJourneyScreenProps = {
  onStartJourney?: (journeyConfig: StartJourneyConfig) => void;
  onOpenProfile?: () => void;
};

export type JourneyType = "walk" | "run" | "hike" | "bike";
export type TripMeasure = "distance" | "duration";
type LocationMode = "current" | "custom";
export type RouteShape = "oneWay" | "loop";

export type StartJourneyConfig = {
  journeyLabel: string;
  measureType: TripMeasure;
  plannedDurationMinutes: number;
  tripSetupLabel: string;
  locationSummary: string;
  routeShape: RouteShape;
  contactNames: string[];
  contactLabel: string;
  startedAt: string;
};

const readyLimeLight = "#CFE17A";
const readyLime = "#AFCB46";
const readyLimeText = "#566126";
const readyLimeTextDark = "#4F5A22";

const journeyTypes: Array<{
  key: JourneyType;
  label: string;
  icon: string;
  colors: [string, string];
  blurb: string;
}> = [
  {
    key: "walk",
    label: "Walk",
    icon: "🚶‍♀️",
    colors: [readyLimeLight, readyLime],
    blurb: "Easy\npace",
  },
  {
    key: "run",
    label: "Run",
    icon: "🏃‍♀️",
    colors: [theme.colors.brandBright, theme.colors.brand],
    blurb: "Quick workout",
  },
  {
    key: "hike",
    label: "Hike",
    icon: "🥾",
    colors: ["#F6D2BE", "#EFB79A"],
    blurb: "Trail\nready",
  },
  {
    key: "bike",
    label: "Bike",
    icon: "🚲",
    colors: [readyLimeLight, readyLime],
    blurb: "Smooth ride",
  },
];

const trustedContacts: string[] = [];
const previewTrustedContacts = ["Maya", "Jordan", "Chris"] as const;
const previewGroupMembers = ["Ava", "Noah", "Lena"] as const;

const journeySpeedMph: Record<JourneyType, number> = {
  walk: 3,
  run: 6,
  hike: 2.5,
  bike: 10,
};

export function StartJourneyScreen({
  onStartJourney,
  onOpenProfile,
}: StartJourneyScreenProps) {
  const [journeyType, setJourneyType] = useState<JourneyType>("walk");
  const [measureType, setMeasureType] = useState<TripMeasure>("distance");
  const [distanceValue, setDistanceValue] = useState("2");
  const [distanceUnit, setDistanceUnit] = useState("mi");
  const [durationHours, setDurationHours] = useState("0");
  const [durationMinutes, setDurationMinutes] = useState("30");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [locationMode, setLocationMode] = useState<LocationMode>("current");
  const [routeShape, setRouteShape] = useState<RouteShape>("oneWay");
  const [groupJourneyEnabled, setGroupJourneyEnabled] = useState(false);
  const [offRouteEnabled, setOffRouteEnabled] = useState(true);
  const [missedCheckInEnabled, setMissedCheckInEnabled] = useState(true);
  const [safetyPromptsEnabled, setSafetyPromptsEnabled] = useState(true);

  const enabledSafetySettings = [
    offRouteEnabled,
    missedCheckInEnabled,
    safetyPromptsEnabled,
  ].filter(Boolean).length;
  const totalSafetySettings = enabledSafetySettings + 1;
  const selectedJourney = journeyTypes.find((item) => item.key === journeyType);
  const previewPeople = groupJourneyEnabled
    ? previewGroupMembers
    : previewTrustedContacts;
  const locationSummary =
    locationMode === "current"
      ? "Current location"
      : destinationLocation.trim() || "Custom destination";
  const peopleSummary = groupJourneyEnabled
    ? `${previewPeople.length} people joining`
    : `${previewPeople.length} trusted contacts`;
  const tripSetupLabel =
    measureType === "distance"
      ? `${distanceValue || "0"} ${distanceUnit}`
      : Number(durationHours || "0") > 0
        ? `${durationHours || "0"} hr ${durationMinutes || "0"} min`
        : `${durationMinutes || "0"} min`;
  const readySummaryTopLine = [
    groupJourneyEnabled ? "Group" : "Solo",
    routeShape === "loop" ? "Loop" : "One-way",
  ].join(" • ");
  const readySummaryBottomLine = [
    tripSetupLabel,
    selectedJourney?.label,
  ].join(" • ");
  const numericDistanceValue = Number(distanceValue || "0");
  const distanceInMiles =
    distanceUnit === "km" ? numericDistanceValue * 0.621371 : numericDistanceValue;
  const durationMinutesTotal =
    Number(durationHours || "0") * 60 + Number(durationMinutes || "0");
  const plannedDurationMinutes =
    measureType === "duration"
      ? Math.max(1, durationMinutesTotal || 30)
      : Math.max(
          5,
          Math.round((distanceInMiles / journeySpeedMph[journeyType]) * 60) || 0,
        );

  return (
    <LinearGradient
      colors={[
        theme.colors.background,
        "#F4E8DA",
        theme.colors.backgroundDeep,
      ]}
      locations={[0, 0.48, 1]}
      start={{ x: 0.45, y: 0 }}
      end={{ x: 0.55, y: 1 }}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Header
          title="Start Your Journey"
          subtitle="We’ll keep you connected along the way."
          tagline="Quick setup, Low stress"
        />

        <LinearGradient
          colors={["rgba(255,255,255,0.92)", "rgba(255,251,247,0.72)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.progressBanner}
        >
          <View style={styles.progressTopRow}>
            <Text style={styles.progressEyebrow}>Start here</Text>
          </View>
          <Text style={styles.progressTitle}>Set up your trip in a few taps</Text>
          <Text style={styles.progressText}>
            Pick your journey, add your people, and start when you are ready.
          </Text>
          <View style={styles.progressChecklist}>
            <Text style={styles.progressChecklistDot}>•</Text>
            {["Journey", "Trusted contacts", "Safety"].map((item) => (
              <View key={item} style={styles.progressChecklistItem}>
                <Text style={styles.progressChecklistLabel}>{item}</Text>
                <Text style={styles.progressChecklistDot}>•</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>Journey type</Text>
            <Text style={styles.sectionTitle}>What kind of trip is this?</Text>
          </View>
          <View style={styles.typeGrid}>
            {journeyTypes.map((item) => {
              const selected = item.key === journeyType;

              return (
                <Pressable
                  key={item.key}
                  onPress={() => setJourneyType(item.key)}
                  style={[styles.typePressable, selected && styles.typePressableSelected]}
                >
                  <View style={[styles.typeCard, selected && styles.typeCardSelected]}>
                    <View
                      style={[
                        styles.typeIconBadge,
                        {
                          backgroundColor: selected
                            ? item.colors[1]
                            : "rgba(222,133,88,0.12)",
                        },
                      ]}
                    >
                      <Text style={styles.typeIcon}>{item.icon}</Text>
                    </View>
                    <Text
                      style={[styles.typeLabel, selected && styles.typeLabelSelected]}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                    <View style={styles.typeBlurbWrap}>
                      <Text
                        style={[styles.typeBlurb, selected && styles.typeBlurbSelected]}
                        numberOfLines={2}
                      >
                        {item.blurb}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderText}>
              <Text style={styles.sectionEyebrow}>Distance or duration</Text>
              <Text style={styles.sectionTitle}>How should we define this trip?</Text>
            </View>
            <View style={styles.segmentedControl}>
              {(["distance", "duration"] as const).map((item) => {
                const selected = item === measureType;

                return (
                  <Pressable
                    key={item}
                    onPress={() => setMeasureType(item)}
                    style={[styles.segment, selected && styles.segmentSelected]}
                  >
                    <Text
                      style={[
                        styles.segmentLabel,
                        selected && styles.segmentLabelSelected,
                      ]}
                    >
                      {item === "distance" ? "Distance" : "Duration"}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.measureInputCard}>
            <View style={styles.measureInputCopy}>
              <Text style={styles.measureInputLabel}>
                {measureType === "distance" ? "Enter distance" : "Enter duration"}
              </Text>
              <Text style={styles.measureInputHint}>
                {measureType === "distance"
                  ? "Type how far you plan to go."
                  : "Set how many hours and minutes you expect this trip to take."}
              </Text>
            </View>
            {measureType === "distance" ? (
              <View style={styles.measureInputRow}>
                <TextInput
                  value={distanceValue}
                  onChangeText={setDistanceValue}
                  keyboardType="numeric"
                  placeholder="2"
                  placeholderTextColor={theme.colors.textMuted}
                  style={styles.measureInput}
                />
                <View style={styles.measureUnitToggle}>
                  {(["mi", "km"] as const).map((unit) => {
                    const selected = distanceUnit === unit;

                    return (
                      <Pressable
                        key={unit}
                        onPress={() => setDistanceUnit(unit)}
                        style={[
                          styles.measureUnitPill,
                          selected && styles.measureUnitPillSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.measureUnitLabel,
                            selected && styles.measureUnitLabelSelected,
                          ]}
                        >
                          {unit}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : (
              <View style={styles.durationRow}>
                <View style={styles.durationField}>
                  <Text style={styles.durationLabel}>Hours</Text>
                  <TextInput
                    value={durationHours}
                    onChangeText={setDurationHours}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={theme.colors.textMuted}
                    style={styles.measureInput}
                  />
                </View>
                <View style={styles.durationField}>
                  <Text style={styles.durationLabel}>Minutes</Text>
                  <TextInput
                    value={durationMinutes}
                    onChangeText={setDurationMinutes}
                    keyboardType="numeric"
                    placeholder="30"
                    placeholderTextColor={theme.colors.textMuted}
                    style={styles.measureInput}
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>Location</Text>
            <Text style={styles.sectionTitle}>Where are you going?</Text>
          </View>

          <View style={styles.locationStack}>
            <View
              style={[
                styles.locationCard,
                locationMode === "current" && styles.locationCardSelected,
              ]}
            >
              <View style={styles.locationTopRow}>
                <View style={[styles.locationBadge, styles.locationBadgeWarm]}>
                  <Text style={styles.locationBadgeText}>📍</Text>
                </View>
                <View style={styles.locationCopy}>
                  <Text style={styles.locationLabel}>Current location</Text>
                  <Text style={styles.locationValue}>Downtown Tulsa, OK</Text>
                </View>
                <Pressable
                  style={[
                    styles.locationAction,
                    locationMode === "current" && styles.locationActionSelected,
                  ]}
                  onPress={() => setLocationMode("current")}
                >
                  <Text
                    style={[
                      styles.locationActionText,
                      locationMode === "current" && styles.locationActionTextSelected,
                    ]}
                  >
                    {locationMode === "current" ? "Selected" : "Select"}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View
              style={[
                styles.locationOptionCard,
                locationMode === "custom" && styles.locationOptionCardSelected,
              ]}
            >
              <View style={styles.locationTopRow}>
                <View style={[styles.locationBadge, styles.locationBadgeCool]}>
                  <Text style={styles.locationBadgeText}>↗</Text>
                </View>
                <View style={styles.locationCopy}>
                  <Text style={styles.locationLabel}>Enter another location</Text>
                </View>
                <Pressable
                  style={[
                    styles.locationAction,
                    locationMode === "custom" && styles.locationActionSelected,
                  ]}
                  onPress={() => setLocationMode("custom")}
                >
                  <Text
                    style={[
                      styles.locationActionText,
                      locationMode === "custom" && styles.locationActionTextSelected,
                    ]}
                  >
                    {locationMode === "custom" ? "Selected" : "Select"}
                  </Text>
                </Pressable>
              </View>
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
                style={[
                  styles.locationInput,
                  locationMode === "custom" && styles.locationInputSelected,
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>Route shape</Text>
            <Text style={styles.sectionTitle}>Should this journey loop back?</Text>
            <Text style={styles.sectionText}>
              Choose whether this trip ends elsewhere or brings you back to the start.
            </Text>
          </View>

          <View style={styles.routeShapeGrid}>
            {[
              {
                key: "oneWay" as const,
                title: "One-way",
                text: "Finish at a different destination.",
              },
              {
                key: "loop" as const,
                title: "Loop",
                text: "Return to your starting point.",
              },
            ].map((option) => {
              const selected = routeShape === option.key;

              return (
                <Pressable
                  key={option.key}
                  onPress={() => setRouteShape(option.key)}
                  style={[
                    styles.routeShapeCard,
                    selected && styles.routeShapeCardSelected,
                  ]}
                >
                  <View style={styles.routeShapeTopRow}>
                    <View style={styles.routeShapeCopy}>
                      <Text
                        style={[
                          styles.routeShapeTitle,
                          selected && styles.routeShapeTitleSelected,
                        ]}
                      >
                        {option.title}
                      </Text>
                      <Text
                        style={[
                          styles.routeShapeText,
                          selected && styles.routeShapeTextSelected,
                        ]}
                      >
                        {option.text}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.routeShapeAction,
                        selected && styles.routeShapeActionSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.routeShapeActionText,
                          selected && styles.routeShapeActionTextSelected,
                        ]}
                      >
                        {selected ? "Selected" : "Select"}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <LinearGradient
          colors={["rgba(255,255,255,0.98)", "rgba(255,255,255,0.98)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.section, styles.contactsSection]}
        >
          <View style={styles.contactsHeaderRow}>
            <View style={styles.sectionHeaderText}>
              <Text style={styles.sectionEyebrow}>Journey sharing</Text>
              <Text style={styles.sectionTitle}>Who is connected to this trip?</Text>
              <Text style={styles.sectionText}>
                Choose who is joining you and who should receive safety updates for this
                journey.
              </Text>
            </View>
            <View style={styles.contactsCountBadge}>
              <Text style={styles.contactsCountValue}>{trustedContacts.length}</Text>
              <Text style={styles.contactsCountLabel}>selected</Text>
            </View>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingCopy}>
              <Text style={styles.sectionEyebrow}>Group journey</Text>
              <Text style={styles.sectionTitle}>Is anyone joining you?</Text>
              <Text style={styles.settingText}>
                Turn this on for a shared walk, run, outing, or meetup.
              </Text>
            </View>
            <Switch
              value={groupJourneyEnabled}
              onValueChange={setGroupJourneyEnabled}
              trackColor={{
                false: "rgba(127,112,118,0.22)",
                true: "rgba(127,112,118,0.22)",
              }}
              thumbColor={groupJourneyEnabled ? readyLime : theme.colors.white}
            />
          </View>

          <View
            style={[
              styles.groupStatusCard,
              groupJourneyEnabled && styles.groupStatusCardEnabled,
            ]}
          >
            <Text style={styles.groupStatusLabel}>
              {groupJourneyEnabled ? "Group journey is on" : "Solo journey is on"}
            </Text>
            <Text style={styles.groupStatusText}>
              {groupJourneyEnabled
                ? "Pick who is joining you on this route, and keep trusted contacts in place for safety updates."
                : "Trusted contacts will be the people monitoring your trip and safety updates."}
            </Text>
          </View>

          {trustedContacts.length > 0 ? (
            <View style={styles.contactRow}>
              {trustedContacts.map((contact) => (
                <View key={contact} style={styles.contactChip}>
                  <View style={styles.contactAvatar}>
                    <Text style={styles.contactAvatarText}>{contact[0]}</Text>
                  </View>
                  <Text style={styles.contactChipLabel}>{contact}</Text>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.contactsActionGrid}>
            <Pressable style={styles.contactActionCard} onPress={onOpenProfile}>
              <View style={styles.contactActionCopy}>
                <Text style={styles.contactActionEyebrow}>
                  {groupJourneyEnabled ? "Trip people" : "Trusted contacts"}
                </Text>
                <Text style={styles.contactActionTitle}>
                  {groupJourneyEnabled
                    ? "Manage group members and safety contacts"
                    : "Manage contacts for this trip"}
                </Text>
                <Text style={styles.contactActionText}>
                  {groupJourneyEnabled
                    ? "Group members are joining the route, while trusted contacts stay in the loop for safety updates."
                    : "Trusted contacts will get safety updates for this journey."}
                </Text>
              </View>
              <View style={styles.contactPreviewRow}>
                {previewPeople.map((contact, index) => (
                  <View key={contact} style={styles.contactPreviewItem}>
                    <View
                      style={[
                        styles.contactPreviewAvatar,
                        index === 0
                          ? styles.contactPreviewAvatarWarm
                          : index === 1
                            ? styles.contactPreviewAvatarCool
                            : styles.contactPreviewAvatarSoft,
                      ]}
                    >
                      <Text style={styles.contactPreviewAvatarText}>{contact[0]}</Text>
                    </View>
                    <Text style={styles.contactPreviewName}>{contact}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.contactActionFooter}>
                <View style={styles.contactActionButton}>
                  <Text style={styles.contactActionButtonText}>Open Profile</Text>
                </View>
              </View>
            </Pressable>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>Safety settings</Text>
            <Text style={styles.sectionTitle}>What safety support should stay on?</Text>
            <Text style={styles.sectionText}>
              Your saved safety settings live in Profile. Here’s what is currently selected
              for this journey.
            </Text>
          </View>

          <View style={styles.safetySummaryHeader}>
            <View style={styles.safetySummaryCard}>
              <Text style={styles.safetySummaryValue}>4/4</Text>
              <Text style={styles.safetySummaryLabel}>Safety options enabled</Text>
            </View>
            <Pressable style={styles.contactActionButton} onPress={onOpenProfile}>
              <Text style={styles.contactActionButtonText}>Open Profile</Text>
            </Pressable>
          </View>

          <View style={styles.safetyChecklist}>
            {[
              "Off-route alerts",
              "Missed check-in alerts",
              "Emergency action",
              "Safety check-ins",
            ].map((item, index, list) => (
              <View key={item} style={styles.safetyChecklistItem}>
                {index === 0 || index === 2 ? (
                  <Text style={styles.safetyChecklistDot}>•</Text>
                ) : null}
                <Text style={styles.safetyChecklistLabel}>{item}</Text>
                {index < list.length - 1 || index === list.length - 1 ? (
                  <Text style={styles.safetyChecklistDot}>•</Text>
                ) : null}
              </View>
            ))}
          </View>
        </View>

        <LinearGradient
          colors={[readyLimeLight, readyLime]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.readyCard}
        >
          <Text style={styles.readyEyebrow}>Ready to start?</Text>
          <Text style={styles.readyTitle}>{readySummaryTopLine}</Text>
          <Text style={styles.readyTitle}>{readySummaryBottomLine}</Text>
          <View style={styles.readySummaryRow}>
            {[locationSummary, peopleSummary, `${totalSafetySettings}/4 safety settings`].map(
              (item, index, list) => (
                <View key={item} style={styles.readySummaryItem}>
                  {index === 0 || item === `${totalSafetySettings}/4 safety settings` ? (
                    <Text style={styles.readySummaryDot}>•</Text>
                  ) : null}
                  <Text style={styles.readySummaryText}>{item}</Text>
                  {index < list.length - 1 || item === `${totalSafetySettings}/4 safety settings` ? (
                    <Text style={styles.readySummaryDot}>•</Text>
                  ) : null}
                </View>
              ),
            )}
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.readyButton,
              pressed && styles.readyButtonPressed,
            ]}
            onPress={() =>
              onStartJourney?.({
                journeyLabel: selectedJourney?.label ?? "Journey",
                measureType,
                plannedDurationMinutes,
                tripSetupLabel,
                locationSummary,
                routeShape,
                contactNames: [...previewPeople],
                contactLabel: groupJourneyEnabled
                  ? "Group status"
                  : "Trusted contact status",
                startedAt: new Date().toISOString(),
              })
            }
          >
            <Text style={styles.readyButtonText}>Start journey</Text>
          </Pressable>
        </LinearGradient>
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
  progressBanner: {
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.56)",
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  progressTopRow: {
    alignItems: "flex-start",
  },
  progressEyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: theme.colors.textMuted,
  },
  progressTitle: {
    marginTop: 4,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "800",
    color: theme.colors.text,
  },
  progressText: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.textSoft,
  },
  progressChecklist: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  progressChecklistItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  progressChecklistDot: {
    fontSize: 16,
    color: readyLime,
  },
  progressChecklistLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.text,
  },
  section: {
    backgroundColor: "rgba(255,253,251,0.98)",
    borderRadius: 28,
    padding: 20,
    gap: 14,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  contactsSection: {
    borderWidth: 1,
    borderColor: "rgba(222,133,88,0.12)",
  },
  sectionHeader: {
    gap: 5,
  },
  sectionHeaderRow: {
    gap: 12,
  },
  sectionHeaderText: {
    gap: 5,
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
  sectionText: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.textSoft,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 12,
  },
  typePressable: {
    flex: 1,
    borderRadius: 22,
  },
  typePressableSelected: {
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  typeCard: {
    height: 124,
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(175,203,70,0.34)",
    backgroundColor: "#FFF9F5",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  typeCardSelected: {
    borderColor: readyLime,
    backgroundColor: "rgba(255,247,241,0.98)",
  },
  typeIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  typeIcon: {
    fontSize: 24,
  },
  typeLabel: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "800",
    color: theme.colors.text,
    textAlign: "center",
  },
  typeLabelSelected: {
    color: theme.colors.text,
  },
  typeBlurbWrap: {
    width: "100%",
    marginTop: "auto",
    alignItems: "center",
  },
  typeBlurb: {
    fontSize: 12,
    lineHeight: 16,
    minHeight: 32,
    width: "100%",
    color: theme.colors.textSoft,
    textAlign: "center",
  },
  typeBlurbSelected: {
    color: theme.colors.textSoft,
  },
  segmentedControl: {
    flexDirection: "row",
    alignSelf: "flex-start",
    padding: 4,
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: theme.radius.pill,
  },
  segment: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
  },
  segmentSelected: {
    backgroundColor: readyLime,
  },
  segmentLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textSoft,
  },
  segmentLabelSelected: {
    color: readyLimeText,
  },
  measureInputCard: {
    padding: 16,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceSoft,
    gap: 12,
  },
  measureInputCopy: {
    gap: 4,
  },
  measureInputLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.text,
  },
  measureInputHint: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textSoft,
  },
  measureInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  measureInput: {
    flex: 1,
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: theme.colors.white,
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  measureUnitToggle: {
    flexDirection: "row",
    padding: 4,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.72)",
  },
  measureUnitPill: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
  },
  measureUnitPillSelected: {
    backgroundColor: readyLime,
  },
  measureUnitLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textSoft,
  },
  measureUnitLabelSelected: {
    color: readyLimeText,
  },
  durationRow: {
    flexDirection: "row",
    gap: 12,
  },
  durationField: {
    flex: 1,
    gap: 8,
  },
  durationLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textSoft,
  },
  locationStack: {
    gap: 12,
  },
  locationCard: {
    padding: 16,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceSoft,
    gap: 6,
  },
  locationCardSelected: {
    borderWidth: 1,
    borderColor: "rgba(175,203,70,0.42)",
    backgroundColor: "rgba(207,225,122,0.2)",
  },
  locationOptionCard: {
    padding: 16,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceSoft,
    gap: 12,
  },
  locationOptionCardSelected: {
    borderWidth: 1,
    borderColor: "rgba(175,203,70,0.42)",
    backgroundColor: "rgba(207,225,122,0.2)",
  },
  locationTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  locationBadge: {
    width: 46,
    height: 46,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  locationBadgeWarm: {
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  locationBadgeCool: {
    backgroundColor: "rgba(255,255,255,0.75)",
  },
  locationBadgeText: {
    fontSize: 20,
  },
  locationCopy: {
    flex: 1,
    gap: 4,
  },
  locationLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textMuted,
  },
  locationValue: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.colors.text,
  },
  locationInput: {
    minHeight: 48,
    marginTop: 4,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.84)",
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
  },
  locationInputSelected: {
    borderWidth: 1,
    borderColor: "rgba(175,203,70,0.42)",
  },
  locationAction: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.white,
  },
  locationActionSelected: {
    backgroundColor: readyLime,
  },
  locationActionText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.text,
  },
  locationActionTextSelected: {
    color: readyLimeText,
  },
  routeShapeGrid: {
    gap: 12,
  },
  routeShapeCard: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: theme.colors.surfaceSoft,
    gap: 6,
  },
  routeShapeTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  routeShapeCopy: {
    flex: 1,
    gap: 6,
  },
  routeShapeCardSelected: {
    borderWidth: 1,
    borderColor: "rgba(175,203,70,0.42)",
    backgroundColor: "rgba(207,225,122,0.2)",
  },
  routeShapeTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: theme.colors.text,
  },
  routeShapeTitleSelected: {
    color: readyLimeTextDark,
  },
  routeShapeText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textSoft,
  },
  routeShapeTextSelected: {
    color: readyLimeText,
  },
  routeShapeAction: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.white,
  },
  routeShapeActionSelected: {
    backgroundColor: readyLime,
  },
  routeShapeActionText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.text,
  },
  routeShapeActionTextSelected: {
    color: readyLimeText,
  },
  contactsHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
  },
  contactsCountBadge: {
    minWidth: 74,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "rgba(222,133,88,0.12)",
  },
  contactsCountValue: {
    fontSize: 20,
    fontWeight: "900",
    color: readyLime,
  },
  contactsCountLabel: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textSoft,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  contactChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.white,
  },
  contactAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.brand,
  },
  contactAvatarText: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.colors.white,
  },
  contactChipLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
  contactsActionGrid: {
    gap: 12,
  },
  contactActionCard: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: theme.colors.surfaceSoft,
    gap: 6,
  },
  contactActionCopy: {
    gap: 2,
  },
  contactActionEyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: theme.colors.textMuted,
  },
  contactActionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: theme.colors.text,
  },
  contactActionText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textSoft,
  },
  contactPreviewRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 4,
    marginBottom: 4,
  },
  contactPreviewItem: {
    alignItems: "center",
    gap: 8,
  },
  contactPreviewAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  contactPreviewAvatarWarm: {
    backgroundColor: "rgba(240,174,141,0.34)",
  },
  contactPreviewAvatarCool: {
    backgroundColor: "rgba(183,205,235,0.42)",
  },
  contactPreviewAvatarSoft: {
    backgroundColor: "rgba(207,225,122,0.3)",
  },
  contactPreviewAvatarText: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.text,
  },
  contactPreviewName: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textSoft,
  },
  contactActionFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 6,
  },
  contactActionButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: readyLime,
  },
  contactActionButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: readyLimeText,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  settingCopy: {
    flex: 1,
    gap: 4,
  },
  settingLabel: {
    fontSize: 17,
    fontWeight: "800",
    color: theme.colors.text,
  },
  settingText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textSoft,
  },
  groupStatusCard: {
    padding: 16,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceSoft,
    gap: 6,
  },
  groupStatusCardEnabled: {
    backgroundColor: "rgba(175,203,70,0.18)",
  },
  groupStatusLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.text,
  },
  groupStatusText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textSoft,
  },
  safetySummaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  safetySummaryCard: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
  },
  safetySummaryValue: {
    fontSize: 22,
    fontWeight: "900",
    color: readyLime,
  },
  safetySummaryLabel: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textSoft,
  },
  safetyChecklist: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12,
  },
  safetyChecklistItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  safetyChecklistDot: {
    fontSize: 16,
    color: readyLime,
  },
  safetyChecklistLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.text,
  },
  readyCard: {
    borderRadius: 30,
    padding: 22,
    gap: 12,
    shadowColor: "#92A93A",
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  readyEyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: "rgba(86,97,38,0.82)",
  },
  readyTitle: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "900",
    color: readyLimeTextDark,
  },
  readyText: {
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(79,90,34,0.82)",
  },
  readySummaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
  },
  readySummaryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  readySummaryDot: {
    fontSize: 16,
    color: readyLimeText,
  },
  readySummaryText: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(79,90,34,0.88)",
  },
  readyChecklist: {
    gap: 8,
  },
  readyChecklistItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  readyChecklistBullet: {
    fontSize: 16,
    color: readyLimeText,
  },
  readyChecklistLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(79,90,34,0.88)",
  },
  readyButton: {
    marginTop: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.92)",
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  readyButtonPressed: {
    opacity: 0.82,
  },
  readyButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: readyLimeTextDark,
  },
});
