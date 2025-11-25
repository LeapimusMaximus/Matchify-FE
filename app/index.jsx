import { StyleSheet, Text, View, Button } from "react-native";
import { Link } from "expo-router";
import React, { useEffect } from "react";
import { Linking } from "react-native";


import * as AuthSession from "expo-auth-session";

const CLIENT_ID = "143a76320dee4cd3a99f2ba35d744613";
const REDIRECT_URI = "http://127.0.0.1:8081";
const SCOPES = ["user-read-private", "user-read-email"];

const AUTH_URL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&scope=${SCOPES.join("%20")}`;




const Home = () => {

 useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("Redirect URL:", url);
    
    });

    Linking.getInitialURL().then((initialUrl) => {
      if (initialUrl) {
        console.log("Initial Redirect URL:", initialUrl);
      }``
    });

    return () => subscription.remove();
  }, []);

  const redirectUri = AuthSession.makeRedirectUri({
  useProxy: true,
});
 

  const handleLogin = () => {
    console.log("Opening Spotify Auth URL:", AUTH_URL);
    Linking.openURL(AUTH_URL);
  };

console.log("here", redirectUri);
  return (
    <View style={styles.container}>
      <Text>{redirectUri}</Text>
            {
             <Button title="Start Spotify Login" onPress={handleLogin} />
            }

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
