import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Loader from "@/components/Loader";
import { useGlobalContext } from "@/context/GlobalProvider";
import { View } from "react-native";

const AuthLayout = () => {
  // const {loading, isLogged} = useGlobalContext();
  // if (!loading && isLogged) return <Redirect href="/" />;

  return (
    <View className="flex-1">
      <Stack>
        <Stack.Screen
          name="signIn"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="signUp"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      {/* <Loader isLoading={loading} /> */}
      <StatusBar backgroundColor="#161622" style="light" />
    </View>
  );
};

export default AuthLayout;
