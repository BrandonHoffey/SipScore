import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Colors from "./Colors";
import LoginScreen from "./app/screens/LoginScreen";
import SignUpScreen from "./app/screens/SignUpScreen";
import HomeScreen from "./app/screens/HomeScreen";
import WhiskeyForm from "./app/extras/WhiskeyForm";
import WhiskeyList from "./app/extras/WhiskeyList";
import Loading from "./app/extras/Loading";

const Stack = createNativeStackNavigator();

const LoadingScreen = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.gray} />
    </View>
  );
};

const StackNavigator = () => {
  const [initialRoute, setInitialRoute] = useState("Loading");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAppLoad = async () => {
      setTimeout(() => {
        setInitialRoute("LoginScreen");
        setLoading(false);
      }, 2000);
    };

    handleAppLoad();
  }, []);

  return loading ? (
    <LoadingScreen />
  ) : (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.lightBlue,
        },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WhiskeyForm"
        component={WhiskeyForm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WhiskeyList"
        component={WhiskeyList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Loading"
        component={Loading}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.lightBlue,
  },
});
