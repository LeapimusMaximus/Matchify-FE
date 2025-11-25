import { useState, useEffect } from "react";
import { Button, Text, View, Image, Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { login, logout, getValidAccessToken } from "../auth/spotifyAuth";

export default function Home() {
  const [user, setUser] = useState(null);
  const [songs, setSongs] = useState(null);
  const [token, setToken] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const t = await getValidAccessToken();
      setToken(t);
    })();
  }, []);

  useEffect(() => {
    if (!token) return;

    (async () => {
      const res = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(await res.json());
    })();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    (async () => {
      const res = await fetch("https://api.spotify.com/v1/me/top/tracks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSongs(await res.json());
    })();
  }, [token]);

  async function handleLogin() {
    await login();
    const newToken = await getValidAccessToken();
    setToken(newToken);
  }

  return (
    <View style={{ marginTop: 80, padding: 20 }}>
      {!user && <Button title="Login with Spotify" onPress={handleLogin} />}

      {user && songs && (
        <>
          <Text style={{ fontSize: 22, marginBottom: 10 }}>
            Logged in as {user.display_name}
          </Text>

          {user.images?.[0]?.url && (
            <Image
              source={{ uri: user.images[0].url }}
              style={{ width: 150, height: 150 }}
            />
          )}

          <Text style={{ marginTop: 20, fontWeight: "bold" }}>Top Tracks:</Text>

          {songs.items?.slice(0, 5).map((track, i) => (
            <Text key={i}>{track.name}</Text>
          ))}

          <Pressable
            onPress={() => navigation.navigate("Feed")}
            style={{ padding: 10, backgroundColor: "blue" }}
          >
            <Text style={{ color: "white" }}>Find Matches Now!</Text>
          </Pressable>

          <Button
            title="Logout"
            onPress={async () => {
              await logout();
              setUser(null);
              setSongs(null);
              setToken(null);
            }}
          />
        </>
      )}
    </View>
  );
}
