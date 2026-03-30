import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Header } from "../components/Header";
import { theme } from "../styles/theme";

type JourneyMode = "idle" | "active" | "off_route" | "complete";

type HomeScreenProps = {
  onOpenSavedRoutes: () => void;
  onOpenPopularRoutes: () => void;
  onOpenAlerts: () => void;
};

const mockHeroMode: JourneyMode = "idle";

const heroStateByMode: Record<
  JourneyMode,
  {
    statusText: string;
    statusDotColor: string;
    locationLabel: string;
    locationValue: string;
    weatherValue: string;
    weatherText: string;
    showRoute: boolean;
    routeOpacity: number;
  }
> = {
  idle: {
    statusText: "Ready to find a journey",
    statusDotColor: theme.colors.success,
    locationLabel: "Current Location",
    locationValue: "Downtown Area",
    weatherValue: "72°F",
    weatherText: "Sunny",
    showRoute: false,
    routeOpacity: 0,
  },
  active: {
    statusText: "Current journey",
    statusDotColor: theme.colors.success,
    locationLabel: "Current Journey",
    locationValue: "Riverwalk Loop",
    weatherValue: "72°F",
    weatherText: "Sunny",
    showRoute: true,
    routeOpacity: 1,
  },
  off_route: {
    statusText: "Deviated from route",
    statusDotColor: theme.colors.brand,
    locationLabel: "Current Location",
    locationValue: "Near Pine Street",
    weatherValue: "71°F",
    weatherText: "Cloudy",
    showRoute: true,
    routeOpacity: 1,
  },
  complete: {
    statusText: "Journey complete",
    statusDotColor: theme.colors.brandBright,
    locationLabel: "Current Location",
    locationValue: "Downtown Area",
    weatherValue: "70°F",
    weatherText: "Clear",
    showRoute: true,
    routeOpacity: 0.45,
  },
};

