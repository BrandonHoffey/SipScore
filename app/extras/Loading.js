import React, { useRef } from "react";
import { View, StyleSheet, Alert } from "react-native";
import Video from "react-native-video";

function Loading(props) {
  const videoRef = useRef(null);

  const onError = (error) => {
    console.error("Video playback error:", error);
    Alert.alert("Error", "An error occurred while playing the video.");
  };

  const onBuffer = (buffer) => {
    console.log("Buffering:", buffer);
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require("../assets/SipScore-Loading-Animation.mp4")}
        style={styles.backgroundVideo}
        resizeMode="contain"
        repeat={true}
        autoplay={true}
        onError={onError}
        onBuffer={onBuffer}
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
