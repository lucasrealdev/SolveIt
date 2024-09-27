import { Stack, usePathname } from 'expo-router';
import "../styles/global.css";
import { View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Menu from '@/components/Menu';
import Header from '@/components/Header';
import { useWindowDimensions } from 'react-native';

export default function Layout() {
  const pathname = usePathname(); // Obtém o caminho atual da rota

  // Lista de rotas onde o menu deve ser exibido
  const showMenuRoutes = ['/', '/conversas', '/amigos', '/configuracoes', '/jogos'];
  const showHeaderRoutes = ['/', '/conversas', '/amigos', '/configuracoes', '/jogos'];

  // Verifica se a rota atual está na lista de rotas que devem exibir o menu
  const shouldShowMenu = showMenuRoutes.includes(pathname);
  const shouldShowHeader = showHeaderRoutes.includes(pathname);
  
  const { width } = useWindowDimensions();

  const isMobile = width <= 770 ? "column-reverse" : "row";
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#0172B1"}} edges={["top"]}>
      <View className='flex flex-1' accessibilityLabel="containerLayout" style={{flexDirection: isMobile}}>
        {/* Renderiza o menu apenas se a rota atual estiver na lista de exibição */}
        {shouldShowMenu && <Menu inicial={10} amigos={2} />}
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="conversas" options={{ headerShown: false }} />
          <Stack.Screen name="amigos" options={{ headerShown: false }} />
          <Stack.Screen name="configuracoes" options={{ headerShown: false }} />
          <Stack.Screen name="jogos" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
        {shouldShowHeader && <Header notificacao={10} conversas={9}/>}
      </View>
    </SafeAreaView>
  );
}
