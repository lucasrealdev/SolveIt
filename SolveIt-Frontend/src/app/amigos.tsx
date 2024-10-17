import IconesPersonalizados from "@/assets/IconesPersonalizados";
import CardAmigo from "@/components/CardAmigo";
import SearchHeader from "@/components/SearchHeader";
import { usePathname, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Amigos() {
  // Estado para hover de amigos
  const [hoveredFriends, setHoveredFriends] = useState(Array(5).fill(false));
  const [isHoveredVerTudo, setIsHoveredVerTudo] = useState(false);

  const animation = useRef(new Animated.Value(0)).current;
  const [buttonWidth, setButtonWidth] = useState(0);

  const moveToSeguidores = () => {
    Animated.timing(animation, {
      toValue: 0, // 0% - Começo da tela
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const moveToSeguindo = () => {
    Animated.timing(animation, {
      toValue: 1, // 1 - Metade da tela
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, buttonWidth], // Mova a barra para a largura do botão
  });

  const handleButtonLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setButtonWidth(width); // Armazene a largura do botão
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      <SearchHeader />
      <View className="flex-1 bg-[#F8FAFC] items-center">
        <View className="max-w-[1000px] w-full bg-[#F8FAFC] px-[10px] py-6 gap-4">
          <View accessibilityLabel="ContainerSugestaoAmigos">
            <Text className="font-bold text-lg text-[#1E293B] mb-6">
              Sugestão de amigos
            </Text>

            <View accessibilityLabel="ContainerAmigos" className="rounded-[10px] border border-[#E2E8F0] bg-white">
              <CardAmigo label="seguidores" />
              <CardAmigo label="seguidores" />
              <CardAmigo label="seguidores" />
              <CardAmigo label="seguidores" />
              <CardAmigo label="seguidores" />
            </View>

            <Pressable
              onHoverIn={() => setIsHoveredVerTudo(true)}
              onHoverOut={() => setIsHoveredVerTudo(false)}
              className="flex flex-row items-end gap-2 w-fit mt-4">
              <Text className={`font-bold text-[14px] ${isHoveredVerTudo ? 'text-[#049681]' : 'text-destaqueVerde'}`}>
                Carregar Mais
              </Text>
              <IconesPersonalizados name="mais"
                color={isHoveredVerTudo ? '#049681' : '#01B198'}
                size={20} />
            </Pressable>
          </View>

          <View accessibilityLabel="Linha" className="w-full bg-[#E2E8F0] h-[1px] rounded-xl"></View>

          <View accessibilityLabel="Buttons" className="w-full h-[45px] rounded-[20px] flex-row items-center justify-between max-w-[311px] bg-[#252628]">
            <Animated.View style={[styles.activeBar, { transform: [{ translateX }], width: buttonWidth }]} />

            <Pressable style={styles.button} onPress={moveToSeguidores} onLayout={handleButtonLayout}>
              <Text className="text-white text-[14px] font-bold">Seguidores</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={moveToSeguindo} onLayout={handleButtonLayout}>
              <Text className="text-white text-[14px] font-bold">Seguindo</Text>
            </Pressable>
          </View>

          <View accessibilityLabel="ContainerSeguidores" className="rounded-[10px] border border-[#E2E8F0] bg-white">
            <CardAmigo label="amigo" />
            <CardAmigo label="amigo" />
            <CardAmigo label="amigo" />
            <CardAmigo label="amigo" />
            <CardAmigo label="amigo" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageAmigos: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    borderRadius: 9999,
  },
  activeBar: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#0172B1',
    borderRadius: 20,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: '100%',
  },
});