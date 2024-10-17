import React, { useState } from "react";
import { Pressable, Text, View, Image, TextInput, useWindowDimensions } from "react-native";
import { Icon } from "@/assets/Icon";
import IconsPersonalizado from "@/assets/IconesPersonalizados";
import { useRouter, usePathname } from "expo-router";

interface MenuProps {
  inicial?: number;
  jogos?: number;
  amigos?: number;
  ajuda?: number;
}

export default function Menu({ inicial, jogos, amigos, ajuda }: MenuProps) {
  const primaryColor = "#01B198";
  const greyColor = "#3692C5";
  const router = useRouter();
  const pathname = usePathname();
  const { width, height } = useWindowDimensions();

  const [isVisible, setIsVisible] = useState(true); // Estado para controlar visibilidade

  const handleClose = () => {
    setIsVisible(false); // Fecha o card ao pressionar o botão
  };

  const navigateTo = (route: string) => {
    if (pathname !== route) {
      router.push(route);
    } else {
      router.replace(route); // Substitui a rota atual, evitando duplicação
    }
  };

  const renderMenuButton = (
    route: string,
    label: string,
    iconName: string,
    notificationCount?: number
  ) => {
    const isActive = pathname === route;
    const iconColor = isActive ? primaryColor : greyColor;

    return (
      <Pressable
        className="flex w-full items-center gap-[8px] justify-center flex-row px-[12px] py-[10px]"
        onPress={() => navigateTo(route)}
      >
        <View className="flex flex-1 gap-[8px] flex-row items-center">
          <IconsPersonalizado name={iconName} size={26} color={iconColor} />
          <Text className="text-white text-base font-bold">{label}</Text>
        </View>
        {notificationCount !== undefined && (
          <View
            accessibilityLabel="notificacao"
            className="flex justify-center items-center bg-white px-[10px] py-[3px] rounded-full"
          >
            <Text className="text-[#0172B1] text-[14px] font-semibold">
              {notificationCount}
            </Text>
          </View>
        )}
      </Pressable>
    );
  };

  const renderMenuButtonMobile = (
    route: string,
    iconName: string,
    notificationCount?: number
  ) => {
    const isActive = pathname === route;
    const iconColor = isActive ? primaryColor : greyColor;

    return (
      <Pressable
        className="flex items-center justify-center"
        onPress={() => navigateTo(route)}
      >
        <View className="relative">
          {notificationCount !== undefined && (
            <View className="absolute bg-white w-4 h-4 rounded-full items-center justify-center top-[-5px] right-[-10px]">
              <Text className="text-[#0172B1] text-[10px] font-semibold">
                {notificationCount}
              </Text>
            </View>
          )}
          <IconsPersonalizado name={iconName} size={26} color={iconColor} />
        </View>
      </Pressable>
    );
  };

  const isMobile = width < 770;
  const isTablet = height <= 720 ? "hidden" : "";
  const containerWidth = width >= 1400 ? 312 : 280;

  if (!isMobile) {
    return (
      <View
        accessibilityLabel="ContainerMenu"
        className="flex h-[100vh] justify-between items-start bg-destaqueAzul px-[16px] py-[32px]"
        style={{ width: containerWidth }}
      >
        <View accessibilityLabel="ContainerHeaderMenu" className="flex gap-[32px] w-full">
          <Image
            style={{ width: 115, height: 32 }}
            source={{
              uri: 'https://i.ibb.co/wBqcsxM/Logo.png',
            }}
          />
          <View
            accessibilityLabel="ContainerPesquisa"
            className="flex gap-[6px] rounded-[124px] border border-[#3692C5] h-[40px] flex-row items-center p-[12px] py-[8px]"
          >
            <Icon name="search1" type="AntDesign" size={17} color="#FFFFFF" />
            <TextInput
              className="outline-none flex-1 text-white text-[16px] h-[24px] pb-[2px] font-medium"
              placeholder="Procurar"
              placeholderTextColor="#fff"
            />
          </View>
          <View className="flex w-full gap-[8px]">
            {renderMenuButton('/', 'Descubra o mundo', 'home', inicial)}
            {renderMenuButton('/jogos', 'Jogos', 'jogos', jogos)}
            {renderMenuButton('/amigos', 'Amigos', 'amigos', amigos)}
            {renderMenuButton('/configuracoes', 'Configurações', 'configuracoes')}
            {renderMenuButton('/ajuda', 'Ajuda e Suporte', 'ajuda', ajuda)}
          </View>
        </View>

        <View accessibilityLabel="ContainerConta" className="flex w-full gap-6">
          {/* Renderiza o card premium somente se estiver visível */}
          {isVisible && (
            <View
              accessibilityLabel="CardPremium"
              className={`flex gap-[16px] p-[16px] bg-[#3692C5] rounded-[24px] w-full ${isTablet}`}
            >
              <View className="flex flex-row justify-between">
                <View className="w-[40px] h-[40px] flex bg-[#49A7DB] rounded-full items-center justify-center">
                  <IconsPersonalizado name="perigo" size={20} color="#FFF" />
                </View>
                <Pressable onPress={handleClose}>
                  <IconsPersonalizado name="fechar" size={14} color="#FFF" />
                </Pressable>
              </View>
              <Text className="text-white text-[14px]">
                Aproveite os benefícios premiuns do app, exclusivos para você!
              </Text>
              <View className="flex flex-row gap-4">
                <Pressable>
                  <Text className="text-[#C7D2FE] font-bold">Recusar</Text>
                </Pressable>
                <Pressable>
                  <Text className="text-white font-bold">Garantir</Text>
                </Pressable>
              </View>
            </View>
          )}

          <View
            accessibilityLabel="CardConta"
            className="flex gap-4 pt-6 border-t border-[#C7D2FE] flex-row items-end"
          >
            <Pressable className="flex flex-1 flex-row items-center gap-3">
              <Image
                className="w-[40px] h-[40px] rounded-full"
                source={require('@/assets/icon.png')}
              />
              <View className="flex gap-[2px]">
                <Text className="text-white font-bold text-[16px]">Azunyan U. Wu</Text>
                <Text className="text-white font-medium text-[14px]">Membro Básico</Text>
              </View>
            </Pressable>
            <Pressable>
              <IconsPersonalizado name="sair" size={24} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View
        accessibilityLabel="ContainerMenu"
        className="flex flex-row w-full bg-destaqueAzul px-[25px] py-[13px] justify-center"
      >
        <View className="flex w-full max-w-[450px] flex-row justify-between">
          {renderMenuButtonMobile('/', 'home', inicial)}
          {renderMenuButtonMobile('/jogos', 'jogos', jogos)}
          {renderMenuButtonMobile('/amigos', 'amigos', amigos)}
          {renderMenuButtonMobile('/configuracoes', 'configuracoes')}
          {renderMenuButtonMobile('/conversas', 'chat', ajuda)}
        </View>
      </View>
    );
  }
}
