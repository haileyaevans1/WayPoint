import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, View } from "react-native";

// 1. Import all of the screens!
import { NavBar } from "../components/NavBar";
import { HomeScreen } from "../screens/HomeScreen";
// Note: Based on your previous code, these were created as "default" exports, 
// so they don't use the curly braces { } around the name.
import ProfileScreen from "../screens/ProfileScreen"; 
import SettingsScreen from "../screens/SettingsScreen";
import StatisticsScreen from "../screens/StatisticsScreen";
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
  const [activeJourneyConfig, setActiveJourneyConfig] =
    useState<StartJourneyConfig | null>(null);

  // 3. Create a router function to swap the UI based on the state
  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return (
          <HomeScreen
            onOpenSavedRoutes={() => {}}
            onOpenPopularRoutes={() => {}}
            onOpenAlerts={() => {}}
          />
        );
      case "profile":
        return <ProfileScreen />;
      case "settings":
        return <SettingsScreen />;
      case "stats":
        return <StatisticsScreen />;
      case "startJourney":
        return (
          <StartJourneyScreen
            onStartJourney={(journeyConfig) => {
              setActiveJourneyConfig(journeyConfig);
              setCurrentScreen("activeJourney");
            }}
            onOpenProfile={() => setCurrentScreen("profile")}
          />
        );
      case "activeJourney":
        return (
          <ActiveJourneyScreen
            journeyConfig={activeJourneyConfig}
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
            onOpenSavedRoutes={() => {}}
            onOpenPopularRoutes={() => {}}
            onOpenAlerts={() => {}}
          />
        ); 
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        
        {/* 4. Render the dynamic screen instead of the hardcoded HomeScreen */}
        {renderScreen()}

        {/* 5. Pass the state into the NavBar so it knows which button to highlight, 
            and what to do when a new button is pressed */}
        <NavBar 
          activeScreen={currentScreen} 
          hasActiveJourney={Boolean(activeJourneyConfig)}
          onNavigate={(screen) => setCurrentScreen(screen)} 
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
