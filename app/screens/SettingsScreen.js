import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Loading from "../extras/Loading";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import {
  API_CURRENT_ACCOUNT,
  API_UPDATE_USERNAME,
  API_UPDATE_PASSWORD,
  API_UPDATE_PROFILE_PICTURE,
} from "../../constants/Endpoints";
import { useUser } from "../../context/UserContext";

function SettingsScreen({ navigation }) {
  const { user, login } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile data
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const fetchUserData = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(API_CURRENT_ACCOUNT, { headers });
      if (response.status === 200) {
        setUsername(response.data.user.username);
        setEmail(response.data.user.email);
        setProfilePicture(response.data.user.profilePicture);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Image picker functions
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
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      await updateProfilePicture(base64Image);
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
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      await updateProfilePicture(base64Image);
    }
  };

  const showImageOptions = () => {
    Alert.alert("Change Profile Picture", "Choose an option", [
      { text: "Take Photo", onPress: takePhoto },
      { text: "Choose from Gallery", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const updateProfilePicture = async (base64Image) => {
    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      const response = await axios.put(
        API_UPDATE_PROFILE_PICTURE,
        { profilePicture: base64Image },
        { headers }
      );
      if (response.status === 200) {
        setProfilePicture(base64Image);
        Alert.alert("Success", "Profile picture updated!");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      Alert.alert("Error", "Failed to update profile picture");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateUsername = async () => {
    if (!username || username.trim().length < 2) {
      Alert.alert("Error", "Username must be at least 2 characters");
      return;
    }

    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      const response = await axios.put(
        API_UPDATE_USERNAME,
        { newUsername: username },
        { headers }
      );
      if (response.status === 200) {
        // Update the user context with new username
        const token = await AsyncStorage.getItem("token");
        login({
          ...user,
          user: { ...user.user, username: response.data.user.username },
          token,
        });
        Alert.alert("Success", "Username updated!");
      }
    } catch (error) {
      console.error("Error updating username:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update username"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters");
      return;
    }

    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      const response = await axios.put(
        API_UPDATE_PASSWORD,
        { currentPassword, newPassword },
        { headers }
      );
      if (response.status === 200) {
        Alert.alert("Success", "Password updated!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update password"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Loading fullScreen={false} message="Loading settings..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
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
          <Text style={styles.pageTitle}>Settings</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Picture Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Picture</Text>
            <View style={styles.profilePictureContainer}>
              <TouchableOpacity
                onPress={showImageOptions}
                style={styles.profilePictureButton}
              >
                {profilePicture ? (
                  <Image
                    source={{ uri: profilePicture }}
                    style={styles.profilePicture}
                  />
                ) : (
                  <View style={styles.profilePicturePlaceholder}>
                    <Ionicons name="person" size={50} color={Colors.gray} />
                  </View>
                )}
                <View style={styles.editBadge}>
                  <Ionicons name="camera" size={16} color="#fff" />
                </View>
              </TouchableOpacity>
              <Text style={styles.profilePictureHint}>Tap to change</Text>
            </View>
          </View>

          {/* Username Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Username</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username"
                placeholderTextColor={Colors.gray}
              />
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdateUsername}
                disabled={saving}
              >
                <Text style={styles.updateButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.emailText}>Email: {email}</Text>
          </View>

          {/* Password Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Change Password</Text>

            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Current password"
                placeholderTextColor={Colors.gray}
                secureTextEntry={!showCurrentPassword}
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showCurrentPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color={Colors.gray}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New password"
                placeholderTextColor={Colors.gray}
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showNewPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color={Colors.gray}
                />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.inputFull}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              placeholderTextColor={Colors.gray}
              secureTextEntry={!showNewPassword}
            />

            <TouchableOpacity
              style={styles.passwordUpdateButton}
              onPress={handleUpdatePassword}
              disabled={saving}
            >
              <Text style={styles.passwordUpdateButtonText}>
                Update Password
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {saving && (
          <View style={styles.savingOverlay}>
            <Loading fullScreen={false} message="Saving..." />
          </View>
        )}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.copper,
    marginBottom: 12,
  },
  profilePictureContainer: {
    alignItems: "center",
  },
  profilePictureButton: {
    position: "relative",
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.copper,
  },
  profilePicturePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.cream,
    borderWidth: 3,
    borderColor: Colors.copper,
    justifyContent: "center",
    alignItems: "center",
  },
  editBadge: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: Colors.gold,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profilePictureHint: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.gray,
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.cream,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.brown,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  inputFull: {
    backgroundColor: Colors.cream,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.brown,
    borderWidth: 1,
    borderColor: Colors.gold,
    marginBottom: 12,
  },
  updateButton: {
    backgroundColor: Colors.copper,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  emailText: {
    marginTop: 10,
    fontSize: 14,
    color: Colors.gray,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cream,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gold,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.brown,
  },
  eyeButton: {
    paddingHorizontal: 12,
  },
  passwordUpdateButton: {
    backgroundColor: Colors.gold,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  passwordUpdateButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  savingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SettingsScreen;
