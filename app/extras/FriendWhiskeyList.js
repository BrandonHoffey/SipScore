import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import Colors from "../../Colors";
import { API_FRIEND_WHISKEYS } from "../../constants/Endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";

function FriendWhiskeyList({ navigation, route }) {
  const { friend } = route.params;
  const [whiskeys, setWhiskeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchFriendWhiskeys = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const url = API_FRIEND_WHISKEYS.replace(":friendId", friend._id);
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setWhiskeys(response.data.whiskeys);
      } else {
        console.error("Failed to fetch whiskeys:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching friend's whiskeys:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendWhiskeys();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchFriendWhiskeys().then(() => setIsRefreshing(false));
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.copper} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SipScore</Text>
        <View style={styles.backButton} />
      </View>

      {/* Page Title */}
      <View style={styles.pageTitleContainer}>
        <Text style={styles.pageTitle}>{friend.username}'s Whiskeys</Text>
        <Text style={styles.pageSubtitle}>
          {whiskeys.length} whiskeys scored
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.copper} />
        </View>
      ) : (
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
          {whiskeys.length === 0 ? (
            <View style={styles.noWhiskeysContainer}>
              <Text style={styles.noWhiskeysText}>
                {friend.username} hasn't added any whiskeys yet.
              </Text>
            </View>
          ) : (
            whiskeys.map((whiskey, index) => (
              <View key={index} style={styles.whiskeyCard}>
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.nameScoreRow}>
                    <Text style={styles.whiskeyName}>{whiskey.name}</Text>
                    <View style={styles.scoreBadge}>
                      <Text style={styles.scoreText}>{whiskey.score}/10</Text>
                    </View>
                  </View>
                  {whiskey.dateAdded && (
                    <Text style={styles.dateText}>
                      Scored on {formatDate(whiskey.dateAdded)}
                    </Text>
                  )}
                </View>

                {/* Photo */}
                {whiskey.image && (
                  <Image
                    source={{ uri: whiskey.image }}
                    style={styles.whiskeyImage}
                  />
                )}

                {/* Card Details */}
                <View style={styles.cardDetails}>
                  {whiskey.proof && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Proof</Text>
                      <Text style={styles.detailValue}>{whiskey.proof}</Text>
                    </View>
                  )}
                  {whiskey.smellingNotes && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Nose</Text>
                      <Text style={styles.detailValue}>
                        {whiskey.smellingNotes}
                      </Text>
                    </View>
                  )}
                  {whiskey.tastingNotes && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Palate</Text>
                      <Text style={styles.detailValue}>
                        {whiskey.tastingNotes}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.copper,
  },
  pageTitleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.copper,
  },
  pageSubtitle: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  noWhiskeysContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  noWhiskeysText: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: "center",
  },
  whiskeyCard: {
    backgroundColor: Colors.copper,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  whiskeyImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  cardHeader: {
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  nameScoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  whiskeyName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    marginRight: 10,
  },
  scoreBadge: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  dateText: {
    fontSize: 12,
    color: Colors.cream,
    opacity: 0.8,
    marginTop: 4,
  },
  cardDetails: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  detailRow: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 11,
    color: Colors.gold,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: "#fff",
  },
});

export default FriendWhiskeyList;

