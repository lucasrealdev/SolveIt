import { Stack, usePathname, SplashScreen } from 'expo-router';
import { View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';
import { useFonts } from 'expo-font';

import Menu from '@/components/Menu';
import Header from '@/components/Header';

import "../styles/global.css";
import { useEffect } from 'react';
import GlobalProvider from '@/context/GlobalProvider';
import { AlertProvider } from '@/context/AlertContext';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const pathname = usePathname(); // Obtém o caminho atual da rota
  const { width } = useWindowDimensions();

  // Carrega as fontes
  const [fontsLoaded, error] = useFonts({
    "PlusJakartaSans-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "PlusJakartaSans-BoldItalic": require("../assets/fonts/PlusJakartaSans-BoldItalic.ttf"),
    "PlusJakartaSans-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "PlusJakartaSans-ExtraBoldItalic": require("../assets/fonts/PlusJakartaSans-ExtraBoldItalic.ttf"),
    "PlusJakartaSans-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "PlusJakartaSans-ExtraLightItalic": require("../assets/fonts/PlusJakartaSans-ExtraLightItalic.ttf"),
    "PlusJakartaSans-Italic": require("../assets/fonts/PlusJakartaSans-Italic.ttf"),
    "PlusJakartaSans-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "PlusJakartaSans-LightItalic": require("../assets/fonts/PlusJakartaSans-LightItalic.ttf"),
    "PlusJakartaSans-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-MediumItalic": require("../assets/fonts/PlusJakartaSans-MediumItalic.ttf"),
    "PlusJakartaSans-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "PlusJakartaSans-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "PlusJakartaSans-SemiBoldItalic": require("../assets/fonts/PlusJakartaSans-SemiBoldItalic.ttf")
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  // Lista de rotas onde o menu e o header devem ser exibidos
  const showMenuRoutes = ['/', '/help', '/friends', '/settings', '/games', '/createPost', '/profile', '/personalProfile'];
  const showHeaderRoutes = ['/', '/help', '/friends', '/settings', '/games', '/createPost', '/profile', '/personalProfile'];

  const shouldShowMenu = showMenuRoutes.includes(pathname);
  const shouldShowHeader = showHeaderRoutes.includes(pathname);

  const isMobile = width <= 770 ? "column-reverse" : "row";

  return (
    <GlobalProvider>
      <AlertProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#0172B1" }} edges={["top"]}>
          <View className='flex flex-1' accessibilityLabel="containerLayout" style={{ flexDirection: isMobile }}>
            {/* Renderiza o menu apenas se a rota atual estiver na lista de exibição */}
            {shouldShowMenu && <Menu home={10} friends={2} />}
            
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack>

            {/* Renderiza o header apenas se a rota atual estiver na lista de exibição */}
            {shouldShowHeader && <Header notificacao={10} conversas={9} />}
          </View>
        </SafeAreaView>
      </AlertProvider>
    </GlobalProvider>
  );
}
