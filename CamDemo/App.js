import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export default function App() {
  const [imagePath, setImagePath] = useState(null); // Gemmer på tværs af renders
  // Udfordrnig med React er, at den kører hele koden igen og igen. Så alt bliver nulstillet.
  // Hooks er en "nødløsning", som gør at man kan gemme det påtrods af rendering.
  // useState er en form for hook. En slags permanent storage i et skiftende miljø.

  // Request access to camera
  async function launchCamera() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (permission.granted === false) {
      console.log("Camera Access Denied!");
      return;
    }

    ImagePicker.launchCameraAsync({
      quality: 1, // from 0.0 to 1.1
    }).then((response) => {
      console.log("Image Recieved: " + response);
      setImagePath(response.assets[0].uri);
    });
  }

  // launchCamera();

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Button title="Add image" onPress={launchCamera} />
      <Image source={{ uri: imagePath }} style={{ width: 150, height: 150 }} />
      {/* Den første curly-brace er JavaScript, den næste er objektet */}
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
