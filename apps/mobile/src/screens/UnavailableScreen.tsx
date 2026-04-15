import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../styles/theme";

type UnavailableScreenProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function UnavailableScreen({
  title,
  message,
  actionLabel = "Back to Home",
  onActionPress,
}: UnavailableScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Temporarily unavailable</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        {onActionPress ? (
          <Pressable
            accessibilityRole="button"
            onPress={onActionPress}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonLabel}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "900",
    color: theme.colors.text,
  },
  message: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.textSoft,
  },
  button: {
    marginTop: theme.spacing.lg,
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.brand,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.white,
  },
});
