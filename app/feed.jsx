import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  Dimensions,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import Spacer from "../components/Spacer";
import { UserContext } from "../contexts/UserContext";
import backendIp from "../env";
import { RefreshMatchesContext } from "../contexts/RefreshMatchesContext";
import Swiper from "react-native-deck-swiper";
import Spinner from "react-native-loading-spinner-overlay";

const { width, height } = Dimensions.get('window');

const Feed = () => {
  const { user, setUser } = useContext(UserContext);
  const { refreshMatches, setRefreshMatches } = useContext(
    RefreshMatchesContext
  );
  const [otherUsers, setOtherUsers] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState(null);

  useEffect(() => {
    if (!user || !Object.hasOwn(user, "genres")) {
      setOtherUsers(null);
      return;
    }
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${backendIp}/users/feed`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ genres: user.genres, spotifyId: user.id }),
        });
        setOtherUsers(await res.json());
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError(err);
        setIsLoading(false);
      }
    })();
  }, [user]);

  async function handleChoice(isLike) {
    const otherSpotifyId = otherUsers[currentIndex].spotifyId;
    try {
      const res = await fetch(`${backendIp}/users/matches`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spotifyId: user.id,
          otherSpotifyId: otherSpotifyId,
          isLike: isLike,
        }),
      });
      setRefreshMatches((cur) => cur + 1);
      setCurrentIndex((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      setError(err);
    }
  }

  const onSwipedLeft = (cardIndex) => {
    handleChoice(false);
  };

  const onSwipedRight = (cardIndex) => {
    handleChoice(true);
  };

  const renderCard = (card, cardIndex) => {
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
      </View>
    );
  };

  if (error) return <Text>Something went wrong...</Text>
  if (isLoading) {
    return (
       <Spinner
          visible={isLoading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
    )
  }

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
        onSwipedLeft={onSwipedLeft}
        onSwipedRight={onSwipedRight}
        stackSize={1}
        backgroundColor= "transparent" 
        cardHorizontalMargin={20}
        verticalSwipe={false} 
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
    width:'100%' ,
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
  card: {
    width: width - 40,
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
