import MenuConfig from "@/components/MenuConfig";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Redirect, Stack } from "expo-router";
import { View } from "react-native";

const configLayout = () => {
    const { loading, isLogged } = useGlobalContext();
  
    // Verifique se a URL atual contém "postdetails", caso contrário, redirecione
    if (!loading && !isLogged) {
      return <Redirect href="/signin" />;
    }

    return (
        <View className="flex-1">
            <MenuConfig />
            <Stack>
                <Stack.Screen
                    name="premium"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="information"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="favorites"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
        </View>
    );
};

export default configLayout;
