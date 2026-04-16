import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AnimatedWayPointLogo from "../components/AnimatedWayPointLogo";
import { theme } from "../styles/theme";
import type { TrustedContact, UserSettings } from "../types/appData";

type ToggleKey =
  | "autoShareLocation"
  | "pushNotifications"
  | "routeDeviationAlerts"
  | "missedCheckInAlerts"
  | "weeklyDigest";

type SettingsScreenProps = {
  settings: UserSettings;
  trustedContacts: TrustedContact[];
  urgentAlertsCount?: number;
  onOpenAlerts?: () => void;
  onOpenProfile?: () => void;
  onOpenStats?: () => void;
  onOpenRoutes?: () => void;
  onOpenStartJourney?: () => void;
  onToggleSetting: (key: ToggleKey) => void;
  onCycleLocationVisibility: () => void;
  onCycleDefaultJourneyMode: () => void;
  onPromoteContact: (contactId: string) => void;
  hasAlertIndicator?: boolean;
};

const toggleRows: Array<{
  key: ToggleKey;
  title: string;
  description: string;
}> = [
  {
    key: "autoShareLocation",
    title: "Auto-share location",
    description: "Start journeys with location updates ready for trusted contacts.",
  },
  {
    key: "pushNotifications",
    title: "Push notifications",
    description: "Get reminders, safety updates, and route changes on time.",
  },
  {
    key: "routeDeviationAlerts",
    title: "Off-route alerts",
    description: "Notify your support network if a trip strays from the planned route.",
  },
  {
    key: "missedCheckInAlerts",
    title: "Missed check-ins",
    description: "Escalate when a check-in window passes without a response.",
  },
  {
    key: "weeklyDigest",
    title: "Weekly recap",
    description: "Receive a simple summary of goals, streaks, and journey completion.",
  },
];

