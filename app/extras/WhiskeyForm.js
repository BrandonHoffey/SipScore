import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function WhiskeyForm(props) {
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.title}>
            <Text>Add A New Whiskey!</Text>
          </View>
          <View style={styles.inputContainer}>
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
            <TextInput
              style={styles.input}
              onChangeText={setSmellingNotes}
              value={smellingNotes}
              placeholder="Smelling Notes"
              onSubmitEditing={handleSmellingNoteSubmit}
              returnKeyType="done"
            />
            <ScrollView style={styles.savedNotesContainer}>
              <Text style={styles.savedNotesTitle}>Saved Smelling Notes:</Text>
              {savedSmellingNotes.map((note, index) => (
                <Text key={index} style={styles.savedNote}>{`• ${note}`}</Text>
              ))}
            </ScrollView>
            <TextInput
              style={styles.input}
              onChangeText={setTastingNotes}
              value={tastingNotes}
              placeholder="Tasting Notes"
              onSubmitEditing={handleTastingNoteSubmit}
              returnKeyType="done"
            />
          </View>
          <ScrollView style={styles.savedNotesContainer}>
            <Text style={styles.savedNotesTitle}>Saved Tasting Notes:</Text>
            {savedTastingNotes.map((note, index) => (
              <Text key={index} style={styles.savedNote}>{`• ${note}`}</Text>
            ))}
          </ScrollView>
          <TextInput
            style={styles.input}
            value={score}
            onChangeText={handleScoreChange}
            placeholder="Score"
            keyboardType="numeric"
            returnKeyType="done"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingBottom: 80,
  },
  title: {
    alignItems: "center",
    marginBottom: 20,
  },
  inputContainer: {
    alignItems: "center",
  },
  input: {
    height: 40,
    width: "80%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  savedNotesContainer: {
    marginTop: 20,
    width: "100%",
  },
  savedNotesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  savedNote: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default WhiskeyForm;
