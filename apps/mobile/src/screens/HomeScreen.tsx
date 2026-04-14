import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { Marker, Polyline } from "react-native-maps";
import AnimatedWayPointLogo from "../components/AnimatedWayPointLogo";
import { theme } from "../styles/theme";

const readyLimeTextDark = "#4F5A22";

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
    locationValue: string;
    routeValue: string;
    weatherValue: string;
    weatherText: string;
    showRoute: boolean;
  }
> = {
  idle: {
    locationValue: "Downtown Area",
    routeValue: "No route started",
    weatherValue: "72°F",
    weatherText: "Sunny",
    showRoute: false,
  },
  active: {
    locationValue: "Downtown Area",
    routeValue: "Riverwalk Loop",
    weatherValue: "72°F",
    weatherText: "Sunny",
    showRoute: true,
  },
  off_route: {
    locationValue: "Near Pine Street",
    routeValue: "Riverwalk Loop",
    weatherValue: "71°F",
    weatherText: "Cloudy",
    showRoute: true,
  },
  complete: {
    locationValue: "Downtown Area",
    routeValue: "Completed route",
    weatherValue: "70°F",
    weatherText: "Clear",
    showRoute: true,
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
      colors={[theme.colors.background, "#F2E8DD", theme.colors.backgroundDeep]}
      locations={[0, 0.48, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.screen}
    >
      <View style={styles.pageConfettiBackdrop}>
        {[
          styles.pageConfettiOne,
          styles.pageConfettiTwo,
          styles.pageConfettiThree,
          styles.pageConfettiFour,
          styles.pageConfettiFive,
          styles.pageConfettiSix,
          styles.pageConfettiSeven,
          styles.pageConfettiEight,
          styles.pageConfettiNine,
          styles.pageConfettiTen,
          styles.pageConfettiEleven,
          styles.pageConfettiTwelve,
          styles.pageConfettiThirteen,
          styles.pageConfettiFourteen,
          styles.pageConfettiFifteen,
          styles.pageConfettiSixteen,
          styles.pageConfettiSeventeen,
          styles.pageConfettiEighteen,
          styles.pageConfettiNineteen,
          styles.pageConfettiTwenty,
        ].map((style, index) => (
          <View key={`home-confetti-${index}`} style={style} />
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mapShell}>
        <View style={styles.mapHero}>
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
            colors={["rgba(255,255,255,0.05)", "rgba(255,250,247,0.18)"]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.mapTint}
          />

          <View style={styles.mapTopRow}>
            <View style={styles.mapBrand}>
              <View style={styles.mapBrandLogoWrap}>
                <AnimatedWayPointLogo size={92} />
              </View>
              <View style={styles.mapBrandCopy}>
                <Text style={styles.mapBrandTitle}>
                  <Text style={styles.mapBrandTitleWay}>Way</Text>
                  <Text style={styles.mapBrandTitlePoint}>Point</Text>
                </Text>
              </View>
            </View>

            <Pressable onPress={onOpenAlerts} style={({ pressed }) => [styles.alertButton, pressed && styles.alertPressed]}>
              <Text style={styles.alertIcon}>◠</Text>
              <View style={styles.alertDot} />
            </Pressable>
          </View>

        </View>
        </View>

        <View style={styles.contentStack}>
          <View style={styles.sectionCard}>
            <Pressable style={({ pressed }) => [styles.searchCard, pressed && styles.cardPressed]}>
              <Text style={styles.searchIcon}>⌕</Text>
              <View style={styles.searchCopy}>
                <Text style={styles.searchTitle}>Where do you want to go?</Text>
                <Text style={styles.searchSubtitle}>Find a safe route nearby</Text>
              </View>
            </Pressable>

            <View style={styles.mapInfoCard}>
              <View>
                <Text style={styles.mapInfoLabel}>
                  {heroState.showRoute ? "Current Journey" : "Current Location"}
                </Text>
                <Text style={styles.mapInfoValue}>
                  {heroState.showRoute ? heroState.routeValue : heroState.locationValue}
                </Text>
              </View>
              <View style={styles.mapWeatherWrap}>
                <Text style={styles.mapWeatherLabel}>{heroState.weatherText}</Text>
                <Text style={styles.mapWeatherValue}>{heroState.weatherValue}</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Suggested Route</Text>
              <Pressable onPress={onOpenPopularRoutes}>
                <Text style={styles.sectionAction}>See all</Text>
              </Pressable>
            </View>

            <Pressable onPress={onOpenPopularRoutes} style={({ pressed }) => [styles.featureCard, pressed && styles.cardPressed]}>
              <View style={styles.featureBadge}>
                <Text style={styles.featureBadgeText}>Best match</Text>
              </View>
              <Text style={styles.featureTitle}>Sunset Riverwalk</Text>
              <Text style={styles.featureSubtitle}>
                Well-lit, easy to follow, and popular for evening walks.
              </Text>
              <View style={styles.featureMetaRow}>
                {["2.4 mi", "34 min", "Low risk"].map((item) => (
                  <View key={item} style={styles.featureMetaPill}>
                    <Text style={styles.featureMetaText}>{item}</Text>
                  </View>
                ))}
              </View>
            </Pressable>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Access</Text>
            </View>

            <View style={styles.listCard}>
              {[
                {
                  title: "Saved routes",
                  subtitle: "Open your favorite places fast",
                  icon: "⌂",
                  onPress: onOpenSavedRoutes,
                  tone: "warm" as const,
                },
                {
                  title: "Popular routes",
                  subtitle: "See routes people love nearby",
                  icon: "↗",
                  onPress: onOpenPopularRoutes,
                  tone: "cool" as const,
                },
              ].map((item, index) => (
                <Pressable
                  key={item.title}
                  onPress={item.onPress}
                  style={({ pressed }) => [
                    styles.listRow,
                    index === 0 && styles.listRowDivider,
                    pressed && styles.listRowPressed,
                  ]}
                >
                  <LinearGradient
                    colors={
                      item.tone === "warm"
                        ? ["#F7D9C9", "#F1B08F"]
                        : ["#D8E59C", "#B9CD62"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.listIcon}
                  >
                    <Text style={styles.listIconText}>{item.icon}</Text>
                  </LinearGradient>
                  <View style={styles.listCopy}>
                    <Text style={styles.listTitle}>{item.title}</Text>
                    <Text style={styles.listSubtitle}>{item.subtitle}</Text>
                  </View>
                  <Text style={styles.listChevron}>›</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today</Text>
            </View>

            <View style={styles.progressRow}>
              {[
                ["Streak", "14d"],
                ["Distance", "6.4 mi"],
                ["Routes", "16"],
              ].map(([label, value]) => (
                <View key={label} style={styles.progressTile}>
                  <Text style={styles.progressLabel}>{label}</Text>
                  <Text style={styles.progressValue}>{value}</Text>
                </View>
              ))}
            </View>
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
  pageConfettiBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    pointerEvents: "none",
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 0,
    paddingBottom: 180,
    zIndex: 1,
  },
  mapShell: {
    marginHorizontal: -18,
    marginTop: -2,
  },
  mapHero: {
    height: 300,
    overflow: "hidden",
    backgroundColor: theme.colors.heroSky,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  mapView: {
    ...StyleSheet.absoluteFillObject,
  },
  mapTint: {
    ...StyleSheet.absoluteFillObject,
  },
  mapTopRow: {
    paddingHorizontal: 18,
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  mapBrand: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    paddingLeft: 4,
    paddingRight: 14,
    borderRadius: 20,
    backgroundColor: "rgba(119,128,147,0.88)",
    borderWidth: 1,
    borderColor: "rgba(243,200,162,0.16)",
    shadowColor: "#778093",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    minWidth: 0,
  },
  mapBrandLogoWrap: {
    marginTop: -22,
    marginBottom: -22,
    marginLeft: -8,
  },
  mapBrandCopy: {
    marginLeft: -10,
    flexShrink: 1,
    alignItems: "center",
  },
  mapBrandTitle: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.8,
    color: theme.colors.white,
  },
  mapBrandTitleWay: {
    color: "#F3C8A2",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  mapBrandTitlePoint: {
    color: theme.colors.success,
  },
  mapBrandSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: "rgba(255,255,255,0.82)",
    textAlign: "center",
  },
  alertButton: {
    minWidth: 60,
    minHeight: 46,
    paddingHorizontal: 8,
    paddingVertical: 11,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#F7D9C9",
    shadowColor: theme.colors.ink,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  alertPressed: {
    opacity: 0.9,
  },
  alertIcon: {
    fontSize: 22,
    color: "#E58B5B",
  },
  alertDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: theme.colors.brand,
  },
  contentStack: {
    marginTop: -34,
    marginHorizontal: 14,
    gap: 16,
  },
  sectionCard: {
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 28,
    padding: 18,
    gap: 14,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  searchCard: {
    borderRadius: 24,
    backgroundColor: theme.colors.surfaceSoft,
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchIcon: {
    fontSize: 22,
    color: theme.colors.textMuted,
  },
  searchCopy: {
    flex: 1,
  },
  searchTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: theme.colors.text,
  },
  searchSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: theme.colors.textSoft,
  },
  mapInfoCard: {
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceSoft,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mapInfoLabel: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  mapInfoValue: {
    marginTop: 3,
    fontSize: 19,
    fontWeight: "700",
    color: theme.colors.text,
  },
  mapWeatherWrap: {
    alignItems: "flex-end",
  },
  mapWeatherLabel: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  mapWeatherValue: {
    marginTop: 3,
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "800",
    color: theme.colors.text,
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.brandDeep,
  },
  featureCard: {
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceSoft,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(239,167,116,0.16)",
  },
  cardPressed: {
    transform: [{ scale: 1.01 }],
  },
  featureBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "rgba(191,214,90,0.16)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  featureBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: "#617228",
  },
  featureTitle: {
    marginTop: 14,
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.text,
  },
  featureSubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textSoft,
  },
  featureMetaRow: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  featureMetaPill: {
    borderRadius: 999,
    backgroundColor: "rgba(222,133,88,0.18)",
    borderWidth: 1,
    borderColor: "rgba(202,116,73,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  featureMetaText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.brandDeep,
  },
  listCard: {
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceSoft,
    overflow: "hidden",
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  listRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(88,80,93,0.06)",
  },
  listRowPressed: {
    opacity: 0.9,
  },
  listIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  listIconText: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.text,
  },
  listCopy: {
    flex: 1,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.text,
  },
  listSubtitle: {
    marginTop: 3,
    fontSize: 13,
    color: theme.colors.textSoft,
  },
  listChevron: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.textMuted,
  },
  progressRow: {
    flexDirection: "row",
    gap: 10,
  },
  progressTile: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "rgba(191,214,90,0.34)",
    paddingHorizontal: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(185,205,98,0.5)",
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: "#6B7B2D",
    textAlign: "center",
  },
  progressValue: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: "900",
    color: "#4F5A22",
    textAlign: "center",
  },
  pageConfettiOne: {
    position: "absolute",
    top: "8%",
    left: "6%",
    width: 16,
    height: 16,
    borderRadius: 999,
    backgroundColor: "rgba(175,203,70,0.24)",
  },
  pageConfettiTwo: {
    position: "absolute",
    top: "12%",
    right: "8%",
    width: 14,
    height: 14,
    borderRadius: 6,
    backgroundColor: "rgba(245,160,87,0.24)",
    transform: [{ rotate: "-18deg" }],
  },
  pageConfettiThree: {
    position: "absolute",
    top: "22%",
    left: "3%",
    width: 9,
    height: 28,
    borderRadius: 999,
    backgroundColor: "rgba(229,139,91,0.22)",
    transform: [{ rotate: "-24deg" }],
  },
  pageConfettiFour: {
    position: "absolute",
    top: "28%",
    right: "4%",
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: "rgba(247,217,201,0.34)",
  },
  pageConfettiFive: {
    position: "absolute",
    top: "43%",
    left: "7%",
    width: 14,
    height: 14,
    borderRadius: 5,
    backgroundColor: "rgba(175,203,70,0.22)",
    transform: [{ rotate: "28deg" }],
  },
  pageConfettiSix: {
    position: "absolute",
    top: "56%",
    right: "6%",
    width: 10,
    height: 34,
    borderRadius: 999,
    backgroundColor: "rgba(245,160,87,0.2)",
    transform: [{ rotate: "-18deg" }],
  },
  pageConfettiSeven: {
    position: "absolute",
    bottom: "28%",
    left: "8%",
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: "rgba(229,139,91,0.22)",
  },
  pageConfettiEight: {
    position: "absolute",
    bottom: "22%",
    right: "22%",
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: "rgba(247,217,201,0.32)",
    transform: [{ rotate: "-16deg" }],
  },
  pageConfettiNine: {
    position: "absolute",
    bottom: "14%",
    right: "10%",
    width: 10,
    height: 34,
    borderRadius: 999,
    backgroundColor: "rgba(175,203,70,0.2)",
    transform: [{ rotate: "32deg" }],
  },
  pageConfettiTen: {
    position: "absolute",
    bottom: "8%",
    left: "18%",
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: "rgba(245,160,87,0.22)",
  },
  pageConfettiEleven: {
    position: "absolute",
    top: "18%",
    left: "18%",
    width: 12,
    height: 32,
    borderRadius: 999,
    backgroundColor: "rgba(175,203,70,0.2)",
    transform: [{ rotate: "26deg" }],
  },
  pageConfettiTwelve: {
    position: "absolute",
    top: "34%",
    right: "16%",
    width: 16,
    height: 16,
    borderRadius: 999,
    backgroundColor: "rgba(245,160,87,0.24)",
  },
  pageConfettiThirteen: {
    position: "absolute",
    top: "48%",
    left: "16%",
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: "rgba(247,217,201,0.32)",
    transform: [{ rotate: "22deg" }],
  },
  pageConfettiFourteen: {
    position: "absolute",
    top: "64%",
    left: "26%",
    width: 10,
    height: 30,
    borderRadius: 999,
    backgroundColor: "rgba(229,139,91,0.22)",
    transform: [{ rotate: "-28deg" }],
  },
  pageConfettiFifteen: {
    position: "absolute",
    bottom: "18%",
    right: "32%",
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: "rgba(175,203,70,0.2)",
  },
  pageConfettiSixteen: {
    position: "absolute",
    bottom: "10%",
    right: "4%",
    width: 14,
    height: 36,
    borderRadius: 999,
    backgroundColor: "rgba(245,160,87,0.2)",
    transform: [{ rotate: "20deg" }],
  },
  pageConfettiSeventeen: {
    position: "absolute",
    top: "10%",
    left: "34%",
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: "rgba(229,139,91,0.22)",
  },
  pageConfettiEighteen: {
    position: "absolute",
    top: "36%",
    left: "26%",
    width: 16,
    height: 44,
    borderRadius: 999,
    backgroundColor: "rgba(175,203,70,0.22)",
    transform: [{ rotate: "24deg" }],
  },
  pageConfettiNineteen: {
    position: "absolute",
    top: "58%",
    right: "20%",
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: "rgba(245,160,87,0.24)",
    transform: [{ rotate: "-18deg" }],
  },
  pageConfettiTwenty: {
    position: "absolute",
    bottom: "32%",
    right: "6%",
    width: 14,
    height: 40,
    borderRadius: 999,
    backgroundColor: "rgba(247,217,201,0.36)",
    transform: [{ rotate: "30deg" }],
  },
});
