import { useMemo, useState } from "react";
import {
  Modal,
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

export type SavedRouteStartPreset = {
  routeId: string;
  routeName: string;
  distance: string;
  time: string;
  routeShape: RouteShape;
  tags: string[];
  safetyFeatureIds: string[];
};

type RoutesScreenProps = {
  onStartRoute: (route: SavedRouteStartPreset) => void;
  onAlertPress: () => void;
};

type RouteShape = "oneWay" | "loop";

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
        name: "River Parks Morning Walk",
        distance: "2.1 mi",
        time: "42 min",
        rating: "4.8",
        reviews: "18 reviews",
        snippet: "Easy to follow along Riverside and feels calm before work.",
        tags: ["Well Lit", "Low Traffic", "Easy Pace"],
      },
      {
        id: "saved-park-loop",
        name: "Gathering Place Loop",
        distance: "3.0 mi",
        time: "58 min",
        rating: "4.7",
        reviews: "26 reviews",
        snippet: "Open paths, clear signage, and lots of visibility through the park.",
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
        name: "Gathering Place Riverwalk",
        distance: "2.8 mi",
        time: "51 min",
        rating: "4.6",
        reviews: "32 reviews",
        snippet: "Well lit and great for evening walks near the river.",
        tags: ["Well Lit", "Moderate Crowd", "Smooth Path"],
      },
      {
        id: "popular-downtown",
        name: "Blue Dome Out-and-Back",
        distance: "1.9 mi",
        time: "36 min",
        rating: "4.5",
        reviews: "24 reviews",
        snippet: "Busy enough to feel comfortable but still easy to pace through downtown Tulsa.",
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
        name: "Turkey Mountain Lower Trail",
        distance: "4.2 mi",
        time: "1 hr 12 min",
        rating: "4.9",
        reviews: "41 reviews",
        snippet: "A trusted Tulsa favorite with a route people know well and return to often.",
        tags: ["Well Lit", "Trusted", "Low Traffic"],
      },
      {
        id: "reviewed-campus",
        name: "Utica Square Connector",
        distance: "2.4 mi",
        time: "44 min",
        rating: "4.7",
        reviews: "29 reviews",
        snippet: "A good mix of visibility, people around, and easy-to-follow Tulsa landmarks.",
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
        name: "Swan Lake Circuit",
        distance: "1.6 mi",
        time: "31 min",
        rating: "4.4",
        reviews: "15 reviews",
        snippet: "Short, scenic, and simple when you want something close in midtown Tulsa.",
        tags: ["Nearby", "Scenic", "Light Traffic"],
      },
      {
        id: "nearby-market",
        name: "Cherry Street Loop",
        distance: "2.0 mi",
        time: "38 min",
        rating: "4.3",
        reviews: "12 reviews",
        snippet: "Useful for quick daytime walks with plenty of activity and cafes nearby.",
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

const quickFilters = ["Well Lit", "Low Traffic", "Nearby", "Popular"] as const;
const availableRouteTags = [
  "Well Lit",
  "Low Traffic",
  "Busy Area",
  "Scenic",
  "Nearby",
  "Quick Route",
  "Easy Pace",
  "Moderate Crowd",
  "Open Views",
  "Smooth Path",
  "Trusted",
  "Easy Navigation",
  "Daytime Friendly",
  "Evening Friendly",
  "Family Friendly",
  "Stroller Friendly",
  "Landmark Rich",
  "Park Access",
  "Sidewalk Route",
  "Loop Route",
] as const;
const savedRouteRecapDefaults: Record<
  string,
  {
    routeShape: RouteShape;
    safetyFeatureIds: string[];
    journeyMode: "Solo" | "Group";
    startLocation: string;
  }
> = {
  "saved-morning-walk": {
    routeShape: "loop",
    safetyFeatureIds: ["off-route", "check-ins"],
    journeyMode: "Solo",
    startLocation: "River Parks Trail, Tulsa",
  },
  "saved-park-loop": {
    routeShape: "loop",
    safetyFeatureIds: ["off-route", "missed-check-in", "emergency"],
    journeyMode: "Group",
    startLocation: "Gathering Place, Tulsa",
  },
};

export function RoutesScreen({
  onStartRoute,
}: RoutesScreenProps) {
  const [searchValue, setSearchValue] = useState("");
  const [savedRouteIds, setSavedRouteIds] = useState<string[]>(
    routeSections[0].routes.map((route) => route.id),
  );
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const [routeNames, setRouteNames] = useState<Record<string, string>>({});
  const [routeReviews, setRouteReviews] = useState<Record<string, string>>({});
  const [routeTags, setRouteTags] = useState<Record<string, string[]>>({});
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState("");
  const [editingReviewValue, setEditingReviewValue] = useState("");
  const [editingTagsValue, setEditingTagsValue] = useState<string[]>([]);
  const [isTagPickerOpen, setIsTagPickerOpen] = useState(false);
  const [editingRouteShapeValue, setEditingRouteShapeValue] =
    useState<RouteShape>("oneWay");
  const [editingSafetySettingsValue, setEditingSafetySettingsValue] = useState<string[]>([]);
  const [editingGroupJourneyValue, setEditingGroupJourneyValue] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  const filteredSections = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    const quickFilter = activeQuickFilter?.toLowerCase() ?? "";
    const hasQuickFilter = quickFilter.length > 0;

    if (!query && !hasQuickFilter) {
      return routeSections;
    }

    return routeSections
      .map((section) => ({
        ...section,
        routes: section.routes.filter((route) => {
          const routeName = routeNames[route.id] ?? route.name;
          const routeReview = routeReviews[route.id] ?? route.snippet;
          const tags = routeTags[route.id] ?? route.tags;
          const searchableText = [
            routeName,
            routeReview,
            route.distance,
            route.time,
            ...tags,
          ]
            .join(" ")
            .toLowerCase();

          const matchesSearch = query ? searchableText.includes(query) : true;
          const matchesQuickFilter = hasQuickFilter
            ? tags.join(" ").toLowerCase().includes(quickFilter)
            : true;

          return matchesSearch && matchesQuickFilter;
        }),
      }))
      .filter((section) => section.routes.length > 0);
  }, [searchValue, activeQuickFilter, routeNames, routeReviews, routeTags]);

  const savedSection = filteredSections.find((section) => section.key === "saved");
  const otherSections = filteredSections.filter((section) => section.key !== "saved");
  const selectedRoute =
    editingRouteId === null
      ? null
      : routeSections
          .flatMap((section) => section.routes)
          .find((route) => route.id === editingRouteId) ?? null;

  function toggleSavedRoute(routeId: string) {
    setSavedRouteIds((current) =>
      current.includes(routeId)
        ? current.filter((id) => id !== routeId)
        : [...current, routeId],
    );
  }

  function removeFromSaved(routeId: string) {
    setSavedRouteIds((current) => current.filter((id) => id !== routeId));
    cancelEditingRoute();
  }

  function toggleQuickFilter(filter: string) {
    setActiveQuickFilter((current) => (current === filter ? null : filter));
  }

  function startEditingRoute(route: RouteItem) {
    const recapDefaults = savedRouteRecapDefaults[route.id];
    setEditingRouteId(route.id);
    setEditingNameValue(routeNames[route.id] ?? route.name);
    setEditingReviewValue(routeReviews[route.id] ?? route.snippet);
    setEditingTagsValue(routeTags[route.id] ?? route.tags);
    setEditingRouteShapeValue(recapDefaults?.routeShape ?? "oneWay");
    setEditingSafetySettingsValue(recapDefaults?.safetyFeatureIds ?? []);
    setEditingGroupJourneyValue(recapDefaults?.journeyMode === "Group");
    setIsEditingName(false);
    setIsTagPickerOpen(false);
  }

  function cancelEditingRoute() {
    setEditingRouteId(null);
    setEditingNameValue("");
    setEditingReviewValue("");
    setEditingTagsValue([]);
    setEditingRouteShapeValue("oneWay");
    setEditingSafetySettingsValue([]);
    setEditingGroupJourneyValue(false);
    setIsEditingName(false);
    setIsTagPickerOpen(false);
  }

  function saveRouteName(route: RouteItem) {
    const trimmedName = editingNameValue.trim();
    const trimmedReview = editingReviewValue.trim();

    if (!trimmedName || !trimmedReview || editingTagsValue.length === 0) {
      cancelEditingRoute();
      return;
    }

    setRouteNames((current) => ({
      ...current,
      [route.id]: trimmedName,
    }));
    setRouteReviews((current) => ({
      ...current,
      [route.id]: trimmedReview,
    }));
    setRouteTags((current) => ({
      ...current,
      [route.id]: editingTagsValue,
    }));
    cancelEditingRoute();
  }

  function toggleEditingTag(tag: string) {
    setEditingTagsValue((current) =>
      current.includes(tag)
        ? current.filter((currentTag) => currentTag !== tag)
        : [...current, tag],
    );
  }

  function buildStartPreset(route: RouteItem): SavedRouteStartPreset {
    return {
      routeId: route.id,
      routeName: routeNames[route.id] ?? route.name,
      distance: route.distance,
      time: route.time,
      routeShape: savedRouteRecapDefaults[route.id]?.routeShape ?? "oneWay",
      tags: routeTags[route.id] ?? route.tags,
      safetyFeatureIds: savedRouteRecapDefaults[route.id]?.safetyFeatureIds ?? [],
    };
  }

  function renderSection(section: (typeof routeSections)[number]) {
    return (
      <View key={section.key} style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
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
          {section.routes.map((route) => {
            const isSaved = savedRouteIds.includes(route.id);
            const canEditRoute = section.key === "saved";
            const routeName = routeNames[route.id] ?? route.name;
            const routeReview = routeReviews[route.id] ?? route.snippet;
            const tags = routeTags[route.id] ?? route.tags;

            return (
              <View key={route.id} style={styles.routeCard}>
                <View style={styles.routeCardTopRow}>
                  <View style={styles.routeCopy}>
                    <Text style={styles.routeName}>{routeName}</Text>
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

                <View style={styles.reviewRow}>
                  <Text style={styles.reviewRating}>
                    ★ {route.rating} ({route.reviews})
                  </Text>
                </View>
                <Text style={styles.reviewSnippet}>“{routeReview}”</Text>

                <View style={styles.tagRow}>
                  {tags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.cardActions}>
                  <Pressable
                    onPress={() =>
                      canEditRoute
                        ? startEditingRoute(route)
                        : toggleSavedRoute(route.id)
                    }
                    style={styles.secondaryAction}
                  >
                    <Text style={styles.secondaryActionText}>
                      {canEditRoute ? "Edit" : isSaved ? "Saved" : "Save"}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => onStartRoute(buildStartPreset(route))}
                    style={styles.primaryAction}
                  >
                    <Text style={styles.primaryActionText}>Start Route</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      </View>
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
        <View style={styles.pageIntro}>
          <Text style={styles.pageEyebrow}>Explore</Text>
          <Text style={styles.pageTitle}>Routes</Text>
          <Text style={styles.pageSubtitle}>
            Find a route that feels comfortable, safe, and right for your day.
          </Text>
        </View>

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

        <View style={styles.filterRow}>
          {quickFilters.map((filter) => {
            const selected = activeQuickFilter === filter;

            return (
              <Pressable
                key={filter}
                onPress={() => toggleQuickFilter(filter)}
                style={[
                  styles.filterPill,
                  selected && styles.filterPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    selected && styles.filterPillTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {savedSection ? (
          <View style={styles.topSectionWrap}>
            {renderSection(savedSection)}
          </View>
        ) : null}

        {otherSections.length > 0 ? (
          <View style={styles.moreSectionWrap}>
            <Text style={styles.moreSectionTitle}>More Routes</Text>
            {otherSections.map(renderSection)}
          </View>
        ) : null}

        {filteredSections.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No routes match that search</Text>
            <Text style={styles.emptyText}>
              Try a route name, neighborhood, or tag like well lit.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <Modal
        visible={selectedRoute !== null}
        transparent
        animationType="fade"
        onRequestClose={cancelEditingRoute}
      >
        {selectedRoute ? (
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <LinearGradient
                colors={["#CFE17A", "#AFCB46"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.modalReadyCard}
              >
                <View style={styles.modalHeader}>
                  <View style={styles.modalHeaderCopy}>
                    <Text style={styles.modalReadyEyebrow}>Ready to start?</Text>
                    {isEditingName ? (
                      <TextInput
                        value={editingNameValue}
                        onChangeText={setEditingNameValue}
                        placeholder="Route name"
                        placeholderTextColor="rgba(79,90,34,0.52)"
                        style={styles.modalReadyTitleInput}
                        autoFocus
                      />
                    ) : (
                      <Text style={styles.modalReadyTitle}>
                        {routeNames[selectedRoute.id] ?? selectedRoute.name}
                      </Text>
                    )}
                    <Text style={styles.modalReadyMeta}>
                      {selectedRoute.distance} • {selectedRoute.time} •{" "}
                      {editingRouteShapeValue === "loop" ? "Loop" : "One-way"}
                    </Text>
                  </View>
                  <Pressable
                    onPress={cancelEditingRoute}
                    style={styles.modalCloseButton}
                  >
                    <Text style={styles.modalCloseText}>×</Text>
                  </Pressable>
                </View>

                <View style={styles.modalReadySummaryRow}>
                  {[
                    editingGroupJourneyValue ? "Group journey" : "Solo journey",
                    editingGroupJourneyValue ? "2 trusted contacts" : "2 trusted contacts",
                    `${editingSafetySettingsValue.length}/4 safety settings`,
                  ].map((item, index, list) => (
                    <View key={item} style={styles.modalReadySummaryItem}>
                      <Text style={styles.modalReadySummaryText}>{item}</Text>
                      {index < list.length - 1 ? (
                        <Text style={styles.modalReadySummaryDot}>•</Text>
                      ) : null}
                    </View>
                  ))}
                </View>
              </LinearGradient>

              <View style={styles.modalLocationCard}>
                <View>
                  <Text style={styles.modalLocationLabel}>Location</Text>
                  <Text style={styles.modalLocationValue}>
                    {savedRouteRecapDefaults[selectedRoute.id]?.startLocation ??
                      "Current location"}
                  </Text>
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Route Tags</Text>
                <Text style={styles.modalHelperText}>
                  Choose the tags that best describe this saved route.
                </Text>
                <Pressable
                  onPress={() => setIsTagPickerOpen((current) => !current)}
                  style={styles.tagDropdownButton}
                >
                  <Text style={styles.tagDropdownButtonText}>
                    {isTagPickerOpen ? "Hide tag options" : "Choose route tags"}
                  </Text>
                  <Text style={styles.tagDropdownChevron}>
                    {isTagPickerOpen ? "⌃" : "⌄"}
                  </Text>
                </Pressable>
                {isTagPickerOpen ? (
                  <ScrollView
                    style={styles.modalTagList}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                  >
                    {availableRouteTags.map((tag) => {
                      const selected = editingTagsValue.includes(tag);

                      return (
                        <Pressable
                          key={tag}
                          onPress={() => toggleEditingTag(tag)}
                          style={[
                            styles.modalTagListItem,
                            selected && styles.modalTagListItemSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.modalTagListItemText,
                              selected && styles.modalTagListItemTextSelected,
                            ]}
                          >
                            {tag}
                          </Text>
                          <Text
                            style={[
                              styles.modalTagListItemCheck,
                              selected && styles.modalTagListItemCheckSelected,
                            ]}
                          >
                            {selected ? "Selected" : "Add"}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                ) : null}
                {!isTagPickerOpen ? (
                  <View style={styles.tagRow}>
                    {editingTagsValue.map((tag) => (
                      <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>

              <View style={styles.modalActions}>
                <Pressable
                  onPress={() => setIsEditingName((current) => !current)}
                  style={styles.secondaryAction}
                >
                  <Text style={styles.secondaryActionText}>
                    {isEditingName ? "Done" : "Edit"}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => saveRouteName(selectedRoute)}
                  style={styles.primaryAction}
                >
                  <Text style={styles.primaryActionText}>Save Changes</Text>
                </Pressable>
              </View>
              <Pressable
                onPress={() => removeFromSaved(selectedRoute.id)}
                style={styles.removeSavedButton}
              >
                <Text style={styles.removeSavedButtonText}>Remove from Saved</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </Modal>
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
    paddingTop: 28,
    paddingBottom: 180,
    gap: 18,
  },
  pageIntro: {
    gap: 6,
  },
  pageEyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: theme.colors.textMuted,
  },
  pageTitle: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900",
    color: theme.colors.text,
  },
  pageSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.textSoft,
    maxWidth: 320,
  },
  searchShell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 24,
    backgroundColor: "rgba(255,250,247,0.96)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  searchIcon: {
    fontSize: 18,
    color: theme.colors.textMuted,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
    paddingVertical: 0,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterPill: {
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,250,247,0.96)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  filterPillActive: {
    backgroundColor: "rgba(241,176,120,0.22)",
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.text,
  },
  filterPillTextActive: {
    color: theme.colors.brandDeep,
  },
  section: {
    gap: 14,
  },
  topSectionWrap: {
    gap: 14,
  },
  moreSectionWrap: {
    gap: 18,
    paddingTop: 8,
  },
  moreSectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: theme.colors.textMuted,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "800",
    color: theme.colors.text,
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: theme.colors.textSoft,
  },
  sectionBadge: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.white,
  },
  routeList: {
    gap: 12,
  },
  routeCard: {
    borderRadius: 28,
    backgroundColor: "rgba(255,252,249,0.98)",
    padding: 18,
    gap: 12,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
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
  routeNameInput: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "700",
    color: theme.colors.text,
    borderRadius: 18,
    backgroundColor: "rgba(255,250,247,0.96)",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  routeMeta: {
    marginTop: 4,
    fontSize: 14,
    color: theme.colors.textSoft,
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonActive: {
    backgroundColor: "rgba(241,176,120,0.2)",
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
    fontWeight: "800",
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
    backgroundColor: "#AFCB46",
    borderWidth: 1,
    borderColor: "#92A93A",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2F3615",
  },
  cardActions: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryAction: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceSoft,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
  primaryAction: {
    flex: 1.3,
    borderRadius: 20,
    backgroundColor: theme.colors.brand,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  primaryActionText: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.white,
  },
  removeSavedButton: {
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: theme.colors.ink,
    borderWidth: 1,
    borderColor: theme.colors.ink,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
  },
  removeSavedButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.white,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(78,67,68,0.34)",
  },
  modalCard: {
    borderRadius: 30,
    backgroundColor: "#FFFDFB",
    padding: 24,
    gap: 16,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.14,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  modalHeaderCopy: {
    flex: 1,
    gap: 4,
  },
  modalReadyCard: {
    borderRadius: 30,
    padding: 24,
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(86,97,38,0.14)",
    shadowColor: "#92A93A",
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  modalReadyEyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: "rgba(86,97,38,0.82)",
  },
  modalReadyTitle: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "900",
    color: "#4F5A22",
  },
  modalReadyMeta: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    color: "rgba(79,90,34,0.74)",
  },
  modalReadyTitleInput: {
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.4)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(79,90,34,0.18)",
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "900",
    color: "#4F5A22",
  },
  modalCloseButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(79,90,34,0.1)",
    borderWidth: 1,
    borderColor: "rgba(79,90,34,0.12)",
  },
  modalCloseText: {
    fontSize: 20,
    lineHeight: 22,
    color: "#566126",
  },
  modalReadySummaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
    marginTop: 2,
  },
  modalReadySummaryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalReadySummaryDot: {
    fontSize: 16,
    color: "#566126",
  },
  modalReadySummaryText: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(79,90,34,0.88)",
  },
  modalSection: {
    gap: 10,
    borderRadius: 22,
    backgroundColor: "rgba(247,240,234,0.78)",
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(223,202,188,0.9)",
  },
  modalSectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.text,
  },
  modalLocationCard: {
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceOrangeDeep,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(202,116,73,0.3)",
  },
  modalLocationLabel: {
    fontSize: 13,
    color: "rgba(111,72,46,0.86)",
    fontWeight: "700",
  },
  modalLocationValue: {
    marginTop: 3,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "900",
    color: theme.colors.text,
  },
  modalReviewRating: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.brandDeep,
  },
  reviewInput: {
    minHeight: 96,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#D8C0B0",
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.text,
  },
  modalHelperText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#625556",
  },
  tagDropdownButton: {
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8C0B0",
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tagDropdownButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.text,
  },
  tagDropdownChevron: {
    fontSize: 16,
    color: theme.colors.textSoft,
  },
  modalTagList: {
    maxHeight: 220,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D8C0B0",
    backgroundColor: "#FFFFFF",
  },
  modalTagListItem: {
    paddingHorizontal: 14,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(78,67,68,0.08)",
  },
  modalTagListItemSelected: {
    backgroundColor: "#AFCB46",
  },
  modalTagListItemText: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
  },
  modalTagListItemCheck: {
    fontSize: 11,
    fontWeight: "800",
    color: theme.colors.textSoft,
    textTransform: "uppercase",
  },
  modalTagListItemCheckSelected: {
    color: "#2F3615",
  },
  modalTagListItemTextSelected: {
    color: "#2F3615",
  },
  modalText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textSoft,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  emptyState: {
    borderRadius: 28,
    backgroundColor: "rgba(255,252,249,0.98)",
    padding: 22,
    alignItems: "center",
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
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
  },
});
