import React, { useState, useEffect } from "react";
import { Button, Text, View } from "react-native";
import { login, logout, getValidAccessToken } from "../auth/spotifyAuth";
import * as AuthSession from "expo-auth-session";

export default function Home() {
  const [user, setUser] = useState(null);
  async function fetchProfile() {
    const token = await getValidAccessToken();
    if (!token) return;
    const res = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(await res.json());
  }
 const redirectUri = AuthSession.makeRedirectUri({
  useProxy: true,
});
console.log("here", redirectUri);

  return (
    <View style={{ marginTop: 80, padding: 20 }}>
      {!user && <Button title="Login with Spotify" onPress={async () => {
        await login();
        await fetchProfile();
      }} />}
      {user && (
        <>
        <Text>{redirectUri}</Text>
          <Text style={{ fontSize: 22, marginBottom: 10 }}>
            Logged in as {user.display_name}
          </Text>
          <Button title="Refresh Profile" onPress={fetchProfile} />
          <Button title="Logout" onPress={logout} />
        </>
      )}
    </View>
  );
}
