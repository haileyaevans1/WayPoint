import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { Marker, Polyline } from "react-native-maps";
import { theme } from "../styles/theme";
import type { StartJourneyConfig } from "./StartJourneyScreen";

type JourneyState = "active" | "offRoute" | "late" | "complete";

type ActiveJourneyScreenProps = {
  onJourneyComplete?: () => void;
  onOpenAlerts?: () => void;
  journeyConfig?: StartJourneyConfig | null;
};

const readyLimeLight = "#CFE17A";
const readyLime = "#AFCB46";
const readyLimeText = "#566126";
const readyLimeTextDark = "#4F5A22";
const warningPeach = "#F7D9C9";
const warningOrange = "#E58B5B";

const fallbackContactStatuses = [
  { name: "Trusted Contact 1", status: "Notified" },
  { name: "Trusted Contact 2", status: "Connected" },
];

const journeyRoute = [
  { latitude: 29.4246, longitude: -98.4898 },
  { latitude: 29.4256, longitude: -98.4883 },
  { latitude: 29.4265, longitude: -98.4867 },
  { latitude: 29.4271, longitude: -98.4852 },
  { latitude: 29.4263, longitude: -98.4838 },
  { latitude: 29.4249, longitude: -98.4832 },
  { latitude: 29.4235, longitude: -98.4838 },
  { latitude: 29.4226, longitude: -98.4855 },
  { latitude: 29.4231, longitude: -98.4874 },
  { latitude: 29.4246, longitude: -98.4898 },
] as const;

const journeyRegion = {
  latitude: 29.4249,
  longitude: -98.486,
  latitudeDelta: 0.006,
  longitudeDelta: 0.006,
};

