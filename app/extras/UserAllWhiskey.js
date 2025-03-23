import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { KeyboardAvoidingView, SafeAreaView } from "react-native";
import axios from "axios";
import Colors from "../../Colors";
import { API_USER_WHISKEY_LIST, API_DELETE_WHISKEY } from "../../constants/Endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

function UserAllWhiskey(props) {
  const [whiskeys, setWhiskeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedWhiskeyIndex, setExpandedWhiskeyIndex] = useState(null);

  const fetchWhiskeys = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(API_USER_WHISKEY_LIST, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const topWhiskeys = response.data.whiskeys.sort(
          (a, b) => b.score - a.score
        );

        setWhiskeys(topWhiskeys);
      } else {
        console.error("Failed to fetch whiskeys:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching whiskeys:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWhiskeys();
  }, []);

  const handleWhiskeyClick = (index) => {
    if (expandedWhiskeyIndex === index) {
      setExpandedWhiskeyIndex(null);
    } else {
      setExpandedWhiskeyIndex(index);
    }
  };

  const handleDeleteWhiskey = async (whiskeyId) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.delete(`${API_DELETE_WHISKEY.replace(":whiskeyId", whiskeyId)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Remove the whiskey from the local state after successful deletion
        setWhiskeys((prevWhiskeys) => 
          prevWhiskeys.filter((whiskey) => whiskey._id !== whiskeyId)
        );
      } else {
        console.error("Failed to delete whiskey:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting whiskey:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView contentContainerStyle={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.whiskeyItemsContainer}>
          {whiskeys.length === 0 ? (
            <View style={styles.noWhiskeysContainer}>
              <Text style={styles.noWhiskeysText}>
                You haven't added any whiskeys yet.
              </Text>
            </View>
          ) : (
            whiskeys.map((whiskey, index) => (
              <View key={index} style={styles.whiskeyItem}>
                {/* Container for name and score */}
                <TouchableOpacity
                  onPress={() => handleWhiskeyClick(index)}
                  style={styles.whiskeyHeader}
                >
                  {/* Separate container for name */}
                  <View style={styles.nameContainer}>
                    <Text style={styles.whiskeyText}>{whiskey.name}</Text>
                  </View>
  
                  {/* Separate container for score */}
                  <View style={styles.scoreContainer}>
                    <Text style={styles.whiskeyDetails}>Score: {whiskey.score}</Text>
                  </View>
                </TouchableOpacity>
  
                {/* Expanded details container */}
                {expandedWhiskeyIndex === index && (
                  <View style={styles.detailsRow}>
                    {/* Expanded details */}
                    <View style={styles.additionalDetails}>
                      {whiskey.proof && (
                        <Text style={styles.whiskeyDetails}>
                          Proof: {whiskey.proof}
                        </Text>
                      )}
                      {whiskey.smellingNotes && (
                        <Text style={styles.whiskeyDetails}>
                          Smelling Notes: {whiskey.smellingNotes}
                        </Text>
                      )}
                      {whiskey.tastingNotes && (
                        <Text style={styles.whiskeyDetails}>
                          Tasting Notes: {whiskey.tastingNotes}
                        </Text>
                      )}
                    </View>
  
                    {/* Trashcan (Delete) icon */}
                    <TouchableOpacity
                      onPress={() => handleDeleteWhiskey(whiskey._id)}
                      style={styles.helloContainer}
                    >
                      <MaterialCommunityIcons 
                        name="delete-forever-outline" 
                        size={28} 
                        color="black" 
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  whiskeyItemsContainer: {
    alignSelf: "center",
    marginTop: 40,
  },
  whiskeyItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    width: 300,
  },
  whiskeyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameContainer: {
    flex: 1,
  },
  scoreContainer: {
    alignItems: "flex-end",
  },
  whiskeyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
  },
  whiskeyDetails: {
    fontSize: 14,
    color: Colors.darkGray,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  additionalDetails: {
    flex: 1,
  },
  helloContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 1,
  },
});

export default UserAllWhiskey;
