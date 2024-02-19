import { Button, StyleSheet, Text, View, TextInput, FlatList, Alert, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { DetailsPage } from "./DetailsPage.js";

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

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      updateList(route.params?.key, route.params?.content);
    });
    return unsubscribe;
  }, [navigation, route.params]);

  function updateList(key, content) {
    const newList = notes.map((note) => {
      if (key === note.key) {
        return { ...note, key: key, content: content };
      }
      return note;
    });
    setNotes(newList);
  }

  async function saveList() {
    try {
      const jsonValue = JSON.stringify(notes);
      await AsyncStorage.setItem("@myList", jsonValue);
    } catch (error) {
      Alert.alert("Error saving list");
    }
  }
  async function loadList() {
    try {
      const jsonValue = await AsyncStorage.getItem("@myList");
      if (jsonValue != null) {
        const notesArray = JSON.parse(jsonValue);
        if (notesArray != null) {
          setNotes(notesArray);
        }
      }
    } catch (error) {
      Alert.alert("Error loading list");
    }
  }

  function buttonHandler() {
    setNotes([...notes, { key: notes.length, title: title, content: text }]);
  }

  function goToDetailsPage(item) {
    navigation.navigate("DetailsPage", { message: item });
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
          data={notes}
          renderItem={(note) => (
            <TouchableOpacity onPress={() => goToDetailsPage(note.item)}>
              <Text>Title: {note.item.title}</Text>
              <Text>{note.item.content}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.rowContainer}>
        <Button title="Save data" onPress={saveList} />
        <Button title="Load data" onPress={loadList} />
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
