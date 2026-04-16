import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../styles/theme";
import type {
  StatsSnapshot,
  TrustedContact,
  UserSettings,
} from "../types/appData";

type StatisticsScreenProps = {
  stats: StatsSnapshot;
  trustedContacts: TrustedContact[];
  settings: UserSettings;
  hasActiveJourney?: boolean;
  urgentAlertsCount?: number;
  onOpenAlerts?: () => void;
  onOpenRoutes?: () => void;
  onOpenStartJourney?: () => void;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
  hasAlertIndicator?: boolean;
};

function buildInsightChips(settings: UserSettings, trustedContacts: TrustedContact[]) {
  return [
    settings.autoShareLocation ? "Auto-share on" : "Auto-share off",
    settings.routeDeviationAlerts ? "Off-route alerts on" : "Off-route alerts off",
    `${trustedContacts.length} trusted contacts ready`,
  ];
}

export default function StatisticsScreen({
  stats,
  trustedContacts,
  settings,
  hasActiveJourney = false,
  urgentAlertsCount = 0,
  onOpenAlerts,
  onOpenRoutes,
  onOpenStartJourney,
  onOpenProfile,
  onOpenSettings,
  hasAlertIndicator = false,
}: StatisticsScreenProps) {
  const weeklyProgress = Math.min(100, Math.round((stats.milesThisWeek / stats.weeklyGoalMiles) * 100));
  const monthlyJourneyGoal = 60;
  const monthlyProgress = Math.min(100, Math.round((stats.safeJourneys / monthlyJourneyGoal) * 100));
  const insightChips = buildInsightChips(settings, trustedContacts);

  return (
    <LinearGradient
      colors={[theme.colors.background, "#F3E7D9", theme.colors.backgroundDeep]}
      locations={[0, 0.48, 1]}
      start={{ x: 0.4, y: 0 }}
      end={{ x: 0.6, y: 1 }}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeaderRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.pageHeader}>Trail Stats</Text>
            <Text style={styles.pageSubheader}>
              A quick read on momentum, safety habits, and what to do next.
            </Text>
          </View>

          <Pressable style={styles.alertButton} onPress={onOpenAlerts}>
            <Feather name="bell" size={18} color={theme.colors.white} />
            {hasAlertIndicator ? <View style={styles.alertDot} /> : null}
          </Pressable>
        </View>

        <LinearGradient
          colors={[theme.colors.surface, theme.colors.surfaceWarm]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroEyebrow}>Weekly pace</Text>
              <Text style={styles.heroValue}>
                {stats.milesThisWeek.toFixed(1)} / {stats.weeklyGoalMiles} mi
              </Text>
            </View>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{weeklyProgress}%</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${weeklyProgress}%` }]} />
          </View>

          <Text style={styles.heroCaption}>{stats.nextGoalLabel}</Text>

          <View style={styles.insightChipRow}>
            {insightChips.map((chip) => (
              <View key={chip} style={styles.insightChip}>
                <Text style={styles.insightChipText}>{chip}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <View style={styles.metricsGrid}>
          {[
            { label: "Safe journeys", value: `${stats.safeJourneys}`, accent: theme.colors.brand },
            { label: "Hours outside", value: `${stats.hoursOutside.toFixed(0)}h`, accent: theme.colors.ink },
            { label: "Streak", value: `${stats.currentStreakDays} days`, accent: theme.colors.accentLime },
            { label: "Alerts open", value: `${urgentAlertsCount}`, accent: theme.colors.accentCoral },
          ].map((item) => (
            <View key={item.label} style={styles.metricCard}>
              <Text style={[styles.metricValue, { color: item.accent }]}>{item.value}</Text>
              <Text style={styles.metricLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Safety reliability</Text>
            <Pressable onPress={onOpenSettings} style={styles.inlineAction}>
              <Text style={styles.inlineActionText}>Tune settings</Text>
            </Pressable>
          </View>

          <View style={styles.reliabilityRow}>
            <View style={styles.reliabilityMetric}>
              <Text style={styles.reliabilityLabel}>Route completion</Text>
              <Text style={styles.reliabilityValue}>{stats.completionRate}%</Text>
            </View>
            <View style={styles.reliabilityMetric}>
              <Text style={styles.reliabilityLabel}>Check-in response</Text>
              <Text style={styles.reliabilityValue}>{stats.checkInRate}%</Text>
            </View>
          </View>

          <Text style={styles.cardBodyText}>
            {settings.missedCheckInAlerts
              ? "Missed check-in alerts are enabled, so your support network gets nudged if timing slips."
              : "Missed check-in alerts are off right now, which lowers your safety coverage on longer trips."}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Route trends</Text>
            <Pressable onPress={onOpenRoutes} style={styles.inlineAction}>
              <Text style={styles.inlineActionText}>Open routes</Text>
            </Pressable>
          </View>

          <View style={styles.routeInsightRow}>
            <View style={styles.routeInsightBlock}>
              <Text style={styles.routeInsightLabel}>Favorite route</Text>
              <Text style={styles.routeInsightValue}>{stats.favoriteRouteTitle}</Text>
            </View>
            <View style={styles.routeInsightBlock}>
              <Text style={styles.routeInsightLabel}>Last journey</Text>
              <Text style={styles.routeInsightValue}>{stats.lastJourneyLabel}</Text>
            </View>
          </View>

          <View style={styles.progressTrackMuted}>
            <View style={[styles.progressFillMuted, { width: `${monthlyProgress}%` }]} />
          </View>
          <Text style={styles.cardBodyText}>
            You are at {monthlyProgress}% of this month&apos;s safe journey goal, with{" "}
            {trustedContacts.length} trusted contacts ready to receive updates.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Next action</Text>
          <View style={styles.actionStack}>
            <Pressable style={styles.primaryActionCard} onPress={onOpenStartJourney}>
              <Text style={styles.primaryActionEyebrow}>
                {hasActiveJourney ? "Journey in progress" : "Ready for another route?"}
              </Text>
              <Text style={styles.primaryActionTitle}>
                {hasActiveJourney ? "Open your active trip" : "Start a new journey"}
              </Text>
              <Text style={styles.primaryActionText}>
                Keep your streak moving with your favorite setup and current safety preferences.
              </Text>
            </Pressable>

            <View style={styles.secondaryActionRow}>
              <Pressable style={styles.secondaryActionCard} onPress={onOpenProfile}>
                <Text style={styles.secondaryActionTitle}>Review profile</Text>
                <Text style={styles.secondaryActionBody}>Check milestones and contact readiness.</Text>
              </Pressable>
              <Pressable style={styles.secondaryActionCard} onPress={onOpenSettings}>
                <Text style={styles.secondaryActionTitle}>Refine alerts</Text>
                <Text style={styles.secondaryActionBody}>Adjust notifications and privacy defaults.</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingTop: 28, gap: 16 },
  pageHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  titleBlock: { flex: 1, gap: 6 },
  pageHeader: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900",
    color: theme.colors.text,
  },
  pageSubheader: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textSoft,
  },
  alertButton: {
    minWidth: 56,
    minHeight: 46,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.brand,
    borderWidth: 1,
    borderColor: theme.colors.brandDeep,
    position: "relative",
  },
  alertDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: theme.colors.accentLime,
  },
  heroCard: {
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 16,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  heroEyebrow: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textSoft,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  heroValue: {
    marginTop: 6,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "900",
    color: theme.colors.text,
  },
  heroBadge: {
    minWidth: 66,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.accentLime,
    alignItems: "center",
  },
  heroBadgeText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#4F5A22",
  },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: "rgba(184, 207, 92, 0.22)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: theme.colors.accentLime,
  },
  heroCaption: {
    fontSize: 14,
    color: theme.colors.textSoft,
  },
  insightChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  insightChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  insightChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.text,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    width: "47%",
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 6,
  },
  metricValue: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "900",
  },
  metricLabel: {
    fontSize: 13,
    color: theme.colors.textSoft,
    fontWeight: "700",
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 16,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: theme.colors.text,
    flex: 1,
  },
  inlineAction: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceWarm,
  },
  inlineActionText: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.brandDeep,
  },
  reliabilityRow: {
    flexDirection: "row",
    gap: 12,
  },
  reliabilityMetric: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    backgroundColor: theme.colors.backgroundAlt,
    gap: 8,
  },
  reliabilityLabel: {
    fontSize: 13,
    color: theme.colors.textSoft,
    fontWeight: "700",
  },
  reliabilityValue: {
    fontSize: 26,
    fontWeight: "900",
    color: theme.colors.text,
  },
  cardBodyText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textSoft,
  },
  routeInsightRow: {
    flexDirection: "row",
    gap: 12,
  },
  routeInsightBlock: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundAlt,
    gap: 6,
  },
  routeInsightLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textSoft,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  routeInsightValue: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "800",
    color: theme.colors.text,
  },
  progressTrackMuted: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(222,133,88,0.14)",
    overflow: "hidden",
  },
  progressFillMuted: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: theme.colors.brand,
  },
  actionStack: { gap: 12 },
  primaryActionCard: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: theme.colors.brand,
    gap: 8,
  },
  primaryActionEyebrow: {
    fontSize: 12,
    fontWeight: "800",
    color: "rgba(255,255,255,0.82)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  primaryActionTitle: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "900",
    color: theme.colors.white,
  },
  primaryActionText: {
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(255,255,255,0.86)",
  },
  secondaryActionRow: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryActionCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    backgroundColor: theme.colors.backgroundAlt,
    gap: 8,
  },
  secondaryActionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.text,
  },
  secondaryActionBody: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.textSoft,
  },
});
