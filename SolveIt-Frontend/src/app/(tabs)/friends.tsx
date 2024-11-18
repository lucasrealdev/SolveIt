import React, { useRef, useState } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import CustomIcons from "@/assets/icons/CustomIcons";
import CardAmigo from "@/components/CardFriend";
import SearchHeader from "@/components/SearchHeader";
import HoverColorComponent from "@/components/HoverColorComponent";
import colors from "@/constants/colors";
import ButtonScale from "@/components/ButtonScale";

export default function Friends() {
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
        <View className="max-w-[1000px] w-full bg-backgroundStandardDark px-[10px] py-6 gap-7">

          <View className="gap-3" aria-label="ContainerPerfil">
            <View className="w-full flex-row justify-between items-center">
              <Text className="font-bold text-xl text-textStandardDark text-nowrap">
                Seu Perfil
              </Text>

              <View className="flex-row gap-2 flex-1 items-center justify-end">
                <View aria-label="Buttons" className="w-full h-[45px] rounded-[20px] flex-row items-center justify-between max-w-[311px] bg-textStandardDark">
                  <Animated.View style={[styles.activeBar, { transform: [{ translateX }], width: buttonWidth }]} />

                  <Pressable className="flex-1 items-center justify-center bg-transparent" onPress={moveToSeguidores} onLayout={handleButtonLayout}>
                    <Text className="text-white text-[14px] font-bold">Seguidores</Text>
                  </Pressable>

                  <Pressable className="flex-1 items-center justify-center bg-transparent" onPress={moveToSeguindo} onLayout={handleButtonLayout}>
                    <Text className="text-white text-[14px] font-bold">Seguindo</Text>
                  </Pressable>
                </View>
                <ButtonScale
                  scale={1.07}
                  className="flex p-[11px] border border-borderStandard rounded-full">
                  <CustomIcons name="chat" size={24} color="#475569" />
                </ButtonScale>
              </View>
            </View>

            <View aria-label="ContainerSeguidores" className="rounded-[10px] border border-borderStandardLight bg-white">
              <CardAmigo label="amigo" />
              <CardAmigo label="amigo" />
              <CardAmigo label="amigo" />
              <CardAmigo label="amigo" />
              <CardAmigo label="amigo" />
              <HoverColorComponent className="flex flex-row gap-2 w-full justify-center my-4" colorHover={colors.accentStandardDark.hover}
                colorPressIn={colors.accentStandardDark.pressIn}>
                <Text className="font-bold text-[15px] justify-center" style={{ color: "#01b297" }}>
                  Carregar Mais
                </Text>

                <CustomIcons name="mais"
                  color='#01B198'
                  size={20} />
              </HoverColorComponent>
            </View>
          </View>


          <View aria-label="ContainerSugestaoAmigos" className="gap-3">
            <View className="w-full flex flex-row justify-between items-center">
              <Text className="font-bold text-xl text-textStandardDark">
                Sugestão de amigos
              </Text>
            </View>

            <View aria-label="ContainerAmigos" className="rounded-[10px] border border-borderStandardLight bg-white">
              <CardAmigo label="seguidores" />
              <CardAmigo label="seguidores" />
              <CardAmigo label="seguidores" />
              <CardAmigo label="seguidores" />
              <CardAmigo label="seguidores" />
              <HoverColorComponent className="flex flex-row gap-2 w-full justify-center my-4" colorHover={colors.accentStandardDark.hover}
                colorPressIn={colors.accentStandardDark.pressIn}>
                <Text className="font-bold text-[15px] justify-center" style={{ color: "#01b297" }}>
                  Carregar Mais
                </Text>

                <CustomIcons name="mais"
                  color='#01B198'
                  size={20} />
              </HoverColorComponent>
            </View>
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