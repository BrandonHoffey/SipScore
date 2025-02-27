import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../Colors";

function HomeScreen(props) {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>Hello from HomeScreen!</Text>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.cream,
  },
});
