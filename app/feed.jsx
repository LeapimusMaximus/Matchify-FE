import { Text, View, StyleSheet, Image, Button } from "react-native";
import Users from "../mockData";
import { Audio } from "expo-av";

const Feed = () => {
  const user = Users[0];

  console.log(user.profileSongs[0].albumArt);

  return (
    <View style={styles.container}>
      {user.profileImage && (
        <Image
          source={{ uri: user.profileImage }}
          style={styles.profileImage}
        />
      )}
      <Text>Match with {user.displayName}?</Text>
      <View style={styles.buttons}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Button title="Pass" onPress={() => {}} />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Button title="Match" onPress={() => {}} />
        </View>
      </View>

      {user.profileSongs.map((track) => {
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
    </View>
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
