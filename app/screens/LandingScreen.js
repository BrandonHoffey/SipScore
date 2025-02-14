import React from "react";
import { SafeAreaView, StyleSheet, View, Text, Button } from "react-native";
import Colors from "../../Colors";

function LandingScreen(props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>SipScore</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Sign In"
          onPress={() => console.log("Sign In Pressed")}
        />
        <Button
          title="Sign Up"
          onPress={() => console.log("Sign Up Pressed")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F8F1E5",
  },
  titleContainer: {
    marginBottom: 30,
    marginTop: 20,
  },
  titleText: {
    marginTop: 180,
    color: "#708090",
    fontSize: 50,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 50,
  },
});

export default LandingScreen;