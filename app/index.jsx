import React, { useState } from "react";
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

  return (
    <View style={{ marginTop: 80, padding: 20 }}>
      {!user && (
        <Button
          title="Login with Spotify"
          onPress={async () => {
            try {
              await login();
              await fetchProfile();
            } catch (err) {
              console.error(err);
            }
          }}
        />
      )}

      {user && (
        <>
          <Text style={{ fontSize: 22, marginBottom: 10 }}>
            Logged in as {user.display_name}
          </Text>
          <Button title="Refresh Profile" onPress={fetchProfile} />
          <Button
            title="Logout"
            onPress={async () => {
              await logout();
              setUser(null);
            }}
          />
        </>
      )}
    </View>
  );
}
