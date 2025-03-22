import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Colors from "./Colors";
import LoginScreen from "./app/screens/LoginScreen";
import SignUpScreen from "./app/screens/SignUpScreen";
import HomeScreen from "./app/screens/HomeScreen";
import WhiskeyForm from "./app/extras/WhiskeyForm";
import WhiskeyList from "./app/extras/WhiskeyList";
import Loading from "./app/extras/Loading";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
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
