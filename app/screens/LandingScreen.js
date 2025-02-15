import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import Colors from "../../Colors";

function LandingScreen({ navigation }) {
  const showAlert = () =>
    Alert.alert(
      "Oops",
      "Brandon hasn't created this function yet, please try later."
    );
  const goToLoginScreen = () => {
    navigation.navigate("LoginScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Sip Score</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={goToLoginScreen}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={showAlert}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.cream,
  },
  titleContainer: {
    marginBottom: 30,
    marginTop: 20,
  },
  titleText: {
    marginTop: 180,
    color: Colors.brown,
    fontSize: 60,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 50,
  },
  button: {
    backgroundColor: Colors.gray,
    justifyContent: "center",
    alignItems: "center",
    width: 120,
    height: 50,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LandingScreen;
