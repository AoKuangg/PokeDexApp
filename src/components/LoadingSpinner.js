import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { TEXTS } from "../utils/constants";

const LoadingSpinner = ({
  text = TEXTS.loading,
  size = "large",
  color = "#007AFF",
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default LoadingSpinner;
