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
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import WhiskeyList from "../extras/WhiskeyList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_USER_WHISKEY_LIST } from "../../constants/Endpoints";

function HomeScreen({ navigation }) {
  const { user, logout } = useUser();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recentWhiskey, setRecentWhiskey] = useState(null);
  const [totalSips, setTotalSips] = useState(0);
  const [averageScore, setAverageScore] = useState(0);

  const fetchWhiskeyStats = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(API_USER_WHISKEY_LIST, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 && response.data.whiskeys?.length > 0) {
        const whiskeys = response.data.whiskeys;

        // Get the most recent whiskey (last in the array)
        setRecentWhiskey(whiskeys[whiskeys.length - 1]);

        // Calculate total sips
        setTotalSips(whiskeys.length);

        // Calculate average score
        const totalScore = whiskeys.reduce((sum, w) => sum + (w.score || 0), 0);
        const avg = totalScore / whiskeys.length;
        setAverageScore(avg.toFixed(1));
      }
    } catch (error) {
      console.error("Error fetching whiskey stats:", error);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchWhiskeyStats();
    setTimeout(() => {
      setIsRefreshing(false);
      console.log("Page refreshed");
    }, 2000);
  };

  useEffect(() => {
    if (user) {
      console.log("Logged in user:", user);
      fetchWhiskeyStats();
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
      await AsyncStorage.removeItem("token");
      await logout();
      navigation.navigate("LoginScreen");
    } catch (error) {
      console.error("Logout failed", error);
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
        <View style={styles.headerContainer}>
          <Text style={styles.sipScoreTitle}>SipScore</Text>
          <View style={styles.logoutButton}>
            <SimpleLineIcons
              onPress={handleUserLogout}
              name="logout"
              size={24}
              color="black"
            />
          </View>
        </View>
        <View style={styles.welcomeContainer}>
          {user ? (
            <>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.username}>{user.user.username}</Text>
            </>
          ) : (
            <Text>Loading...</Text>
          )}
        </View>

        <View style={styles.recentScoreBox}>
          <View style={styles.recentScoreHeader}>
            <Text style={styles.recentScoreTitle}>Your Most Recent Score</Text>
            {recentWhiskey?.dateAdded && (
              <Text style={styles.recentScoreDate}>
                {new Date(recentWhiskey.dateAdded).toLocaleDateString()}
              </Text>
            )}
          </View>
          {recentWhiskey ? (
            <View style={styles.recentScoreContent}>
              <Text style={styles.recentWhiskeyName}>{recentWhiskey.name}</Text>
              <Text style={styles.recentWhiskeyScore}>
                {recentWhiskey.score}/10
              </Text>
            </View>
          ) : (
            <Text style={styles.noRecentText}>No whiskeys scored yet</Text>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Total Sips</Text>
            <Text style={styles.statValue}>{totalSips}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Average Score</Text>
            <Text style={styles.statValue}>{averageScore}</Text>
          </View>
        </View>

        <View style={styles.top3Box}>
          <View style={styles.top3Header}>
            <Text style={styles.top3Title}>Your Top 3 Whiskeys</Text>
            <Text onPress={handleUserAllWhiskey} style={styles.viewAllText}>
              View All
            </Text>
          </View>
          <View style={styles.whiskeyListContainer}>
            <WhiskeyList />
          </View>
        </View>

        <TouchableOpacity
          style={styles.addWhiskeyButton}
          onPress={handleWhiskeyForm}
        >
          <Text style={styles.addWhiskeyText}>Add A New Whiskey</Text>
        </TouchableOpacity>
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
  welcomeContainer: {
    width: "100%",
    paddingLeft: 20,
    marginTop: 16,
  },
  welcomeText: {
    fontSize: 18,
    color: Colors.gray,
  },
  username: {
    fontSize: 34,
    fontWeight: "bold",
    color: Colors.copper,
    marginTop: 4,
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 4,
    position: "relative",
  },
  sipScoreTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.copper,
    textAlign: "center",
  },
  logoutButton: {
    position: "absolute",
    right: 20,
  },
  recentScoreBox: {
    width: "90%",
    backgroundColor: Colors.copper,
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  recentScoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  recentScoreTitle: {
    fontSize: 14,
    color: Colors.cream,
    opacity: 0.9,
  },
  recentScoreDate: {
    fontSize: 12,
    color: Colors.cream,
    opacity: 0.7,
  },
  recentScoreContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recentWhiskeyName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  recentWhiskeyScore: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.gold,
  },
  noRecentText: {
    fontSize: 16,
    color: Colors.cream,
    opacity: 0.8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 12,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.gold,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  statTitle: {
    fontSize: 11,
    color: "#fff",
    opacity: 0.9,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  top3Box: {
    width: "90%",
    backgroundColor: Colors.copper,
    borderRadius: 12,
    padding: 15,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  top3Header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  top3Title: {
    fontSize: 14,
    color: Colors.cream,
    opacity: 0.9,
  },
  viewAllText: {
    color: Colors.gold,
    fontSize: 14,
    fontWeight: "600",
  },
  whiskeyListContainer: {
    minHeight: 140,
  },
  addWhiskeyButton: {
    width: "90%",
    backgroundColor: Colors.gold,
    borderRadius: 10,
    padding: 14,
    marginTop: 12,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  addWhiskeyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default HomeScreen;
