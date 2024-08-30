import "../styles/global.css";
import { Tabs } from "expo-router";
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import { View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
  return(
    <SafeAreaView style={{ flex: 1, backgroundColor: '#030712' }} edges={["top"]}>
        <View className="flex-1 mx-[15px] mt-[20px]">
          <Header/>
          <Tabs tabBar={props=> <Menu {...props} />} >
            <Tabs.Screen name="index" options={{ headerShown: false}}/>
            <Tabs.Screen name="criar" options={{ headerShown: false}}/>
            <Tabs.Screen name="jogar" options={{ headerShown: false}}/>
            <Tabs.Screen name="perfil" options={{ headerShown: false}}/>
          </Tabs>
        </View>
    </SafeAreaView>
  )
}
