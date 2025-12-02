import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  ScrollView,
  Dimensions,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { Audio } from "expo-av";
import Spacer from "../components/Spacer";
import { UserContext } from "../contexts/UserContext";
import backendIp from "../env";
import { RefreshMatchesContext } from "../contexts/RefreshMatchesContext";
import Swiper from "react-native-deck-swiper";

const { width, height } = Dimensions.get('window');

const Feed = () => {
  const { user, setUser } = useContext(UserContext);
  const { refreshMatches, setRefreshMatches } = useContext(
    RefreshMatchesContext
  );
  const [otherUsers, setOtherUsers] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!user || !Object.hasOwn(user, "genres")) {
      setOtherUsers(null);
      return;
    }
    (async () => {
      const res = await fetch(`${backendIp}/users/feed`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ genres: user.genres, spotifyId: user.id }),
      });
      setOtherUsers(await res.json());
    })();
  }, [user]);

  async function handleMatch() {
    const otherSpotifyId = otherUsers[currentIndex].spotifyId;
    const res = await fetch(`${backendIp}/users/matches`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        spotifyId: user.id,
        otherSpotifyId: otherSpotifyId,
        isLike: true,
      }),
    });
    // setRefreshMatches((cur) => cur + 1);
    setCurrentIndex((prev) => prev + 1);
  }

  async function handlePass() {
    const otherSpotifyId = otherUsers[currentIndex].spotifyId;
    const res = await fetch(`${backendIp}/users/matches`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        spotifyId: user.id,
        otherSpotifyId: otherSpotifyId,
        isLike: false,
      }),
    });
    // setRefreshMatches((cur) => cur + 1);
    setCurrentIndex((prev) => prev + 1);
  }

  const onSwiped = (cardIndex) => {
    console.log("Swiped card at index:", cardIndex);
  };

  const onSwipedLeft = (cardIndex) => {
    console.log("Disliked:", otherUsers[cardIndex].displayName);
    handlePass();
   
  };

  const onSwipedRight = (cardIndex) => {
    console.log("Liked:", otherUsers[cardIndex].displayName);
    handleMatch();
    
  };

  const renderCard = (card, cardIndex) => {
    console.log(cardIndex)
    return (
      <View style={styles.card}>
        {card && card.profileImage && (
          <Image
            source={{ uri: card.profileImage }}
            style={styles.profileImage}
          />
        )}
        <Text style={styles.title}>
          {card && card.displayName}
        </Text>
        <Spacer height={20} />
        {card &&
          card.profileSongs.map((track) => {
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
        {/* <Spacer height={20} /> */}
        {/* <Text>
          Match with {card && card.displayName}?
        </Text> */}
        {/* <Spacer height={20} /> */}
        {/* <View style={styles.buttons}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Button title="Pass" onPress={handlePass} />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Button title="Match" onPress={handleMatch} />
          </View>
        </View> */}
      </View>
    );
  };

  if (!otherUsers || !otherUsers[currentIndex]) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 20, marginTop: 50 }}>No more users</Text>
        <Spacer />
        <Button
          title="Refresh"
          onPress={() => {
            setCurrentIndex(0);
            setOtherUsers(null);
            setUser({ ...user });
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Swiper
        cards={otherUsers}
        renderCard={renderCard}
        onSwiped={onSwiped}
        onSwipedLeft={onSwipedLeft}
        onSwipedRight={onSwipedRight}
        stackSize={1}
        backgroundColor="#f0f0f0"
        cardHorizontalMargin={0}
        verticalSwipe={false} // disable vertical swipes
        showSecondCard={true}
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
  card: {
    width: width,
    height: height - 250,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Feed;
