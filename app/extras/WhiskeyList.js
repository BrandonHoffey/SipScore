import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, StyleSheet, Platform, ActivityIndicator } from "react-native";
import { KeyboardAvoidingView, SafeAreaView } from "react-native";
import axios from 'axios';
import Colors from "../../Colors";
import { API_USER_WHISKEY_LIST } from "../../constants/Endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

function WhiskeyList(props) {
  const [whiskeys, setWhiskeys] = useState([]); // State to store the whiskeys
  const [loading, setLoading] = useState(true); // State to track loading state

  // Fetch the user's whiskey list from the API
  const fetchWhiskeys = async () => {
    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(API_USER_WHISKEY_LIST, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request header
        },
      });

      // If the response is successful, update the state with the whiskey list
      if (response.status === 200) {
        setWhiskeys(response.data.whiskeys); // Assuming the API returns a `whiskeys` array
      } else {
        console.error("Failed to fetch whiskeys:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching whiskeys:", error);
    } finally {
      setLoading(false); // Stop loading once the request is done
    }
  };

  useEffect(() => {
    fetchWhiskeys(); // Call fetchWhiskeys when the component is mounted
  }, []);

  // If still loading, show a loading indicator
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView contentContainerStyle={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView>
          {whiskeys.length === 0 ? (
            <View style={styles.noWhiskeysContainer}>
              <Text style={styles.noWhiskeysText}>You haven't added any whiskeys yet.</Text>
            </View>
          ) : (
            whiskeys.map((whiskey, index) => (
              <View key={index} style={styles.whiskeyItem}>
                <Text style={styles.whiskeyText}>{whiskey.name}</Text>
                <Text style={styles.whiskeyDetails}>Proof: {whiskey.proof}</Text>
                <Text style={styles.whiskeyDetails}>Score: {whiskey.score}</Text>
                <Text style={styles.whiskeyDetails}>Smelling Notes: {whiskey.smellingNotes}</Text>
                <Text style={styles.whiskeyDetails}>Tasting Notes: {whiskey.tastingNotes}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  noWhiskeysContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  noWhiskeysText: {
    fontSize: 18,
    color: Colors.darkGray,
  },
  whiskeyItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  whiskeyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  whiskeyDetails: {
    fontSize: 14,
    color: Colors.darkGray,
  },
});

export default WhiskeyList;