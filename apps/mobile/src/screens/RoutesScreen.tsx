import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../styles/theme";

type RouteSectionKey = "saved" | "popular" | "reviewed" | "nearby";

type RouteItem = {
  id: string;
  name: string;
  distance: string;
  time: string;
  rating: string;
  reviews: string;
  snippet: string;
  tags: string[];
};

type RoutesScreenProps = {
  onStartRoute: () => void;
  onAlertPress: () => void;
};

const routeSections: Array<{
  key: RouteSectionKey;
  title: string;
  subtitle: string;
  routes: RouteItem[];
}> = [
  {
    key: "saved",
    title: "Saved Routes",
    subtitle: "Your go-to paths",
    routes: [
      {
        id: "saved-morning-walk",
        name: "Morning Walk",
        distance: "2.1 mi",
        time: "42 min",
        rating: "4.8",
        reviews: "18 reviews",
        snippet: "Easy to follow and feels calm before work.",
        tags: ["Well Lit", "Low Traffic", "Easy Pace"],
      },
      {
        id: "saved-park-loop",
        name: "Park Loop",
        distance: "3.0 mi",
        time: "58 min",
        rating: "4.7",
        reviews: "26 reviews",
        snippet: "Open paths and lots of visibility the whole way.",
        tags: ["Open Views", "Popular", "Moderate Crowd"],
      },
    ],
  },
  {
    key: "popular",
    title: "Popular Routes",
    subtitle: "Quick picks people love",
    routes: [
      {
        id: "popular-riverwalk",
        name: "Riverwalk Loop",
        distance: "2.8 mi",
        time: "51 min",
        rating: "4.6",
        reviews: "32 reviews",
        snippet: "Well lit and great for evening walks.",
        tags: ["Well Lit", "Moderate Crowd", "Smooth Path"],
      },
      {
        id: "popular-downtown",
        name: "Downtown Out-and-Back",
        distance: "1.9 mi",
        time: "36 min",
        rating: "4.5",
        reviews: "24 reviews",
        snippet: "Busy enough to feel comfortable but still easy to pace.",
        tags: ["Busy Area", "Shops Nearby", "Quick Route"],
      },
    ],
  },
  {
    key: "reviewed",
    title: "Reviewed Routes",
    subtitle: "Most trusted by the community",
    routes: [
      {
        id: "reviewed-greenway",
        name: "Greenway Path",
        distance: "4.2 mi",
        time: "1 hr 12 min",
        rating: "4.9",
        reviews: "41 reviews",
        snippet: "Feels safe even after sunset because the lighting is consistent.",
        tags: ["Well Lit", "Trusted", "Low Traffic"],
      },
      {
        id: "reviewed-campus",
        name: "Campus Connector",
        distance: "2.4 mi",
        time: "44 min",
        rating: "4.7",
        reviews: "29 reviews",
        snippet: "A good mix of visibility, people around, and easy landmarks.",
        tags: ["Landmarks", "Moderate Crowd", "Easy Navigation"],
      },
    ],
  },
  {
    key: "nearby",
    title: "Nearby Routes",
    subtitle: "Good options close to you",
    routes: [
      {
        id: "nearby-lake",
        name: "Lakeside Route",
        distance: "1.6 mi",
        time: "31 min",
        rating: "4.4",
        reviews: "15 reviews",
        snippet: "Short, scenic, and simple when you want something close.",
        tags: ["Nearby", "Scenic", "Light Traffic"],
      },
      {
        id: "nearby-market",
        name: "Market Street Loop",
        distance: "2.0 mi",
        time: "38 min",
        rating: "4.3",
        reviews: "12 reviews",
        snippet: "Useful for quick daytime walks with plenty of activity nearby.",
        tags: ["Daytime", "Busy Area", "Quick Route"],
      },
    ],
  },
];

const sectionAccent: Record<RouteSectionKey, [string, string]> = {
  saved: ["#F7D9C9", "#F1B08F"],
  popular: ["#F4B37E", "#E48C57"],
  reviewed: ["#D8E59C", "#B9CD62"],
  nearby: ["#D8E5F2", "#B5CBE6"],
};

