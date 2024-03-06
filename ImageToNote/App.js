import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function App() {
  const [imagePath, setImagePath] = useState(null);

  async function getImage() {
    const image = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });

    if (!image.canceled) {
      console.log("Got image..." + image.assets[0].uri);
      setImagePath(image.assets[0].uri);
    } else {
      console.log("No image found.");
    }
  }

  async function uploadImage() {
    const res = await fetch(imagePath);
    const blob = await res.blob();
    const storageRef = ref(storage, "steffengroenandersen.jpg");
    uploadBytes(storageRef, blob).then(() => {
      console.log("image upload...");
    });
  }

  async function downloadImage() {
    await getDownloadURL(ref(storage, "steffengroenandersen.jpg")).then((url) => {
      setImagePath(url);
    });
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Image source={{ uri: imagePath }} style={{ width: 150, height: 150 }} />
      <Button title="Hent billede" onPress={getImage} />
      <Button title="Upload billede" onPress={uploadImage} />
      <Button title="Download image" onPress={downloadImage} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
