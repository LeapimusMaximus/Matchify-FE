import {
  StyleSheet,
  useColorScheme,
  Image,
  Platform,
  View,
} from "react-native";
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
                backgroundColor: "#d3e7ed",
              },
              headerTintColor: theme.inverseTitle,

              headerTitle: () => (
                <Image
                  source={require("../assets/matchify_logo.png")}
                  style={{
                    width: 170,
                    height: 60,
                  }}
                  resizeMode="contain"
                />
              ),
              headerTitleAlign: "center",
              tabBarStyle: {
                backgroundColor: "#d3e7ed",
                borderTopWidth: 0,
                height: 70 + (Platform.OS === "ios" ? 20 : 0),
                paddingBottom: Platform.OS === "ios" ? 20 : 10,
              },
              tabBarActiveTintColor: "#007AFF",
              tabBarInactiveTintColor: "#8e8e93",
            }}
          >
            <Tab.Screen
              name="Home"
              component={Home}
              options={{
                tabBarIcon: ({ focused, color, size }) => (
                  <Image
                    source={require("../assets/matchify_icon.png")}
                    style={{
                      width: size,
                      height: size,
                      resizeMode: "contain",
                    }}
                  />
                ),
              }}
            />

            <Tab.Screen
              name="Feed"
              component={Feed}
              options={{
                tabBarIcon: ({ focused, color, size }) => (
                  <Image
                    source={require("../assets/matchify_icon.png")}
                    style={{
                      width: size,
                      height: size,
                      resizeMode: "contain",
                    }}
                  />
                ),
              }}
            />
            {/* <Tab.Screen name="Messages" component={Messages} options={{
              tabBarIcon: ({focused, color, size}) => (
                <Image
                  source={require("../assets/matchify_icon.png")}
                  style={{
                    width: size,
                    height: size,
                    resizeMode: "contain",
                  }}
                />
              )
            }}/> */}
            <Tab.Screen
              name="Matches"
              component={Matches}
              options={{
                tabBarIcon: ({ focused, color, size }) => (
                  <Image
                    source={require("../assets/matchify_icon.png")}
                    style={{
                      width: size,
                      height: size,
                      resizeMode: "contain",
                    }}
                  />
                ),
              }}
            />
            {/* <Tab.Screen name="Profile" component={Profile} options={{
              tabBarIcon: ({focused, color, size}) => (
                <Image
                  source={require("../assets/matchify_icon.png")}
                  style={{
                    width: size,
                    height: size,
                    resizeMode: "contain",
                  }}
                />
              )
            }}/> */}
          </Tab.Navigator>
        </NavigationContainer>
      </NavigationIndependentTree>
    </>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
