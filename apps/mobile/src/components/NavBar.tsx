import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppScreen, theme } from "../styles/theme";

const endJourneyOrange = "#E58B5B";
const navPeach = "#D78B67";
const centerGreen = "#AFCB46";
const centerGreenDeep = "#92A93A";

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

export function NavBar({
  activeScreen,
  hasActiveJourney = false,
  onNavigate,
}: NavBarProps) {
  const isJourneyScreen = activeScreen === "startJourney";
  const isActiveJourneyScreen = activeScreen === "activeJourney";
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const centerTarget =
    activeScreen === "activeJourney"
      ? "home"
      : activeScreen === "startJourney"
        ? "activeJourney"
      : hasActiveJourney
        ? "activeJourney"
        : "startJourney";

  const centerTopLabel = isActiveJourneyScreen
    ? "Home"
    : hasActiveJourney
      ? "Active"
      : "Start";

  const centerBottomLabel = isActiveJourneyScreen ? "" : "Journey";

  useEffect(() => {
    if (isJourneyScreen) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 850,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 850,
            useNativeDriver: true,
          }),
        ]),
      );

      pulse.start();

      return () => {
        pulse.stop();
        pulseAnim.setValue(1);
      };
    }

    pulseAnim.setValue(1);
  }, [isJourneyScreen, pulseAnim]);

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
              <Text
                style={[
                  styles.navIcon,
                  activeScreen === item.key && styles.navIconActive,
                ]}
              >
                {item.icon}
              </Text>
              <Text
                style={[
                  styles.navLabel,
                  activeScreen === item.key && styles.navLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.centerWrap}>
          <Animated.View
            style={[
              styles.centerPulseWrap,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <Pressable
              style={styles.centerButtonShell}
              onPress={() => onNavigate(centerTarget)}
            >
              <LinearGradient
                colors={[centerGreen, centerGreen]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.centerButton}
              >
                <View style={styles.centerInnerRing} />
                <Text style={styles.centerIcon}>
                  {isActiveJourneyScreen ? "⌂" : isJourneyScreen ? "✓" : "➤"}
                </Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          <Text style={styles.centerLabelTop}>{centerTopLabel}</Text>

          {centerBottomLabel ? (
            <Text style={styles.centerLabelBottom}>{centerBottomLabel}</Text>
          ) : null}
        </View>

        <View style={styles.sideGroup}>
          {navItems.slice(2).map((item) => (
            <Pressable
              key={item.key}
              style={styles.navItem}
              onPress={() => onNavigate(item.key)}
            >
              <Text
                style={[
                  styles.navIcon,
                  activeScreen === item.key && styles.navIconActive,
                ]}
              >
                {item.icon}
              </Text>
              <Text
                style={[
                  styles.navLabel,
                  activeScreen === item.key && styles.navLabelActive,
                ]}
              >
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
    left: 0,
    right: 0,
    bottom: 0,
  },
  bar: {
    borderTopLeftRadius: theme.radius.pill,
    borderTopRightRadius: theme.radius.pill,
    backgroundColor: navPeach,
    paddingHorizontal: 24,
    height: 76,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: navPeach,
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  sideGroup: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  navItem: {
    minWidth: 58,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  navIcon: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 22,
  },
  navLabel: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    fontWeight: "600",
  },
  navIconActive: {
    color: theme.colors.white,
  },
  navLabelActive: {
    color: theme.colors.white,
    fontWeight: "700",
  },
  centerWrap: {
    marginTop: -34,
    alignItems: "center",
  },
  centerPulseWrap: {
    borderRadius: 999,
  },
  centerButtonShell: {
    width: 68,
    height: 68,
    borderRadius: 999,
    overflow: "hidden",
    shadowColor: centerGreenDeep,
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
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2.8,
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
