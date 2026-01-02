import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  RefreshControl,
  Image,
} from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import Colors from "../../Colors";
import {
  API_USER_WHISKEY_LIST,
  API_DELETE_WHISKEY,
} from "../../constants/Endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

function UserAllWhiskey({ navigation }) {
  const [whiskeys, setWhiskeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [whiskeyToDelete, setWhiskeyToDelete] = useState(null);

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
        const sortedWhiskeys = response.data.whiskeys.sort(
          (a, b) => b.score - a.score
        );
        setWhiskeys(sortedWhiskeys);
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

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchWhiskeys().then(() => setIsRefreshing(false));
  };

  const handleDeleteWhiskey = async () => {
    if (!whiskeyToDelete) return;

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.delete(
        `${API_DELETE_WHISKEY.replace(":whiskeyId", whiskeyToDelete)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setWhiskeys((prevWhiskeys) =>
          prevWhiskeys.filter((whiskey) => whiskey._id !== whiskeyToDelete)
        );
        setModalVisible(false);
      } else {
        console.error("Failed to delete whiskey:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting whiskey:", error);
    }
  };

  const handleReturnHome = () => {
    navigation.navigate("HomeScreen");
  };

  const showModal = (whiskeyId) => {
    setWhiskeyToDelete(whiskeyId);
    setModalVisible(true);
  };

  const hideModal = () => {
    setWhiskeyToDelete(null);
    setModalVisible(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
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
          <Text style={styles.pageTitle}>All Your Whiskeys</Text>
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
                  You haven't added any whiskeys yet.
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

                  {/* Delete Button */}
                  <TouchableOpacity
                    onPress={() => showModal(whiskey._id)}
                    style={styles.deleteButton}
                  >
                    <MaterialCommunityIcons
                      name="delete-outline"
                      size={20}
                      color={Colors.copper}
                    />
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </KeyboardAvoidingView>

      {/* Delete Confirmation Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={hideModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Whiskey?</Text>
            <Text style={styles.modalText}>This action cannot be undone.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={hideModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleDeleteWhiskey}
              >
                <Text style={styles.confirmButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  deleteText: {
    fontSize: 14,
    color: Colors.cream,
    marginLeft: 6,
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: Colors.cream,
    padding: 24,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.copper,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.copper,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.copper,
    fontWeight: "600",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.copper,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});

export default UserAllWhiskey;
