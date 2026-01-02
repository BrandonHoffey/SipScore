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
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../Colors";
import { API_USER_NEW_WHISKEY } from "../../constants/Endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

function WhiskeyForm({ navigation }) {
  const [name, setName] = useState("");
  const [proof, setProof] = useState("");
  const [smellingNotes, setSmellingNotes] = useState("");
  const [tastingNotes, setTastingNotes] = useState("");
  const [savedSmellingNotes, setSavedSmellingNotes] = useState([]);
  const [savedTastingNotes, setSavedTastingNotes] = useState([]);
  const [score, setScore] = useState(5);
  const [image, setImage] = useState(null);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Camera permission is required to take photos."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Photo library permission is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

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

  const handleRemoveSmellingNote = (index) => {
    setSavedSmellingNotes((prevNotes) =>
      prevNotes.filter((_, i) => i !== index)
    );
  };

  const handleRemoveTastingNote = (index) => {
    setSavedTastingNotes((prevNotes) =>
      prevNotes.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Please enter a whiskey name.");
      return;
    }
    if (!proof.trim()) {
      alert("Please enter the proof.");
      return;
    }

    const whiskeyData = {
      name,
      proof,
      smellingNotes: savedSmellingNotes.join(", "),
      tastingNotes: savedTastingNotes.join(", "),
      score: score,
      image: image?.base64 ? `data:image/jpeg;base64,${image.base64}` : null,
    };

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("No token found. Please login again.");
      }

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

  const handleReturnHome = () => {
    navigation.navigate("HomeScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={handleReturnHome}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.copper} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SipScore</Text>
          <View style={styles.backButton} />
        </View>

        {/* Page Title */}
        <View style={styles.pageTitleContainer}>
          <Text style={styles.pageTitle}>Add New Whiskey</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Basic Info Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Basic Info</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={setName}
                value={name}
                placeholder="e.g. Buffalo Trace"
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Proof</Text>
              <TextInput
                style={styles.input}
                onChangeText={setProof}
                value={proof}
                placeholder="e.g. 90"
                placeholderTextColor="rgba(255,255,255,0.5)"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Photo Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Photo</Text>
            {image ? (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: image.uri }}
                  style={styles.imagePreview}
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={removeImage}
                >
                  <Ionicons
                    name="close-circle"
                    size={28}
                    color={Colors.copper}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoButtons}>
                <TouchableOpacity
                  style={styles.photoButton}
                  onPress={takePhoto}
                >
                  <Ionicons name="camera" size={24} color="#fff" />
                  <Text style={styles.photoButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.photoButton}
                  onPress={pickImage}
                >
                  <Ionicons name="images" size={24} color="#fff" />
                  <Text style={styles.photoButtonText}>Choose Photo</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Nose Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Nose (Smelling Notes)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                onChangeText={setSmellingNotes}
                value={smellingNotes}
                placeholder="Add a note and press enter"
                placeholderTextColor="rgba(255,255,255,0.5)"
                onSubmitEditing={handleSmellingNoteSubmit}
                returnKeyType="done"
              />
            </View>
            {savedSmellingNotes.length > 0 && (
              <View style={styles.notesContainer}>
                {savedSmellingNotes.map((note, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.noteChip}
                    onPress={() => handleRemoveSmellingNote(index)}
                  >
                    <Text style={styles.noteChipText}>{note}</Text>
                    <Ionicons name="close" size={14} color="#fff" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Palate Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Palate (Tasting Notes)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                onChangeText={setTastingNotes}
                value={tastingNotes}
                placeholder="Add a note and press enter"
                placeholderTextColor="rgba(255,255,255,0.5)"
                onSubmitEditing={handleTastingNoteSubmit}
                returnKeyType="done"
              />
            </View>
            {savedTastingNotes.length > 0 && (
              <View style={styles.notesContainer}>
                {savedTastingNotes.map((note, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.noteChip}
                    onPress={() => handleRemoveTastingNote(index)}
                  >
                    <Text style={styles.noteChipText}>{note}</Text>
                    <Ionicons name="close" size={14} color="#fff" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Score Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Score</Text>
            <View style={styles.scoreDisplay}>
              <Text style={styles.scoreValue}>{score.toFixed(1)}</Text>
              <Text style={styles.scoreMax}>/ 10</Text>
            </View>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>0</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10}
                step={0.5}
                value={score}
                onValueChange={setScore}
                minimumTrackTintColor={Colors.gold}
                maximumTrackTintColor="rgba(255,255,255,0.3)"
                thumbTintColor={Colors.gold}
              />
              <Text style={styles.sliderLabel}>10</Text>
            </View>
            <View style={styles.sliderMarks}>
              {[0, 2.5, 5, 7.5, 10].map((mark) => (
                <Text key={mark} style={styles.markText}>
                  {mark}
                </Text>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Save Whiskey</Text>
          </TouchableOpacity>
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
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.copper,
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    color: Colors.cream,
    opacity: 0.9,
    marginBottom: 12,
    fontWeight: "600",
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 11,
    color: Colors.gold,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#fff",
  },
  notesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 8,
  },
  noteChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  noteChipText: {
    color: "#fff",
    fontSize: 14,
  },
  scoreDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginBottom: 20,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.gold,
  },
  scoreMax: {
    fontSize: 24,
    color: Colors.cream,
    opacity: 0.7,
    marginLeft: 4,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderLabel: {
    color: Colors.cream,
    fontSize: 12,
    width: 20,
    textAlign: "center",
  },
  sliderMarks: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  markText: {
    color: Colors.cream,
    opacity: 0.6,
    fontSize: 10,
  },
  photoButtons: {
    flexDirection: "row",
    gap: 12,
  },
  photoButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.gold,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  photoButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  imagePreviewContainer: {
    position: "relative",
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 14,
  },
  submitButton: {
    backgroundColor: Colors.gold,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default WhiskeyForm;
