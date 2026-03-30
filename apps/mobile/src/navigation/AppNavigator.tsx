import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { NavBar } from "../components/NavBar";
import { HomeScreen } from "../screens/HomeScreen";
import { theme } from "../styles/theme";

export function AppNavigator() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <HomeScreen
          onOpenSavedRoutes={() => {}}
          onOpenPopularRoutes={() => {}}
          onOpenAlerts={() => {}}
        />
        <NavBar activeScreen="home" onNavigate={() => {}} />
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
  },
});
