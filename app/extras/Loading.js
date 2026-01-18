import React from "react";
import { View, StyleSheet, Platform, Text, ActivityIndicator } from "react-native";
import { Video, ResizeMode } from "expo-av";
import Colors from "../../Colors";

// Props:
// - fullScreen: boolean (default: true) - Use full-screen video animation (Android only) or spinner
// - message: string (optional) - Custom loading message to display
function Loading({ fullScreen = true, message = "Loading..." }) {
  const onError = (error) => {
    console.error("Video playback error:", error);
  };

  // Always use spinner on web (video autoplay is blocked on mobile browsers)
  // Also use spinner for inline/non-fullscreen loading on Android
  if (Platform.OS === "web" || !fullScreen) {
    return (
      <View style={fullScreen ? styles.webContainer : styles.inlineContainer}>
        {fullScreen && <Text style={styles.title}>SipScore</Text>}
        <ActivityIndicator size="large" color={Colors.copper} style={styles.spinner} />
        <Text style={styles.loadingText}>{message}</Text>
      </View>
    );
  }

  // Use video animation for full-screen loading on Android
  return (
    <View style={styles.container}>
      <Video
        source={require("../assets/SipScore-Loading-Animation.mp4")}
        style={styles.backgroundVideo}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isLooping
        isMuted
        onError={onError}
      />
      <Text style={styles.videoMessage}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.cream,
  },
  backgroundVideo: {
    width: "80%",
    height: "40%",
  },
  videoMessage: {
    marginTop: 20,
    fontSize: 18,
    color: Colors.copper,
    fontWeight: "600",
  },
  webContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.cream,
  },
  inlineContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.copper,
    marginBottom: 20,
  },
  spinner: {
    marginVertical: 10,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 8,
  },
});

export default Loading;
