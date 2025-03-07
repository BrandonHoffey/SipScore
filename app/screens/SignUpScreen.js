import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import Colors from "../../Colors";
import LoginScreen from "./LoginScreen";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { API_NEW_USER } from "../../constants/Endpoints";

function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");

  const showAlert = (message) => Alert.alert("Error", message);

  const handleCreateAccount = async () => {
    if (!username || !email || !password || !passwordCheck) {
      return showAlert("Please fill in all fields.");
    }

    if (password !== passwordCheck) {
      return showAlert("Passwords do not match.");
    }

    try {
      //! Emulator
      // const apiUrl = "http://10.0.2.2:5000/api/users";

      //! Physical Device
      const apiUrl = API_NEW_USER;

      const response = await axios.post(apiUrl, {
        username,
        email,
        password,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Account created successfully!");
        navigation.navigate("LoginScreen");
      }
    } catch (error) {
      console.error("Error creating account:", error.response || error.message);

      if (error.response && error.response.data) {
        if (error.response.data.message === "Email is already in use") {
          showAlert("The email address is already associated with an account.");
        } else {
          showAlert("Failed to create account. Please try again later.");
        }
      } else {
        showAlert("An unknown error occurred. Please try again later.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>SipScore</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setUsername}
              value={username}
              placeholder="Username"
              keyboardType="default"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="Email"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              placeholder="Password"
              secureTextEntry
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setPasswordCheck}
              value={passwordCheck}
              placeholder="Re-Type Password"
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.cream,
  },
  titleContainer: {
    marginBottom: 30,
    marginTop: 0,
  },
  titleText: {
    marginTop: 110,
    color: Colors.gray,
    fontSize: 60,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
  input: {
    height: hp("7%"),
    width: "90%",
    marginVertical: hp("1%"),
    borderWidth: 2,
    padding: wp("2.5%"),
    borderRadius: 5,
    borderColor: Colors.gold,
    marginLeft: 20,
  },
  button: {
    backgroundColor: Colors.copper,
    borderRadius: 25,
    padding: wp("3%"),
    alignItems: "center",
    marginTop: hp("1%"),
    width: "90%",
    marginLeft: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: wp("4%"),
  },
});