export function HomeScreen({
  onOpenSavedRoutes,
  onOpenPopularRoutes,
  onOpenAlerts,
}: HomeScreenProps) {
  const heroState = heroStateByMode[mockHeroMode];

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundAlt, theme.colors.backgroundDeep]}
      locations={[0, 0.48, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Header onAlertPress={onOpenAlerts} />

        <View style={styles.heroShell}>
          <View style={styles.hero}>
            <View style={styles.skyBlob} />
            <View style={styles.grassBlob} />
            <View style={styles.grassBlobTwo} />
            {heroState.showRoute ? (
              <>
                <View style={[styles.routeLinePrimary, { opacity: heroState.routeOpacity }]} />
                <View style={[styles.routeNodeLeft, { opacity: heroState.routeOpacity }]} />
                <View style={[styles.routeNodeRight, { opacity: heroState.routeOpacity }]} />
              </>
            ) : null}
            <View style={styles.pinWrap}>
              <View style={styles.pinCircleOuter}>
                <View style={styles.pinCircleInner} />
              </View>
              <View style={styles.pinTail} />
            </View>
            <View style={styles.waveOne} />
            <View style={styles.waveTwo} />
            <View style={styles.waveThree} />
            <View style={styles.mapCard} />

            <View style={styles.statusCard}>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: heroState.statusDotColor }]} />
                <View>
                  <Text style={styles.statusLabel}>Status</Text>
                  <Text style={styles.statusValue}>{heroState.statusText}</Text>
                </View>
              </View>
            </View>

            <View style={styles.locationCard}>
              <View>
                <Text style={styles.locationLabel}>{heroState.locationLabel}</Text>
                <Text style={styles.locationValue}>{heroState.locationValue}</Text>
              </View>
              <View style={styles.weatherWrap}>
                <Text style={styles.weatherLabel}>Weather</Text>
                <Text style={styles.weatherValue}>{heroState.weatherValue}</Text>
                <Text style={styles.weatherText}>{heroState.weatherText}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.routeGrid}>
          <LinearGradient
            colors={[theme.colors.inkSoft, "#A8B27F", "#DF9059"]}
            locations={[0, 0.28, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.routeCard, styles.savedCard]}
          >
            <View style={styles.routeSavedWash} />
            <View style={styles.routeSavedWarmWash} />
            <View style={styles.routeOrb} />
            <View style={styles.routeOrbSaved} />
            <Text style={styles.routeTitle}>Saved Routes</Text>
            <Text style={styles.routeSubtitle}>12 favorites</Text>
            <Pressable onPress={onOpenSavedRoutes} style={({ pressed }) => pressed && styles.routePressablePressed}>
              {({ pressed }) => (
                <View style={[styles.routeActionPill, pressed && styles.routeActionPillPressed]}>
                  <Text style={styles.routeAction}>View all →</Text>
                </View>
              )}
            </Pressable>
          </LinearGradient>
          <LinearGradient
            colors={[theme.colors.accentPeach, "#EA9358", "#D27645"]}
            locations={[0, 0.58, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.routeCard, styles.popularCard]}
          >
            <View style={styles.routePopularWarmWash} />
            <View style={styles.routeOrb} />
            <Text style={styles.routeTitle}>Popular Routes</Text>
            <Text style={styles.routeSubtitle}>Trending now</Text>
            <Pressable onPress={onOpenPopularRoutes} style={({ pressed }) => pressed && styles.routePressablePressed}>
              {({ pressed }) => (
                <View style={[styles.routeActionPill, pressed && styles.routeActionPillPressed]}>
                  <Text style={styles.routeAction}>Explore →</Text>
                </View>
              )}
            </Pressable>
          </LinearGradient>
        </View>

        <View style={styles.analyticsShell}>
          <Text style={styles.analyticsEyebrow}>Your progress</Text>
          <Text style={styles.analyticsTitle}>Daily analytics</Text>

          <View style={styles.analyticsGrid}>
            {[
              ["Steps", "8.2k"],
              ["Streak", "14d"],
              ["Distance", "6.4 mi"],
              ["Individual Routes", "16"],
              ["Group Routes", "7"],
            ].map(([label, value]) => (
              <Pressable
                key={label}
                style={({ pressed }) => [styles.analyticsPressable, pressed && styles.analyticsPressablePressed]}
              >
                {({ pressed }) => (
                  <LinearGradient
                    colors={["#E8CBB7", "#F4DED0", "#FFF8F3"]}
                    locations={[0, 0.45, 1]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={[styles.analyticsCard, pressed && styles.analyticsCardPressed]}
                  >
                    <Text style={styles.analyticsLabel}>{label}</Text>
                    <Text style={styles.analyticsValue}>{value}</Text>
                  </LinearGradient>
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 180,
    gap: 18,
  },
  heroShell: {
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: theme.colors.heroSky,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  hero: {
    minHeight: 540,
    overflow: "hidden",
    borderRadius: 32,
    backgroundColor: theme.colors.heroSkySoft,
  },
  skyBlob: {
    position: "absolute",
    right: -24,
    top: -18,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: theme.colors.heroSky,
  },
  grassBlob: {
    position: "absolute",
    left: -32,
    bottom: 102,
    width: 320,
    height: 180,
    borderRadius: 100,
    backgroundColor: theme.colors.heroGrass,
    transform: [{ rotate: "-10deg" }],
  },
  grassBlobTwo: {
    position: "absolute",
    left: -20,
    bottom: -20,
    width: 300,
    height: 180,
    borderRadius: 100,
    backgroundColor: theme.colors.heroGrassDeep,
    opacity: 0.6,
  },
  routeLinePrimary: {
    position: "absolute",
    left: 118,
    top: 258,
    width: 220,
    height: 12,
    borderRadius: 999,
    backgroundColor: "#6D73F1",
    transform: [{ rotate: "15deg" }],
  },
  routeNodeLeft: {
    position: "absolute",
    left: 96,
    top: 286,
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: "#6D73F1",
    borderWidth: 5,
    borderColor: "rgba(255,255,255,0.9)",
  },
  routeNodeRight: {
    position: "absolute",
    right: 92,
    top: 308,
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: "#6D73F1",
    borderWidth: 5,
    borderColor: "rgba(255,255,255,0.9)",
  },
  pinWrap: {
    position: "absolute",
    left: "50%",
    top: 206,
    marginLeft: -44,
    alignItems: "center",
  },
  pinCircleOuter: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#675EF2",
    alignItems: "center",
    justifyContent: "center",
  },
  pinCircleInner: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: theme.colors.white,
    borderWidth: 8,
    borderColor: "#675EF2",
  },
  pinTail: {
    marginTop: -4,
    width: 0,
    height: 0,
    borderLeftWidth: 28,
    borderRightWidth: 28,
    borderTopWidth: 34,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#675EF2",
  },
  waveOne: {
    position: "absolute",
    left: -60,
    top: 176,
    width: 520,
    height: 24,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.88)",
    transform: [{ rotate: "9deg" }],
  },
  waveTwo: {
    position: "absolute",
    left: 70,
    top: 46,
    width: 360,
    height: 18,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.8)",
    transform: [{ rotate: "-8deg" }],
  },
  waveThree: {
    position: "absolute",
    left: 150,
    bottom: 96,
    width: 330,
    height: 20,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.82)",
    transform: [{ rotate: "-8deg" }],
  },
  mapCard: {
    position: "absolute",
    right: 58,
    top: 108,
    width: 80,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.54)",
  },
  statusCard: {
    margin: 20,
    alignSelf: "flex-start",
    borderRadius: 24,
    backgroundColor: theme.colors.overlay,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: theme.colors.ink,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: theme.colors.success,
  },
  statusLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  statusValue: {
    marginTop: 3,
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  locationCard: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 20,
    borderRadius: 24,
    backgroundColor: theme.colors.overlay,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: theme.colors.ink,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  locationLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  locationValue: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
  },
  weatherWrap: {
    alignItems: "flex-end",
  },
  weatherLabel: {
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: theme.colors.textMuted,
  },
  weatherValue: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
  },
  weatherText: {
    marginTop: 3,
    fontSize: 12,
    color: theme.colors.textSoft,
  },
  routeGrid: {
    gap: 14,
  },
  routeCard: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 24,
    minHeight: 186,
    justifyContent: "flex-end",
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  savedCard: {},
  popularCard: {},
  routePressablePressed: {
    transform: [{ translateY: -1 }],
  },
  routeSavedWash: {
    position: "absolute",
    left: -68,
    top: -8,
    bottom: 0,
    width: 250,
    borderRadius: 999,
    backgroundColor: theme.colors.savedTint,
  },
  routeSavedWarmWash: {
    position: "absolute",
    right: -74,
    bottom: -70,
    width: 310,
    height: 310,
    borderRadius: 999,
    backgroundColor: theme.colors.savedWarmWash,
  },
  routeOrb: {
    position: "absolute",
    right: -58,
    top: -54,
    width: 205,
    height: 205,
    borderRadius: 999,
    backgroundColor: theme.colors.popularOrb,
  },
  routeOrbSaved: {
    position: "absolute",
    left: 62,
    bottom: -98,
    width: 278,
    height: 278,
    borderRadius: 999,
    backgroundColor: theme.colors.savedOrb,
  },
  routePopularWarmWash: {
    position: "absolute",
    left: -22,
    bottom: -96,
    width: 350,
    height: 290,
    borderRadius: 999,
    backgroundColor: theme.colors.popularWarmWash,
  },
  routeTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.white,
  },
  routeSubtitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255,255,255,0.88)",
  },
  routeAction: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.white,
  },
  routeActionPill: {
    marginTop: 28,
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  routeActionPillPressed: {
    backgroundColor: "rgba(255,255,255,0.28)",
    transform: [{ scale: 1.03 }],
  },
  analyticsShell: {
    borderRadius: 30,
    backgroundColor: "#FFFCFA",
    paddingHorizontal: 18,
    paddingVertical: 18,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  analyticsEyebrow: {
    fontSize: 12,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: theme.colors.textMuted,
  },
  analyticsTitle: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.text,
  },
  analyticsGrid: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  analyticsPressable: {
    width: "47.8%",
  },
  analyticsPressablePressed: {
    transform: [{ translateY: -2 }],
  },
  analyticsCard: {
    width: "100%",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(202,116,73,0.14)",
    paddingHorizontal: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: theme.colors.ink,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  analyticsCardPressed: {
    transform: [{ scale: 1.03 }],
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  analyticsLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: "#7A6058",
    fontWeight: "700",
    textAlign: "center",
  },
  analyticsValue: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: "800",
    color: "#4B3E45",
    textAlign: "center",
  },
});
