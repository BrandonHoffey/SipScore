import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../Colors";
import { API_USER_NEW_WHISKEY } from "../../constants/Endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

function WhiskeyForm({ props, navigation }) {
  const [name, setName] = useState("");
  const [proof, setProof] = useState("");
  const [smellingNotes, setSmellingNotes] = useState("");
  const [tastingNotes, setTastingNotes] = useState("");
  const [savedSmellingNotes, setSavedSmellingNotes] = useState([]);
  const [savedTastingNotes, setSavedTastingNotes] = useState([]);
  const [score, setScore] = useState("");

  const handleSmellingNoteSubmit = () => {
    if (smellingNotes.trim()) {
      setSavedSmellingNotes((prevNotes) => [...prevNotes, smellingNotes]);
      setSmellingNotes("");
    }
  };

  const handleTastingNoteSubmit = () => {
    if (tastingNotes.trim()) {
      setSavedTastingNotes((prevNotes) => [...prevNotes, tastingNotes]);
      setTastingNotes("");
    }
  };

  const handleScoreChange = (value) => {
    const scoreValue = parseFloat(value);
    if (
      !isNaN(scoreValue) &&
      scoreValue >= 0 &&
      scoreValue <= 5 &&
      (scoreValue * 2) % 1 === 0
    ) {
      setScore(value);
    } else {
      setScore("");
    }
  };

  const handleSubmit = async () => {
    const whiskeyData = {
      name,
      proof,
      smellingNotes: savedSmellingNotes.join(", "),
      tastingNotes: savedTastingNotes.join(", "),
      score: parseFloat(score),
    };

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("No token found. Please login again.");
      }

      // Send the whiskey data to the API
      const response = await fetch(API_USER_NEW_WHISKEY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(whiskeyData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Whiskey added:", result);
        navigation.navigate("HomeScreen");
      } else {
        console.error("Failed to add whiskey:", result.message);
        alert(result.message || "Failed to add whiskey.");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.sectionContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setName}
              value={name}
              placeholder="Name"
              keyboardType="default"
            />
            <TextInput
              style={styles.input}
              onChangeText={setProof}
              value={proof}
              placeholder="Proof"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.sectionContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setSmellingNotes}
              value={smellingNotes}
              placeholder="Smelling Notes"
              onSubmitEditing={handleSmellingNoteSubmit}
              returnKeyType="done"
            />
            <View style={styles.savedNotesRow}>
              <Text style={styles.savedNotesTitle}>Smelling Notes:</Text>
              <View style={styles.savedNotesList}>
                {savedSmellingNotes.map((note, index) => (
                  <Text key={index} style={styles.savedNote}>
                    {`• ${note}`}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setTastingNotes}
              value={tastingNotes}
              placeholder="Tasting Notes"
              onSubmitEditing={handleTastingNoteSubmit}
              returnKeyType="done"
            />
            <View style={styles.savedNotesRow}>
              <Text style={styles.savedNotesTitle}>Tasting Notes:</Text>
              <View style={styles.savedNotesList}>
                {savedTastingNotes.map((note, index) => (
                  <Text key={index} style={styles.savedNote}>
                    {`• ${note}`}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <TextInput
              style={styles.input}
              value={score}
              onChangeText={handleScoreChange}
              placeholder="Score"
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>
          <View style={styles.button}>
            <Button
              onPress={handleSubmit}
              title="Submit"
              color={Colors.copper}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
    borderWidth: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingBottom: 80,
    marginTop: 20,
  },
  sectionContainer: {
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
  },
  input: {
    height: 40,
    width: "80%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  savedNotesRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  savedNotesTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  savedNotesList: {
    flexDirection: "row",
  },
  savedNote: {
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 6,
  },
  button: {
    width: 100,
    alignSelf: "center",
  },
});

export default WhiskeyForm;
