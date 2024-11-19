import "../global.css";

import {useEffect} from "react";
import {Stack} from "expo-router";
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {useFonts} from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {useColorScheme} from "nativewind";

import "react-native-reanimated";

export {ErrorBoundary} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const {colorScheme} = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown: false}} />
        <Stack.Screen name="modal" options={{presentation: "modal"}} />
      </Stack>
    </ThemeProvider>
  );
}
