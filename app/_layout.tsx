import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import outputs from "../amplify_outputs.json";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Amplify } from "aws-amplify";
import {
  Authenticator,
  ThemeProvider as AmplifyThemeProvider,
} from "@aws-amplify/ui-react-native";
import { amplifyTheme, DarkTheme, LightTheme } from "@/constants/Colors";
import { SignUp } from "@aws-amplify/ui-react-native/dist/Authenticator/Defaults";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
Amplify.configure(outputs);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const theme = colorScheme === "dark" ? DarkTheme : LightTheme;

  return (
    <ThemeProvider value={theme}>
      <AmplifyThemeProvider
        theme={amplifyTheme}
        colorMode={colorScheme === "dark" ? "dark" : "light"}
      >
        <Authenticator.Provider>
          <Authenticator
            socialProviders={["google"]}
            signUpAttributes={[
            ]}
            components={{
              SignUp: ({ fields, ...props }) => (
                <Authenticator.SignUp
                  {...props}
                  fields={[
                   {
                      name: 'given_name',
                      label: 'First Name',
                      type: 'default',
                      placeholder: 'Enter your first name',
                      required: true,
                      
                    },  
                    {
                      name: 'family_name',
                      label: 'Last Name',
                      type: 'default',
                      placeholder: 'Enter your last name',
                      required: true,
                      
                    },  
                    ...fields,
                  ]}
                />
              ),
            }}
              >
            <Slot />
          </Authenticator>
        </Authenticator.Provider>
      </AmplifyThemeProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
