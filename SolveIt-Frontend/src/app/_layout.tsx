import { Stack } from 'expo-router';
import "../styles/global.css";
import Menu from "@/components/Menu";
import { View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={["top"]}>
      <View className='flex flex-1 flex-row'>
        <Menu inicial={10} amigos={2}/>
        <Stack>
          <Stack.Screen name="index" options={{headerShown: false}} />
          <Stack.Screen name="ajuda" options={{headerShown: false}} />
          <Stack.Screen name="amigos" options={{headerShown: false}} />
          <Stack.Screen name="configuracoes" options={{headerShown: false}} />
          <Stack.Screen name="jogos" options={{headerShown: false}} />
        </Stack>
      </View>
    </SafeAreaView>
  );
}
