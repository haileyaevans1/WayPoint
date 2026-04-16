import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';

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
                colors={[theme.colors.brandBright, theme.colors.brand]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[
                  styles.primaryButton,
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
                  logInHovered && styles.secondaryButtonHover,
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
    backgroundColor: theme.colors.backgroundDeep,
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
    backgroundColor: 'rgba(78, 67, 68, 0.34)',
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
    color: theme.colors.surface,
    marginBottom: 60,
    fontWeight: '600',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(78, 67, 68, 0.28)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    shadowColor: theme.colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
  },
  primaryButtonText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 249, 244, 0.14)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 249, 244, 0.45)',
    paddingVertical: 16,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: theme.colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonHoverGlow: {
    shadowColor: theme.colors.brandBright,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    transform: [{ scale: 1.02 }],
  },
  secondaryButtonHover: {
    backgroundColor: 'rgba(255, 249, 244, 0.22)',
    borderColor: theme.colors.accentLime,
    shadowColor: theme.colors.accentLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.32,
    shadowRadius: 16,
    transform: [{ scale: 1.02 }],
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.18,
  }
});
