import { useEffect, useRef, useState } from "react";
import { Feather } from "@expo/vector-icons";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../styles/theme";
import type { SavedRouteStartPreset } from "./RoutesScreen";

type StartJourneyScreenProps = {
  onStartJourney?: (journeyConfig: StartJourneyConfig) => void;
  onOpenAlerts?: () => void;
  onOpenProfile?: () => void;
  initialRoutePreset?: SavedRouteStartPreset | null;
  hasAlertIndicator?: boolean;
};

export type JourneyType = "walk" | "run" | "hike" | "bike";
export type TripMeasure = "distance" | "duration";
type LocationMode = "current" | "custom";
export type RouteShape = "oneWay" | "loop";
type EditableContact = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  note: string;
};
type SafetyFeature = {
  id: string;
  label: string;
  description: string;
};

export type StartJourneyConfig = {
  journeyLabel: string;
  measureType: TripMeasure;
  plannedDurationMinutes: number;
  tripSetupLabel: string;
  locationSummary: string;
  routeShape: RouteShape;
  contactNames: string[];
  primaryContactName: string;
  contactLabel: string;
  startedAt: string;
};

const defaultIncludedSafetyIds = [
  "off-route",
  "missed-check-in",
  "emergency",
  "check-ins",
] as const;

const readyLimeLight = "#CFE17A";
const readyLime = "#AFCB46";
const readyLimeMid = "#A1BE3F";
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

const initialTrustedContacts: EditableContact[] = [
  { id: "maya", firstName: "Maya", lastName: "Lopez", phone: "(918) 555-0143", note: "Mom" },
  { id: "jordan", firstName: "Jordan", lastName: "Reed", phone: "(918) 555-0188", note: "Best friend" },
  { id: "chris", firstName: "Chris", lastName: "Parker", phone: "(918) 555-0121", note: "Emergency contact" },
];
const initialGroupMembers: EditableContact[] = [
  { id: "ava", firstName: "Ava", lastName: "Stone", phone: "(918) 555-0102", note: "Walking together" },
  { id: "noah", firstName: "Noah", lastName: "Brooks", phone: "(918) 555-0190", note: "Meeting downtown" },
  { id: "lena", firstName: "Lena", lastName: "Cole", phone: "(918) 555-0176", note: "Bike partner" },
];
const safetyFeatures: SafetyFeature[] = [
  {
    id: "off-route",
    label: "Off-route alerts",
    description: "Let trusted contacts know if the journey goes off the planned path.",
  },
  {
    id: "missed-check-in",
    label: "Missed check-in alerts",
    description: "Send an alert if a check-in window is missed during the journey.",
  },
  {
    id: "emergency",
    label: "Emergency action",
    description: "Keep a quick emergency action available during the trip.",
  },
  {
    id: "check-ins",
    label: "Safety check-ins",
    description: "Prompt for check-ins during longer or more sensitive journeys.",
  },
];

const journeySpeedMph: Record<JourneyType, number> = {
  walk: 3,
  run: 6,
  hike: 2.5,
  bike: 10,
};

