import React, { useState } from "react";
import { Pressable, Text, View, Image, StyleSheet, useWindowDimensions, Animated } from "react-native";
import { usePathname, useRouter } from "expo-router";

import CustomIcons from "@/assets/icons/CustomIcons";
import CardAmigo from "./CardFriend";
import images from "@/constants/images";

export default function MenuRight() {
  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const pathname = usePathname();
  const [scaleChat] = useState(new Animated.Value(1));
  const [scaleNotificacao] = useState(new Animated.Value(1));
  const [isHoveredVerTudo, setIsHoveredVerTudo] = useState(false);

  const handleHover = (scaleValue, toValue) => {
    Animated.spring(scaleValue, {
      toValue,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const navigateTo = (route) => {
    pathname !== route ? router.push(route) : router.replace(route);
  };

  const renderEventCard = ({ title, date, icon }, index) => (
    <View key={index} accessibilityLabel="CardEvento" className="flex flex-row border-t border-borderStandardLight py-[12px] gap-3 items-center">
      <View className="w-[40px] h-[40px] flex items-center justify-center bg-[#EEF2FF] rounded-full">
        <CustomIcons name={icon} color="#01B198" size={20} />
      </View>
      <View className="flex flex-1">
        <Text className="text-textSecondary font-bold text-[14px]">{title}</Text>
        <Text className="text-textSecondary font-normal text-[14px]">{date}</Text>
      </View>
      <CustomIcons name="notificacao" color="#94A3B8" size={20} />
    </View>
  );

  const isMobile = width > 1250;
  const isTablet = height <= 835 ? "hidden" : "";
  const containerWidth = width >= 1400 ? 368 : 320;

  if (!isMobile) return null;

  return (
    <View accessibilityLabel="ContainerMenu" className="flex h-[100vh] border-l border-borderStandardLight bg-white" style={{ width: containerWidth }}>
      <View accessibilityLabel="ContainerHeaderMenu" className="flex w-full px-6 py-[20px] flex-row justify-between border-b border-borderStandardLight">
        <Pressable className="flex justify-center items-end">
          <Image className="w-12 h-12 object-cover rounded-full" source={images.person} />
          <View className="w-3 h-3 bg-[#22C55E] border-white border-[1.5px] rounded-full mt-[-12px]" />
        </Pressable>
        <View className="flex flex-row gap-2">
          {['chat', 'notificacao'].map((icon, index) => {
            const scaleValue = icon === 'chat' ? scaleChat : scaleNotificacao;
            return (
              <Pressable
                key={index}
                className="flex p-[11px] border border-borderStandard rounded-full"
                onHoverIn={() => handleHover(scaleValue, 1.08)}
                onHoverOut={() => handleHover(scaleValue, 1)}
              >
                <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                  <CustomIcons name={icon} size={24} color="#475569" />
                </Animated.View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View accessibilityLabel="ContainerSections" className="flex w-full gap-8 p-6">
        <View accessibilityLabel="ContainerAmigos" className="flex">
          <View accessibilityLabel="ContainerTexto" className="flex flex-row justify-between items-center pb-6">
            <Text className="font-bold text-[18px]">Sugestão de amigos</Text>
            <Pressable
              onHoverIn={() => setIsHoveredVerTudo(true)}
              onHoverOut={() => setIsHoveredVerTudo(false)}
              onPress={() => navigateTo("/friends")}
              className="flex flex-row items-end gap-2"
            >
              <Text className={`font-bold text-[14px] ${isHoveredVerTudo ? 'text-[#049681]' : 'text-accentStandardDark'}`}>
                Ver tudo
              </Text>
              <CustomIcons name="setaDireita" color={isHoveredVerTudo ? '#049681' : '#01B198'} size={20} />
            </Pressable>
          </View>
          {[...Array(5)].map((_, index) => <CardAmigo key={index} label="menu" />)}
        </View>

        <View accessibilityLabel="ContainerEventos" className={isTablet}>
          <View accessibilityLabel="ContainerTexto" className="flex flex-row justify-between items-center pb-6">
            <Text className="font-bold text-[18px]">Próximos eventos</Text>
          </View>
          {[
            { title: "Aniversário do amigo", date: "25 de junho de 2028", icon: "presente" },
            { title: "Feriado", date: "28 de junho de 2028", icon: "moon" },
            { title: "Encontro de grupo", date: "19 de agosto de 2028", icon: "team" },
            { title: "Graduação", date: "22 de dezembro de 2028", icon: "graduacao" },
          ].map(renderEventCard)}
        </View>
      </View>
    </View>
  );
}