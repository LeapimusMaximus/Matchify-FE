import { Text, View, StyleSheet, Image, ScrollView } from "react-native";
import { UserContext } from "../contexts/UserContext";
import { useState, useEffect, useContext } from "react";
import backendIp from "../env";
import { RefreshMatchesContext } from "../contexts/RefreshMatchesContext";
import Spinner from "react-native-loading-spinner-overlay";

const Matches = () => {
  const { user } = useContext(UserContext);
  const [matches, setMatches] = useState(null);
  const { refreshMatches, setRefreshMatches } = useContext(
    RefreshMatchesContext
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setMatches(null);
      return;
    }
    setIsLoading(true);
    (async () => {
      try {
        const res = await fetch(`${backendIp}/users/matches`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ spotifyId: user.id }),
        });
        setMatches(await res.json());
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError(err);
        setIsLoading(false);
      }
    })();
  }, [user, refreshMatches]);

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
  if (!matches) return <Text>Go and swipe!</Text>;

  return (
    <>
      <View
        style={[
          styles.titleContainer,
          { backgroundColor: "rgba(39, 120, 160, 0.95)" },
          { height: 60 },
          { marginBottom: 10 },
        ]}
      >
        <Text style={styles.title}>Your Matches</Text>
      </View>
      <ScrollView>
        <View style={styles.container}>
          {matches &&
            matches.map((match, i) => {
              return (
                <View key={i} style={styles.threadsWrapper}>
                  <Image
                    src={match.profileImage}
                    width="50"
                    height="50"
                    borderRadius={75}
                  />
                  <Text style={[{ fontSize: 18 }, { fontWeight: "bold" }]}>
                    {match.displayName}
                  </Text>
                  <Text>{match.email}</Text>
                </View>
              );
            })}
        </View>
      </ScrollView>
    </>
  );
};

export default Matches;

const styles = StyleSheet.create({
  container: {
    alignItems: "stretch",
    justifyContent: "center",
    paddingStart: 20,
  },
  titleContainer: {
    alignItems: "stretch",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    alignSelf: "center",
  },
  card: {
    backgroundColor: "#eee",
    padding: 20,
    borderRadius: 5,
    boxShadow: "4px 4px rgba(0, 0, 0, 0.1)",
  },
  link: {
    marginVertical: 10,
    borderBottomWidth: 1,
  },
  threads: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
  threadsWrapper: {
    alignSelf: "stretch",
    marginVertical: 5,
    borderStyle: "solid",
    borderColor: "#000",
    borderRadius: 30,
    borderWidth: 0.1,
    padding: 20,
    marginRight: 20,
    alignItems: "center",
    backgroundColor: "rgba(165, 210, 233, .95)",
    opacity: 1,
  },
});
