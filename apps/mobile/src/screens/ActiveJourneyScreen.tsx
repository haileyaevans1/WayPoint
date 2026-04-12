import { View, Text, StyleSheet } from "react-native";

export function ActiveJourneyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Active Journey Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
  },
});