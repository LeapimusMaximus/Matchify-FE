import React, { useState, useEffect } from "react";
import { Button, Text, View, Image } from "react-native";
import { login, logout, getValidAccessToken } from "../auth/spotifyAuth";
import * as AuthSession from "expo-auth-session";

export default function Home() {
  const [user, setUser] = useState(null);
  const [songs, setSongs] = useState([]);
  const [token, setToken] = useState(null);

  useEffect( () => {
    async function getNewToken() {
      const newToken = await getValidAccessToken();
      setToken(newToken)
    }
    getNewToken();
    }, []);

  async function fetchProfile() {
    if (!token) return;

    const res = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser(await res.json());
  }

  useEffect( () => {
    async function getTopTracks() {
      if (token) {
        const res = await fetch("https://api.spotify.com/v1/me/top/tracks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSongs(await res.json());
      }
    }
    getTopTracks()
  }, []);

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
          <Image
            source={{ uri: user.images[0].url }}
            style={{ width: 150, height: 150 }}
          />
          {/* <Button title="Refresh Profile" onPress={fetchProfile} /> */}
          <Text>{songs.items[0].name}</Text>
          <Text>{songs.items[1].name}</Text>
          <Text>{songs.items[2].name}</Text>
          <Text>{songs.items[3].name}</Text>
          <Text>{songs.items[4].name}</Text>
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
