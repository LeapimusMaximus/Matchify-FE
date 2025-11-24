import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";

const Matches = () => {
  return (
    <View style={styles.container}>
      <Text>Matches</Text>
    </View>
  );
};

export default Matches;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  card: {
    backgroundColor: "#eee",
    padding: 20,
    borderRadius: 5,
    boxShadow: "4px 4px rgba(0,0,0,0.1)",
  },
  link: {
    marginVertical: 10,
    borderBottomWidth: 1,
  },
});
