import React, { useEffect, useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Modal, SafeAreaView, StyleSheet, View } from "react-native";
import {
  initialAlerts,
  buildEscalationAlert,
  type AlertAction,
  type JourneyAlert,
} from "../alerts/alertData";
import { AlertToast } from "../components/AlertToast";
import { NavBar } from "../components/NavBar";
import { HomeScreen } from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import StatisticsScreen from "../screens/StatisticsScreen";
import {
  RoutesScreen,
  defaultFavoriteRoute,
  type FavoriteRouteSummary,
  type SavedRouteStartPreset,
} from "../screens/RoutesScreen";
import { AlertsScreen } from "../screens/AlertsScreen";
import { ActiveJourneyScreen } from "../screens/ActiveJourneyScreen";
import {
  StartJourneyScreen,
  type StartJourneyConfig,
} from "../screens/StartJourneyScreen";
import { theme, AppScreen } from "../styles/theme";
import type {
  StatsSnapshot,
  TrustedContact,
  UserProfile,
  UserSettings,
} from "../types/appData";

const initialTrustedContacts: TrustedContact[] = [
  {
    id: "maya",
    firstName: "Maya",
    lastName: "Lopez",
    phone: "(918) 555-0143",
    note: "Mom",
  },
  {
    id: "jordan",
    firstName: "Jordan",
    lastName: "Reed",
    phone: "(918) 555-0188",
    note: "Best friend",
  },
  {
    id: "chris",
    firstName: "Chris",
    lastName: "Parker",
    phone: "(918) 555-0121",
    note: "Emergency contact",
  },
];

const initialProfile: UserProfile = {
  firstName: "Melissa",
  lastName: "West",
  headline: "Student builder and trail regular",
  bio: "Balancing engineering projects with long walks, route reviews, and safer solo outings.",
  city: "Tulsa, OK",
  privacyLabel: "Visible to trusted contacts during active journeys",
  memberSince: "January 2026",
  nextMilestone: "200 trail miles",
};

const initialSettings: UserSettings = {
  autoShareLocation: true,
  pushNotifications: true,
  routeDeviationAlerts: true,
  missedCheckInAlerts: true,
  weeklyDigest: true,
  locationVisibility: "during journey",
  defaultJourneyMode: "solo",
};

const initialStats: StatsSnapshot = {
  milesThisWeek: 15.4,
  weeklyGoalMiles: 20,
  safeJourneys: 48,
  hoursOutside: 142,
  currentStreakDays: 5,
  completionRate: 96,
  checkInRate: 92,
  favoriteRouteTitle: defaultFavoriteRoute.title,
  lastJourneyLabel: "River Parks Morning Walk",
  nextGoalLabel: "Hit 20 miles this week",
};

function getJourneyMiles(journeyConfig: StartJourneyConfig | null) {
  if (!journeyConfig) {
    return 0;
  }

  const milesMatch = journeyConfig.tripSetupLabel.match(/([\d.]+)\s*mi/i);
  if (milesMatch) {
    return Number(milesMatch[1]) || 0;
  }

  const kilometersMatch = journeyConfig.tripSetupLabel.match(/([\d.]+)\s*km/i);
  if (kilometersMatch) {
    return (Number(kilometersMatch[1]) || 0) * 0.621371;
  }

  return Math.max(1, journeyConfig.plannedDurationMinutes / 30);
}

