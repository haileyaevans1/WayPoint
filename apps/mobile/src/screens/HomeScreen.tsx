import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
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
  onOpenStartJourney: () => void;
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
  onOpenStartJourney,
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
              <Feather name="bell" size={18} color={theme.colors.white} />
              <View style={styles.alertDot} />
            </Pressable>
          </View>

        </View>
        </View>

        <View style={styles.contentStack}>
          <View style={styles.sectionCard}>
            <Pressable
              onPress={onOpenStartJourney}
              style={({ pressed }) => [styles.searchCard, pressed && styles.cardPressed]}
            >
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
              <Text style={styles.sectionTitle}>Favorites</Text>
            </View>

            <View style={styles.favoriteRoutesRow}>
              {[
                {
                  title: "Riverwalk",
                  subtitle: "Bike loop • 5k",
                  icon: "↗",
                  onPress: onOpenPopularRoutes,
                  tone: "warm" as const,
                },
                {
                  title: "School → Home",
                  subtitle: "Walk • 1.2 mi",
                  icon: "⌂",
                  onPress: onOpenSavedRoutes,
                  tone: "cool" as const,
                },
                {
                  title: "Add",
                  subtitle: "Favorite",
                  icon: "+",
                  onPress: onOpenSavedRoutes,
                  tone: "add" as const,
                },
              ].map((item) => (
                <Pressable
                  key={item.title}
                  onPress={item.onPress}
                  style={({ pressed }) => [
                    styles.favoriteRouteItem,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <LinearGradient
                    colors={
                      item.tone === "warm"
                        ? ["#F7D9C9", "#F1B08F"]
                        : item.tone === "cool"
                          ? ["#D8E59C", "#B9CD62"]
                          : ["#F6D2BE", "#EFA06F"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.favoriteRouteIcon,
                      item.tone === "add" && styles.favoriteRouteIconAdd,
                    ]}
                  >
                    <Text
                      style={[
                        styles.favoriteRouteIconText,
                        item.tone === "add" && styles.favoriteRouteIconTextAdd,
                      ]}
                    >
                      {item.icon}
                    </Text>
                  </LinearGradient>
                  <Text style={styles.favoriteRouteTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.favoriteRouteSubtitle}>{item.subtitle}</Text>
                </Pressable>
              ))}
            </View>
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
                    item.tone === "warm" ? styles.listRowWarm : styles.listRowCool,
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
              <Text style={styles.sectionTitle}>At a Glance</Text>
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
    backgroundColor: "rgba(255,242,233,0.12)",
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
    backgroundColor: "rgba(108,116,130,0.92)",
    borderWidth: 1,
    borderColor: "rgba(243,200,162,0.28)",
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
    color: theme.colors.brandBright,
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
    backgroundColor: theme.colors.brandBright,
    position: "relative",
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.18,
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
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: theme.colors.brand,
  },
  contentStack: {
    marginTop: -34,
    marginHorizontal: 0,
    gap: 16,
  },
  sectionCard: {
    backgroundColor: "#FFF7F1",
    borderRadius: 28,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(202,116,73,0.22)",
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.14,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  searchCard: {
    borderRadius: 24,
    backgroundColor: theme.colors.surfaceOrange,
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(202,116,73,0.26)",
  },
  searchIcon: {
    fontSize: 22,
    color: theme.colors.brandDeep,
  },
  searchCopy: {
    flex: 1,
  },
  searchTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: theme.colors.text,
  },
  searchSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: theme.colors.brandDeep,
  },
  mapInfoCard: {
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceOrangeDeep,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(202,116,73,0.3)",
  },
  mapInfoLabel: {
    fontSize: 13,
    color: "rgba(111,72,46,0.86)",
    fontWeight: "700",
  },
  mapInfoValue: {
    marginTop: 3,
    fontSize: 20,
    fontWeight: "900",
    color: theme.colors.text,
  },
  mapWeatherWrap: {
    alignItems: "flex-end",
    backgroundColor: "rgba(255,249,244,0.82)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(202,116,73,0.16)",
  },
  mapWeatherLabel: {
    fontSize: 13,
    color: theme.colors.brandDeep,
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
    fontWeight: "900",
    color: theme.colors.brandDeep,
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.brandDeep,
  },
  cardPressed: {
    transform: [{ scale: 1.01 }],
  },
  favoriteRoutesRow: {
    flexDirection: "row",
    gap: 14,
  },
  favoriteRouteItem: {
    flex: 1,
    alignItems: "center",
  },
  favoriteRouteIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  favoriteRouteIconAdd: {
    borderWidth: 1,
    borderColor: "rgba(119,128,147,0.12)",
  },
  favoriteRouteIconText: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.text,
  },
  favoriteRouteIconTextAdd: {
    color: "#B26035",
  },
  favoriteRouteTitle: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.text,
  },
  favoriteRouteSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: theme.colors.text,
  },
  listCard: {
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceOrange,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(202,116,73,0.22)",
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  listRowWarm: {
    backgroundColor: theme.colors.surfaceOrangeDeep,
  },
  listRowCool: {
    backgroundColor: theme.colors.success,
  },
  listRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(202,116,73,0.12)",
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
    fontWeight: "900",
    color: theme.colors.text,
  },
  listSubtitle: {
    marginTop: 3,
    fontSize: 13,
    color: theme.colors.text,
  },
  listChevron: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.brandDeep,
  },
  progressRow: {
    flexDirection: "row",
    gap: 10,
  },
  progressTile: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceOrange,
    paddingHorizontal: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(202,116,73,0.28)",
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: theme.colors.brandDeep,
    textAlign: "center",
  },
  progressValue: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: "900",
    color: theme.colors.brandDeep,
    textAlign: "center",
  },
});
