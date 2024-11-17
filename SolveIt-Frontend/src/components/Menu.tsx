import React, { useState } from "react";
import { Pressable, Text, View, Image, TextInput, useWindowDimensions, ActivityIndicator } from "react-native";
import { useRouter, usePathname } from "expo-router";
import CustomIcons from "@/assets/icons/CustomIcons";
import { useGlobalContext } from "@/context/GlobalProvider";
import { signOut } from "@/lib/appwriteConfig";
import images from "@/constants/images";
import { useAlert } from "@/context/AlertContext";
import ButtonScale from "./ButtonScale";
import colors from "@/constants/colors";

interface MenuProps {
  home?: number;
  games?: number;
  friends?: number;
  profile?: number;
  help?: number;
}

export default function Menu({ home, games, friends, profile, help }: MenuProps) {
  const primaryColor = "#01B198";
  const greyColor = "#3692C5";
  const router = useRouter();
  const pathname = usePathname();
  const { showAlert } = useAlert();
  const { width, height } = useWindowDimensions();
  const [isVisible, setIsVisible] = useState(true); // Estado para controlar visibilidade
  const { setUser, setIsLogged, user } = useGlobalContext();

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
          {iconName === "profile" ? (
            user && user.avatar ? (
              // Renderize a imagem quando user.avatar estiver disponível
              <Image
                source={{ uri: user.avatar }}
                className="w-[26px] h-[26px] rounded-full"
              />
            ) : (
              // Exibe o ActivityIndicator enquanto user.avatar não estiver disponível
              <ActivityIndicator size="small" color={iconColor} />
            )
          ) : (
            <CustomIcons name={iconName} size={26} color={iconColor} />
          )}
        </View>
      </Pressable>
    );
  };

  const isMobile = width < 770;
  const isTablet = height <= 720 ? "hidden" : "";
  const containerWidth = width >= 1400 ? 312 : 280;

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    showAlert("Sucesso", "Você saiu da conta com sucesso!");
    router.replace("/signIn");
  };

  const renderDesktopMenu = () => (
    <View accessibilityLabel="ContainerMenu" className="flex h-[100vh] justify-between items-start bg-primaryStandardDark px-[16px] py-[32px]" style={{ width: containerWidth }}>
      <View className="flex gap-[32px] w-full">
        <Image style={{ width: 115, height: 32 }} source={images.logo} />
        <View className="flex gap-[6px] rounded-[124px] border border-[#3692C5] h-[40px] flex-row items-center p-[12px] py-[8px]">
          <CustomIcons name="pesquisar" size={17} color="#FFFFFF" />
          <TextInput className="outline-none flex-1 text-white text-base h-[24px] pb-[2px] font-medium" placeholder="Procurar" placeholderTextColor="#fff" keyboardType="default"/>
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
          <View className="flex flex-1 flex-row items-center gap-3">
            {
              user && user.avatar ? (
                // Renderize a imagem quando user.avatar estiver disponível
                <ButtonScale scale={1.05} onPress={() => router.push("/personalProfile")}>
                  <Image
                  source={{ uri: user.avatar }}
                  className="w-[40px] h-[40px] rounded-full"
                  />
                </ButtonScale>
              ) : (
                // Exibe o ActivityIndicator enquanto user.avatar não estiver disponível
                <ActivityIndicator size="small" color={colors.borderStandard.standard} />
              )}
            <View className="flex gap-[2px]">
              {user ? (
                // Se o usuário estiver logado, exiba o nome de usuário e o status de membro
                <>
                  <Text className="text-white font-bold text-base">{user.username}</Text>
                  <Text className="text-textStandard font-medium text-sm">Membro Básico</Text>
                </>
              ) : (
                <Pressable onPress={() => router.push("/signIn")}>
                  <Text className="text-white font-bold text-base">Faça login.</Text>
                </Pressable>
              )}
            </View>
          </View>

          <ButtonScale
            onPress={logout}
            scale={1.1}>
            <CustomIcons name="sair" size={24} color="#FFFFFF" />
          </ButtonScale>
        </View>
      </View>
    </View>
  );

  const renderMobileMenu = () => (
    <View accessibilityLabel="ContainerMenu" className="flex flex-row w-full bg-destaqueAzul px-[25px] py-[13px] justify-center">
      <View className="flex w-full max-w-[400px] flex-row justify-between">
        {renderMenuButtonMobile('/', 'home', home)}
        {renderMenuButtonMobile('/games', 'jogos', games)}
        {renderMenuButtonMobile('/createPost', 'createPost')}
        {renderMenuButtonMobile('/friends', 'amigos', friends)}
        {renderMenuButtonMobile('/settings', 'profile', profile)}
      </View>
    </View>
  );

  return isMobile ? renderMobileMenu() : renderDesktopMenu();
}