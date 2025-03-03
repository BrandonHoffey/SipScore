import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, SafeAreaView } from "react-native";
import AppStackNavigator from "./StackNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { UserProvider } from "./context/UserContext";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import axios from "axios";

const fetchUsers = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/users");
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching users", error);
  }
};

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <AppStackNavigator />
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
