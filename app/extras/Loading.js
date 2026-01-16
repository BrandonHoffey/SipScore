import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Video, ResizeMode } from "expo-av";

function Loading(props) {
  const onError = (error) => {
    console.error("Video playback error:", error);
    Alert.alert("Error", "An error occurred while playing the video.");
  };

  return (
    <View style={styles.container}>
      <Video
        source={require("../assets/SipScore-Loading-Animation.mp4")}
        style={styles.backgroundVideo}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isLooping
        onError={onError}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundVideo: {
    width: "100%",
    height: "100%",
  },
});

export default Loading;
