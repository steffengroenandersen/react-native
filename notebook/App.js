import { useCollection } from "react-firebase-hooks/firestore";
import { collection, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { app, database } from "./config/firebase.js";

import { Button, StyleSheet, Text, View, TextInput, FlatList, Alert, TouchableOpacity } from "react-native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { DetailsPage } from "./DetailsPage.js";

import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRoute="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="DetailsPage" component={DetailsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Home = ({ navigation, route }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);

  const [values, loading, error] = useCollection(collection(database, "notes"));

  const data = values?.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      updateNote(route.params);
    });
    return unsubscribe;
  }, [route.params]);

  async function updateNote(note) {
    console.log(note);
    try {
      await updateDoc(doc(database, "notes", note.id), {
        title: note.title,
        text: note.text,
        images: note.images,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteNote(id) {
    try {
      await deleteDoc(doc(database, "notes", id));
    } catch (error) {
      console.log(error);
    }
  }

  async function buttonHandler() {
    try {
      await addDoc(collection(database, "notes"), {
        key: data.length,
        title: title,
        text: text,
        images: images,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  function goToDetailsPage(note) {
    navigation.navigate("DetailsPage", { message: note });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Notebook</Text>
      <View style={styles.rowContainer}>
        <TextInput style={styles.inputField} onChangeText={(title) => setTitle(title)} />
        <TextInput style={styles.inputField} onChangeText={(txt) => setText(txt)} />
        <Button title="Add note" onPress={buttonHandler} />
      </View>
      <View style={styles.notesContainer}>
        <FlatList
          style={styles.listLayout}
          data={data}
          renderItem={(note) => (
            <TouchableOpacity onPress={() => goToDetailsPage(note.item)}>
              <View>
                <Text>Title: {note.item.title}</Text>
                <Text>{note.item.text}</Text>
                <Button title="Delete note" onPress={() => deleteNote(note.item.id)} />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headline: {
    fontSize: 24,
    marginBottom: 20, // Add some space below the headline
  },
  inputField: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 10, // Round the corners
    padding: 10,
    marginBottom: 10, // Add some space below the input fields
  },
  rowContainer: {
    flexDirection: "row",
    margin: 12,
    alignItems: "center",
  },
  listLayout: {
    flex: 1,
    width: "90%",
  },
  titleInput: {
    marginRight: 10, // Add some space between the title input and content input
  },
  contentInput: {
    flex: 2, // Take up more space for content input
    marginRight: 10, // Add some space between the title input and content input
  },
  notesContainer: {
    flex: 1, // Take up remaining space
    width: "90%", // Adjust width as needed
    backgroundColor: "#f0f0f0", // Background color for the notes container
    padding: 10, // Add padding for better spacing
    borderRadius: 10, // Add border radius for rounded corners
    marginBottom: 10, // Add margin at the bottom
  },
});
