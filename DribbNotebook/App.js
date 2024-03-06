import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TextInput, View, FlatList, Button, TouchableOpacity } from "react-native";

import { useState, useEffect } from "react";

import { app, database } from "./firebase";
import { useCollection } from "react-firebase-hooks/firestore";

import { collection, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { NotesPage } from "./NotesPage.js";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRoute="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="NotesPage" component={NotesPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Home = ({ navigation, route }) => {
  // Note properties
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);

  // Getting notes from database, and ready to render them
  const [values, loading, error] = useCollection(collection(database, "notes"));
  const notesData = values?.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  // Update information when navigating back to App.js
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      const noteToSave = route.params;
      //console.log(noteToSave);
      updateNote(noteToSave);
    });
    return unsubscribe;
  }, [route.params]);

  // ########## METHODS ##########

  // Create note
  async function createNote() {
    console.log("createNote()");
    try {
      await addDoc(collection(database, "notes"), {
        key: notesData.length,
        title: title,
        text: text,
        images: images,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  // Update note
  async function updateNote(note) {
    console.log("updateNote()");
    //console.log(note);
    try {
      await updateDoc(doc(database, "notes", note.id), {
        title: note.title,
        text: note.text,
        images: note.images,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  // Delete note
  async function deleteNote(id) {
    console.log("deleteNote()");
    try {
      await deleteDoc(doc(database, "notes", id));
    } catch (error) {
      console.log(error.message);
    }
  }

  // Navigate to Notes Page
  function goToNotesPage(note) {
    console.log("goToNotesPage()");
    navigation.navigate("NotesPage", { message: note });
  }

  // ########## MY NOTES VIEW ##########
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Notes</Text>
      </View>

      <View style={styles.main}>
        <View style={styles.noteContainer}>
          <View>
            <FlatList
              style={styles.listLayout}
              data={notesData}
              numColumns={2}
              renderItem={(note) => (
                <TouchableOpacity style={styles.noteItem} onPress={() => goToNotesPage(note.item)}>
                  <View>
                    <Text style={styles.noteTitle}>{note.item.title}</Text>
                    <Text style={styles.noteText} numberOfLines={2} ellipsizeMode="tail">
                      {note.item.text}
                    </Text>
                  </View>
                  <Button title="Delete note" onPress={() => deleteNote(note.item.id)} />
                </TouchableOpacity>
              )}
            />
          </View>
          <View style={styles.newNote}>
            <Text style={styles.newNoteHeader}>Create New Note</Text>
            <TextInput
              style={styles.newNoteTitle}
              placeholder="Enter title..."
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.newNoteText}
              placeholder="Enter text..."
              value={text}
              onChangeText={setText}
            />
            <Button title="Create note" onPress={() => createNote()} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: "#292929",
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
  },
  main: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "yellow",
  },

  noteContainer: {
    backgroundColor: "#292929",
    flex: 1,
    padding: 20,
  },
  listLayout: {},
  noteItem: {
    borderRadius: 15,
    backgroundColor: "#333333",
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    padding: 7,
    width: "46%",
    height: 150,
    flex: 1,
    justifyContent: "space-between",
  },
  noteTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  noteText: {
    color: "#ccc",
  },
  newNote: {
    borderRadius: 15,
    backgroundColor: "#FEBD3D",
    border: 1,
    padding: 20,
    width: "50%",
    height: 150,
  },
  newNoteHeader: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#292929",
    marginBottom: 5,
  },
  newNoteTitle: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 2,
  },
  newNoteText: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
  },
});
