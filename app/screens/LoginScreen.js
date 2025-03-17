import React, { useState } from "react";
import Colors from "../../Colors";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../../context/UserContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import {
  API_USER_SIGNIN,
  API_CURRENT_ACCOUNT,
} from "../../constants/Endpoints";

function LoginScreen({ navigation }) {
  const { login, user } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }

    try {
      const apiUrl = API_USER_SIGNIN;
      const response = await axios.post(apiUrl, {
        username,
        password,
      });

      if (response.status === 200) {
        login(response.data);

        await AsyncStorage.setItem("token", response.data.token);

        const userInfoResponse = await axios.get(API_CURRENT_ACCOUNT, {
          headers: {
            Authorization: `Bearer ${response.data.token}`,
          },
        });

        if (userInfoResponse.status === 200) {
        } else {
          console.error("Failed to fetch user details");
        }

        Alert.alert("Success", "Login successful!");
        navigation.navigate("HomeScreen");
      } else {
        Alert.alert("Login Failed", "Invalid username or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

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
          keyboardType="default"
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.forgotPassword}>I forgot my password</Text>
      <View style={styles.signupContainer}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUpScreen")}>
          <Text style={styles.signupText}>Tap Here</Text>
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
