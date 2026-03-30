import React, { useState, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppNavigator } from "./src/navigation/AppNavigator";

import AuthScreen from './src/screens/AuthScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { colors } from './src/theme/colors';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 3.5 second timer for the splash screen
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800, 
        useNativeDriver: false,
      }).start(() => setIsSplashVisible(false));
    }, 3500); 

    return () => clearTimeout(timer);
  }, [fadeAnim]);

  return (
    <AppNavigator />
    <View style={styles.container}>
      {/* The Router handles switching between screens */}
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>

      {/* The Splash Screen stays on top of everything while it loads */}
      {isSplashVisible && (
        <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
          <Image
            source={require('./assets/WayPoint_vertical_logo.png')}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue1000,
  },
  splashContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.blue1000,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, 
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
});
