import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppScreen, theme } from "../styles/theme";

const endJourneyOrange = "#E58B5B";
const navPeach = "#778093";
const centerGreen = "#AFCB46";
const centerGreenDeep = "#92A93A";
const logoLightPeach = "#F3C8A2";
const logoDarkPeach = "#E99573";

const navItems = [
  { key: "routes", label: "Routes", icon: "□" },
  { key: "stats", label: "Stats", icon: "◆" },
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
  const isRoutesScreen = activeScreen === "routes";
  const showsHomeCenterButton =
    isJourneyScreen || isActiveJourneyScreen || isRoutesScreen;
  const usesGreenHomeButton = isRoutesScreen;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const centerTarget =
    showsHomeCenterButton
      ? "home"
      : hasActiveJourney
        ? "activeJourney"
        : "startJourney";

  const centerTopLabel = showsHomeCenterButton
    ? "Home"
    : hasActiveJourney
      ? "Active"
      : "Start";

  const centerBottomLabel = showsHomeCenterButton ? "" : "Journey";
  const centerButtonColors = showsHomeCenterButton
    ? usesGreenHomeButton
      ? [centerGreen, centerGreen]
      : [navPeach, navPeach]
    : [centerGreen, centerGreen];
  const centerButtonShadow = showsHomeCenterButton
    ? usesGreenHomeButton
      ? centerGreenDeep
      : navPeach
    : centerGreenDeep;

  useEffect(() => {
    if (!showsHomeCenterButton && !hasActiveJourney) {
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
  }, [hasActiveJourney, pulseAnim, showsHomeCenterButton]);

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
              style={[
                styles.centerButtonShell,
                { shadowColor: centerButtonShadow },
              ]}
              onPress={() => onNavigate(centerTarget)}
            >
              <LinearGradient
                colors={centerButtonColors}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.centerButton}
              >
                <View style={styles.centerInnerRing} />
                <Text style={styles.centerIcon}>
                  {showsHomeCenterButton ? "⌂" : "➤"}
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
    borderWidth: 2,
    borderColor: logoDarkPeach,
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
    color: logoLightPeach,
    fontSize: 24,
    fontWeight: "800",
  },
  navLabel: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "700",
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
