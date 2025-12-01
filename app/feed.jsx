import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  ScrollView,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { Audio } from "expo-av";
import Spacer from "../components/Spacer";
import { UserContext } from "../contexts/UserContext";
import Users from "../mockData";
import MiniPlayer from "../components/MiniPlayer";

const Feed = () => {
  const { user } = useContext(UserContext);
  const [match, setMatch] = useState(null);

  const [sound, setSound] = useState(null);
  const [currentTrackUrl, setCurrentTrackUrl] = useState(null);
  const [currentTrackInfo, setCurrentTrackInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    loadNextMatch();
  }, [user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadNextMatch = () => {
    const possibleMatches = Users.filter(
      (u) => u.spotifyId !== user.spotifyId
    );
    if (possibleMatches.length === 0) {
      setMatch(null);
      return;
    }
    const selected =
      possibleMatches[Math.floor(Math.random() * possibleMatches.length)];
    setMatch(selected);
  };

  // ---------- Deezer Preview Fetch ----------
  const getDeezerPreview = async (trackName, artistName) => {
    try {
      const query = encodeURIComponent(`${trackName} ${artistName}`);
      const res = await fetch(`https://api.deezer.com/search?q=${query}`);
      const json = await res.json();
      return json.data?.[0]?.preview || null;
    } catch (e) {
      console.log("Error fetching Deezer preview:", e);
      return null;
    }
  };

  // ---------- AUDIO PLAYER ----------
  const playTrack = async (track) => {
    try {
      // Get track preview from Deezer
      const previewUrl = await getDeezerPreview(track.trackName, track.artistName);
      if (!previewUrl) {
        console.log("No preview available for", track.trackName);
        return;
      }

      // Stop previous sound
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync({ uri: previewUrl });
      setSound(newSound);
      setCurrentTrackUrl(previewUrl);

      // Normalize track info for MiniPlayer
      setCurrentTrackInfo({
        title: track.trackName,
        artist: track.artistName,
        albumArt: track.albumArt,
      });

      setIsPlaying(true);
      await newSound.playAsync();
    } catch (e) {
      console.log("Play error:", e);
    }
  };

  const pauseTrack = async () => {
    if (!sound) return;
    await sound.pauseAsync();
    setIsPlaying(false);
  };

  const resumeTrack = async () => {
    if (!sound) return;
    await sound.playAsync();
    setIsPlaying(true);
  };

  const stopTrack = async () => {
    if (!sound) return;
    await sound.stopAsync();
    await sound.unloadAsync();
    setSound(null);
    setCurrentTrackUrl(null);
    setCurrentTrackInfo(null);
    setIsPlaying(false);
  };

  // ---------- UI ----------
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        {match?.profileImage && (
          <Image
            source={{ uri: match.profileImage }}
            style={styles.profileImage}
          />
        )}

        <Spacer height={10} />
        {match && <Text style={styles.title}>{match.displayName}</Text>}
        <Spacer height={20} />

        <Text>Match with {match?.displayName}?</Text>
        <Spacer height={20} />

        {match?.profileSongs?.slice(0, 5).map((track) => (
          <View
            key={track.trackId}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <Image
              source={{ uri: track.albumArt }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 5,
                marginRight: 10,
              }}
            />
            <Text style={{ flex: 1 }}>
              {track.trackName} - {track.artistName}
            </Text>

            {/* ✅ FIX: Now fetches Deezer preview dynamically */}
            <Button
              title={
                currentTrackInfo?.title === track.trackName && isPlaying
                  ? "Pause"
                  : "Play"
              }
              onPress={() =>
                currentTrackInfo?.title === track.trackName && isPlaying
                  ? pauseTrack()
                  : playTrack(track)
              }
            />
          </View>
        ))}

        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Button title="Pass" onPress={loadNextMatch} />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Button title="Match" onPress={loadNextMatch} />
          </View>
        </View>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
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
});

export default Feed;


{/* export default Feed;

  //const [otherUsers, setOtherUsers] = useState(null);

  // console.log(user.genres);

  // useEffect(() => {
  //   (async () => {
  //     const res = await fetch("http://localhost:3000/users/feed", {
  //       method: "PATCH",
  //       body: JSON.stringify({ genres: user.genres }),
  //     });
  //     const response = await res.json();
  //     console.log(response);
  //     setOtherUsers(response);
  //   })();
  // }, [user]); */}
    
    {/* {otherUsers &&
      otherUsers[0].profileSongs.map((track) => {
        return (
          <View key={track.trackId} style={styles.tracksWrapper}>
          <View style={styles.tracks}>
          <Image
          source={{ uri: track.albumArt }}
          style={{ width: 50, height: 50, borderRadius: 5 }}
          />
          <Text style={styles.trackText}>
          {track.trackName} - {track.artistName}
          </Text>
          </View>
          </View>
          );
          })} */}