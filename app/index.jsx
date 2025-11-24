import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import * as AuthSession from "expo-auth-session";


const Home = () => {
  const redirectUri = AuthSession.makeRedirectUri({
  useProxy: true,
});
console.log("here", redirectUri);
  return (
    <View style={styles.container}>
      <Text>{redirectUri}</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  card: {
    backgroundColor: "#eee",
    padding: 20,
    borderRadius: 5,
    boxShadow: "4px 4px rgba(0,0,0,0.1)",
  },
  link: {
    marginVertical: 10,
    borderBottomWidth: 1,
  },
});