export function RoutesScreen({
  onStartRoute,
}: RoutesScreenProps) {
  const [searchValue, setSearchValue] = useState("");
  const [savedRouteIds, setSavedRouteIds] = useState<string[]>(
    routeSections[0].routes.map((route) => route.id),
  );

  const filteredSections = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return routeSections;
    }

    return routeSections
      .map((section) => ({
        ...section,
        routes: section.routes.filter((route) =>
          [
            route.name,
            route.snippet,
            route.distance,
            route.time,
            ...route.tags,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query),
        ),
      }))
      .filter((section) => section.routes.length > 0);
  }, [searchValue]);

  function toggleSavedRoute(routeId: string) {
    setSavedRouteIds((current) =>
      current.includes(routeId)
        ? current.filter((id) => id !== routeId)
        : [...current, routeId],
    );
  }

  return (
    <LinearGradient
      colors={[theme.colors.background, "#F2E8DD", theme.colors.backgroundDeep]}
      locations={[0, 0.48, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={({ pressed }) => [
            styles.searchShell,
            pressed && styles.searchShellPressed,
          ]}
        >
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            value={searchValue}
            onChangeText={setSearchValue}
            placeholder="Search routes, areas, or safety tags"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.searchInput}
          />
        </Pressable>

        {filteredSections.map((section) => (
          <View key={section.key} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleWrap}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
              </View>

              <LinearGradient
                colors={sectionAccent[section.key]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sectionBadge}
              >
                <Text style={styles.sectionBadgeText}>
                  {section.key === "reviewed"
                    ? "Top rated"
                    : section.key === "nearby"
                      ? "Near you"
                      : section.key === "saved"
                        ? "Personal"
                        : "Trending"}
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.routeList}>
              {section.routes.map((route, index) => {
                const isSaved = savedRouteIds.includes(route.id);
                const isFeatured = index === 0;

                return (
                  <Pressable
                    key={route.id}
                    style={({ pressed }) => [
                      styles.routeCard,
                      isFeatured && styles.routeCardFeatured,
                      pressed && styles.routeCardPressed,
                    ]}
                  >
                    {isFeatured ? (
                      <View style={styles.featuredPill}>
                        <Text style={styles.featuredPillText}>Recommended</Text>
                      </View>
                    ) : null}

                    <View style={styles.routeCardTopRow}>
                      <View style={styles.routeCopy}>
                        <Text style={styles.routeName}>{route.name}</Text>
                        <Text style={styles.routeMeta}>
                          {route.distance} • {route.time}
                        </Text>
                      </View>

                      <Pressable
                        onPress={() => toggleSavedRoute(route.id)}
                        style={({ pressed }) => [
                          styles.saveButton,
                          isSaved && styles.saveButtonActive,
                          pressed && styles.saveButtonPressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.saveButtonIcon,
                            isSaved && styles.saveButtonIconActive,
                          ]}
                        >
                          ♥
                        </Text>
                      </Pressable>
                    </View>

                    <View style={styles.reviewRow}>
                      <Text style={styles.reviewRating}>
                        ★ {route.rating} ({route.reviews})
                      </Text>
                    </View>

                    <Text style={styles.reviewSnippet}>“{route.snippet}”</Text>

                    <View style={styles.tagRow}>
                      {route.tags.map((tag) => (
                        <View key={tag} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.cardActions}>
                      <Pressable
                        onPress={() => toggleSavedRoute(route.id)}
                        style={({ pressed }) => [
                          styles.secondaryAction,
                          pressed && styles.secondaryActionPressed,
                        ]}
                      >
                        <Text style={styles.secondaryActionText}>
                          {isSaved ? "Saved" : "Save"}
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={onStartRoute}
                        style={({ pressed }) => [
                          styles.primaryAction,
                          pressed && styles.primaryActionPressed,
                        ]}
                      >
                        <Text style={styles.primaryActionText}>Start Route</Text>
                      </Pressable>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}

        {filteredSections.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No routes match that search</Text>
            <Text style={styles.emptyText}>
              Try a route name, neighborhood, or tag like well lit.
            </Text>
          </View>
        ) : null}
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
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 180,
    gap: 22,
  },
  searchShell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  searchShellPressed: {
    transform: [{ scale: 0.995 }],
  },
  searchIcon: {
    fontSize: 18,
    color: theme.colors.textMuted,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    paddingVertical: 0,
  },
  section: {
    gap: 14,
    paddingTop: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionTitleWrap: {
    flex: 1,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "800",
    color: theme.colors.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: theme.colors.textSoft,
    opacity: 0.8,
  },
  sectionBadge: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    opacity: 0.92,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.white,
  },
  routeList: {
    gap: 14,
  },
  routeCard: {
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    padding: 18,
    gap: 12,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  routeCardFeatured: {
    borderWidth: 1,
    borderColor: "rgba(241,176,120,0.28)",
    shadowOpacity: 0.16,
  },
  routeCardPressed: {
    transform: [{ scale: 0.99 }],
  },
  featuredPill: {
    alignSelf: "flex-start",
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(241,176,120,0.16)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 2,
  },
  featuredPillText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.4,
    color: theme.colors.brandDeep,
  },
  routeCardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  routeCopy: {
    flex: 1,
    minWidth: 0,
  },
  routeName: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "800",
    color: theme.colors.text,
  },
  routeMeta: {
    marginTop: 4,
    fontSize: 13,
    color: theme.colors.textSoft,
    opacity: 0.8,
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonActive: {
    backgroundColor: "rgba(241,176,120,0.25)",
  },
  saveButtonPressed: {
    transform: [{ scale: 0.94 }],
  },
  saveButtonIcon: {
    fontSize: 16,
    color: theme.colors.textMuted,
  },
  saveButtonIconActive: {
    color: theme.colors.brand,
  },
  reviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reviewRating: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.brandDeep,
  },
  reviewSnippet: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textSoft,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(175,203,70,0.15)",
    borderWidth: 1,
    borderColor: "rgba(146,169,58,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4F5A22",
  },
  cardActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 2,
  },
  secondaryAction: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.04)",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  secondaryActionPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  primaryAction: {
    flex: 1.3,
    borderRadius: 20,
    backgroundColor: theme.colors.brand,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    shadowColor: theme.colors.brand,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  primaryActionPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  primaryActionText: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.white,
  },
  emptyState: {
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    padding: 24,
    alignItems: "center",
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.text,
  },
  emptyText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: theme.colors.textSoft,
    opacity: 0.85,
  },
});