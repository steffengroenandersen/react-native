import { View, ScrollView, Text, TextInput, Button, StyleSheet, Image, FlatList } from "react-native";
import { useState, useEffect } from "react";

import * as ImagePicker from "expo-image-picker";
import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export const NotesPage = ({ navigation, route }) => {
  // Get note from message
  const note = route.params?.message;

  // Note properties
  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [images, setImages] = useState(note.images);
  const [downloadedImages, setDownloadedImages] = useState([]);

  // Download the images and update state when they are downloaded
  useEffect(() => {
    downloadImages().then((images) => {
      setDownloadedImages(images);
    });
  }, []);

  // ########## IMAGE RELATED METHODS ##########
  const [imagePath, setImagePath] = useState(null);

  // Generate image name
  function generateUUID() {
    return uuidv4();
  }

  // Download images from firestore
  async function downloadImages() {
    const downloadedImages = [];

    for (const image of images) {
      const url = await getDownloadURL(ref(storage, image)).then((url) => {
        downloadedImages.push(url);
      });
    }

    return downloadedImages;
  }
  // Get image from local
  async function getImage() {
    const image = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });

    if (!image.canceled) {
      setImagePath(image.assets[0].uri);
    } else {
      console.log("No image found.");
    }
  }

  // Upload image to firestore
  async function uploadImage() {
    const res = await fetch(imagePath);
    const blob = await res.blob();
    const imageName = generateUUID();
    setImages([...images, imageName]);

    const storageRef = ref(storage, imageName);
    uploadBytes(storageRef, blob).then(() => {
      console.log("image upload...");
    });
  }

  // Return to home
  function saveAndGoToHome() {
    navigation.navigate("Home", {
      id: note.id,
      title: title,
      text: text,
      images: images,
    });
  }

  // ########## VIEW ##########
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput style={styles.headerText} multiline={true} value={title} onChangeText={setTitle} />
      </View>

      <View style={styles.body}>
        <View style={styles.note}>
          <TextInput style={styles.noteText} multiline={true} value={text} onChangeText={setText} />
        </View>

        <FlatList
          data={downloadedImages}
          numColumns={2}
          renderItem={(image) => (
            <View>
              <Image source={{ uri: image.item }} style={styles.actualImage} />
            </View>
          )}
        />
        <Image source={{ uri: imagePath }} style={styles.actualImage} />

        <View style={styles.buttonContainer}>
          <Button title="Upload image" onPress={getImage} />

          <Button title="Save image" onPress={uploadImage} />

          <Button title="Save Note" onPress={() => saveAndGoToHome(text)} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#292929",
  },
  header: {
    backgroundColor: "#292929",
    padding: 20,
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
  },

  body: {
    padding: 20,
  },
  note: {
    backgroundColor: "#292929",
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noteText: {
    fontSize: 16,
    color: "#ccc",
    height: 250,
  },
  body: {
    flexGrow: 1,
    padding: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  image: {
    flex: 1,
    marginRight: 10, // Adjust spacing between images
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  actualImage: {
    width: 150,
    height: 150,
  },
});
