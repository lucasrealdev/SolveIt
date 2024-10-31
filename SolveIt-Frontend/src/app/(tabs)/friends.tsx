import React, { useRef, useState } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import CustomIcons from "@/assets/icons/CustomIcons";
import CardAmigo from "@/components/CardFriend";
import SearchHeader from "@/components/SearchHeader";

export default function Friends() {
  const [isHoveredVerTudo, setIsHoveredVerTudo] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const [buttonWidth, setButtonWidth] = useState(0);

  const moveToSeguidores = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const moveToSeguindo = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, buttonWidth],
  });

  const handleButtonLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setButtonWidth(width);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      <SearchHeader />
      <View className="flex-1 bg-backgroundStandardDark items-center">
        <View className="max-w-[1000px] w-full bg-backgroundStandardDark px-[10px] py-6 gap-4">
          <View accessibilityLabel="ContainerSugestaoAmigos">
            <Text className="font-bold text-xl text-textStandardDark mb-6">
              Sugestão de amigos
            </Text>

            <View accessibilityLabel="ContainerAmigos" className="rounded-[10px] border border-borderStandardLight bg-white">
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

              <Text className={`font-bold text-[15px] ${isHoveredVerTudo ? 'text-[#049681]' : 'text-accentStandardDark'}`}>
                Carregar Mais
              </Text>
              
              <CustomIcons name="mais"
                color={isHoveredVerTudo ? '#049681' : '#01B198'}
                size={20} />
            </Pressable>
          </View>

          <View accessibilityLabel="Linha" className="w-full bg-borderStandardLight h-[1px] rounded-xl"></View>

          <View accessibilityLabel="Buttons" className="w-full h-[45px] rounded-[20px] flex-row items-center justify-between max-w-[311px] bg-textStandardDark">
            <Animated.View style={[styles.activeBar, { transform: [{ translateX }], width: buttonWidth }]} />

            <Pressable className="flex-1 items-center justify-center bg-transparent" onPress={moveToSeguidores} onLayout={handleButtonLayout}>
              <Text className="text-white text-[14px] font-bold">Seguidores</Text>
            </Pressable>

            <Pressable className="flex-1 items-center justify-center bg-transparent" onPress={moveToSeguindo} onLayout={handleButtonLayout}>
              <Text className="text-white text-[14px] font-bold">Seguindo</Text>
            </Pressable>
          </View>

          <View accessibilityLabel="ContainerSeguidores" className="rounded-[10px] border border-borderStandardLight bg-white">
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
  activeBar: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#0172B1',
    borderRadius: 20,
  }
});