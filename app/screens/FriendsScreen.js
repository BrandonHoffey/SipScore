import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  API_SEARCH_USERS,
  API_SEND_FRIEND_REQUEST,
  API_FRIEND_REQUESTS,
  API_ACCEPT_FRIEND_REQUEST,
  API_DENY_FRIEND_REQUEST,
  API_FRIENDS_LIST,
  API_REMOVE_FRIEND,
} from "../../constants/Endpoints";

function FriendsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  // Search users
  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) {
      Alert.alert("Search", "Please enter at least 2 characters to search");
      return;
    }

    setLoading(true);
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(
        `${API_SEARCH_USERS}?username=${encodeURIComponent(searchQuery)}`,
        { headers }
      );
      setSearchResults(response.data.users);
    } catch (error) {
      console.error("Error searching users:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to search users"
      );
    } finally {
      setLoading(false);
    }
  };

  // Send friend request
  const handleSendRequest = async (userId) => {
    try {
      const headers = await getAuthHeaders();
      await axios.post(API_SEND_FRIEND_REQUEST, { userId }, { headers });
      Alert.alert("Success", "Friend request sent!");

      // Update the search results to show pending status
      setSearchResults((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, status: "pending" } : user
        )
      );
    } catch (error) {
      console.error("Error sending friend request:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to send friend request"
      );
    }
  };

  // Fetch friend requests
  const fetchFriendRequests = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(API_FRIEND_REQUESTS, { headers });
      setFriendRequests(response.data.requests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  }, []);

  // Fetch friends list
  const fetchFriends = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(API_FRIENDS_LIST, { headers });
      setFriends(response.data.friends);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  }, []);

  // Accept friend request
  const handleAcceptRequest = async (userId) => {
    try {
      const headers = await getAuthHeaders();
      await axios.post(API_ACCEPT_FRIEND_REQUEST, { userId }, { headers });
      Alert.alert("Success", "Friend request accepted!");
      fetchFriendRequests();
      fetchFriends();
    } catch (error) {
      console.error("Error accepting friend request:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to accept request"
      );
    }
  };

  // Deny friend request
  const handleDenyRequest = async (userId) => {
    try {
      const headers = await getAuthHeaders();
      await axios.post(API_DENY_FRIEND_REQUEST, { userId }, { headers });
      Alert.alert("Declined", "Friend request declined");
      fetchFriendRequests();
    } catch (error) {
      console.error("Error denying friend request:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to decline request"
      );
    }
  };

  // Remove friend
  const handleRemoveFriend = async (userId, username) => {
    Alert.alert(
      "Remove Friend",
      `Are you sure you want to remove ${username} as a friend?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const headers = await getAuthHeaders();
              await axios.post(API_REMOVE_FRIEND, { userId }, { headers });
              fetchFriends();
            } catch (error) {
              console.error("Error removing friend:", error);
              Alert.alert("Error", "Failed to remove friend");
            }
          },
        },
      ]
    );
  };

  // View friend's whiskeys
  const handleViewWhiskeys = (friend) => {
    navigation.navigate("FriendWhiskeyList", { friend });
  };

  // Refresh data based on active tab
  const onRefresh = async () => {
    setIsRefreshing(true);
    if (activeTab === "requests") {
      await fetchFriendRequests();
    } else if (activeTab === "friends") {
      await fetchFriends();
    }
    setIsRefreshing(false);
  };

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === "requests") {
      fetchFriendRequests();
    } else if (activeTab === "friends") {
      fetchFriends();
    }
  }, [activeTab, fetchFriendRequests, fetchFriends]);

  const handleReturnHome = () => {
    navigation.navigate("HomeScreen");
  };

  const renderSearchTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by username..."
          placeholderTextColor={Colors.gray}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.copper}
          style={styles.loader}
        />
      ) : (
        <ScrollView style={styles.resultsList}>
          {searchResults.length === 0 && searchQuery.length > 0 ? (
            <Text style={styles.noResultsText}>No users found</Text>
          ) : (
            searchResults.map((user) => (
              <View key={user._id} style={styles.userCard}>
                <View style={styles.userInfo}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.avatarText}>
                      {user.username.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.username}>{user.username}</Text>
                </View>
                {user.status === "friends" ? (
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Friends</Text>
                  </View>
                ) : user.status === "pending" ? (
                  <View style={[styles.statusBadge, styles.pendingBadge]}>
                    <Text style={styles.statusText}>Pending</Text>
                  </View>
                ) : user.status === "received" ? (
                  <View style={[styles.statusBadge, styles.receivedBadge]}>
                    <Text style={styles.statusText}>Respond</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleSendRequest(user._id)}
                  >
                    <Ionicons name="person-add" size={18} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );

  const renderRequestsTab = () => (
    <ScrollView
      style={styles.tabContent}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={Colors.copper}
        />
      }
    >
      {friendRequests.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="account-clock"
            size={48}
            color={Colors.gray}
          />
          <Text style={styles.emptyStateText}>No pending friend requests</Text>
        </View>
      ) : (
        friendRequests.map((request) => (
          <View key={request._id} style={styles.requestCard}>
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Text style={styles.avatarText}>
                  {request.username.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.username}>{request.username}</Text>
                <Text style={styles.requestDate}>
                  {new Date(request.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <View style={styles.requestActions}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleAcceptRequest(request._id)}
              >
                <Ionicons name="checkmark" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.denyButton}
                onPress={() => handleDenyRequest(request._id)}
              >
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );

  const renderFriendsTab = () => (
    <ScrollView
      style={styles.tabContent}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={Colors.copper}
        />
      }
    >
      {friends.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="account-group"
            size={48}
            color={Colors.gray}
          />
          <Text style={styles.emptyStateText}>No friends yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Search for users to add friends
          </Text>
        </View>
      ) : (
        friends.map((friend) => (
          <View key={friend._id} style={styles.friendCard}>
            <TouchableOpacity
              style={styles.friendInfo}
              onPress={() => handleViewWhiskeys(friend)}
            >
              {friend.profilePicture ? (
                <Image
                  source={{ uri: friend.profilePicture }}
                  style={styles.friendProfilePicture}
                />
              ) : (
                <View style={styles.userAvatar}>
                  <Text style={styles.avatarText}>
                    {friend.username.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={styles.friendDetails}>
                <Text style={styles.username}>{friend.username}</Text>
                <Text style={styles.viewWhiskeysText}>
                  Tap to view whiskeys
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveFriend(friend._id, friend.username)}
            >
              <MaterialCommunityIcons
                name="account-remove"
                size={20}
                color={Colors.copper}
              />
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleReturnHome} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.copper} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SipScore</Text>
        <View style={styles.backButton} />
      </View>

      {/* Page Title */}
      <View style={styles.pageTitleContainer}>
        <Text style={styles.pageTitle}>Friends</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "search" && styles.activeTab]}
          onPress={() => setActiveTab("search")}
        >
          <Ionicons
            name="search"
            size={18}
            color={activeTab === "search" ? "#fff" : Colors.copper}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "search" && styles.activeTabText,
            ]}
          >
            Search
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "requests" && styles.activeTab]}
          onPress={() => setActiveTab("requests")}
        >
          <Ionicons
            name="mail"
            size={18}
            color={activeTab === "requests" ? "#fff" : Colors.copper}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "requests" && styles.activeTabText,
            ]}
          >
            Requests
            {friendRequests.length > 0 && (
              <Text style={styles.badgeText}> ({friendRequests.length})</Text>
            )}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "friends" && styles.activeTab]}
          onPress={() => setActiveTab("friends")}
        >
          <Ionicons
            name="people"
            size={18}
            color={activeTab === "friends" ? "#fff" : Colors.copper}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "friends" && styles.activeTabText,
            ]}
          >
            Friends
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === "search" && renderSearchTab()}
      {activeTab === "requests" && renderRequestsTab()}
      {activeTab === "friends" && renderFriendsTab()}
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
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.cream,
    borderWidth: 1,
    borderColor: Colors.copper,
    gap: 4,
  },
  activeTab: {
    backgroundColor: Colors.copper,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.copper,
  },
  activeTabText: {
    color: "#fff",
  },
  badgeText: {
    fontWeight: "bold",
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.copper,
    color: Colors.brown,
  },
  searchButton: {
    backgroundColor: Colors.copper,
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    marginTop: 30,
  },
  resultsList: {
    flex: 1,
  },
  noResultsText: {
    textAlign: "center",
    color: Colors.gray,
    marginTop: 30,
    fontSize: 16,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  requestCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.copper,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  friendCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.copper,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  friendInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  friendDetails: {
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gold,
    justifyContent: "center",
    alignItems: "center",
  },
  friendProfilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.brown,
  },
  requestDate: {
    fontSize: 12,
    color: Colors.cream,
    opacity: 0.8,
    marginTop: 2,
  },
  viewWhiskeysText: {
    fontSize: 12,
    color: Colors.cream,
    opacity: 0.8,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  pendingBadge: {
    backgroundColor: Colors.gray,
  },
  receivedBadge: {
    backgroundColor: Colors.copper,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: Colors.gold,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  requestActions: {
    flexDirection: "row",
    gap: 8,
  },
  acceptButton: {
    backgroundColor: Colors.gold,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  denyButton: {
    backgroundColor: Colors.gray,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButton: {
    backgroundColor: Colors.cream,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.gray,
    opacity: 0.7,
    marginTop: 4,
  },
});

export default FriendsScreen;
