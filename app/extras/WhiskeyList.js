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
import { API_USER_WHISKEY_LIST } from "../../constants/Endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

function WhiskeyList(props) {
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
        const topWhiskeys = response.data.whiskeys
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);

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

  const handleWhiskeyClick = (index) => {
    if (expandedWhiskeyIndex === index) {
      setExpandedWhiskeyIndex(null);
    } else {
      setExpandedWhiskeyIndex(index);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          {whiskeys.length === 0 ? (
            <View style={styles.noWhiskeysContainer}>
              <Text style={styles.noWhiskeysText}>
                You haven't added any whiskeys yet.
              </Text>
            </View>
          ) : (
            whiskeys.map((whiskey, index) => (
              <View key={index} style={styles.whiskeyItem}>
                <TouchableOpacity onPress={() => handleWhiskeyClick(index)}>
                  <Text style={styles.whiskeyText}>{whiskey.name}</Text>
                  <Text style={styles.whiskeyDetails}>
                    Score: {whiskey.score}
                  </Text>
                </TouchableOpacity>

                {expandedWhiskeyIndex === index && (
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
    backgroundColor: "transparent",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noWhiskeysContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  noWhiskeysText: {
    fontSize: 16,
    color: Colors.cream,
    opacity: 0.8,
  },
  whiskeyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  whiskeyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  whiskeyDetails: {
    fontSize: 14,
    color: Colors.gold,
    marginTop: 2,
  },
  additionalDetails: {
    marginTop: 10,
    paddingLeft: 15,
  },
});

export default WhiskeyList;
