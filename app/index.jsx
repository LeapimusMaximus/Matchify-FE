import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const Home = () => {
  return (
    <View style={styles.container}>
      <Text>Home</Text>

      <Link href="/login" style={styles.link}>
        <Text>Login</Text>
      </Link>
      <Link href="/feed" style={styles.link}>
        <Text>Feed</Text>
      </Link>
      <Link href="/matches" style={styles.link}>
        <Text>Matches</Text>
      </Link>
      <Link href="/messages" style={styles.link}>
        <Text>Messages</Text>
      </Link>
      <Link href="/profile" style={styles.link}>
        <Text>Profile</Text>
      </Link>
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
