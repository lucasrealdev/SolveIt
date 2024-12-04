import React, { useState } from "react";
import { Pressable, Text, View, useWindowDimensions, ActivityIndicator } from "react-native";
import { useRouter, usePathname } from "expo-router";
import CustomIcons from "@/assets/icons/CustomIcons";
import { useGlobalContext } from "@/context/GlobalProvider";
import { signOut } from "@/lib/appwriteConfig";
import images from "@/constants/images";
import { useAlert } from "@/context/AlertContext";
import ButtonScale from "../ButtonScale";
import colors from "@/constants/colors";
import { Image as ExpoImage } from 'expo-image';

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
  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

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
              <ExpoImage
                source={{ uri: user.avatar }}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 9999
                }}
                contentFit="cover"
                placeholder={{ blurhash }}
                cachePolicy="memory-disk"
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

  const isMobile = width < 771;
  const isTablet = height <= 720 ? "hidden" : "";
  const containerWidth = width >= 1400 ? 312 : 280;

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    showAlert("Sucesso", "Você saiu da conta com sucesso!");
    router.replace("/signin");
  };

  const renderDesktopMenu = () => (
    <View aria-label="ContainerMenu" className="flex h-[100vh] justify-between items-start bg-primaryStandardDark px-[16px] py-[32px]" style={{ width: containerWidth }}>
      <View className="flex gap-[32px] w-full">
        <ExpoImage style={{ width: 115, height: 32 }} source={images.logo}
          contentFit="cover"
          placeholder={{ blurhash }}
          cachePolicy="none" />
        <View className="flex rounded-[124px] border border-[#3692C5] items-center justify-center px-[12px] py-[8px]">
          <Text className="text-white font-semibold text-center">"A necessidade é a mãe da invenção"    Platão</Text>
        </View>
        <View className="flex w-full gap-[8px]">
          {renderMenuButton('/', 'Descubra o mundo', 'home', home)}
          {renderMenuButton('/games', 'Jogos', 'jogos', games)}
          {renderMenuButton('/friends', 'Amigos', 'amigos', friends)}
          {renderMenuButton('/information', 'Configurações', 'configuracoes')}
          {renderMenuButton('/help', 'Ajuda e Suporte', 'ajuda', help)}
        </View>
      </View>

      <View className="flex w-full gap-6">
        {isVisible && (
          <View aria-label="CardPremium" className={`flex gap-[16px] p-[16px] bg-secondaryStandardDark rounded-[24px] w-full ${isTablet}`}>
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
              <Pressable onPress={() => setIsVisible(false)}><Text className="text-white font-bold">Recusar</Text></Pressable>
              <Pressable onPress={() => navigateTo("/premium")}><Text className="text-[#C7FEF1] font-bold">Garantir</Text></Pressable>
            </View>
          </View>
        )}
        <View aria-label="CardConta" className="flex gap-4 pt-6 border-t border-borderStandard flex-row items-end">
          <View className="flex flex-1 flex-row items-center gap-3">
            {
              user && user.avatar ? (
                // Renderize a imagem quando user.avatar estiver disponível
                <ButtonScale scale={1.05} onPress={() => router.push("/personalprofile")}>
                  <ExpoImage
                    source={{ uri: user.avatar }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 9999
                    }}
                    contentFit="cover"
                    placeholder={{ blurhash }}
                    cachePolicy="memory-disk"
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
                  <Text className="text-textStandard font-medium text-sm">Membro {user.accountType}</Text>
                </>
              ) : (
                <Pressable onPress={() => router.push("/signin")}>
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
    <View aria-label="ContainerMenu" className="flex flex-row w-full bg-destaqueAzul px-[25px] py-[13px] justify-center">
      <View className="flex w-full max-w-[400px] flex-row justify-between">
        {renderMenuButtonMobile('/', 'home', home)}
        {renderMenuButtonMobile('/games', 'jogos', games)}
        {renderMenuButtonMobile('/createpost', 'createPost')}
        {renderMenuButtonMobile('/friends', 'amigos', friends)}
        {renderMenuButtonMobile('/personalprofile', 'profile', profile)}
      </View>
    </View>
  );

  return isMobile ? renderMobileMenu() : renderDesktopMenu();
}