import React, { useEffect, useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, View } from "react-native";
import {
  initialAlerts,
  buildEscalationAlert,
  type AlertAction,
  type JourneyAlert,
} from "../alerts/alertData";
import { AlertToast } from "../components/AlertToast";

// 1. Import all of the screens!
import { NavBar } from "../components/NavBar";
import { HomeScreen } from "../screens/HomeScreen";
// Note: Based on your previous code, these were created as "default" exports, 
// so they don't use the curly braces { } around the name.
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

// Import the team's theme and the AppScreen type
import { theme, AppScreen } from "../styles/theme"; 

export function AppNavigator() {
  // 2. Create the State to track the active screen (defaults to "home")
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("home");
  const [previousScreen, setPreviousScreen] = useState<AppScreen>("home");
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
  const openAlerts = () => {
    setPreviousScreen(currentScreen);
    setCurrentScreen("alerts");
  };
  const activeToast = useMemo(
    () => alerts.find((alert) => alert.id === toastAlertId) ?? null,
    [alerts, toastAlertId],
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
    setCurrentScreen(previousScreen === "alerts" ? "home" : previousScreen);
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
      setCurrentScreen("alerts");
      return;
    }

    if (action.label === "Close") {
      dismissAlert(alertId);
      return;
    }

    if (action.label === "Dismiss") {
      dismissAlert(alertId);
      return;
    }
  }

  // 3. Create a router function to swap the UI based on the state
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
          />
        );
      case "profile":
        return <ProfileScreen onOpenAlerts={openAlerts} />;
      case "settings":
        return <SettingsScreen onOpenAlerts={openAlerts} />;
      case "stats":
        return <StatisticsScreen onOpenAlerts={openAlerts} />;
      case "alerts":
        return (
          <AlertsScreen
            alerts={alerts}
            onAlertAction={handleAlertAction}
            onDismissAlert={dismissAlert}
            onClose={closeAlerts}
          />
        );
      case "startJourney":
        return (
          <StartJourneyScreen
            initialRoutePreset={pendingRoutePreset}
            onStartJourney={(journeyConfig) => {
              setActiveJourneyConfig(journeyConfig);
              setPendingRoutePreset(null);
              setCurrentScreen("activeJourney");
            }}
            onOpenAlerts={openAlerts}
            onOpenProfile={() => setCurrentScreen("profile")}
          />
        );
      case "activeJourney":
        return (
          <ActiveJourneyScreen
            journeyConfig={activeJourneyConfig}
            onOpenAlerts={openAlerts}
            onJourneyComplete={() => {
              setActiveJourneyConfig(null);
              setCurrentScreen("home");
            }}
          />
        );
      // If "routes" or "startJourney" is clicked before they are built, 
      // safely fallback to home so the app doesn't crash!
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
          />
        ); 
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {activeToast && currentScreen !== "alerts" ? (
          <AlertToast
            alert={activeToast}
            onDismiss={dismissAlert}
            onOpenAlerts={openAlerts}
          />
        ) : null}
        
        {/* 4. Render the dynamic screen instead of the hardcoded HomeScreen */}
        {renderScreen()}

        {/* 5. Pass the state into the NavBar so it knows which button to highlight, 
            and what to do when a new button is pressed */}
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
    // The team set a global background color here
    backgroundColor: theme.colors.background, 
  },
  container: {
    flex: 1,
    // Note: We leave a little padding at the bottom so the screens 
    // don't hide behind the floating navigation bar!
    paddingBottom: 90, 
  },
});
