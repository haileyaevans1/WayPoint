import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Header } from "../components/Header";
import { theme } from "../styles/theme";

const readyLimeLight = "#CFE17A";
const readyLimeTextDark = "#4F5A22";
const readyLimeText = "#566126";

const previewRoute = [
  { latitude: 29.4246, longitude: -98.4898 },
  { latitude: 29.4256, longitude: -98.4883 },
  { latitude: 29.4265, longitude: -98.4867 },
  { latitude: 29.4271, longitude: -98.4852 },
  { latitude: 29.4263, longitude: -98.4838 },
  { latitude: 29.4249, longitude: -98.4832 },
  { latitude: 29.4235, longitude: -98.4838 },
  { latitude: 29.4226, longitude: -98.4855 },
  { latitude: 29.4231, longitude: -98.4874 },
  { latitude: 29.4246, longitude: -98.4898 },
] as const;

const liveLocationRegion = {
  latitude: 29.4249,
  longitude: -98.486,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const activeRouteRegion = {
  latitude: 29.4249,
  longitude: -98.486,
  latitudeDelta: 0.0068,
  longitudeDelta: 0.0068,
};

type JourneyMode = "idle" | "active" | "off_route" | "complete";

type HomeScreenProps = {
  onOpenSavedRoutes: () => void;
  onOpenPopularRoutes: () => void;
  onOpenAlerts: () => void;
  journeyMode?: JourneyMode;
};

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
  journeyMode = "idle",
}: HomeScreenProps) {
  const heroState = heroStateByMode[journeyMode];

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
            <MapView
              style={styles.mapView}
              initialRegion={heroState.showRoute ? activeRouteRegion : liveLocationRegion}
              showsUserLocation={!heroState.showRoute}
              followsUserLocation={!heroState.showRoute}
              scrollEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
              toolbarEnabled={false}
              showsCompass={false}
              pointerEvents="none"
            >
              {heroState.showRoute ? (
                <>
                  <Polyline
                    coordinates={[...previewRoute]}
                    strokeColor="#675EF2"
                    strokeWidth={5}
                    lineCap="round"
                    lineJoin="round"
                  />
                  <Marker coordinate={previewRoute[0]} title="Start" />
                  <Marker
                    coordinate={previewRoute[Math.min(4, previewRoute.length - 1)]}
                    title="Current position"
                    pinColor={theme.colors.brand}
                  />
                </>
              ) : null}
            </MapView>
            <LinearGradient
              colors={["rgba(255,255,255,0.06)", "rgba(255,250,247,0.16)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.mapTint}
            />

            <View style={styles.mapBadge}>
              <Text style={styles.mapBadgeLabel}>
                {heroState.showRoute ? "Active route" : "Live location"}
              </Text>
            </View>

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
            colors={["#F6CBB9", "#EEAD92", "#E79A7B"]}
            locations={[0, 0.62, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.routeCard, styles.savedCard]}
          >
            <View style={styles.routeSavedWash} />
            <View style={styles.routeSavedWarmWash} />
            <View style={styles.routeOrb} />
            <View style={styles.routeOrbSaved} />
            <Text style={styles.routeTitle}>Saved{"\n"}Routes</Text>
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

        <LinearGradient
          colors={["#CFE17A", "#DCEE93"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.analyticsShell}
        >
          <View style={styles.analyticsGlowOne} />
          <View style={styles.analyticsGlowTwo} />
          <View style={styles.analyticsGlowThree} />
          <Text style={styles.analyticsEyebrow}>Your progress</Text>
          <Text style={styles.analyticsTitle}>Daily analytics</Text>

          <View style={styles.analyticsGrid}>
            {[
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
                    colors={["rgba(255,255,255,0.98)", "rgba(255,253,248,0.95)"]}
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
        </LinearGradient>
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
    minHeight: 388,
    overflow: "hidden",
    borderRadius: 32,
    backgroundColor: theme.colors.heroSkySoft,
  },
  mapView: {
    ...StyleSheet.absoluteFillObject,
  },
  mapTint: {
    ...StyleSheet.absoluteFillObject,
  },
  mapBadge: {
    position: "absolute",
    right: 16,
    top: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255,250,247,0.92)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: theme.colors.ink,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  mapBadgeLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.text,
  },
  statusCard: {
    margin: 14,
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
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  locationCard: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 14,
    borderRadius: 24,
    backgroundColor: theme.colors.overlay,
    paddingHorizontal: 16,
    paddingVertical: 10,
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
    fontSize: 17,
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
    fontSize: 17,
    fontWeight: "700",
    color: theme.colors.text,
  },
  weatherText: {
    marginTop: 3,
    fontSize: 11,
    color: theme.colors.textSoft,
  },
  routeGrid: {
    flexDirection: "row",
    gap: 12,
  },
  routeCard: {
    position: "relative",
    overflow: "hidden",
    flex: 1,
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 20,
    minHeight: 172,
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
    left: -96,
    top: 8,
    bottom: 0,
    width: 180,
    borderRadius: 999,
    backgroundColor: "rgba(255,236,234,0.12)",
  },
  routeSavedWarmWash: {
    position: "absolute",
    right: -110,
    bottom: -120,
    width: 250,
    height: 250,
    borderRadius: 999,
    backgroundColor: "rgba(244,208,199,0.1)",
  },
  routeOrb: {
    position: "absolute",
    right: -64,
    top: -50,
    width: 170,
    height: 170,
    borderRadius: 999,
    backgroundColor: theme.colors.popularOrb,
  },
  routeOrbSaved: {
    position: "absolute",
    right: -108,
    top: -84,
    width: 172,
    height: 172,
    borderRadius: 999,
    backgroundColor: "rgba(255,239,238,0.05)",
    opacity: 0.12,
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
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.white,
  },
  routeSubtitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255,255,255,0.88)",
  },
  routeAction: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.white,
  },
  routeActionPill: {
    marginTop: 22,
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
    position: "relative",
    overflow: "hidden",
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 18,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  analyticsGlowOne: {
    position: "absolute",
    top: -70,
    right: -54,
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  analyticsGlowTwo: {
    position: "absolute",
    left: -88,
    bottom: -96,
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: "rgba(175,203,70,0.1)",
  },
  analyticsGlowThree: {
    position: "absolute",
    right: 24,
    top: 56,
    width: 340,
    height: 88,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
    transform: [{ rotate: "-12deg" }],
  },
  analyticsEyebrow: {
    fontSize: 12,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: readyLimeText,
  },
  analyticsTitle: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: "700",
    color: readyLimeTextDark,
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
    borderColor: "rgba(175,203,70,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: theme.colors.ink,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
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
    color: readyLimeText,
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
