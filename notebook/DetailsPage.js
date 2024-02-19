import { View, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";

export const DetailsPage = ({ navigation, route }) => {
  const message = route.params?.message;
  const [title, setTitle] = useState(message.title);
  const [text, setText] = useState(message.content);

  function saveAndGoToHome() {
    navigation.navigate("Home", { content: text, key: message.key });
  }

  return (
    <View style={styles.container}>
      <TextInput value={title} onChangeText={setTitle} style={styles.title} />
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
