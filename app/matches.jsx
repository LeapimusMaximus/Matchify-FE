import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  ScrollView,
} from "react-native";
import { UserContext } from "../contexts/UserContext";
import { useState, useEffect, useContext } from "react";
import backendIp from "../env";
import Spacer from "../components/Spacer";

const Matches = () => {
  const { user } = useContext(UserContext);
  const [matches, setMatches] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${backendIp}/users/matches`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spotifyId: user.id }),
      });
      setMatches(await res.json());
    })();
  }, [user]);

  return (
    <>
      <View style={[styles.titleContainer, {backgroundColor: "rgba(39, 120, 160, 0.5)"}, {height: 60}, {marginBottom: 10}]}>
        <Text style={styles.title}>Your Matches</Text>
      </View>
      <ScrollView>
        <View style={styles.container}>
            {matches &&
              matches.map((match) => {
                return (
                  <View key={match._id} style={styles.threadsWrapper}>
                    <Image
                      src={match.profileImage}
                      width="50"
                      height="50"
                      borderRadius={75}
                    />
                    <Text style={[{fontSize: 18}, {fontWeight: "bold"}]}>{match.displayName}</Text>
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
    // flex: 1,
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
    padding: 20,
    marginRight: 20,
    alignItems: "center",
    backgroundColor: "rgba(8, 38, 53, 0.1)"
  },
});
