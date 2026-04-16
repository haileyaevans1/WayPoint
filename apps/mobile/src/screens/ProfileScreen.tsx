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
  UserProfile,
  UserSettings,
} from "../types/appData";

type ProfileScreenProps = {
  profile: UserProfile;
  stats: StatsSnapshot;
  trustedContacts: TrustedContact[];
  settings: UserSettings;
  primaryContactName: string;
  onOpenAlerts?: () => void;
  onOpenStats?: () => void;
  onOpenSettings?: () => void;
  onOpenRoutes?: () => void;
  onOpenStartJourney?: () => void;
  hasAlertIndicator?: boolean;
};

function getInitials(profile: UserProfile) {
  return `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase();
}

export default function ProfileScreen({
  profile,
  stats,
  trustedContacts,
  settings,
  primaryContactName,
  onOpenAlerts,
  onOpenStats,
  onOpenSettings,
  onOpenRoutes,
  onOpenStartJourney,
  hasAlertIndicator = false,
}: ProfileScreenProps) {
  const weeklyProgress = Math.min(100, Math.round((stats.milesThisWeek / stats.weeklyGoalMiles) * 100));

  return (
    <LinearGradient
      colors={[theme.colors.background, "#F6EBE0", theme.colors.backgroundDeep]}
      locations={[0, 0.46, 1]}
      start={{ x: 0.4, y: 0 }}
      end={{ x: 0.6, y: 1 }}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.pageTopRow}>
          <View style={styles.titleWrap}>
            <Text style={styles.pageTitle}>Profile</Text>
            <Text style={styles.pageSubtitle}>Your identity, trail habits, and support circle.</Text>
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
            <View style={styles.avatarWrap}>
              <LinearGradient
                colors={[theme.colors.brandBright, theme.colors.brand]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarBadge}
              >
                <Text style={styles.avatarText}>{getInitials(profile)}</Text>
              </LinearGradient>
            </View>

            <Pressable style={styles.settingsShortcut} onPress={onOpenSettings}>
              <Feather name="sliders" size={18} color={theme.colors.brandDeep} />
            </Pressable>
          </View>

          <View style={styles.heroCopy}>
            <Text style={styles.userName}>
              {profile.firstName} {profile.lastName}
            </Text>
            <Text style={styles.userHeadline}>{profile.headline}</Text>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </View>

          <View style={styles.metaChipRow}>
            <View style={styles.metaChip}>
              <Feather name="map-pin" size={14} color={theme.colors.textSoft} />
              <Text style={styles.metaChipText}>{profile.city}</Text>
            </View>
            <View style={styles.metaChip}>
              <Feather name="shield" size={14} color={theme.colors.textSoft} />
              <Text style={styles.metaChipText}>{profile.privacyLabel}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{stats.safeJourneys}</Text>
            <Text style={styles.metricLabel}>Safe journeys</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{stats.hoursOutside.toFixed(0)}h</Text>
            <Text style={styles.metricLabel}>Hours outside</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{stats.currentStreakDays}</Text>
            <Text style={styles.metricLabel}>Day streak</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Weekly momentum</Text>
            <Pressable onPress={onOpenStats} style={styles.inlineAction}>
              <Text style={styles.inlineActionText}>See full stats</Text>
            </Pressable>
          </View>

          <Text style={styles.goalValue}>
            {stats.milesThisWeek.toFixed(1)} / {stats.weeklyGoalMiles} miles
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${weeklyProgress}%` }]} />
          </View>
          <Text style={styles.cardBodyText}>
            {profile.nextMilestone} is next. Your favorite route right now is {stats.favoriteRouteTitle}.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Safety network</Text>
            <Pressable onPress={onOpenSettings} style={styles.inlineAction}>
              <Text style={styles.inlineActionText}>Manage contacts</Text>
            </Pressable>
          </View>

          <View style={styles.contactHero}>
            <View style={styles.contactHeroCopy}>
              <Text style={styles.contactHeroLabel}>Primary check-in contact</Text>
              <Text style={styles.contactHeroName}>{primaryContactName}</Text>
              <Text style={styles.cardBodyText}>
                {trustedContacts.length} people are ready to receive updates if something changes mid-route.
              </Text>
            </View>
            <View style={styles.contactCountBadge}>
              <Text style={styles.contactCountBadgeText}>{trustedContacts.length}</Text>
            </View>
          </View>

          <View style={styles.contactList}>
            {trustedContacts.slice(0, 3).map((contact) => (
              <View key={contact.id} style={styles.contactRow}>
                <View style={styles.contactAvatar}>
                  <Text style={styles.contactAvatarText}>
                    {contact.firstName[0]}
                    {contact.lastName[0]}
                  </Text>
                </View>
                <View style={styles.contactCopy}>
                  <Text style={styles.contactName}>
                    {contact.firstName} {contact.lastName}
                  </Text>
                  <Text style={styles.contactMeta}>
                    {contact.note} • {contact.phone}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Linked features</Text>
          <View style={styles.linkGrid}>
            <Pressable style={styles.linkCard} onPress={onOpenRoutes}>
              <Feather name="map" size={18} color={theme.colors.brandDeep} />
              <Text style={styles.linkTitle}>Routes</Text>
              <Text style={styles.linkBody}>Open favorites and route reviews.</Text>
            </Pressable>
            <Pressable style={styles.linkCard} onPress={onOpenStartJourney}>
              <Feather name="navigation" size={18} color={theme.colors.brandDeep} />
              <Text style={styles.linkTitle}>Start journey</Text>
              <Text style={styles.linkBody}>Launch a trip with your saved defaults.</Text>
            </Pressable>
            <Pressable style={styles.linkCard} onPress={onOpenStats}>
              <Feather name="bar-chart-2" size={18} color={theme.colors.brandDeep} />
              <Text style={styles.linkTitle}>Progress</Text>
              <Text style={styles.linkBody}>Review pace, completion, and streaks.</Text>
            </Pressable>
            <Pressable style={styles.linkCard} onPress={onOpenSettings}>
              <Feather name="settings" size={18} color={theme.colors.brandDeep} />
              <Text style={styles.linkTitle}>Preferences</Text>
              <Text style={styles.linkBody}>
                {settings.autoShareLocation ? "Auto-share enabled" : "Auto-share disabled"} and privacy controls.
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            Member since {profile.memberSince}. Default mode is {settings.defaultJourneyMode}.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingTop: 28, gap: 16 },
  pageTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  titleWrap: { flex: 1, gap: 6 },
  pageTitle: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900",
    color: theme.colors.text,
  },
  pageSubtitle: {
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
    alignItems: "flex-start",
  },
  avatarWrap: {
    borderRadius: 999,
    padding: 4,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
  avatarBadge: {
    width: 84,
    height: 84,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "900",
    color: theme.colors.white,
  },
  settingsShortcut: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: theme.colors.surfaceWarm,
    alignItems: "center",
    justifyContent: "center",
  },
  heroCopy: { gap: 8 },
  userName: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "900",
    color: theme.colors.text,
  },
  userHeadline: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.brandDeep,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textSoft,
  },
  metaChipRow: {
    gap: 10,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.72)",
  },
  metaChipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    gap: 6,
  },
  metricValue: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "900",
    color: theme.colors.brand,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textSoft,
    textAlign: "center",
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
    flex: 1,
    fontSize: 21,
    fontWeight: "900",
    color: theme.colors.text,
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
  goalValue: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "900",
    color: theme.colors.text,
  },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: "rgba(222,133,88,0.14)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: theme.colors.brand,
  },
  cardBodyText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textSoft,
  },
  contactHero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  contactHeroCopy: { flex: 1, gap: 6 },
  contactHeroLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.textSoft,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  contactHeroName: {
    fontSize: 23,
    lineHeight: 28,
    fontWeight: "900",
    color: theme.colors.text,
  },
  contactCountBadge: {
    width: 54,
    height: 54,
    borderRadius: 999,
    backgroundColor: theme.colors.accentLime,
    alignItems: "center",
    justifyContent: "center",
  },
  contactCountBadgeText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#4F5A22",
  },
  contactList: { gap: 12 },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundAlt,
  },
  contactAvatar: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: theme.colors.brandBright,
    alignItems: "center",
    justifyContent: "center",
  },
  contactAvatarText: {
    fontSize: 14,
    fontWeight: "900",
    color: theme.colors.white,
  },
  contactCopy: { flex: 1, gap: 4 },
  contactName: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.text,
  },
  contactMeta: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.textSoft,
  },
  linkGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  linkCard: {
    width: "47%",
    borderRadius: 22,
    padding: 16,
    backgroundColor: theme.colors.backgroundAlt,
    gap: 8,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.text,
  },
  linkBody: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.textSoft,
  },
  footerNote: {
    paddingHorizontal: 4,
    paddingBottom: 12,
  },
  footerNoteText: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
});
