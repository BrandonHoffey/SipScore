import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../Colors";
import { useUser } from "../../context/UserContext";
import AntDesign from "@expo/vector-icons/AntDesign";

function HomeScreen({ navigation }) {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      console.log("Logged in user:", user);
    }
  }, [user]);

  const handleWhiskeyForm = () => {
    navigation.navigate("WhiskeyForm");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {user ? (
          <Text style={styles.username}>Welcome, {user.user.username}</Text>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
      <View style={styles.title}>
        <Text style={styles.titleText}>Add A New Whiskey!</Text>
        <TouchableOpacity>
          <AntDesign
            name="pluscircleo"
            size={24}
            color="black"
            onPress={handleWhiskeyForm}
          />
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
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.copper,
    marginTop: 20,
  },
  whiskeyForm: {
    marginLeft: 80,
  },
  title: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 20,
    marginRight: 15,
  },
});

export default HomeScreen;
