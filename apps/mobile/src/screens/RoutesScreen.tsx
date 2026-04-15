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
  // all the saved / popular / reviewed / nearby route data
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

    if (!query) return routeSections;

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
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* SEARCH */}
        <View style={styles.searchShell}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            value={searchValue}
            onChangeText={setSearchValue}
            placeholder="Search routes, areas, or safety tags"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.searchInput}
          />
        </View>

        {/* SECTIONS */}
        {filteredSections.map((section) => (
          <View key={section.key} style={styles.section}>
            
            {/* HEADER */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
              </View>

              <LinearGradient
                colors={sectionAccent[section.key]}
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

            {/* ROUTES */}
            <View style={styles.routeList}>
              {section.routes.map((route) => {
                const isSaved = savedRouteIds.includes(route.id);

                return (
                  <View key={route.id} style={styles.routeCard}>
                    
                    <View style={styles.routeCardTopRow}>
                      <View style={styles.routeCopy}>
                        <Text style={styles.routeName}>{route.name}</Text>
                        <Text style={styles.routeMeta}>
                          {route.distance} • {route.time}
                        </Text>
                      </View>

                      <Pressable
                        onPress={() => toggleSavedRoute(route.id)}
                        style={[
                          styles.saveButton,
                          isSaved && styles.saveButtonActive,
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

                    <Text style={styles.reviewRating}>
                      ★ {route.rating} ({route.reviews})
                    </Text>

                    <Text style={styles.reviewSnippet}>
                      “{route.snippet}”
                    </Text>

                    <View style={styles.tagRow}>
                      {route.tags.map((tag) => (
                        <View key={tag} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.cardActions}>
                      <Pressable style={styles.secondaryAction}>
                        <Text style={styles.secondaryActionText}>
                          {isSaved ? "Saved" : "Save"}
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={onStartRoute}
                        style={styles.primaryAction}
                      >
                        <Text style={styles.primaryActionText}>
                          Start Route
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 180,
    gap: 18,
  },

  // SEARCH UPGRADE
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

  searchIcon: {
    fontSize: 18,
    color: theme.colors.textMuted,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },

  section: { gap: 12 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.text,
  },

  sectionSubtitle: {
    fontSize: 13,
    color: theme.colors.textSoft,
    opacity: 0.8,
  },

  sectionBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  sectionBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },

  routeList: { gap: 12 },

  // CARD UPGRADE
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

  routeCardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  routeCopy: { flex: 1 },

  routeName: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.text,
  },

  routeMeta: {
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

  saveButtonIcon: {
    color: theme.colors.textMuted,
  },

  saveButtonIconActive: {
    color: theme.colors.brand,
  },

  reviewRating: {
    fontWeight: "700",
    color: theme.colors.brandDeep,
  },

  reviewSnippet: {
    color: theme.colors.textSoft,
  },

  // TAG FIX
  tag: {
    backgroundColor: "rgba(175,203,70,0.15)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  tagText: {
    fontSize: 12,
    color: "#4F5A22",
  },

  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  cardActions: {
    flexDirection: "row",
    gap: 10,
  },

  secondaryAction: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.04)",
    paddingVertical: 14,
    alignItems: "center",
  },

  primaryAction: {
    flex: 1.3,
    borderRadius: 20,
    backgroundColor: theme.colors.brand,
    paddingVertical: 14,
    alignItems: "center",
  },

  primaryActionText: {
    color: "#fff",
    fontWeight: "800",
  },

  secondaryActionText: {
    color: theme.colors.text,
    fontWeight: "600",
  },
});