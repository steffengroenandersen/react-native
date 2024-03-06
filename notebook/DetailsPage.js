import { View, TextInput, Button, StyleSheet, Image } from "react-native";
import { useState, useEffect } from "react";

import * as ImagePicker from "expo-image-picker";
import { storage } from "./config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const DetailsPage = ({ navigation, route }) => {
  const note = route.params?.message;

  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [images, setImages] = useState(note.images);

  note.images = ["hej.jpg", "mathias.jpg"];

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

  async function downloadImage(imageName) {
    await getDownloadURL(ref(storage, imageName)).then((url) => {
      setImagePath(url);
    });
  }

  function saveAndGoToHome() {
    navigation.navigate("Home", {
      title: title,
      text: text,
      key: note.key,
      id: note.id,
      images: note.images,
    });
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: imagePath }} style={{ width: 150, height: 150 }} />

      <TextInput value={title} onChangeText={setTitle} style={styles.title} />

      <Button title="Hent billede" onPress={getImage} />
      <Button title="Upload billede" onPress={uploadImage} />
      <Button title="Download image" onPress={downloadImage} />

      <TextInput value={text} onChangeText={setText} multiline={true} style={[styles.input, styles.text]} />

      <View style={styles.buttonContainer}>
        <Button title="Save Note" onPress={() => saveAndGoToHome(text)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "white",
    width: "80%",
    padding: 10,
    borderRadius: 10, // Round the corners
    shadowColor: "#000", // Set shadow color
    shadowOffset: { width: 0, height: 2 }, // Set shadow offset
    shadowOpacity: 0.5, // Set shadow opacity
    shadowRadius: 2, // Set shadow radius
    elevation: 5, // Add elevation for Android shadow
  },
  text: {
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 20, // Add space below the button
  },
});
