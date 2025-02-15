import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Ionicons from "react-native-vector-icons/Ionicons";

function LoginScreen(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const showAlert = () =>
    Alert.alert(
      "Oops",
      "Brandon hasn't created this function yet, please try later."
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>SipScore</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setUsername}
          value={username}
          placeholder="Username"
          keyboardType="keyboard"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={passwordVisible ? "eye-outline" : "eye-off-outline"}
            size={24}
            color="grey"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={showAlert}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.forgotPassword}>I forgot my password</Text>
      <View style={styles.signupContainer}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity>
          <Text style={styles.signupText}>
            Click Here
          </Text>
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
    color: Colors.gray,
    fontSize: 60,
    textAlign: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
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
  eyeIcon: {
    position: "absolute",
    right: wp("2.5%"),
    marginRight: 20,
  },
  button: {
    backgroundColor: Colors.copper,
    borderRadius: 25,
    padding: wp("3%"),
    alignItems: "center",
    marginTop: hp("2.5%"),
    width: "90%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: wp("4%"),
  },
  forgotPassword: {
    color: Colors.gold,
    marginTop: hp("2.5%"),
    fontSize: wp("3.5%"),
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: hp("2.5%"),
  },
  signupText: {
    color: Colors.copper,
    marginLeft: wp("1%"),
    fontSize: wp("3.5%"),
  },
});

export default LoginScreen;