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
import axios from "axios";

const Feed = () => {
  const { user } = useContext(UserContext);
  const [otherUsers, setOtherUsers] = useState(null);

  console.log(user.genres);

  useEffect(() => {
    (async () => {
      const res = await axios.patch(
        "http://localhost:3000/users/feed",
        user.genres
      );
      console.log(res.data);
      setOtherUsers(res.data);
    })();
  }, [user]);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
      <View style={styles.container}>
        {user.profileImage && (
          <Image
            source={{ uri: user.profileImage }}
            style={styles.profileImage}
          />
        )}
        <Spacer height={10} />
        <Text style={styles.title}>{user.displayName}</Text>
        <Spacer height={30} />
        {otherUsers &&
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
          })}
        <Spacer height={20} />
        <Text>Match with {user.displayName}?</Text>
        <Spacer height={20} />
        <View style={styles.buttons}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Button title="Pass" onPress={() => {}} />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Button title="Match" onPress={() => {}} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
  },
  tracksWrapper: {
    alignSelf: "stretch",
    marginVertical: 5,
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

export default Feed;
