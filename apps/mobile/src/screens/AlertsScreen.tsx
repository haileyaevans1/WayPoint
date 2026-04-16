import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { AlertAction, AlertTone, JourneyAlert } from "../alerts/alertData";
import { theme } from "../styles/theme";

type AlertsScreenProps = {
  alerts: JourneyAlert[];
  onAlertAction: (alertId: string, action: AlertAction) => void;
  onDismissAlert: (alertId: string) => void;
  onClose: () => void;
};

const tonePriority: Record<AlertTone, number> = {
  urgent: 0,
  warning: 1,
  info: 2,
  safe: 3,
};

const toneIndicator: Record<AlertTone, string> = {
  urgent: theme.colors.accentCoral,
  warning: theme.colors.accentPeach,
  info: theme.colors.textSoft,
  safe: theme.colors.accentLime,
};

const activeToneIndicator: Record<AlertTone, string> = {
  urgent: theme.colors.brandBright,
  warning: theme.colors.brandBright,
  info: theme.colors.brandBright,
  safe: theme.colors.brandBright,
};

function getPrimaryAction(alert: JourneyAlert) {
  return alert.actions.find((action) => action.emphasis === "primary") ?? null;
}

function getSecondaryActions(alert: JourneyAlert) {
  const primaryAction = getPrimaryAction(alert);

  return alert.actions.filter((action) => action.id !== primaryAction?.id);
}

function isStrongSecondaryAction(action: AlertAction) {
  return action.label === "Extend time" || action.label === "Extend journey";
}

function isDualPrimaryAlert(alert: JourneyAlert) {
  return alert.type === "off-route";
}

