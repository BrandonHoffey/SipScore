import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function HomeScreen(props) {
  return (
    <SafeAreaView>
      <View>
        <Text>Hello from HomeScreen!</Text>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;
