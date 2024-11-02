import React, { useState } from "react";
import { Pressable, Text, View, Image, TextInput, useWindowDimensions } from "react-native";
import { useRouter, usePathname } from "expo-router";
import CustomIcons from "@/assets/icons/CustomIcons";
import { useGlobalContext } from "@/context/GlobalProvider";
import { signOut } from "@/lib/appwriteConfig";
import images from "@/constants/images";

interface MenuProps {
  home?: number;
  games?: number;
  friends?: number;
  help?: number;
}

export default function Menu({ home, games, friends, help }: MenuProps) {
  const primaryColor = "#01B198";
  const greyColor = "#3692C5";
  const router = useRouter();
  const pathname = usePathname();
  const { width, height } = useWindowDimensions();
  const [isVisible, setIsVisible] = useState(true); // Estado para controlar visibilidade

  const navigateTo = (route: string) => {
    router[pathname !== route ? 'push' : 'replace'](route);
  };

  const renderMenuButton = (route: string, label: string, iconName: string, notificationCount?: number) => {
    const isActive = pathname === route;
    const iconColor = isActive ? primaryColor : greyColor;

    return (
      <Pressable className="flex w-full items-center gap-[8px] justify-center flex-row px-[12px] py-[10px]" onPress={() => navigateTo(route)}>
        <View className="flex flex-1 gap-[8px] flex-row items-center">
          <CustomIcons name={iconName} size={26} color={iconColor} />
          <Text className="text-white text-base font-bold">{label}</Text>
        </View>
        {notificationCount !== undefined && (
          <View className="flex bg-white px-[10px] py-[3px] rounded-full items-center justify-center">
            <Text
              className="text-[#0172B1] text-sm font-semibold"
              style={{ lineHeight: 14 }}>
              {notificationCount}
            </Text>
          </View>        
        )}
      </Pressable>
    );
  };

  const renderMenuButtonMobile = (route: string, iconName: string, notificationCount?: number) => {
    const isActive = pathname === route;
    const iconColor = isActive ? primaryColor : greyColor;

    return (
      <Pressable className="flex items-center justify-center" onPress={() => navigateTo(route)}>
        <View className="relative">
          {notificationCount !== undefined && (
            <View className="absolute bg-white w-[16px] h-[16px] rounded-full items-center justify-center top-[-5px] right-[-10px] z-10">
              <Text className="text-primaryStandardDark text-[10px] leading-3 font-semibold">{notificationCount}</Text>
            </View>
          )}
          <CustomIcons name={iconName} size={26} color={iconColor} />
        </View>
      </Pressable>
    );
  };

  const isMobile = width < 770;
  const isTablet = height <= 720 ? "hidden" : "";
  const containerWidth = width >= 1400 ? 312 : 280;

  // const { setUser, setIsLogged } = useGlobalContext();

  // const logout = async () => {
  //   await signOut();
  //   setUser(null);
  //   setIsLogged(false);

  //   router.replace("/signIn");
  // };

  const renderDesktopMenu = () => (
    <View accessibilityLabel="ContainerMenu" className="flex h-[100vh] justify-between items-start bg-primaryStandardDark px-[16px] py-[32px]" style={{ width: containerWidth }}>
      <View className="flex gap-[32px] w-full">
        <Image style={{ width: 115, height: 32 }} source={images.logo} />
        <View className="flex gap-[6px] rounded-[124px] border border-[#3692C5] h-[40px] flex-row items-center p-[12px] py-[8px]">
          <CustomIcons name="pesquisar" size={17} color="#FFFFFF" />
          <TextInput className="outline-none flex-1 text-white text-base h-[24px] pb-[2px] font-medium" placeholder="Procurar" placeholderTextColor="#fff" />
        </View>
        <View className="flex w-full gap-[8px]">
          {renderMenuButton('/', 'Descubra o mundo', 'home', home)}
          {renderMenuButton('/games', 'Jogos', 'jogos', games)}
          {renderMenuButton('/friends', 'Amigos', 'amigos', friends)}
          {renderMenuButton('/settings', 'Configurações', 'configuracoes')}
          {renderMenuButton('/help', 'Ajuda e Suporte', 'ajuda', help)}
        </View>
      </View>

      <View className="flex w-full gap-6">
        {isVisible && (
          <View accessibilityLabel="CardPremium" className={`flex gap-[16px] p-[16px] bg-secondaryStandardDark rounded-[24px] w-full ${isTablet}`}>
            <View className="flex flex-row justify-between">
              <View className="w-[40px] h-[40px] flex bg-secondaryStandard rounded-full items-center justify-center">
                <CustomIcons name="perigo" size={20} color="#FFF" />
              </View>
              <Pressable onPress={() => setIsVisible(false)}>
                <CustomIcons name="fechar" size={14} color="#FFF" />
              </Pressable>
            </View>
            <Text className="text-white text-sm">Aproveite os benefícios premiuns do app, exclusivos para você!</Text>
            <View className="flex flex-row gap-4">
              <Pressable><Text className="text-white font-bold">Recusar</Text></Pressable>
              <Pressable><Text className="text-[#C7FEF1] font-bold">Garantir</Text></Pressable>
            </View>
          </View>
        )}
        <View accessibilityLabel="CardConta" className="flex gap-4 pt-6 border-t border-borderStandard flex-row items-end">
          <Pressable className="flex flex-1 flex-row items-center gap-3">
            <Image className="w-[40px] h-[40px] rounded-full" source={require('@/assets/icon.png')} />
            <View className="flex gap-[2px]">
              <Text className="text-white font-bold text-base">Azunyan U. Wu</Text>
              <Text className="text-textStandard font-medium text-sm">Membro Básico</Text>
            </View>
          </Pressable>
          <Pressable
            // onPress={logout}
          >
            <CustomIcons name="sair" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );

  const renderMobileMenu = () => (
    <View accessibilityLabel="ContainerMenu" className="flex flex-row w-full bg-destaqueAzul px-[25px] py-[13px] justify-center">
      <View className="flex w-full max-w-[450px] flex-row justify-between">
        {renderMenuButtonMobile('/', 'home', home)}
        {renderMenuButtonMobile('/games', 'jogos', games)}
        {renderMenuButtonMobile('/friends', 'amigos', friends)}
        {renderMenuButtonMobile('/settings', 'configuracoes')}
        {renderMenuButtonMobile('/help', 'chat', help)}
      </View>
    </View>
  );

  return isMobile ? renderMobileMenu() : renderDesktopMenu();
}
