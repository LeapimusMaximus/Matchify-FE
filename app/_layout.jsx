import { StyleSheet, useColorScheme, Text, View } from "react-native";
import { Colors } from "../constants/Colors";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import Home from "./index";
import Feed from "./feed";
import Messages from "./messages";
import Matches from "./matches";
import Profile from "./profile";

const Tab = createBottomTabNavigator();

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <>
      <StatusBar value="auto" />
      <NavigationIndependentTree>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.navBackground,
              },
              headerTintColor: theme.inverseTitle,
            }}
          >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Feed" component={Feed} />
            <Tab.Screen name="Messages" component={Messages} />
            <Tab.Screen name="Matches" component={Matches} />
            <Tab.Screen name="Profile" component={Profile} />
          </Tab.Navigator>
        </NavigationContainer>
      </NavigationIndependentTree>
    </>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