export function AlertsScreen({
  alerts,
  onAlertAction,
  onDismissAlert,
  onClose,
}: AlertsScreenProps) {
  const visibleAlerts = alerts.filter(
    (alert) =>
      alert.type === "missed-check-in" ||
      alert.type === "off-route" ||
      alert.type === "escalation",
  );
  const orderedAlerts = [...visibleAlerts].sort(
    (left, right) => tonePriority[left.tone] - tonePriority[right.tone],
  );

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundAlt, theme.colors.surface]}
        locations={[0, 0.44, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.modalCard}
      >
        <View style={styles.headerBlock}>
          <View style={styles.pageIntroRow}>
            <View style={styles.pageIntro}>
              <Text style={styles.pageTitle}>Alerts</Text>
              <Text style={styles.pageSubtitle}>
                Quick safety updates and actions when something changes.
              </Text>
            </View>

            <Pressable style={styles.headerCloseButton} onPress={onClose}>
              <Feather name="x" size={20} color={theme.colors.text} />
            </Pressable>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Needs Attention</Text>
          </View>
        </View>

        <View style={styles.alertList}>
          <ScrollView
            style={styles.alertScroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {orderedAlerts.length > 0 ? (
              orderedAlerts.map((alert) => (
                <View key={alert.id} style={styles.alertCard}>
                  <View
                    style={[
                      styles.alertAccent,
                      { backgroundColor: toneIndicator[alert.tone] },
                    ]}
                  />

                  <View style={styles.alertContent}>
                    <View style={styles.alertTopRow}>
                      <View style={styles.alertCopy}>
                        <View style={styles.metaRow}>
                          <View
                            style={[
                              styles.statusDot,
                              { backgroundColor: activeToneIndicator[alert.tone] },
                            ]}
                          />
                          <Text style={styles.alertTimestamp}>{alert.timestamp}</Text>
                        </View>
                        <Text style={styles.alertTitle}>{alert.title}</Text>
                        <Text numberOfLines={2} style={styles.alertMessage}>
                          {alert.message}
                        </Text>
                      </View>

                      <Pressable
                        onPress={() => onDismissAlert(alert.id)}
                        style={styles.cardCloseButton}
                      >
                        <Feather name="x" size={18} color={theme.colors.brandDeep} />
                      </Pressable>
                    </View>

                    <View style={styles.alertActionRow}>
                      {isDualPrimaryAlert(alert) ? (
                        <View style={styles.splitActionRow}>
                          {getPrimaryAction(alert) ? (
                            <Pressable
                              onPress={() =>
                                onAlertAction(alert.id, getPrimaryAction(alert)!)
                              }
                              style={[styles.primaryAction, styles.splitActionButton]}
                            >
                              <Text style={styles.primaryActionText}>
                                {getPrimaryAction(alert)!.label}
                              </Text>
                            </Pressable>
                          ) : null}
                          {getSecondaryActions(alert).slice(0, 1).map((action) => (
                            <Pressable
                              key={action.id}
                              onPress={() => onAlertAction(alert.id, action)}
                              style={[
                                styles.secondaryActionStrong,
                                styles.splitActionButton,
                              ]}
                            >
                              <Text style={styles.secondaryActionTextStrong}>
                                {action.label}
                              </Text>
                            </Pressable>
                          ))}
                        </View>
                      ) : (
                        <>
                          {getPrimaryAction(alert) ? (
                            <Pressable
                              onPress={() =>
                                onAlertAction(alert.id, getPrimaryAction(alert)!)
                              }
                              style={styles.primaryAction}
                            >
                              <Text style={styles.primaryActionText}>
                                {getPrimaryAction(alert)!.label}
                              </Text>
                            </Pressable>
                          ) : null}

                          {getSecondaryActions(alert).length > 0 ? (
                            <View style={styles.secondaryActionRow}>
                              {getSecondaryActions(alert).slice(0, 2).map((action) => (
                                <Pressable
                                  key={action.id}
                                  onPress={() => onAlertAction(alert.id, action)}
                                  style={[
                                    styles.secondaryAction,
                                    isStrongSecondaryAction(action) &&
                                      styles.secondaryActionStrong,
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.secondaryActionText,
                                      isStrongSecondaryAction(action) &&
                                        styles.secondaryActionTextStrong,
                                    ]}
                                  >
                                    {action.label}
                                  </Text>
                                </Pressable>
                              ))}
                            </View>
                          ) : null}
                        </>
                      )}
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No alerts right now.</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(78,67,68,0.34)",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 28,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: "100%",
    maxHeight: "82%",
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
    elevation: 8,
  },
  headerBlock: {
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 12,
    gap: 14,
  },
  alertScroll: {
    flexGrow: 0,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 22,
    gap: 12,
  },
  pageIntroRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
  },
  pageIntro: {
    gap: 6,
    flex: 1,
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
  sectionHeader: {
    paddingTop: 2,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "800",
    color: theme.colors.text,
  },
  headerCloseButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  alertList: {
    flexShrink: 1,
    minHeight: 0,
    paddingBottom: 6,
  },
  alertCard: {
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.brand,
    borderWidth: 1,
    borderColor: theme.colors.brandDeep,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.22,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 7,
  },
  alertAccent: {
    width: 6,
    backgroundColor: theme.colors.brandBright,
  },
  alertContent: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 20,
    gap: 10,
  },
  alertTopRow: {
    flexDirection: "row",
    gap: 12,
  },
  alertCopy: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  alertTimestamp: {
    fontSize: 12,
    color: theme.colors.white,
    fontWeight: "700",
  },
  alertTitle: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "800",
    color: theme.colors.white,
  },
  alertMessage: {
    fontSize: 15,
    lineHeight: 21,
    color: theme.colors.white,
  },
  cardCloseButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.surfaceWarmDeep,
  },
  alertActionRow: {
    gap: 6,
  },
  splitActionRow: {
    flexDirection: "row",
    gap: 12,
  },
  splitActionButton: {
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryAction: {
    alignSelf: "flex-start",
    borderRadius: 18,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  primaryActionText: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.brandDeep,
  },
  secondaryActionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
  },
  secondaryAction: {
    paddingVertical: 2,
    opacity: 0.92,
  },
  secondaryActionStrong: {
    borderRadius: 18,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    opacity: 1,
  },
  secondaryActionText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.white,
  },
  secondaryActionTextStrong: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.brandDeep,
  },
  emptyState: {
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  emptyStateText: {
    fontSize: 14,
    color: theme.colors.textSoft,
  },
});
