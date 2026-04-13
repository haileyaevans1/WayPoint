import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../styles/theme";

type HeaderProps = {
  title?: string;
  subtitle?: string;
  tagline?: string;
  onAlertPress?: () => void;
};

export function Header({
  title = "WayPoint",
  subtitle = "Welcome back, Hailey",
  tagline = "Journey Smart, Journey Safe",
  onAlertPress,
}: HeaderProps) {
  const [taglineTop, taglineBottom] = tagline.split(",").map((part) => part.trim());

  return (
    <LinearGradient
      colors={[theme.colors.ink, theme.colors.inkSoft, theme.colors.brand]}
      locations={[0, 0.42, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.shell}
    >
      <View style={styles.coolWash} />
      <View style={styles.centerWash} />
      <View style={styles.warmWash} />
      <View style={styles.orangeGlow} />
      <View style={styles.orangeOrb} />
      <View style={styles.content}>
        <View style={styles.copy}>
          <Text style={styles.title} adjustsFontSizeToFit numberOfLines={1}>
            {title === "WayPoint" ? (
              <>
                <Text style={styles.titleWay}>Way</Text>
                <Text style={styles.titlePoint}>Point</Text>
              </>
            ) : (
              title
            )}
          </Text>
          <View style={styles.taglineWrap}>
            <Text style={styles.tagline}>{taglineTop || "Journey Smart"}</Text>
            <Text style={styles.tagline}>{taglineBottom || "Journey Safe"}</Text>
          </View>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <Pressable
          style={styles.alertButton}
          accessibilityRole="button"
          onPress={onAlertPress}
        >
          <Text style={styles.alertIcon}>◠</Text>
          <View style={styles.alertDot} />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: theme.colors.brandDeep,
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  orangeGlow: {
    position: "absolute",
    right: -16,
    top: -26,
    width: 172,
    height: 172,
    borderRadius: 999,
    backgroundColor: theme.colors.headerGlow,
  },
  orangeOrb: {
    position: "absolute",
    right: -26,
    top: -24,
    width: 118,
    height: 118,
    borderRadius: 999,
    backgroundColor: theme.colors.headerOrb,
  },
  coolWash: {
    position: "absolute",
    left: -54,
    top: -30,
    bottom: 0,
    width: 250,
    borderRadius: 999,
    backgroundColor: theme.colors.headerCoolWash,
  },
  centerWash: {
    position: "absolute",
    left: "30%",
    top: -28,
    width: 190,
    height: 190,
    borderRadius: 999,
    backgroundColor: theme.colors.headerCenterWash,
  },
  warmWash: {
    position: "absolute",
    right: -34,
    top: -56,
    width: 238,
    height: 238,
    borderRadius: 999,
    backgroundColor: theme.colors.headerWarmWash,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    gap: 10,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },
  taglineWrap: {
    marginTop: 6,
    alignItems: "flex-start",
    gap: 2,
  },
  title: {
    fontSize: 28,
    lineHeight: 28,
    fontWeight: "900",
    letterSpacing: -1,
  },
  titleWay: {
    color: theme.colors.white,
  },
  titlePoint: {
    color: theme.colors.success,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 13,
    color: "rgba(255,255,255,0.78)",
  },
  tagline: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.92)",
    textAlign: "left",
  },
  alertButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    position: "relative",
  },
  alertIcon: {
    color: theme.colors.white,
    fontSize: 18,
  },
  alertDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: theme.colors.brand,
  },
});
