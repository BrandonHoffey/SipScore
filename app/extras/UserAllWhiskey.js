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
  Button,
} from "react-native";
import { KeyboardAvoidingView, SafeAreaView } from "react-native";
import axios from "axios";
import Colors from "../../Colors";
import {
  API_USER_WHISKEY_LIST,
  API_DELETE_WHISKEY,
} from "../../constants/Endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

function UserAllWhiskey({ navigation }) {
  const [whiskeys, setWhiskeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedWhiskeyIndex, setExpandedWhiskeyIndex] = useState(null);
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
  }

  const showModal = (whiskeyId) => {
    setWhiskeyToDelete(whiskeyId);
    setModalVisible(true);
  };

  const hideModal = () => {
    setWhiskeyToDelete(null);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.homeIconContainer}>
          <MaterialIcons onPress={handleReturnHome} name="home" size={32} color="black" />
        </View>

        {loading ? (
          <ScrollView contentContainerStyle={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </ScrollView>
        ) : (
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
                  <TouchableOpacity
                    onPress={() => handleWhiskeyClick(index)}
                    style={styles.whiskeyHeader}
                  >
                    <View style={styles.nameContainer}>
                      <Text style={styles.whiskeyText}>{whiskey.name}</Text>
                    </View>

                    <View style={styles.scoreContainer}>
                      <Text style={styles.whiskeyDetails}>
                        Score: {whiskey.score}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {expandedWhiskeyIndex === index && (
                    <View style={styles.detailsRow}>
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

                      <TouchableOpacity
                        onPress={() => showModal(whiskey._id)}
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
        )}
      </KeyboardAvoidingView>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={hideModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure?</Text>
            <View style={styles.modalButtons}>
              <Button title="Maybe Not" onPress={hideModal} />
              <Button title="I'm Sure" onPress={handleDeleteWhiskey} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  homeIconContainer: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    // borderWidth: 1,
  },
  whiskeyItemsContainer: {
    alignSelf: "center",
    marginTop: 100,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default UserAllWhiskey;
