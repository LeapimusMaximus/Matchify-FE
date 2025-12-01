import { useState, useEffect, useContext } from "react";
import {
  ScrollView,
  Button,
  Text,
  View,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { login, logout, getValidAccessToken } from "../auth/spotifyAuth";
import { Audio } from "expo-av";
import MiniPlayer from "../components/MiniPlayer";
import { UserContext } from "../contexts/UserContext";
import Spacer from "../components/Spacer";

export default function Home() {
  const { user, setUser } = useContext(UserContext);
  const [songs, setSongs] = useState(null);
  const [token, setToken] = useState(null);

  const [sound, setSound] = useState(null);
  const [currentTrackUrl, setCurrentTrackUrl] = useState(null);
  const [currentTrackInfo, setCurrentTrackInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
      const topSongs = await res.json();
      if (topSongs.items.length > 0) {
        setSongs(topSongs);
      } else {
        const res = await fetch("https://api.spotify.com/v1/me/tracks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const topSavedSongs = await res.json();
        topSavedSongs.items = topSavedSongs.items.map((song) => song.track);
        setSongs(topSavedSongs);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      const genres = new Set();
      for (const song of songs.items) {
        const res = await fetch(
          `https://api.spotify.com/v1/artists/${song.artists[0].id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const artistInfo = await res.json();
        artistInfo.genres.forEach((genre) => genres.add(genre));
      }
      setUser((currUser) => {
        return { ...currUser, genres: Array.from(genres) };
      });
    })();
  }, [songs]);

  async function handleLogin() {
    await login();
    const newToken = await getValidAccessToken();
    setToken(newToken);
  }

  async function getDeezerPreview(trackName, artistName) {
    const query = encodeURIComponent(`${trackName} ${artistName}`);
    const res = await fetch(`https://api.deezer.com/search?q=${query}`);
    const json = await res.json();
    return json.data?.[0]?.preview || null;
  }

  async function playTrack(url, trackInfo) {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync({ uri: url });
      setSound(newSound);
      setCurrentTrackUrl(url);
      setCurrentTrackInfo(trackInfo);
      setIsPlaying(true);

      await newSound.playAsync();
    } catch (e) {
      console.log("Play error:", e);
    }
  }

  async function pauseTrack() {
    if (!sound) return;
    await sound.pauseAsync();
    setIsPlaying(false);
  }

  async function resumeTrack() {
    if (!sound) return;
    await sound.playAsync();
    setIsPlaying(true);
  }

  async function stopTrack() {
    if (!sound) return;
    await sound.stopAsync();
    await sound.unloadAsync();
    setSound(null);
    setCurrentTrackUrl(null);
    setCurrentTrackInfo(null);
    setIsPlaying(false);
  }

  return (
    <View style={{ flex: 1, paddingTop: 80, paddingHorizontal: 20 }}>
      {!user && <Button title="Login with Spotify" onPress={handleLogin} />}

      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        {user && songs && (
          <>
            <Text
              style={{ fontSize: 22, marginBottom: 10, fontWeight: "bold" }}
            >
              Hi, {user.display_name}!
            </Text>

            {user.images?.[0]?.url && (
              <Image
                source={{ uri: user.images[0].url }}
                style={{ width: 150, height: 150, borderRadius: 75 }}
              />
            )}

            <Text style={{ marginTop: 20, fontWeight: "bold" }}>
              Top Tracks:
            </Text>
            <Spacer height={30} />
            
            {songs.items?.slice(0, 5).map((track, i) => (
              <View key={i} style={styles.tracksWrapper}>

                <View style={styles.tracks}>

                  <Image
                    source={{ uri: track.album.images[0].url }}
                    style={{ width: 50, height: 50, borderRadius: 5 }}
                  />

                
                  <Text style={styles.trackText}>
                    {track.name} - {track.artists[0].name}
                  </Text>
                
                </View>
              
          
              <View>
                <Button
                  title="Play Preview"
                  onPress={async () => {
                    const preview = await getDeezerPreview(
                      track.name,
                      track.artists[0].name
                      
                    );

                    if (!preview) {
                      alert("No Deezer preview available");
                      return;
                    }

                    playTrack(preview, {
                      title: track.name,
                      artist: track.artists[0].name,
                    });
                  }}
                />
                </View>
                </View>
            ))}

            <Pressable
              onPress={() => navigation.navigate("Feed")}
              style={{ padding: 10, backgroundColor: "blue", borderRadius: 6 }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Find Matches Now!
              </Text>
            </Pressable>

            <Button
              title="Logout"
              onPress={async () => {
                await logout();
                stopTrack();
                setUser(null);
                setSongs(null);
                setToken(null);
              }}
            />
          </>
        )}
      </ScrollView>

      <MiniPlayer
        trackInfo={currentTrackInfo}
        isPlaying={isPlaying}
        onPause={pauseTrack}
        onPlay={resumeTrack}
        onStop={stopTrack}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
  },
  tracksWrapper: {
    alignSelf: "stretch",
    marginVertical: 5,
    flexDirection: "row",
  },
  tracks: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
  trackText: {
    marginLeft: 10,
    fontSize: 16,
    flexShrink: 1,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  buttons: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
});

