import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../Colors";
import { useUser } from "../../context/UserContext";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

function HomeScreen() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      console.log("Logged in user:", user);
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {user ? (
          <Text style={styles.username}>Welcome, {user.user.username}</Text>
        ) : (
          <Text>Loading...</Text>
        )}
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
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.copper,
    marginTop: 20,
  },
});

export default HomeScreen;