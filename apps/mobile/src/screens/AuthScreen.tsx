import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/colors";
import { API_BASE_URL, API_HEADERS } from '../constants/api';

export default function AuthScreen({ navigation }: any) {
  const [signUpHovered, setSignUpHovered] = useState(false);
  const [logInHovered, setLogInHovered] = useState(false);

  const videoSource = require("../../assets/running-vertical.mp4");

  const player = useVideoPlayer(videoSource, (p) => {
    p.loop = true;
    p.muted = true;
  });

  useEffect(() => {
    if (player) player.play();
  }, [player]);

  // --- THE FRICTIONLESS GUEST SIGN-UP (Hitting Express/Prisma) ---
  const handleFrictionlessSignUp = async () => {
    // 1. Generate unique identifiers
    const uniqueId = Math.random().toString(36).substring(2, 10);
    const generatedEmail = `guest_${uniqueId}@waypoint.app`;
    const generatedPassword = `wp_pass_${uniqueId}`;
    const generatedName = `Guest_${uniqueId}`;

    console.log(` Sending guest to home: ${generatedEmail}`);

    try {
      // 2. Send it to your Express backend (10.0.2.2 for Android Emulator to Windows Localhost)
      const response = await fetch(`${API_BASE_URL}/api/users/onboarding`,
        {
          method: "POST",
          headers: API_HEADERS,
          body: JSON.stringify({
            name: generatedName,
            email: generatedEmail,
            password: generatedPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      console.log(
        " User successfully created in Supabase DB via Prisma!",
        data.user,
      );

      // 3. Instantly navigate to Home and trigger the Welcome Pop-up!
      navigation.navigate("Profile", {
        screen: "Home",
        params: { isNewUser: true },
      });
    } catch (error: any) {
      console.error("Sign Up Error:", error);
      Alert.alert("Sign Up Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.videoBackground}
        player={player}
        contentFit="cover"
        nativeControls={false}
      />
      <View style={styles.overlay} />

      <View style={styles.contentContainer}>
        <Text style={styles.tagline}>Your journey. Your safety net.</Text>

        <View style={styles.buttonContainer}>
          {/* --- 1-CLICK SIGN UP BUTTON --- */}
          <Pressable
            onPress={handleFrictionlessSignUp}
            onHoverIn={() => setSignUpHovered(true)}
            onHoverOut={() => setSignUpHovered(false)}
          >
            {({ pressed }) => (
              <LinearGradient
                colors={["#B2EF91", "#FA9372"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[
                  styles.primaryButton,
                  signUpHovered && styles.buttonHoverGlow,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
              </LinearGradient>
            )}
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("Profile")}
            onHoverIn={() => setLogInHovered(true)}
            onHoverOut={() => setLogInHovered(false)}
          >
            {({ pressed }) => (
              <View
                style={[
                  styles.secondaryButton,
                  logInHovered && styles.buttonHoverGlow,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.secondaryButtonText}>Log In</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.blue1000, overflow: "hidden" },
  videoBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.videoOverlay,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  tagline: {
    fontSize: 18,
    color: colors.white,
    marginBottom: 60,
    fontWeight: "500",
  },
  buttonContainer: { width: "100%", gap: 16 },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#FA9372",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  primaryButtonText: {
    color: colors.blue1000,
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.green400,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonHoverGlow: {
    shadowColor: "#B2EF91",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    transform: [{ scale: 1.02 }],
  },
  buttonPressed: { transform: [{ scale: 0.98 }], shadowOpacity: 0.2 },
});
