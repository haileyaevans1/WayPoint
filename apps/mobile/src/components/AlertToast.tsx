import { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import type { AlertTone, JourneyAlert } from "../alerts/alertData";
import { theme } from "../styles/theme";

type AlertToastProps = {
  alert: JourneyAlert;
  onDismiss: (alertId: string) => void;
  onOpenAlerts: () => void;
};

const toneStyles: Record<
  AlertTone,
  {
    indicator: string;
    statusText: string;
  }
> = {
  info: {
    indicator: theme.colors.textSoft,
    statusText: theme.colors.textSoft,
  },
  warning: {
    indicator: theme.colors.accentPeach,
    statusText: theme.colors.brandDeep,
  },
  urgent: {
    indicator: theme.colors.accentCoral,
    statusText: theme.colors.brandDeep,
  },
  safe: {
    indicator: theme.colors.accentLime,
    statusText: theme.colors.text,
  },
};

export function AlertToast({
  alert,
  onDismiss,
  onOpenAlerts,
}: AlertToastProps) {
  const slideY = useRef(new Animated.Value(-32)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const tone = toneStyles[alert.tone];
  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, slideY, alert.id]);

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <Animated.View
        style={[
          styles.animatedWrap,
          { opacity, transform: [{ translateY: slideY }] },
        ]}
      >
        <Pressable onPress={onOpenAlerts} style={styles.card}>
          <View style={styles.topRow}>
            <View style={styles.copyWrap}>
              <View style={styles.metaRow}>
                <View
                  style={[styles.statusDot, { backgroundColor: tone.indicator }]}
                />
                <Text style={[styles.statusLabel, { color: tone.statusText }]}>
                  {alert.statusLabel}
                </Text>
              </View>
              <Text style={styles.title}>{alert.title}</Text>
              <Text numberOfLines={1} style={styles.message}>
                {alert.message}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => onDismiss(alert.id)}
              style={styles.closeButton}
            >
              <Feather name="x" size={16} color={theme.colors.textMuted} />
            </Pressable>
          </View>

          <View style={styles.bottomRow}>
            <Pressable onPress={onOpenAlerts} style={styles.primaryAction}>
              <Text style={styles.primaryActionText}>Check in</Text>
            </Pressable>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 12,
    left: 16,
    right: 16,
    zIndex: 50,
  },
  animatedWrap: {
    width: "100%",
  },
  card: {
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: 12,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  topRow: {
    flexDirection: "row",
    gap: 12,
  },
  copyWrap: {
    flex: 1,
    minWidth: 0,
    gap: 4,
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
  statusLabel: {
    fontSize: 12,
    fontWeight: "800",
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.text,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textSoft,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomRow: {
    flexDirection: "row",
  },
  primaryAction: {
    borderRadius: 18,
    backgroundColor: theme.colors.brand,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  primaryActionText: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.colors.white,
  },
});
