import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

const AuthLayout = () => {
  return (
    <View className="flex-1">
      <Stack>
        <Stack.Screen
          name="signin"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#161622" style="light" />
    </View>
  );
};

export default AuthLayout;