export function AppNavigator() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("home");
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [activeJourneyConfig, setActiveJourneyConfig] =
    useState<StartJourneyConfig | null>(null);
  const [pendingRoutePreset, setPendingRoutePreset] =
    useState<SavedRouteStartPreset | null>(null);
  const [favoriteRoute, setFavoriteRoute] =
    useState<FavoriteRouteSummary | null>(defaultFavoriteRoute);
  const [alerts, setAlerts] = useState<JourneyAlert[]>(initialAlerts);
  const [toastAlertId, setToastAlertId] = useState<string | null>(
    initialAlerts[0]?.id ?? null,
  );
  const [trustedContacts, setTrustedContacts] =
    useState<TrustedContact[]>(initialTrustedContacts);
  const [profile] = useState<UserProfile>(initialProfile);
  const [settings, setSettings] = useState<UserSettings>(initialSettings);
  const [statsSnapshot, setStatsSnapshot] = useState<StatsSnapshot>(initialStats);

  const openAlerts = () => setIsAlertsOpen(true);
  const activeToast = useMemo(
    () => alerts.find((alert) => alert.id === toastAlertId) ?? null,
    [alerts, toastAlertId],
  );
  const hasAlertIndicator = alerts.some(
    (alert) =>
      alert.type === "missed-check-in" ||
      alert.type === "off-route" ||
      alert.type === "escalation",
  );
  const urgentAlertsCount = alerts.filter(
    (alert) =>
      alert.type === "missed-check-in" ||
      alert.type === "off-route" ||
      alert.type === "escalation",
  ).length;
  const primaryContact =
    trustedContacts[0]
      ? `${trustedContacts[0].firstName} ${trustedContacts[0].lastName}`.trim()
      : "No trusted contact selected";

  const liveStats = useMemo<StatsSnapshot>(
    () => ({
      ...statsSnapshot,
      favoriteRouteTitle: favoriteRoute?.title ?? statsSnapshot.favoriteRouteTitle,
      lastJourneyLabel:
        activeJourneyConfig?.journeyLabel ?? statsSnapshot.lastJourneyLabel,
    }),
    [activeJourneyConfig, favoriteRoute, statsSnapshot],
  );

  useEffect(() => {
    if (!activeToast) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setToastAlertId((current) => (current === activeToast.id ? null : current));
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [activeToast]);

  function addOrPromoteAlert(nextAlert: JourneyAlert) {
    setAlerts((current) => {
      const withoutMatch = current.filter((alert) => alert.type !== nextAlert.type);
      return [nextAlert, ...withoutMatch];
    });
    setToastAlertId(nextAlert.id);
  }

  function dismissAlert(alertId: string) {
    setAlerts((current) => current.filter((alert) => alert.id !== alertId));
    setToastAlertId((current) => (current === alertId ? null : current));
  }

  function closeAlerts() {
    setIsAlertsOpen(false);
  }

  function handleAlertAction(alertId: string, action: AlertAction) {
    const timestamp = "Just now";

    if (action.label === "Recenter route") {
      setCurrentScreen(activeJourneyConfig ? "activeJourney" : "home");
      setToastAlertId(null);
      return;
    }

    if (action.label === "Extend time" || action.label === "Extend journey") {
      dismissAlert(alertId);
      return;
    }

    if (action.label === "Call emergency") {
      dismissAlert(alertId);
      addOrPromoteAlert(buildEscalationAlert(timestamp));
      setIsAlertsOpen(true);
      return;
    }

    if (action.label === "Close" || action.label === "Dismiss") {
      dismissAlert(alertId);
    }
  }

  function handleJourneyComplete() {
    if (activeJourneyConfig) {
      const completedMiles = getJourneyMiles(activeJourneyConfig);
      setStatsSnapshot((current) => ({
        ...current,
        milesThisWeek: Number((current.milesThisWeek + completedMiles).toFixed(1)),
        safeJourneys: current.safeJourneys + 1,
        hoursOutside: Number(
          (current.hoursOutside + activeJourneyConfig.plannedDurationMinutes / 60).toFixed(1),
        ),
        currentStreakDays: current.currentStreakDays + 1,
        lastJourneyLabel: activeJourneyConfig.journeyLabel,
      }));
    }

    setActiveJourneyConfig(null);
    setCurrentScreen("home");
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return (
          <HomeScreen
            onOpenSavedRoutes={() => setCurrentScreen("routes")}
            onOpenPopularRoutes={() => setCurrentScreen("routes")}
            onOpenAlerts={openAlerts}
            onOpenStartJourney={() => {
              setPendingRoutePreset(null);
              setCurrentScreen("startJourney");
            }}
            favoriteRoute={favoriteRoute}
            journeyMode={activeJourneyConfig ? "active" : "idle"}
            hasAlertIndicator={hasAlertIndicator}
          />
        );
      case "routes":
        return (
          <RoutesScreen
            onAlertPress={openAlerts}
            favoriteRouteId={favoriteRoute?.routeId ?? null}
            onFavoriteRouteChange={setFavoriteRoute}
            onStartRoute={(routePreset) => {
              setPendingRoutePreset(routePreset);
              setCurrentScreen("startJourney");
            }}
            hasAlertIndicator={hasAlertIndicator}
          />
        );
      case "profile":
        return (
          <ProfileScreen
            profile={profile}
            stats={liveStats}
            trustedContacts={trustedContacts}
            settings={settings}
            primaryContactName={primaryContact}
            onOpenAlerts={openAlerts}
            onOpenStats={() => setCurrentScreen("stats")}
            onOpenSettings={() => setCurrentScreen("settings")}
            onOpenRoutes={() => setCurrentScreen("routes")}
            onOpenStartJourney={() => {
              setPendingRoutePreset(null);
              setCurrentScreen("startJourney");
            }}
            hasAlertIndicator={hasAlertIndicator}
          />
        );
      case "settings":
        return (
          <SettingsScreen
            settings={settings}
            trustedContacts={trustedContacts}
            urgentAlertsCount={urgentAlertsCount}
            onOpenAlerts={openAlerts}
            onOpenProfile={() => setCurrentScreen("profile")}
            onOpenStats={() => setCurrentScreen("stats")}
            onOpenRoutes={() => setCurrentScreen("routes")}
            onOpenStartJourney={() => {
              setPendingRoutePreset(null);
              setCurrentScreen("startJourney");
            }}
            onToggleSetting={(key) =>
              setSettings((current) => ({
                ...current,
                [key]: !current[key],
              }))
            }
            onCycleLocationVisibility={() =>
              setSettings((current) => ({
                ...current,
                locationVisibility:
                  current.locationVisibility === "private"
                    ? "trusted contacts"
                    : current.locationVisibility === "trusted contacts"
                      ? "during journey"
                      : "private",
              }))
            }
            onCycleDefaultJourneyMode={() =>
              setSettings((current) => ({
                ...current,
                defaultJourneyMode:
                  current.defaultJourneyMode === "solo" ? "group" : "solo",
              }))
            }
            onPromoteContact={(contactId) =>
              setTrustedContacts((current) => {
                const selectedContact = current.find((contact) => contact.id === contactId);
                if (!selectedContact) {
                  return current;
                }

                return [
                  selectedContact,
                  ...current.filter((contact) => contact.id !== contactId),
                ];
              })
            }
            hasAlertIndicator={hasAlertIndicator}
          />
        );
      case "stats":
        return (
          <StatisticsScreen
            stats={liveStats}
            trustedContacts={trustedContacts}
            settings={settings}
            hasActiveJourney={Boolean(activeJourneyConfig)}
            urgentAlertsCount={urgentAlertsCount}
            onOpenAlerts={openAlerts}
            onOpenRoutes={() => setCurrentScreen("routes")}
            onOpenStartJourney={() => {
              setPendingRoutePreset(null);
              setCurrentScreen("startJourney");
            }}
            onOpenProfile={() => setCurrentScreen("profile")}
            onOpenSettings={() => setCurrentScreen("settings")}
            hasAlertIndicator={hasAlertIndicator}
          />
        );
      case "startJourney":
        return (
          <StartJourneyScreen
            initialRoutePreset={pendingRoutePreset}
            trustedContacts={trustedContacts}
            defaultJourneyMode={settings.defaultJourneyMode}
            onStartJourney={(journeyConfig) => {
              setActiveJourneyConfig(journeyConfig);
              setPendingRoutePreset(null);
              setCurrentScreen("activeJourney");
            }}
            onOpenAlerts={openAlerts}
            onOpenProfile={() => setCurrentScreen("profile")}
            hasAlertIndicator={hasAlertIndicator}
          />
        );
      case "activeJourney":
        return (
          <ActiveJourneyScreen
            journeyConfig={activeJourneyConfig}
            onOpenAlerts={openAlerts}
            onJourneyComplete={handleJourneyComplete}
            hasAlertIndicator={hasAlertIndicator}
          />
        );
      default:
        return (
          <HomeScreen
            onOpenSavedRoutes={() => setCurrentScreen("routes")}
            onOpenPopularRoutes={() => setCurrentScreen("routes")}
            onOpenAlerts={openAlerts}
            onOpenStartJourney={() => {
              setPendingRoutePreset(null);
              setCurrentScreen("startJourney");
            }}
            favoriteRoute={favoriteRoute}
            journeyMode={activeJourneyConfig ? "active" : "idle"}
            hasAlertIndicator={hasAlertIndicator}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {activeToast && !isAlertsOpen ? (
          <AlertToast
            alert={activeToast}
            onDismiss={dismissAlert}
            onOpenAlerts={openAlerts}
          />
        ) : null}

        {renderScreen()}

        <Modal
          visible={isAlertsOpen}
          transparent
          animationType="fade"
          onRequestClose={closeAlerts}
        >
          <AlertsScreen
            alerts={alerts}
            onAlertAction={handleAlertAction}
            onDismissAlert={dismissAlert}
            onClose={closeAlerts}
          />
        </Modal>

        <NavBar
          activeScreen={currentScreen}
          hasActiveJourney={Boolean(activeJourneyConfig)}
          onNavigate={(screen) => {
            if (screen === "startJourney") {
              setPendingRoutePreset(null);
            }
            setCurrentScreen(screen);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingBottom: 90,
  },
});
