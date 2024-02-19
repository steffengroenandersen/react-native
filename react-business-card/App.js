import React from "react";
import { StyleSheet, Text, View, Image, Button, Linking } from "react-native";

export default function App() {
  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Image source={require("./assets/sga-profile.png")} style={styles.image} />
      <View style={styles.component}>
        <Text style={styles.name}>Steffen Grøn Andersen</Text>
        <Text style={styles.description}>
          Actively expanding skills across the web development spectrum, from server-side to user interface.
          <br />
          My goal is to contribute to creating robust and scalable solutions.
        </Text>
        <Text style={styles.contact}>Email: steffengroenandersen@gmail.com</Text>
        <Text style={styles.contact}>Phone: +45 27633951</Text>
        <View style={styles.buttonContainer}>
          <Button title="GitHub" onPress={() => openLink("https://github.com/steffengroenandersen")} />
          <Button
            title="LinkedIn"
            onPress={() => openLink("https://www.linkedin.com/in/steffen-groen-andersen/")}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F2EE",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  component: {
    padding: 20,
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    textAlign: "center",
    marginBottom: 15,
    width: 300,
  },
  contact: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    gap: 5,
  },
});