export function ActiveJourneyScreen({
  onJourneyComplete,
  onOpenAlerts,
  journeyConfig,
}: ActiveJourneyScreenProps) {
  const { height: windowHeight } = useWindowDimensions();
  const safetyPulse = useRef(new Animated.Value(1)).current;
  const [journeyState, setJourneyState] = useState<JourneyState>("active");
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [now, setNow] = useState(Date.now());

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
  const startedAtMs = journeyConfig?.startedAt
    ? new Date(journeyConfig.startedAt).getTime()
    : Date.now();
  const plannedDurationMinutes = journeyConfig?.plannedDurationMinutes ?? 30;
  const totalDurationSeconds = plannedDurationMinutes * 60;
  const elapsedSeconds = Math.max(0, Math.floor((now - startedAtMs) / 1000));
  const remainingSeconds = Math.max(0, totalDurationSeconds - elapsedSeconds);
  const elapsedDisplay = `${String(Math.floor(elapsedSeconds / 60)).padStart(
    2,
    "0",
  )}:${String(elapsedSeconds % 60).padStart(2, "0")}`;
  const remainingDisplay = `${String(
    Math.floor(remainingSeconds / 60),
  ).padStart(2, "0")}:${String(remainingSeconds % 60).padStart(2, "0")}`;
  const countdownDisplay = `${String(Math.floor(remainingSeconds / 60)).padStart(
    2,
    "0",
  )}:${String(remainingSeconds % 60).padStart(2, "0")}`;
  const expectedFinish = new Date(startedAtMs + totalDurationSeconds * 1000);
  const checkInTime = new Date(expectedFinish.getTime() + 5 * 60 * 1000);
  const checkInCountdownSeconds = Math.max(
    0,
    Math.floor((checkInTime.getTime() - now) / 1000),
  );
  const checkInCountdownDisplay = `${String(
    Math.floor(checkInCountdownSeconds / 60),
  ).padStart(2, "0")}:${String(checkInCountdownSeconds % 60).padStart(2, "0")}`;
  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    [],
  );
  const syncedContactStatuses =
    journeyConfig?.contactNames && journeyConfig.contactNames.length > 0
      ? journeyConfig.contactNames.map((name, index) => ({
          name,
          status: index === 0 ? "Connected" : "Notified",
        }))
      : fallbackContactStatuses;
  const [activeContactName, setActiveContactName] = useState(
    syncedContactStatuses[0]?.name ?? "",
  );

  useEffect(() => {
    if (isComplete) {
      safetyPulse.stopAnimation();
      safetyPulse.setValue(1);
      return;
    }

    const safetyPulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(safetyPulse, {
          toValue: 1.05,
          duration: 950,
          useNativeDriver: true,
        }),
        Animated.timing(safetyPulse, {
          toValue: 1,
          duration: 950,
          useNativeDriver: true,
        }),
      ]),
    );

    safetyPulseLoop.start();

    return () => {
      safetyPulseLoop.stop();
      safetyPulse.stopAnimation();
      safetyPulse.setValue(1);
    };
  }, [isComplete, safetyPulse]);

  useEffect(() => {
    if (isComplete) {
      return;
    }

    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isComplete]);

  return (
    <LinearGradient
      colors={[theme.colors.background, "#F4E8DA", theme.colors.backgroundDeep]}
      locations={[0, 0.48, 1]}
      start={{ x: 0.45, y: 0 }}
      end={{ x: 0.55, y: 1 }}
      style={styles.screen}
    >
      <View style={styles.pageConfettiBackdrop}>
        {[
          styles.pageConfettiOne,
          styles.pageConfettiTwo,
          styles.pageConfettiThree,
          styles.pageConfettiFour,
          styles.pageConfettiFive,
          styles.pageConfettiSix,
          styles.pageConfettiSeven,
          styles.pageConfettiEight,
          styles.pageConfettiNine,
          styles.pageConfettiTen,
          styles.pageConfettiEleven,
          styles.pageConfettiTwelve,
          styles.pageConfettiThirteen,
          styles.pageConfettiFourteen,
          styles.pageConfettiFifteen,
          styles.pageConfettiSixteen,
          styles.pageConfettiSeventeen,
          styles.pageConfettiEighteen,
          styles.pageConfettiNineteen,
          styles.pageConfettiTwenty,
          styles.pageConfettiTwentyOne,
          styles.pageConfettiTwentyTwo,
          styles.pageConfettiTwentyThree,
          styles.pageConfettiTwentyFour,
          styles.pageConfettiTwentyFive,
          styles.pageConfettiTwentySix,
          styles.pageConfettiTwentySeven,
          styles.pageConfettiTwentyEight,
          styles.pageConfettiTwentyNine,
          styles.pageConfettiThirty,
          styles.pageConfettiThirtyOne,
          styles.pageConfettiThirtyTwo,
          styles.pageConfettiThirtyThree,
          styles.pageConfettiThirtyFour,
          styles.pageConfettiThirtyFive,
          styles.pageConfettiThirtySix,
          styles.pageConfettiThirtySeven,
          styles.pageConfettiThirtyEight,
          styles.pageConfettiThirtyNine,
          styles.pageConfettiForty,
          styles.pageConfettiFortyOne,
          styles.pageConfettiFortyTwo,
          styles.pageConfettiFortyThree,
          styles.pageConfettiFortyFour,
          styles.pageConfettiFortyFive,
          styles.pageConfettiFortySix,
        ].map((style, index) => (
          <View key={`page-confetti-${index}`} style={style} />
        ))}
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mapShell}>
          <View style={styles.heroShell}>
            <View style={[styles.hero, { minHeight: windowHeight - 200 }]}>
              <MapView
                style={styles.mapView}
                initialRegion={journeyRegion}
                scrollEnabled
                zoomEnabled
                pitchEnabled
                rotateEnabled
                showsCompass
                showsScale
                toolbarEnabled={false}
              >
                <Polyline
                  coordinates={[...journeyRoute]}
                  strokeColor="#675EF2"
                  strokeWidth={5}
                  lineCap="round"
                  lineJoin="round"
                />
                <Marker coordinate={journeyRoute[0]} title="Start" />
                <Marker coordinate={journeyRoute[4]} title="Current position" />
              </MapView>
              <View style={styles.mapTint} />
              {!isComplete ? (
                <Animated.View
                  style={[
                    styles.mapSafetyPulseWrap,
                    styles.mapSafetyCornerWrap,
                    { transform: [{ scale: safetyPulse }] },
                  ]}
                >
                  <Pressable
                    style={styles.mapSafetyButton}
                    onPress={() => setShowSafetyModal(true)}
                  >
                    <Text style={styles.mapSafetyEyebrow}>Quick check-in</Text>
                    <Text style={styles.mapSafetyText}>Safe?</Text>
                  </Pressable>
                </Animated.View>
              ) : null}
              <View style={styles.mapTopControls}>
                <Pressable
                  style={({ pressed }) => [
                    styles.mapAlertButton,
                    pressed && styles.mapAlertButtonPressed,
                  ]}
                  accessibilityRole="button"
                  onPress={onOpenAlerts}
                >
                  <Text style={styles.mapAlertIcon}>◠</Text>
                  <View style={styles.mapAlertDot} />
                </Pressable>
                {!isComplete ? (
                  <Pressable
                    style={({ pressed }) => [
                      styles.mapEndJourneyButton,
                      pressed && styles.mapEndJourneyButtonPressed,
                    ]}
                    onPress={() => {
                      setJourneyState("complete");
                      setShowCompletionModal(true);
                      onJourneyComplete?.();
                    }}
                  >
                    <Text style={styles.mapEndJourneyEyebrow}>All done?</Text>
                    <Text style={styles.mapEndJourneyText}>End Journey</Text>
                  </Pressable>
                ) : null}
              </View>

              <View style={styles.heroLocationCard}>
                <View>
                  <Text style={styles.heroLocationLabel}>Current Journey</Text>
                  <Text style={styles.heroLocationValue}>Riverwalk Loop</Text>
                </View>
                <View style={styles.weatherWrap}>
                  <Text style={styles.weatherLabel}>Sunny</Text>
                  <Text style={styles.weatherValue}>72°F</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.statusHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>Status</Text>
              <Text style={styles.sectionTitle}>Journey Active</Text>
              <Text style={styles.statusStateText}>{statusLabel}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: `${statusAccent}22` },
              ]}
            >
              <View
                style={[styles.statusDot, { backgroundColor: statusAccent }]}
              />
              <Text style={[styles.statusBadgeText, { color: statusAccent }]}>
                Live
              </Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            {[
              ["Elapsed", elapsedDisplay],
              ["Expected finish", timeFormatter.format(expectedFinish)],
              ["Check-in", timeFormatter.format(checkInTime)],
              ["Time remaining", remainingDisplay],
            ].map(([label, value]) => (
              <View key={label} style={styles.statCard}>
                <Text style={styles.statLabel}>{label}</Text>
                <Text style={styles.statValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        <LinearGradient
          colors={["rgba(255,255,255,0.98)", "rgba(255,251,247,0.95)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.deadlineCard}
        >
          <Text style={styles.sectionEyebrow}>Countdown</Text>
          <View style={styles.deadlineRow}>
            <Text style={styles.deadlineValue}>
              {journeyState === "late" ? "00:45" : checkInCountdownDisplay}
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

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>
            {journeyConfig?.contactLabel ?? "Trusted contact status"}
          </Text>
          <Text style={styles.sectionTitle}>Your safety circle is connected</Text>

          <View style={styles.contactPreviewRow}>
            {syncedContactStatuses.map((contact, index) => (
              <Pressable
                key={`${contact.name}-preview`}
                style={[
                  styles.contactPreviewItem,
                  activeContactName === contact.name &&
                    styles.contactPreviewItemActive,
                ]}
                onPress={() => setActiveContactName(contact.name)}
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
                    {contact.name[0]}
                  </Text>
                </View>
                <Text style={styles.contactPreviewName}>{contact.name}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.contactActionRow}>
            {["Message", "Share location", "Call"].map((action) => (
              <Pressable key={action} style={styles.contactActionButton}>
                <Text style={styles.contactActionButtonText}>{action}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {journeyState === "offRoute" ? (
          <View style={[styles.section, styles.warningSection]}>
            <Text style={styles.sectionEyebrow}>Off-route warning</Text>
            <Text style={styles.sectionTitle}>
              You appear to be off route
            </Text>
            <Text style={styles.sectionText}>
              Return to your route or confirm you’re safe so your contacts know
              everything is okay.
            </Text>
            <View style={styles.warningActionRow}>
              <Pressable style={styles.warningPrimaryAction}>
                <Text style={styles.warningPrimaryActionText}>I’m okay</Text>
              </Pressable>
              <Pressable style={styles.warningSecondaryAction}>
                <Text style={styles.warningSecondaryActionText}>
                  Send location
                </Text>
              </Pressable>
              <Pressable style={styles.warningSecondaryAction}>
                <Text style={styles.warningSecondaryActionText}>
                  Re-route me
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {journeyState === "late" ? (
          <View style={[styles.section, styles.warningSection]}>
            <Text style={styles.sectionEyebrow}>Completion warning</Text>
            <Text style={styles.sectionTitle}>
              You haven’t completed your journey yet
            </Text>
            <Text style={styles.sectionText}>
              Complete now. After five minutes your trusted contacts will be
              notified automatically.
            </Text>
            <View style={styles.warningActionRow}>
              <Pressable
                style={styles.warningPrimaryAction}
                onPress={() => {
                  setJourneyState("complete");
                  setShowCompletionModal(true);
                  onJourneyComplete?.();
                }}
              >
                <Text style={styles.warningPrimaryActionText}>
                  Complete Journey
                </Text>
              </Pressable>
              <Pressable style={styles.warningSecondaryAction}>
                <Text style={styles.warningSecondaryActionText}>I’m safe</Text>
              </Pressable>
              <Pressable style={styles.warningSecondaryAction}>
                <Text style={styles.warningSecondaryActionText}>Need help</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

      </ScrollView>

      <Modal visible={showCompletionModal} transparent animationType="fade">
        <View style={styles.completionOverlay}>
          <View style={styles.confettiBurst}>
            {[
              { label: "●", style: styles.confettiOne },
              { label: "✦", style: styles.confettiTwo },
              { label: "◆", style: styles.confettiThree },
              { label: "●", style: styles.confettiFour },
              { label: "✦", style: styles.confettiFive },
              { label: "◆", style: styles.confettiSix },
              { label: "●", style: styles.confettiSeven },
              { label: "✦", style: styles.confettiEight },
            ].map((piece, index) => (
              <Text key={`${piece.label}-${index}`} style={piece.style}>
                {piece.label}
              </Text>
            ))}
          </View>

          <LinearGradient
            colors={[readyLimeLight, readyLime]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.completionModal}
          >
            <Text style={styles.completionEyebrow}>Journey complete</Text>
            <Text style={styles.completionTitle}>You made it safely</Text>
            <Text style={styles.completionText}>
              Your trusted contacts have been updated and your journey is now
              marked complete.
            </Text>
            <Pressable
              style={styles.completionButton}
              onPress={() => setShowCompletionModal(false)}
            >
              <Text style={styles.completionButtonText}>Close</Text>
            </Pressable>
          </LinearGradient>
        </View>
      </Modal>

      <Modal visible={showSafetyModal} transparent animationType="slide">
        <Pressable
          style={styles.safetyOverlay}
          onPress={() => setShowSafetyModal(false)}
        >
          <Pressable style={styles.safetySheet} onPress={() => {}}>
            <Text style={styles.sectionEyebrow}>Are you safe?</Text>
            <Text style={styles.sectionTitle}>Check in quickly if you need to</Text>
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
            <Pressable
              style={styles.safetyCloseButton}
              onPress={() => setShowSafetyModal(false)}
            >
              <Text style={styles.safetyCloseButtonText}>Close</Text>
            </Pressable>
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
  pageConfettiBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 0,
    paddingBottom: 180,
    gap: 18,
  },
  mapShell: {
    marginHorizontal: -18,
    marginTop: -2,
    gap: 14,
  },
  heroShell: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    backgroundColor: theme.colors.heroSky,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  hero: {
    overflow: "hidden",
    backgroundColor: theme.colors.heroSkySoft,
  },
  mapView: {
    ...StyleSheet.absoluteFillObject,
  },
  mapTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,250,247,0.08)",
  },
  mapTopControls: {
    position: "absolute",
    top: 22,
    right: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  mapAlertButton: {
    minWidth: 60,
    minHeight: 46,
    paddingHorizontal: 8,
    paddingVertical: 11,
    borderRadius: 20,
    backgroundColor: warningPeach,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: theme.colors.ink,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  mapAlertButtonPressed: {
    opacity: 0.82,
  },
  mapAlertIcon: {
    fontSize: 22,
    color: warningOrange,
  },
  mapAlertDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: theme.colors.brand,
  },
  mapEndJourneyButton: {
    minWidth: 120,
    minHeight: 46,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 20,
    backgroundColor: warningOrange,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: warningOrange,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  mapEndJourneyButtonPressed: {
    opacity: 0.82,
  },
  mapEndJourneyEyebrow: {
    fontSize: 11,
    color: "rgba(255,255,255,0.82)",
    textAlign: "center",
  },
  mapEndJourneyText: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.white,
    textAlign: "center",
  },
  mapSafetyButton: {
    minWidth: 92,
    minHeight: 46,
    borderRadius: 20,
    backgroundColor: readyLime,
    paddingHorizontal: 14,
    paddingVertical: 9,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#92A93A",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  mapSafetyPulseWrap: {
    borderRadius: 20,
  },
  mapSafetyCornerWrap: {
    position: "absolute",
    top: 22,
    left: 16,
  },
  mapSafetyEyebrow: {
    fontSize: 11,
    color: "rgba(79,90,34,0.82)",
    textAlign: "center",
  },
  mapSafetyText: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: "700",
    color: readyLimeTextDark,
    textAlign: "center",
  },
  heroLocationCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: theme.colors.ink,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  heroLocationLabel: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  heroLocationValue: {
    marginTop: 3,
    fontSize: 19,
    fontWeight: "700",
    color: theme.colors.text,
  },
  weatherWrap: {
    alignItems: "flex-end",
  },
  weatherLabel: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  weatherValue: {
    marginTop: 3,
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  weatherText: {
    marginTop: 2,
    fontSize: 13,
    color: theme.colors.textSoft,
  },
  section: {
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 28,
    padding: 20,
    gap: 14,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  warningSection: {
    borderWidth: 1,
    borderColor: "rgba(229,139,91,0.2)",
    backgroundColor: "rgba(255,249,245,0.98)",
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
  statusHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: "800",
  },
  statusStateText: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.textSoft,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: "47.5%",
    padding: 16,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceSoft,
    gap: 6,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textMuted,
  },
  statValue: {
    fontSize: 19,
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
    color: readyLimeText,
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
    backgroundColor: warningPeach,
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
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  deadlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  deadlineValue: {
    width: 104,
    fontSize: 31,
    lineHeight: 34,
    fontWeight: "900",
    color: theme.colors.text,
    letterSpacing: 0,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
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
  contactPreviewRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 2,
    marginBottom: 2,
  },
  contactPreviewItem: {
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 18,
  },
  contactPreviewItemActive: {
    backgroundColor: "rgba(255,250,247,0.92)",
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
  contactActionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  contactActionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceSoft,
  },
  contactActionButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.text,
  },
  warningActionRow: {
    gap: 10,
  },
  warningPrimaryAction: {
    borderRadius: 22,
    paddingVertical: 15,
    paddingHorizontal: 18,
    backgroundColor: warningOrange,
    alignItems: "center",
  },
  warningPrimaryActionText: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.white,
  },
  warningSecondaryAction: {
    borderRadius: 22,
    paddingVertical: 15,
    paddingHorizontal: 18,
    backgroundColor: theme.colors.surfaceSoft,
    alignItems: "center",
  },
  warningSecondaryActionText: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
  },
  safetyOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(41,34,28,0.32)",
  },
  safetySheet: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    gap: 14,
  },
  safetyCloseButton: {
    alignSelf: "center",
    marginTop: 4,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceSoft,
  },
  safetyCloseButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
  completionEyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: "rgba(86,97,38,0.82)",
  },
  completionTitle: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "900",
    color: readyLimeTextDark,
  },
  completionText: {
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(79,90,34,0.82)",
  },
  completionOverlay: {
    flex: 1,
    backgroundColor: "rgba(41,34,28,0.38)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  confettiBurst: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  completionModal: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 34,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 22,
    gap: 14,
    shadowColor: "#92A93A",
    shadowOpacity: 0.22,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },
  completionButton: {
    marginTop: 6,
    alignSelf: "center",
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(79,90,34,0.18)",
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  completionButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: readyLimeTextDark,
  },
  confettiOne: {
    position: "absolute",
    top: "18%",
    left: "14%",
    fontSize: 28,
    color: "#F4A261",
  },
  confettiTwo: {
    position: "absolute",
    top: "21%",
    left: "28%",
    fontSize: 26,
    color: readyLimeTextDark,
  },
  confettiThree: {
    position: "absolute",
    top: "17%",
    right: "24%",
    fontSize: 22,
    color: "#E58B5B",
  },
  confettiFour: {
    position: "absolute",
    top: "24%",
    right: "14%",
    fontSize: 30,
    color: readyLime,
  },
  confettiFive: {
    position: "absolute",
    top: "64%",
    left: "16%",
    fontSize: 24,
    color: readyLimeText,
  },
  confettiSix: {
    position: "absolute",
    top: "69%",
    left: "30%",
    fontSize: 20,
    color: "#F4A261",
  },
  confettiSeven: {
    position: "absolute",
    top: "66%",
    right: "18%",
    fontSize: 28,
    color: "#E58B5B",
  },
  confettiEight: {
    position: "absolute",
    top: "71%",
    right: "30%",
    fontSize: 24,
    color: readyLimeTextDark,
  },
  pageConfettiOne: {
    position: "absolute",
    top: "8%",
    left: "6%",
    width: 16,
    height: 16,
    borderRadius: 999,
    backgroundColor: "rgba(175,203,70,0.24)",
  },
  pageConfettiTwo: {
    position: "absolute",
    top: "12%",
    right: "8%",
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: "rgba(245,160,87,0.24)",
    transform: [{ rotate: "18deg" }],
  },
  pageConfettiThree: {
    position: "absolute",
    top: "22%",
    left: "3%",
    width: 9,
    height: 28,
    borderRadius: 999,
    backgroundColor: "rgba(229,139,91,0.22)",
    transform: [{ rotate: "-24deg" }],
  },
  pageConfettiFour: {
    position: "absolute",
    top: "28%",
    right: "4%",
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: "rgba(247,217,201,0.34)",
  },
  pageConfettiFive: {
    position: "absolute",
    top: "43%",
    left: "7%",
    width: 14,
    height: 14,
    borderRadius: 5,
    backgroundColor: "rgba(175,203,70,0.22)",
    transform: [{ rotate: "28deg" }],
  },
  pageConfettiSix: {
    position: "absolute",
    top: "56%",
    right: "6%",
    width: 10,
    height: 34,
    borderRadius: 999,
    backgroundColor: "rgba(245,160,87,0.2)",
    transform: [{ rotate: "-18deg" }],
  },
  pageConfettiSeven: {
    position: "absolute",
    bottom: "28%",
    left: "8%",
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: "rgba(229,139,91,0.22)",
  },
  pageConfettiEight: {
    position: "absolute",
    bottom: "22%",
    right: "22%",
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: "rgba(247,217,201,0.32)",
    transform: [{ rotate: "-16deg" }],
  },
  pageConfettiNine: {
    position: "absolute",
    bottom: "14%",
    right: "10%",
    width: 10,
    height: 34,
    borderRadius: 999,
    backgroundColor: "rgba(175,203,70,0.2)",
    transform: [{ rotate: "32deg" }],
  },
  pageConfettiTen: {
    position: "absolute",
    bottom: "8%",
    left: "18%",
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: "rgba(245,160,87,0.22)",
  },
  pageConfettiEleven: {
    position: "absolute",
    top: "18%",
    left: "18%",
    width: 12,
    height: 32,
    borderRadius: 999,
    backgroundColor: "rgba(175,203,70,0.2)",
    transform: [{ rotate: "26deg" }],
  },
  pageConfettiTwelve: {
    position: "absolute",
    top: "34%",
    right: "16%",
    width: 16,
    height: 16,
    borderRadius: 999,
    backgroundColor: "rgba(245,160,87,0.24)",
  },
  pageConfettiThirteen: {
    position: "absolute",
    top: "48%",
    left: "16%",
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: "rgba(247,217,201,0.32)",
    transform: [{ rotate: "22deg" }],
  },
  pageConfettiFourteen: {
    position: "absolute",
    top: "64%",
    left: "26%",
    width: 10,
    height: 30,
    borderRadius: 999,
    backgroundColor: "rgba(229,139,91,0.22)",
    transform: [{ rotate: "-28deg" }],
  },
  pageConfettiFifteen: {
    position: "absolute",
    bottom: "18%",
    right: "32%",
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: "rgba(175,203,70,0.2)",
  },
  pageConfettiSixteen: {
    position: "absolute",
    bottom: "10%",
    right: "4%",
    width: 14,
    height: 36,
    borderRadius: 999,
    backgroundColor: "rgba(245,160,87,0.2)",
    transform: [{ rotate: "20deg" }],
  },
  pageConfettiSeventeen: {
    position: "absolute",
    top: "10%",
    left: "34%",
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: "rgba(229,139,91,0.22)",
  },
  pageConfettiEighteen: {
    position: "absolute",
    top: "36%",
    left: "26%",
    width: 16,
    height: 44,
    borderRadius: 999,
    backgroundColor: "rgba(175,203,70,0.22)",
    transform: [{ rotate: "24deg" }],
  },
  pageConfettiNineteen: {
    position: "absolute",
    top: "58%",
    right: "20%",
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: "rgba(245,160,87,0.24)",
    transform: [{ rotate: "-18deg" }],
  },
  pageConfettiTwenty: {
    position: "absolute",
    bottom: "32%",
    right: "6%",
    width: 14,
    height: 40,
    borderRadius: 999,
    backgroundColor: "rgba(247,217,201,0.36)",
    transform: [{ rotate: "30deg" }],
  },
  pageConfettiTwentyOne: {
    position: "absolute",
    bottom: "24%",
    left: "30%",
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: "rgba(175,203,70,0.24)",
  },
  pageConfettiTwentyTwo: {
    position: "absolute",
    bottom: "6%",
    left: "42%",
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: "rgba(229,139,91,0.24)",
    transform: [{ rotate: "16deg" }],
  },
  pageConfettiTwentyThree: {
    position: "absolute",
    top: "6%",
    left: "22%",
    width: 12,
    height: 34,
    borderRadius: 999,
    backgroundColor: "rgba(175,203,70,0.22)",
    transform: [{ rotate: "-18deg" }],
  },
  pageConfettiTwentyFour: {
    position: "absolute",
    top: "16%",
    right: "26%",
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: "rgba(245,160,87,0.22)",
  },
  pageConfettiTwentyFive: {
    position: "absolute",
    top: "24%",
    left: "24%",
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: "rgba(247,217,201,0.34)",
    transform: [{ rotate: "26deg" }],
  },
  pageConfettiTwentySix: {
    position: "absolute",
    top: "32%",
    right: "28%",
    width: 14,
    height: 38,
    borderRadius: 999,
    backgroundColor: "rgba(229,139,91,0.22)",
    transform: [{ rotate: "-24deg" }],
  },
  pageConfettiTwentySeven: {
    position: "absolute",
    top: "46%",
    right: "12%",
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: "rgba(175,203,70,0.24)",
  },
  pageConfettiTwentyEight: {
    position: "absolute",
    top: "52%",
    left: "34%",
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: "rgba(245,160,87,0.24)",
    transform: [{ rotate: "-12deg" }],
  },
  pageConfettiTwentyNine: {
    position: "absolute",
    top: "62%",
    left: "12%",
    width: 12,
    height: 42,
    borderRadius: 999,
    backgroundColor: "rgba(247,217,201,0.36)",
    transform: [{ rotate: "28deg" }],
  },
  pageConfettiThirty: {
    position: "absolute",
    top: "70%",
    right: "28%",
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: "rgba(229,139,91,0.24)",
  },
  pageConfettiThirtyOne: {
    position: "absolute",
    bottom: "26%",
    left: "44%",
    width: 16,
    height: 40,
    borderRadius: 999,
    backgroundColor: "rgba(175,203,70,0.22)",
    transform: [{ rotate: "-30deg" }],
  },
  pageConfettiThirtyTwo: {
    position: "absolute",
    bottom: "20%",
    right: "18%",
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "rgba(245,160,87,0.24)",
    transform: [{ rotate: "20deg" }],
  },
  pageConfettiThirtyThree: {
    position: "absolute",
    bottom: "12%",
    left: "8%",
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: "rgba(175,203,70,0.24)",
  },
  pageConfettiThirtyFour: {
    position: "absolute",
    bottom: "4%",
    right: "24%",
    width: 14,
    height: 44,
    borderRadius: 999,
    backgroundColor: "rgba(229,139,91,0.24)",
    transform: [{ rotate: "18deg" }],
  },
  pageConfettiThirtyFive: {
    position: "absolute",
    top: "14%",
    left: "48%",
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: "rgba(229,139,91,0.34)",
  },
  pageConfettiThirtySix: {
    position: "absolute",
    top: "40%",
    right: "10%",
    width: 18,
    height: 56,
    borderRadius: 999,
    backgroundColor: "rgba(245,160,87,0.32)",
    transform: [{ rotate: "22deg" }],
  },
  pageConfettiThirtySeven: {
    position: "absolute",
    bottom: "18%",
    left: "14%",
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: "rgba(229,139,91,0.3)",
    transform: [{ rotate: "-18deg" }],
  },
  pageConfettiThirtyEight: {
    position: "absolute",
    bottom: "34%",
    right: "34%",
    width: 16,
    height: 52,
    borderRadius: 999,
    backgroundColor: "rgba(245,160,87,0.3)",
    transform: [{ rotate: "-26deg" }],
  },
  pageConfettiThirtyNine: {
    position: "absolute",
    top: "6%",
    right: "18%",
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: "rgba(245,160,87,0.32)",
  },
  pageConfettiForty: {
    position: "absolute",
    top: "19%",
    left: "10%",
    width: 18,
    height: 64,
    borderRadius: 999,
    backgroundColor: "rgba(229,139,91,0.3)",
    transform: [{ rotate: "34deg" }],
  },
  pageConfettiFortyOne: {
    position: "absolute",
    top: "26%",
    right: "30%",
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: "rgba(245,160,87,0.28)",
    transform: [{ rotate: "-24deg" }],
  },
  pageConfettiFortyTwo: {
    position: "absolute",
    top: "50%",
    left: "6%",
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: "rgba(229,139,91,0.28)",
  },
  pageConfettiFortyThree: {
    position: "absolute",
    top: "60%",
    right: "8%",
    width: 22,
    height: 70,
    borderRadius: 999,
    backgroundColor: "rgba(245,160,87,0.28)",
    transform: [{ rotate: "-30deg" }],
  },
  pageConfettiFortyFour: {
    position: "absolute",
    bottom: "30%",
    left: "22%",
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: "rgba(229,139,91,0.3)",
    transform: [{ rotate: "18deg" }],
  },
  pageConfettiFortyFive: {
    position: "absolute",
    bottom: "16%",
    right: "14%",
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: "rgba(245,160,87,0.3)",
  },
  pageConfettiFortySix: {
    position: "absolute",
    bottom: "8%",
    left: "34%",
    width: 20,
    height: 68,
    borderRadius: 999,
    backgroundColor: "rgba(229,139,91,0.28)",
    transform: [{ rotate: "28deg" }],
  },
});
