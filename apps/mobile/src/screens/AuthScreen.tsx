import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

export default function AuthScreen({ navigation }: any) {
  const [signUpHovered, setSignUpHovered] = useState(false);
  const [logInHovered, setLogInHovered] = useState(false);
  const videoSource = require('../../assets/running-vertical.mp4');
  
  const player = useVideoPlayer(videoSource, (p) => {
    p.loop = true;
    p.muted = true;
  });

  useEffect(() => {
    if (player) {
      player.play();
    }
  }, [player]);

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
          
          {/* --- SIGN UP BUTTON (Gradient + Glow) --- */}
          <Pressable
            onHoverIn={() => setSignUpHovered(true)}
            onHoverOut={() => setSignUpHovered(false)}
          >
            {({ pressed }) => (
              <LinearGradient
                // Your exact CSS hex codes!
                colors={['#B2EF91', '#FA9372']} 
                // 90deg translates to starting left (x:0) and ending right (x:1)
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[
                  styles.primaryButton,
                  // Add glow when hovered, scale down slightly when clicked
                  signUpHovered && styles.buttonHoverGlow,
                  pressed && styles.buttonPressed
                ]}
              >
                <Text style={styles.primaryButtonText}>Sign Up</Text>
              </LinearGradient>
            )}
          </Pressable>

          {/* --- LOG IN BUTTON (Outline + Glow) --- */}
          <Pressable 
            onPress={() => navigation.navigate('Profile')}
            onHoverIn={() => setLogInHovered(true)}
            onHoverOut={() => setLogInHovered(false)}
          >
            {({ pressed }) => (
              <View 
                style={[
                  styles.secondaryButton,
                  logInHovered && styles.buttonHoverGlow, // Uses the same glow effect
                  pressed && styles.buttonPressed
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
  container: {
    flex: 1,
    backgroundColor: colors.blue1000,
    overflow: 'hidden', 
  },
  videoBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.videoOverlay, 
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  tagline: {
    fontSize: 18,
    color: colors.white,
    marginBottom: 60,
    fontWeight: '500', 
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 30, 
    alignItems: 'center',
    // Base subtle shadow
    shadowColor: '#FA9372', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  primaryButtonText: {
    color: colors.blue1000, 
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.green400, 
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  // --- HOVER & PRESS EFFECTS ---
  buttonHoverGlow: {
    shadowColor: '#B2EF91', // Glows with your bright green color
    shadowOffset: { width: 0, height: 0 }, // 0 offset makes it glow in all directions
    shadowOpacity: 0.8,
    shadowRadius: 15, // Large blur creates the "glow"
    transform: [{ scale: 1.02 }], // Slightly enlarges the button
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }], // Shrinks slightly when actively clicked
    shadowOpacity: 0.2, // Dims the glow when clicked
  }
});