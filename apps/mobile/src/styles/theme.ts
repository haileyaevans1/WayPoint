export const theme = {
  colors: {
    background: "#F6EEE4",
    backgroundAlt: "#F1E7DC",
    backgroundDeep: "#EADFD2",
    surface: "#FFFAF7",
    surfaceSoft: "#F8ECE5",
    surfaceTint: "#F1DDD1",
    text: "#58505D",
    textSoft: "#7F7076",
    textMuted: "#97858D",
    border: "#EADACF",
    brand: "#DE8558",
    brandBright: "#F1B078",
    brandDeep: "#CA7449",
    accentPeach: "#F0AE8D",
    accentCoral: "#D97E4D",
    accentLime: "#B8CF5C",
    success: "#BFD65A",
    ink: "#6B7486",
    inkSoft: "#8B94A5",
    headerGlow: "rgba(222,133,88,0.08)",
    headerOrb: "rgba(241,176,120,0.1)",
    headerCoolWash: "rgba(167,187,216,0.14)",
    headerWarmWash: "rgba(223,133,88,0.12)",
    headerCenterWash: "rgba(255,255,255,0.025)",
    savedBase: "#A5AE83",
    savedOrb: "rgba(236,183,98,0.16)",
    savedTint: "rgba(180,203,132,0.18)",
    savedWarmWash: "rgba(226,152,83,0.18)",
    popularBase: "#E28A54",
    popularOrb: "rgba(246,195,157,0.16)",
    popularWarmWash: "rgba(255,189,136,0.18)",
    heroSky: "#B7CDEB",
    heroSkySoft: "#E7EFF8",
    heroGrass: "#CFDFC1",
    heroGrassDeep: "#B8CDAF",
    overlay: "rgba(255,250,247,0.92)",
    white: "#FFFFFF",
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 14,
    md: 22,
    lg: 30,
    pill: 999,
  },
};

export type AppScreen =
  | "home"
  | "startJourney"
  | "activeJourney"
  | "routes"
  | "stats"
  | "profile"
  | "settings"
  | "alerts";

export type RouteSection = "saved" | "popular";
