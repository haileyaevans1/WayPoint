import React, { useState, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. Import Auth and your team's AppNavigator
import AuthScreen from './src/screens/AuthScreen';
import { AppNavigator } from "./src/navigation/AppNavigator";
import { colors } from './src/theme/colors';

// (We no longer need to import ProfileScreen directly here, 
// because AppNavigator handles it now!)

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
    <View style={styles.container}>
      
      {/* 2. The Main Router */}
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          
          {/* The front door: Your video auth screen */}
          <Stack.Screen name="Auth" component={AuthScreen} />
          
          {/* The inside of the app: Your team's NavBar setup */}
          {/* We named the route "Profile" so your Auth button still connects to it! */}
          <Stack.Screen name="Profile" component={AppNavigator} />
          
        </Stack.Navigator>
      </NavigationContainer>

      {/* 3. The Splash Screen stays on top of everything while it loads */}
      {isSplashVisible && (
        <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
          <Image
            source={require('./assets/waypoint-logo.png')}
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
    ...StyleSheet.absoluteFillObject,
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