export function StartJourneyScreen({
  onStartJourney,
  onOpenAlerts,
  onOpenProfile,
  initialRoutePreset = null,
  hasAlertIndicator = false,
}: StartJourneyScreenProps) {
  const safetyScrollRef = useRef<ScrollView | null>(null);
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
  const [trustedContactList, setTrustedContactList] =
    useState<EditableContact[]>(initialTrustedContacts);
  const [groupMemberList, setGroupMemberList] =
    useState<EditableContact[]>(initialGroupMembers);
  const [includedSafetyIds, setIncludedSafetyIds] =
    useState<string[]>([...defaultIncludedSafetyIds]);
  const [selectedTrustedContactName, setSelectedTrustedContactName] =
    useState(
      initialTrustedContacts[0]
        ? `${initialTrustedContacts[0].firstName} ${initialTrustedContacts[0].lastName}`.trim()
        : "",
    );
  const [safetyScrollX, setSafetyScrollX] = useState(0);
  const [safetyViewportWidth, setSafetyViewportWidth] = useState(0);
  const [safetyContentWidth, setSafetyContentWidth] = useState(0);
  const [contactEditorVisible, setContactEditorVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<EditableContact | null>(null);
  const [editingGroupContact, setEditingGroupContact] = useState(false);
  const [isEditingContactFields, setIsEditingContactFields] = useState(false);
  const [safetyEditorVisible, setSafetyEditorVisible] = useState(false);
  const [selectedSafetyFeature, setSelectedSafetyFeature] = useState<SafetyFeature | null>(null);
  const [safetyEditorMode, setSafetyEditorMode] = useState<"feature" | "add">("feature");

  const includedSafetyFeatures = safetyFeatures.filter((feature) =>
    includedSafetyIds.includes(feature.id),
  );
  const availableSafetyFeatures = safetyFeatures.filter(
    (feature) => !includedSafetyIds.includes(feature.id),
  );
  const totalSafetySettings = includedSafetyFeatures.length;
  const maxSafetyScrollX = Math.max(0, safetyContentWidth - safetyViewportWidth);
  const canScrollSafetyLeft = safetyScrollX > 4;
  const canScrollSafetyRight = safetyScrollX < maxSafetyScrollX - 4;
  const selectedJourney = journeyTypes.find((item) => item.key === journeyType);
  const previewPeople = groupJourneyEnabled ? groupMemberList : trustedContactList;
  const selectedTrustedContact =
    trustedContactList.find(
      (contact) =>
        `${contact.firstName} ${contact.lastName}`.trim() === selectedTrustedContactName,
    ) ??
    trustedContactList[0] ??
    null;
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
  const trustedContactNames = trustedContactList.map((contact) =>
    `${contact.firstName} ${contact.lastName}`.trim(),
  );
  const journeyLabel =
    locationMode === "custom" && destinationLocation.trim().length > 0
      ? destinationLocation.trim()
      : initialRoutePreset?.routeName?.trim()
        ? initialRoutePreset.routeName
      : `${selectedJourney?.label ?? "Journey"} ${routeShape === "loop" ? "Loop" : "Route"}`;

  useEffect(() => {
    if (!initialRoutePreset) {
      return;
    }

    const distanceMatch = initialRoutePreset.distance.match(/^([\d.]+)\s*(mi|km)$/i);
    if (distanceMatch) {
      setMeasureType("distance");
      setDistanceValue(distanceMatch[1]);
      setDistanceUnit(distanceMatch[2].toLowerCase());
    }

    const timeMatch = initialRoutePreset.time.match(
      /^(?:(\d+)\s*hr\s*)?(?:(\d+)\s*min)$/i,
    );
    if (timeMatch) {
      const parsedHours = timeMatch[1] ?? "0";
      const parsedMinutes = timeMatch[2] ?? "0";
      setDurationHours(parsedHours);
      setDurationMinutes(parsedMinutes);
    }

    setRouteShape(initialRoutePreset.routeShape);
    setIncludedSafetyIds(
      Array.isArray(initialRoutePreset.safetyFeatureIds) &&
        initialRoutePreset.safetyFeatureIds.length > 0
        ? initialRoutePreset.safetyFeatureIds
        : [...defaultIncludedSafetyIds],
    );
  }, [initialRoutePreset]);

  function openContactEditor(contact: EditableContact, isGroupContact: boolean) {
    setEditingContact({ ...contact });
    setEditingGroupContact(isGroupContact);
    setIsEditingContactFields(false);
    setContactEditorVisible(true);
  }

  function openNewContactEditor() {
    setEditingContact({
      id: `contact-${Date.now()}`,
      firstName: "",
      lastName: "",
      phone: "",
      note: "",
    });
    setEditingGroupContact(groupJourneyEnabled);
    setIsEditingContactFields(true);
    setContactEditorVisible(true);
  }

  function closeContactEditor() {
    setContactEditorVisible(false);
    setEditingContact(null);
    setIsEditingContactFields(false);
  }

  function updateEditingContact(field: keyof EditableContact, value: string) {
    setEditingContact((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : current,
    );
  }

  function saveEditingContact() {
    if (!editingContact) {
      return;
    }

    const normalizedContact: EditableContact = {
      ...editingContact,
      firstName: editingContact.firstName.trim() || "New",
      lastName: editingContact.lastName.trim() || "Contact",
      phone: editingContact.phone.trim(),
      note: editingContact.note.trim(),
    };

    const updateList = (contacts: EditableContact[]) => {
      const exists = contacts.some((contact) => contact.id === normalizedContact.id);

      return exists
        ? contacts.map((contact) =>
            contact.id === normalizedContact.id ? normalizedContact : contact,
          )
        : [...contacts, normalizedContact];
    };

    if (editingGroupContact) {
      setGroupMemberList((current) => updateList(current));
    } else {
      setTrustedContactList((current) => {
        const updatedContacts = updateList(current);
        const savedContact = updatedContacts.find(
          (contact) => contact.id === normalizedContact.id,
        );

        if (
          savedContact &&
          selectedTrustedContactName ===
            `${editingContact.firstName} ${editingContact.lastName}`.trim()
        ) {
          setSelectedTrustedContactName(
            `${savedContact.firstName} ${savedContact.lastName}`.trim(),
          );
        }

        return updatedContacts;
      });
    }

    closeContactEditor();
  }

  function removeEditingContact() {
    if (!editingContact) {
      return;
    }

    if (editingGroupContact) {
      setGroupMemberList((current) =>
        current.filter((contact) => contact.id !== editingContact.id),
      );
    } else {
      setTrustedContactList((current) => {
        const updatedContacts = current.filter(
          (contact) => contact.id !== editingContact.id,
        );

        if (
          selectedTrustedContactName ===
          `${editingContact.firstName} ${editingContact.lastName}`.trim()
        ) {
          setSelectedTrustedContactName(
            updatedContacts[0]
              ? `${updatedContacts[0].firstName} ${updatedContacts[0].lastName}`.trim()
              : "",
          );
        }

        return updatedContacts;
      });
    }

    closeContactEditor();
  }

  function openSafetyEditor(item: SafetyFeature) {
    setSelectedSafetyFeature(item);
    setSafetyEditorMode("feature");
    setSafetyEditorVisible(true);
  }

  function openNewSafetyEditor() {
    setSelectedSafetyFeature(null);
    setSafetyEditorMode("add");
    setSafetyEditorVisible(true);
  }

  function closeSafetyEditor() {
    setSafetyEditorVisible(false);
    setSelectedSafetyFeature(null);
  }

  function includeSafetyFeature(featureId: string) {
    setIncludedSafetyIds((current) =>
      current.includes(featureId) ? current : [...current, featureId],
    );
    closeSafetyEditor();
  }

  function removeSafetyItem() {
    if (!selectedSafetyFeature) {
      return;
    }

    setIncludedSafetyIds((current) =>
      current.filter((item) => item !== selectedSafetyFeature.id),
    );
    closeSafetyEditor();
  }

  function scrollSafetyRow(direction: "left" | "right") {
    const scrollDistance = Math.max(140, safetyViewportWidth * 0.72);
    const nextX =
      direction === "left"
        ? Math.max(0, safetyScrollX - scrollDistance)
        : Math.min(maxSafetyScrollX, safetyScrollX + scrollDistance);

    safetyScrollRef.current?.scrollTo({
      x: nextX,
      animated: true,
    });
  }

  function handleStartJourney() {
    onStartJourney?.({
      journeyLabel,
      measureType,
      plannedDurationMinutes,
      tripSetupLabel,
      locationSummary,
      routeShape,
      contactNames: trustedContactNames,
      primaryContactName:
        selectedTrustedContactName || trustedContactNames[0] || "Trusted contact",
      contactLabel: "Trusted contact status",
      startedAt: new Date().toISOString(),
    });
  }

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
        <View style={styles.pageActionRow}>
          <View style={styles.pageActionSpacer} />
          <Pressable onPress={onOpenAlerts} style={styles.alertButton}>
            <Feather name="bell" size={18} color={theme.colors.white} />
            {hasAlertIndicator ? <View style={styles.alertDot} /> : null}
          </Pressable>
        </View>

        {initialRoutePreset ? (
          <View style={styles.savedRoutePresetCard}>
            <Text style={styles.savedRoutePresetEyebrow}>Saved Route</Text>
            <Text style={styles.savedRoutePresetTitle}>
              {initialRoutePreset.routeName}
            </Text>
            <Text style={styles.savedRoutePresetText}>
              {initialRoutePreset.distance} • {initialRoutePreset.time} •{" "}
              {initialRoutePreset.routeShape === "loop" ? "Loop" : "One-way"}
            </Text>
          </View>
        ) : null}

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
              <Text style={styles.contactsCountValue}>{previewPeople.length}</Text>
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
                  <Pressable
                    key={contact.id}
                    style={styles.contactPreviewItem}
                    onPress={() => {
                      if (!groupJourneyEnabled) {
                        setSelectedTrustedContactName(
                          `${contact.firstName} ${contact.lastName}`.trim(),
                        );
                      }
                      openContactEditor(contact, groupJourneyEnabled);
                    }}
                  >
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
                      <Text style={styles.contactPreviewAvatarText}>
                        {contact.firstName.charAt(0)}
                      </Text>
                    </View>
                    <Text style={styles.contactPreviewName}>
                      {`${contact.firstName} ${contact.lastName}`.trim()}
                    </Text>
                  </Pressable>
                ))}
                <Pressable style={styles.contactPreviewAddItem} onPress={openNewContactEditor}>
                  <View style={styles.contactPreviewAddButton}>
                    <Text style={styles.contactPreviewAddText}>+</Text>
                  </View>
                  <Text style={styles.contactPreviewName}>Add</Text>
                </Pressable>
              </View>
            </Pressable>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.safetySummaryHeader}>
            <View style={styles.safetySummaryIntro}>
              <Text style={styles.sectionEyebrow}>Safety settings</Text>
              <Text style={styles.safetySummaryTitle}>Control your safety support</Text>
            </View>
          </View>

          <View style={styles.safetyScrollerRow}>
            <Pressable
              onPress={() => scrollSafetyRow("left")}
              style={[
                styles.safetyScrollArrow,
                !canScrollSafetyLeft && styles.safetyScrollArrowDisabled,
              ]}
            >
              <Text style={styles.safetyScrollArrowText}>‹</Text>
            </Pressable>
            <ScrollView
              ref={safetyScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              onLayout={(event) =>
                setSafetyViewportWidth(event.nativeEvent.layout.width)
              }
              onContentSizeChange={(width) => setSafetyContentWidth(width)}
              onScroll={(event) =>
                setSafetyScrollX(event.nativeEvent.contentOffset.x)
              }
              scrollEventThrottle={16}
              contentContainerStyle={styles.safetyChecklist}
              style={styles.safetyScrollView}
            >
              {includedSafetyFeatures.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => openSafetyEditor(item)}
                  style={styles.safetyChip}
                >
                  <Text style={styles.safetyChipText}>{item.label}</Text>
                </Pressable>
              ))}
              {availableSafetyFeatures.length > 0 ? (
                <Pressable onPress={openNewSafetyEditor} style={styles.safetyAddChip}>
                  <Text style={styles.safetyAddChipText}>+ Add</Text>
                </Pressable>
              ) : null}
            </ScrollView>
            <Pressable
              onPress={() => scrollSafetyRow("right")}
              style={[
                styles.safetyScrollArrow,
                !canScrollSafetyRight && styles.safetyScrollArrowDisabled,
              ]}
            >
              <Text style={styles.safetyScrollArrowText}>›</Text>
            </Pressable>
          </View>
        </View>

        <Pressable onPress={handleStartJourney} style={({ pressed }) => pressed && styles.readyCardPressed}>
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
          </LinearGradient>
        </Pressable>
      </ScrollView>

      <Modal
        transparent
        visible={contactEditorVisible}
        animationType="fade"
        onRequestClose={closeContactEditor}
      >
        <Pressable style={styles.contactModalBackdrop} onPress={closeContactEditor}>
          <Pressable style={styles.contactModalCard} onPress={() => {}}>
            <Text style={styles.contactModalEyebrow}>
              {editingGroupContact ? "Group member" : "Trusted contact"}
            </Text>
            <Text style={styles.contactModalTitle}>Edit contact</Text>

            <View style={styles.contactModalFieldRow}>
              <View style={styles.contactModalNameField}>
                <Text style={styles.contactModalLabel}>First name</Text>
                <TextInput
                  value={editingContact?.firstName ?? ""}
                  onChangeText={(value) => updateEditingContact("firstName", value)}
                  placeholder="First name"
                  placeholderTextColor={theme.colors.textMuted}
                  editable={isEditingContactFields}
                  style={[
                    styles.contactModalInput,
                    !isEditingContactFields && styles.contactModalInputReadOnly,
                  ]}
                />
              </View>
              <View style={styles.contactModalNameField}>
                <Text style={styles.contactModalLabel}>Last name</Text>
                <TextInput
                  value={editingContact?.lastName ?? ""}
                  onChangeText={(value) => updateEditingContact("lastName", value)}
                  placeholder="Last name"
                  placeholderTextColor={theme.colors.textMuted}
                  editable={isEditingContactFields}
                  style={[
                    styles.contactModalInput,
                    !isEditingContactFields && styles.contactModalInputReadOnly,
                  ]}
                />
              </View>
            </View>

            <View style={styles.contactModalField}>
              <Text style={styles.contactModalLabel}>Phone number</Text>
              <TextInput
                value={editingContact?.phone ?? ""}
                onChangeText={(value) => updateEditingContact("phone", value)}
                placeholder="(555) 555-5555"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="phone-pad"
                editable={isEditingContactFields}
                style={[
                  styles.contactModalInput,
                  !isEditingContactFields && styles.contactModalInputReadOnly,
                ]}
              />
            </View>

            <View style={styles.contactModalField}>
              <Text style={styles.contactModalLabel}>Note</Text>
              <TextInput
                value={editingContact?.note ?? ""}
                onChangeText={(value) => updateEditingContact("note", value)}
                placeholder="Mom, friend, roommate..."
                placeholderTextColor={theme.colors.textMuted}
                editable={isEditingContactFields}
                style={[
                  styles.contactModalInput,
                  !isEditingContactFields && styles.contactModalInputReadOnly,
                ]}
              />
            </View>

            <View style={styles.contactModalActions}>
              <Pressable
                onPress={removeEditingContact}
                style={[styles.contactModalButton, styles.contactModalRemoveButton]}
              >
                <Text style={styles.contactModalRemoveText}>Remove</Text>
              </Pressable>
              <Pressable
                onPress={() => setIsEditingContactFields(true)}
                style={[styles.contactModalButton, styles.contactModalEditButton]}
              >
                <Text style={styles.contactModalEditText}>Edit</Text>
              </Pressable>
              <Pressable
                onPress={saveEditingContact}
                style={[styles.contactModalButton, styles.contactModalSaveButton]}
              >
                <Text style={styles.contactModalSaveText}>Save</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        transparent
        visible={safetyEditorVisible}
        animationType="fade"
        onRequestClose={closeSafetyEditor}
      >
        <Pressable style={styles.contactModalBackdrop} onPress={closeSafetyEditor}>
          <Pressable style={styles.contactModalCard} onPress={() => {}}>
            <Text style={styles.contactModalEyebrow}>Safety settings</Text>
            <Text style={styles.contactModalTitle}>
              {safetyEditorMode === "add" ? "Add safety support" : selectedSafetyFeature?.label}
            </Text>
            {safetyEditorMode === "add" ? (
              <View style={styles.safetyModalList}>
                {availableSafetyFeatures.length > 0 ? (
                  availableSafetyFeatures.map((feature) => (
                    <Pressable
                      key={feature.id}
                      onPress={() => includeSafetyFeature(feature.id)}
                      style={styles.safetyModalListItem}
                    >
                      <View style={styles.safetyModalListCopy}>
                        <Text style={styles.safetyModalListTitle}>{feature.label}</Text>
                        <Text style={styles.safetyModalListText}>{feature.description}</Text>
                      </View>
                      <Text style={styles.safetyModalListAdd}>Add</Text>
                    </Pressable>
                  ))
                ) : (
                  <Text style={styles.contactModalBody}>All safety features are already included.</Text>
                )}
              </View>
            ) : (
              <>
                <Text style={styles.contactModalBody}>
                  {selectedSafetyFeature?.description}
                </Text>
                <View style={styles.contactModalActions}>
                  <Pressable
                    onPress={removeSafetyItem}
                    style={[styles.contactModalButton, styles.contactModalRemoveButton]}
                  >
                    <Text style={styles.contactModalRemoveText}>Remove</Text>
                  </Pressable>
                  <Pressable
                    onPress={closeSafetyEditor}
                    style={[styles.contactModalButton, styles.contactModalSaveButton]}
                  >
                    <Text style={styles.contactModalSaveText}>Done</Text>
                  </Pressable>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

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
  pageActionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  pageActionSpacer: {
    flex: 1,
  },
  alertButton: {
    minWidth: 60,
    minHeight: 46,
    paddingHorizontal: 8,
    paddingVertical: 11,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.brand,
    borderWidth: 1,
    borderColor: theme.colors.brandDeep,
    position: "relative",
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  alertDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#FF6A5B",
  },
  savedRoutePresetCard: {
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.98)",
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(223,202,188,0.9)",
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    gap: 6,
  },
  savedRoutePresetEyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: theme.colors.textMuted,
  },
  savedRoutePresetTitle: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "900",
    color: theme.colors.text,
  },
  savedRoutePresetText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textSoft,
  },
  progressBanner: {
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(202,116,73,0.24)",
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
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
    fontWeight: "900",
    color: theme.colors.brandDeep,
  },
  progressText: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.brandDeep,
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
    backgroundColor: "#FFF7F1",
    borderRadius: 28,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(202,116,73,0.22)",
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.14,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  contactsSection: {
    borderWidth: 1,
    borderColor: "rgba(222,133,88,0.22)",
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
    fontWeight: "900",
    color: theme.colors.brandDeep,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.brandDeep,
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
    borderColor: "rgba(202,116,73,0.18)",
    backgroundColor: theme.colors.surfaceOrange,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  typeCardSelected: {
    borderColor: theme.colors.brandDeep,
    backgroundColor: theme.colors.surfaceOrangeDeep,
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
    color: theme.colors.brandDeep,
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
    color: theme.colors.brandDeep,
    textAlign: "center",
  },
  typeBlurbSelected: {
    color: theme.colors.textSoft,
  },
  segmentedControl: {
    flexDirection: "row",
    alignSelf: "flex-start",
    padding: 4,
    backgroundColor: theme.colors.surfaceOrange,
    borderRadius: theme.radius.pill,
  },
  segment: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
  },
  segmentSelected: {
    backgroundColor: readyLimeMid,
  },
  segmentLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textSoft,
  },
  segmentLabelSelected: {
    color: theme.colors.white,
  },
  measureInputCard: {
    padding: 16,
    borderRadius: 22,
    backgroundColor: "rgba(225,138,84,0.24)",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(202,116,73,0.3)",
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
    color: theme.colors.brandDeep,
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
    backgroundColor: "rgba(255,249,244,0.96)",
  },
  measureUnitPill: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
  },
  measureUnitPillSelected: {
    backgroundColor: readyLimeMid,
  },
  measureUnitLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textSoft,
  },
  measureUnitLabelSelected: {
    color: theme.colors.white,
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
    color: theme.colors.text,
  },
  locationStack: {
    gap: 12,
  },
  locationCard: {
    padding: 16,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceOrange,
    gap: 6,
  },
  locationCardSelected: {
    borderWidth: 1,
    borderColor: "rgba(202,116,73,0.28)",
    backgroundColor: theme.colors.surfaceOrangeDeep,
  },
  locationOptionCard: {
    padding: 16,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceOrange,
    gap: 12,
  },
  locationOptionCardSelected: {
    borderWidth: 1,
    borderColor: "rgba(202,116,73,0.28)",
    backgroundColor: theme.colors.surfaceOrangeDeep,
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
    color: theme.colors.brandDeep,
  },
  locationValue: {
    fontSize: 17,
    fontWeight: "800",
    color: theme.colors.text,
  },
  locationInput: {
    minHeight: 48,
    marginTop: 4,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255,251,248,0.96)",
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
  },
  locationInputSelected: {
    borderWidth: 1,
    borderColor: "rgba(202,116,73,0.28)",
  },
  locationAction: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.white,
  },
  locationActionSelected: {
    backgroundColor: readyLimeMid,
  },
  locationActionText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.text,
  },
  locationActionTextSelected: {
    color: theme.colors.white,
  },
  routeShapeGrid: {
    gap: 12,
  },
  routeShapeCard: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: theme.colors.surfaceOrange,
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
    borderColor: "rgba(202,116,73,0.28)",
    backgroundColor: theme.colors.surfaceOrangeDeep,
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
    color: theme.colors.text,
  },
  routeShapeTextSelected: {
    color: theme.colors.brandDeep,
  },
  routeShapeAction: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.white,
  },
  routeShapeActionSelected: {
    backgroundColor: readyLimeMid,
  },
  routeShapeActionText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.text,
  },
  routeShapeActionTextSelected: {
    color: theme.colors.white,
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
    backgroundColor: "rgba(222,133,88,0.2)",
  },
  contactsCountValue: {
    fontSize: 20,
    fontWeight: "900",
    color: theme.colors.brandDeep,
  },
  contactsCountLabel: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.text,
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
    backgroundColor: theme.colors.surfaceOrange,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(202,116,73,0.22)",
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
    color: theme.colors.brandDeep,
  },
  contactActionText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.brandDeep,
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
  contactPreviewAddItem: {
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
    backgroundColor: "#E6A07B",
  },
  contactPreviewAvatarCool: {
    backgroundColor: "#9AB8DB",
  },
  contactPreviewAvatarSoft: {
    backgroundColor: "#B8CF5C",
  },
  contactPreviewAvatarText: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.white,
  },
  contactPreviewName: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textSoft,
  },
  contactPreviewAddButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E58B5B",
    borderWidth: 1,
    borderColor: "#E58B5B",
  },
  contactPreviewAddText: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: "800",
    color: theme.colors.white,
  },
  contactActionButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.brandBright,
  },
  contactActionButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.brandDeep,
  },
  contactModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(58,49,52,0.3)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  contactModalCard: {
    borderRadius: 28,
    backgroundColor: "rgba(255,252,249,0.99)",
    padding: 20,
    gap: 14,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.14,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  contactModalEyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: theme.colors.textMuted,
  },
  contactModalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.text,
  },
  contactModalFieldRow: {
    flexDirection: "row",
    gap: 12,
  },
  contactModalIconField: {
    width: 80,
    gap: 8,
  },
  contactModalNameField: {
    flex: 1,
    gap: 8,
  },
  contactModalField: {
    gap: 8,
  },
  contactModalLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textSoft,
  },
  contactModalInput: {
    minHeight: 50,
    borderRadius: 18,
    backgroundColor: theme.colors.surfaceSoft,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  contactModalInputReadOnly: {
    opacity: 0.82,
  },
  contactModalBody: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.textSoft,
  },
  safetyModalList: {
    gap: 10,
  },
  safetyModalListItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: theme.colors.surfaceSoft,
  },
  safetyModalListCopy: {
    flex: 1,
    gap: 4,
  },
  safetyModalListTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.text,
  },
  safetyModalListText: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.textSoft,
  },
  safetyModalListAdd: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.colors.brandDeep,
  },
  contactModalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  contactModalButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  contactModalRemoveButton: {
    backgroundColor: "rgba(229,139,91,0.14)",
  },
  contactModalEditButton: {
    backgroundColor: theme.colors.surfaceSoft,
  },
  contactModalSaveButton: {
    backgroundColor: theme.colors.ink,
  },
  contactModalRemoveText: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.brandDeep,
  },
  contactModalEditText: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.text,
  },
  contactModalSaveText: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.white,
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
  safetySummaryIntro: {
    flex: 1,
    gap: 4,
  },
  safetySummaryTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "800",
    color: theme.colors.text,
  },
  safetySummaryRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  safetyDetailsButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceSoft,
  },
  safetyDetailsButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.text,
  },
  safetySummaryCard: {
    minWidth: 72,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    alignItems: "center",
  },
  safetySummaryValue: {
    fontSize: 20,
    fontWeight: "900",
    color: readyLime,
  },
  safetySummaryLabel: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.textSoft,
  },
  safetyChecklist: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingRight: 8,
  },
  safetyScrollerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  safetyScrollView: {
    flex: 1,
  },
  safetyScrollArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(229,139,91,0.12)",
  },
  safetyScrollArrowDisabled: {
    opacity: 0.35,
  },
  safetyScrollArrowText: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.brandDeep,
    marginTop: -1,
  },
  safetyChip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(229,139,91,0.14)",
    borderWidth: 1,
    borderColor: "rgba(202,116,73,0.16)",
  },
  safetyChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.brandDeep,
  },
  safetyAddChip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(229,139,91,0.1)",
  },
  safetyAddChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.brandDeep,
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
  readyCardPressed: {
    opacity: 0.92,
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
