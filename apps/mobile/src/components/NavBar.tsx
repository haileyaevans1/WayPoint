import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppScreen, theme } from "../styles/theme";

const navItems = [
  { key: "routes", label: "Routes", icon: "□" },
  { key: "stats", label: "Stats", icon: "◇" },
  { key: "profile", label: "Profile", icon: "○" },
  { key: "settings", label: "Settings", icon: "⋯" },
] as const;

type NavBarProps = {
  activeScreen: AppScreen;
  hasActiveJourney?: boolean;
  onNavigate: (screen: AppScreen) => void;
};

export function NavBar({ activeScreen, onNavigate }: NavBarProps) {
  const isJourneyScreen =
    activeScreen === "startJourney" || activeScreen === "activeJourney";

  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        <View style={styles.sideGroup}>
          {navItems.slice(0, 2).map((item) => (
            <Pressable
              key={item.key}
              style={styles.navItem}
              onPress={() => onNavigate(item.key)}
            >
              <Text style={[styles.navIcon, activeScreen === item.key && styles.navIconActive]}>
                {item.icon}
              </Text>
              <Text style={[styles.navLabel, activeScreen === item.key && styles.navLabelActive]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.centerWrap}>
          <Pressable
            style={styles.centerButtonShell}
            onPress={() => onNavigate(isJourneyScreen ? "home" : "startJourney")}
          >
            <LinearGradient
              colors={[theme.colors.brandBright, theme.colors.brand]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.centerButton}
            >
              <View style={styles.centerInnerRing} />
              <Text style={styles.centerIcon}>{isJourneyScreen ? "✓" : "➤"}</Text>
            </LinearGradient>
          </Pressable>
          <Text style={styles.centerLabelTop}>
            {isJourneyScreen ? "Complete" : "Start"}
          </Text>
          <Text style={styles.centerLabelBottom}>Journey</Text>
        </View>

        <View style={styles.sideGroup}>
          {navItems.slice(2).map((item) => (
            <Pressable
              key={item.key}
              style={styles.navItem}
              onPress={() => onNavigate(item.key)}
            >
              <Text style={[styles.navIcon, activeScreen === item.key && styles.navIconActive]}>
                {item.icon}
              </Text>
              <Text style={[styles.navLabel, activeScreen === item.key && styles.navLabelActive]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 8,
  },
  bar: {
    borderTopLeftRadius: theme.radius.pill,
    borderTopRightRadius: theme.radius.pill,
    borderBottomLeftRadius: theme.radius.pill,
    borderBottomRightRadius: theme.radius.pill,
    backgroundColor: "#778093",
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    shadowColor: theme.colors.ink,
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  sideGroup: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  navItem: {
    minWidth: 58,
    alignItems: "center",
    gap: 3,
  },
  navIcon: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 22,
  },
  navLabel: {
    color: "rgba(255,255,255,0.94)",
    fontSize: 14,
    fontWeight: "500",
  },
  navIconActive: {
    color: theme.colors.white,
  },
  navLabelActive: {
    color: theme.colors.white,
    fontWeight: "700",
  },
  centerWrap: {
    marginTop: -30,
    alignItems: "center",
  },
  centerButtonShell: {
    width: 68,
    height: 68,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: "rgba(255,250,247,0.92)",
    overflow: "hidden",
    shadowColor: theme.colors.brand,
    shadowOpacity: 0.34,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
  },
  centerButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  centerInnerRing: {
    position: "absolute",
    inset: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  centerIcon: {
    color: theme.colors.white,
    fontSize: 26,
    fontWeight: "700",
  },
  centerLabelTop: {
    marginTop: 7,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 2.4,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.9)",
  },
  centerLabelBottom: {
    marginTop: 2,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 2.4,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.9)",
  },
});
