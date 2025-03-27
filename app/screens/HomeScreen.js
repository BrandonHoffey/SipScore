import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../Colors";
import { useUser } from "../../context/UserContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import WhiskeyList from "../extras/WhiskeyList";
import axios from "axios";
import { API_USER_LOGOUT } from "../../constants/Endpoints";

function HomeScreen({ navigation }) {
  const { user, setUser } = useUser();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      console.log("Page refreshed");
    }, 2000);
  };

  useEffect(() => {
    if (user) {
      console.log("Logged in user:", user);
    }
  }, [user]);

  const handleWhiskeyForm = () => {
    navigation.navigate("WhiskeyForm");
  };

  const handleUserAllWhiskey = () => {
    navigation.navigate("UserAllWhiskey");
  };

  const handleUserLogout = async () => {
    try {
      // Call the API to log the user out without sending credentials
      await axios.post(API_USER_LOGOUT);
    } catch (error) {
      console.error("Logout failed", error);
      // Optionally, you can handle the error here (e.g., show an error message)
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.copper}
          />
        }
      >
          <View style={styles.logoutContainer}>
            <SimpleLineIcons onPress={handleUserLogout} name="logout" size={24} color="black" />
          </View>
        <View style={styles.usernameIconContainer}>
          <View style={styles.contentWrapper}>
            {user ? (
              <Text style={styles.username}>Welcome, {user.user.username}</Text>
            ) : (
              <Text>Loading...</Text>
            )}
          </View>
        </View>

        <View style={styles.top3Container}>
          <Text style={styles.top3Text}>Your Top 3 Whiskeys:</Text>
          <Text onPress={handleUserAllWhiskey} style={styles.viewAllText}>
            View All
          </Text>
        </View>

        <View style={styles.whiskeyList}>
          <WhiskeyList />
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.cream,
  },
  scrollView: {
    width: "100%",
  },
  scrollViewContent: {
    alignItems: "center",
    paddingBottom: 20,
  },
  contentWrapper: {
    width: 300,
    alignItems: "center",
    // borderWidth: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.copper,
    marginTop: 20,
  },
  usernameIconContainer: {
    // borderWidth: 1,
    width: "100%",
    marginTop: 8,
    alignItems: "center",
  },
  logoutContainer: {
    // borderWidth: 1,
    marginLeft: 300,
    marginTop: 20,
    marginBottom: 4,
  },
  top3Container: {
    marginTop: 270,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  top3Text: {
    fontSize: 20,
  },
  viewAllText: {
    color: Colors.gold,
    marginLeft: 75,
    paddingTop: 4,
    fontSize: 16,
  },
  title: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    height: 35,
    marginTop: 10,
  },
  titleText: {
    fontSize: 20,
    marginRight: 15,
  },
  whiskeyList: {
    height: 260,
    marginTop: 5,
    width: "100%",
  },
});

export default HomeScreen;