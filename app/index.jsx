import { useState, useEffect, useContext } from "react";
import {
  ScrollView,
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
import backendIp from "../env";
import Spacer from "../components/Spacer";
import Spinner from "react-native-loading-spinner-overlay";

export default function Home() {
  const { user, setUser } = useContext(UserContext);
  const [songs, setSongs] = useState(null);
  const [token, setToken] = useState(null);
  const [sound, setSound] = useState(null);
  const [currentTrackUrl, setCurrentTrackUrl] = useState(null);
  const [currentTrackInfo, setCurrentTrackInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      try {
        const t = await getValidAccessToken();
        setToken(t);
      } catch (err) {
        console.error(err);
        setError(err);
      }
    })();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (!token) {
      setIsLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = await res.json();
        if (user.images.length > 0) {
          user.image = user.images[0].url;
        } else {
          user.image = `https://avatar.iran.liara.run/username?username=${user.display_name[0]}`;
        }
        setUser(user);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError(err);
        setIsLoading(false);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
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
      } catch (err) {
        console.error(err);
        setError(err);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const genres = new Set();
        const artistsApiUrl = songs.items
          .reduce((acc, item) => {
            return (acc += item.artists[0].id + ",");
          }, "https://api.spotify.com/v1/artists?ids=")
          .slice(0, -1);
        const res = await fetch(artistsApiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { artists } = await res.json();
        artists.forEach((artist) => {
          artist.genres.forEach((genre) => genres.add(genre));
        });

        setUser((currUser) => {
          return { ...currUser, genres: Array.from(genres) };
        });

        while (user === null) {}

        await fetch(`${backendIp}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            spotifyId: user.id,
            displayName: user.display_name,
            email: user.email,
            profileImage: user.image,
            profileSongs: songs.items.map((song) => {
              return {
                trackId: song.id,
                trackName: song.name,
                artistName: song.artists[0].name,
                albumArt: song.album.images[0].url,
              };
            }),
            genres: Array.from(genres),
            matches: [],
            liked: [],
            passed: [],
          }),
        });
      } catch (err) {
        console.error(err);
        setError(err);
      }
    })();
  }, [songs]);

  async function handleLogin() {
    try {
      await login();
      const newToken = await getValidAccessToken();
      setToken(newToken);
    } catch (err) {
      console.error(err);
      setError(err);
    }
  }

  async function getDeezerPreview(trackName, artistName) {
    try {
      const query = encodeURIComponent(`${trackName} ${artistName}`);
      const res = await fetch(`https://api.deezer.com/search?q=${query}`);
      const json = await res.json();
      return json.data?.[0]?.preview || null;
    } catch (err) {
      console.error(err);
      setError(err);
    }
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
      setError(e);
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

  if (error) return <Text>Something went wrong...</Text>;
  if (isLoading) {
    return (
      <Spinner
        visible={isLoading}
        textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: 0, paddingHorizontal: 20 }}>
      {!user && (
        <Pressable
          style={{
            backgroundColor: "rgba(39, 120, 160, 0.95)",
            borderWidth: 1,
            borderRadius: 50,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderColor: "white",
            marginTop: 20,
            alignItems: "center",
          }}
          onPress={handleLogin}
        >
          <Text style={{ color: "white" }}>Login with Spotify</Text>
        </Pressable>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 150,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {user && songs && (
          <View style={styles.container}>
            <View
              style={[
                styles.container,
                { minWidth: "90%", alignContent: "space-between" },
              ]}
            >
              <View
                style={[
                  styles.container,
                  {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    padding: 40,
                    borderRadius: 30,
                    marginTop: -40,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 22,
                    marginBottom: 10,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Hi {user.display_name}!
                </Text>
                {user?.image && (
                  <Image
                    source={{ uri: user?.image }}
                    style={{ width: 150, height: 150, borderRadius: 75 }}
                  />
                )}
                <Spacer height={20} />
                <Text style={{ marginTop: 20, fontWeight: "bold" }}>
                  Top Tracks
                </Text>
              </View>

              <Spacer height={30} />

              <View style={{ width: "76%", alignItems: "center" }}>
                {songs.items?.slice(0, 5).map((track, i) => (
                  <Pressable
                    key={i}
                    style={[styles.threadsWrapper, { alignSelf: "stretch" }]}
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
                  >
                    <View style={styles.tracks}>
                      <Image
                        source={{ uri: track.album.images[0].url }}
                        style={{ width: 50, height: 50, borderRadius: 5 }}
                      />
                      <Text style={styles.trackText}>
                        {track.name} - {track.artists[0].name}
                      </Text>
                      <Text
                        style={[
                          styles.trackText,
                          { justifySelf: "flex-end", verticalAlign: "middle" },
                        ]}
                      >
                        {" "}
                        ▶️{" "}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
            <Spacer />

            <Pressable
              style={{
                backgroundColor: "rgba(39, 120, 160, 0.95)",
                borderWidth: 1,
                borderRadius: 50,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderColor: "white",
              }}
              onPress={async () => {
                await logout();
                stopTrack();
                setUser(null);
                setSongs(null);
                setToken(null);
              }}
            >
              <Text style={{ color: "white" }}>Logout</Text>
            </Pressable>
          </View>
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
    alignItems: "center",
    paddingTop: 40,
    justifyContent: "center",
  },
  tracks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  trackText: {
    marginLeft: 10,
    fontSize: 16,
    flexShrink: 1,
    flexGrow: 2,
    alignSelf: "center",
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
  card: {
    backgroundColor: "#eee",
    padding: 20,
    borderRadius: 5,
    boxShadow: "4px 4px rgba(0, 0, 0, 0.1)",
  },
  threadsWrapper: {
    alignSelf: "stretch",
    marginVertical: 5,
    borderStyle: "solid",
    borderColor: "#000",
    borderRadius: 30,
    borderWidth: 0.1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "rgba(165, 210, 233, .95)",
    opacity: 1,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});