export default function SettingsScreen({
  settings,
  trustedContacts,
  urgentAlertsCount = 0,
  onOpenAlerts,
  onOpenProfile,
  onOpenStats,
  onOpenRoutes,
  onOpenStartJourney,
  onToggleSetting,
  onCycleLocationVisibility,
  onCycleDefaultJourneyMode,
  onPromoteContact,
  hasAlertIndicator = false,
}: SettingsScreenProps) {
  return (
    <LinearGradient
      colors={[theme.colors.background, "#F4E7DA", theme.colors.backgroundDeep]}
      locations={[0, 0.48, 1]}
      start={{ x: 0.4, y: 0 }}
      end={{ x: 0.6, y: 1 }}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeaderRow}>
          <View style={styles.titleWrap}>
            <View style={styles.headerTitleRow}>
              <View style={styles.headerLogoWrap}>
                <AnimatedWayPointLogo size={70} />
              </View>
              <Text style={styles.pageHeader}>Settings</Text>
            </View>
            <Text style={styles.pageSubheader}>
              Fine tune privacy, alerts, and the people your journeys depend on.
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
              <Text style={styles.heroEyebrow}>Safety coverage</Text>
              <Text style={styles.heroTitle}>
                {settings.routeDeviationAlerts && settings.missedCheckInAlerts
                  ? "Fully armed for route monitoring"
                  : "Some safety automations are paused"}
              </Text>
            </View>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{urgentAlertsCount}</Text>
              <Text style={styles.heroBadgeLabel}>open alerts</Text>
            </View>
          </View>

          <View style={styles.heroPillRow}>
            <View style={styles.heroPill}>
              <Text style={styles.heroPillLabel}>Visibility</Text>
              <Text style={styles.heroPillValue}>{settings.locationVisibility}</Text>
            </View>
            <View style={styles.heroPill}>
              <Text style={styles.heroPillLabel}>Default mode</Text>
              <Text style={styles.heroPillValue}>{settings.defaultJourneyMode}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Core preferences</Text>
          <View style={styles.toggleList}>
            {toggleRows.map((item) => (
              <View key={item.key} style={styles.toggleRow}>
                <View style={styles.toggleCopy}>
                  <Text style={styles.toggleTitle}>{item.title}</Text>
                  <Text style={styles.toggleDescription}>{item.description}</Text>
                </View>
                <Switch
                  value={settings[item.key]}
                  onValueChange={() => onToggleSetting(item.key)}
                  trackColor={{
                    false: theme.colors.inkSoft,
                    true: theme.colors.accentLime,
                  }}
                  thumbColor={theme.colors.white}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Privacy and journey defaults</Text>

          <Pressable style={styles.preferenceRow} onPress={onCycleLocationVisibility}>
            <View style={styles.preferenceCopy}>
              <Text style={styles.preferenceTitle}>Location visibility</Text>
              <Text style={styles.preferenceDescription}>
                Decide when your live position is visible to others.
              </Text>
            </View>
            <View style={styles.preferenceBadge}>
              <Text style={styles.preferenceBadgeText}>{settings.locationVisibility}</Text>
            </View>
          </Pressable>

          <Pressable style={styles.preferenceRow} onPress={onCycleDefaultJourneyMode}>
            <View style={styles.preferenceCopy}>
              <Text style={styles.preferenceTitle}>Default journey mode</Text>
              <Text style={styles.preferenceDescription}>
                Pick the setup you want preselected when opening Start Journey.
              </Text>
            </View>
            <View style={styles.preferenceBadge}>
              <Text style={styles.preferenceBadgeText}>{settings.defaultJourneyMode}</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Trusted contacts</Text>
            <Pressable onPress={onOpenProfile} style={styles.inlineAction}>
              <Text style={styles.inlineActionText}>Back to profile</Text>
            </Pressable>
          </View>

          <View style={styles.contactList}>
            {trustedContacts.map((contact, index) => (
              <View key={contact.id} style={styles.contactRow}>
                <View style={styles.contactIdentity}>
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

                <Pressable
                  style={[
                    styles.contactAction,
                    index === 0 && styles.contactActionSelected,
                  ]}
                  onPress={() => onPromoteContact(contact.id)}
                >
                  <Text
                    style={[
                      styles.contactActionText,
                      index === 0 && styles.contactActionTextSelected,
                    ]}
                  >
                    {index === 0 ? "Primary" : "Make primary"}
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Linked pages</Text>
          <View style={styles.linkRow}>
            <Pressable style={styles.linkCard} onPress={onOpenStats}>
              <Feather name="bar-chart-2" size={18} color={theme.colors.brandDeep} />
              <Text style={styles.linkTitle}>Stats</Text>
              <Text style={styles.linkBody}>Review completion and check-in rates.</Text>
            </Pressable>
            <Pressable style={styles.linkCard} onPress={onOpenRoutes}>
              <Feather name="map" size={18} color={theme.colors.brandDeep} />
              <Text style={styles.linkTitle}>Routes</Text>
              <Text style={styles.linkBody}>Choose a route that matches your setup.</Text>
            </Pressable>
            <Pressable style={styles.linkCard} onPress={onOpenStartJourney}>
              <Feather name="navigation" size={18} color={theme.colors.brandDeep} />
              <Text style={styles.linkTitle}>Start Journey</Text>
              <Text style={styles.linkBody}>Use the defaults you just updated.</Text>
            </Pressable>
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
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  titleWrap: { flex: 1, gap: 6 },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerLogoWrap: {
    width: 62,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
  },
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
    alignItems: "flex-start",
    gap: 16,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.textSoft,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  heroTitle: {
    marginTop: 6,
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "900",
    color: theme.colors.text,
    maxWidth: 230,
  },
  heroBadge: {
    minWidth: 84,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceWarm,
    alignItems: "center",
    gap: 2,
  },
  heroBadgeText: {
    fontSize: 22,
    fontWeight: "900",
    color: theme.colors.brandDeep,
  },
  heroBadgeLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.textSoft,
  },
  heroPillRow: {
    flexDirection: "row",
    gap: 12,
  },
  heroPill: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.72)",
    gap: 6,
  },
  heroPillLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textSoft,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  heroPillValue: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.text,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 16,
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: theme.colors.text,
  },
  toggleList: { gap: 12 },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    padding: 14,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundAlt,
  },
  toggleCopy: { flex: 1, gap: 4 },
  toggleTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.text,
  },
  toggleDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.textSoft,
  },
  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    padding: 14,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundAlt,
  },
  preferenceCopy: { flex: 1, gap: 4 },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.text,
  },
  preferenceDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.textSoft,
  },
  preferenceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceWarm,
  },
  preferenceBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.brandDeep,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
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
  contactList: { gap: 12 },
  contactRow: {
    gap: 12,
    padding: 14,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundAlt,
  },
  contactIdentity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  contactAction: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceWarm,
  },
  contactActionSelected: {
    backgroundColor: theme.colors.accentLime,
  },
  contactActionText: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.brandDeep,
  },
  contactActionTextSelected: {
    color: "#4F5A22",
  },
  linkRow: {
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
});
