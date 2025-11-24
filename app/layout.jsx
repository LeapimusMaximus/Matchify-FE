import { StyleSheet, useColorScheme } from "react-native";
import { Stack } from "expo-router";
import { Colors } from "../constants/Colors";
import { StatusBar } from "expo-status-bar";

const RootLayout = () => {

    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;

    return (
        <>
            <StatusBar />
            <Stack screenOptions={{
                headerStyle: { backgroundColor: theme.navBackground },
                    headerTintColor: theme.title,
                }}>
                <Stack.screen name="index" options={{title: "Home"}}/>
                <Stack.screen name="feed" options={{title: "Feed"}}/>
                <Stack.screen name="login" options={{title: "Login"}}/>
                <Stack.screen name="matches" options={{title: "Matches"}}/>
                <Stack.screen name="messages" options={{title: "Messages"}}/>
                <Stack.screen name="profile" options={{title: "Profile"}}/>
            </Stack>
        </>
    )

}

export default RootLayout;

const styles = StyleSheet.create({})