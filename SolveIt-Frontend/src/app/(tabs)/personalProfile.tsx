import React, { useRef, useState } from "react";
import { Text, View, Image, StyleSheet, Pressable, ScrollView, Animated } from "react-native";
import { base64Image, base64Image2, Imagem64Agua } from "../../assets/images/base64Image";
import { useRouter } from 'expo-router';
import Post from "@/components/Post";
import CustomIcons from "@/assets/icons/CustomIcons";
import images from "@/constants/images";
import ButtonScale from "@/components/ButtonScale";
import HoverColorComponent from "@/components/HoverColorComponent";
import colors from "@/constants/colors";

const PersonalProfile = () => {
  const animation = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const [buttonWidth, setButtonWidth] = useState(0);

  const moveTo = (value) => {
    Animated.timing(animation, {
      toValue: value,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, buttonWidth],
  });

  const handleButtonLayout = ({ nativeEvent }) => {
    setButtonWidth(nativeEvent.layout.width);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1 bg-white">
      <View className="flex-1 bg-white pb-[40px] items-center">
        <View className="flex w-full max-w-[700px]">
          <View className="relative">
            <Image source={images.banner} className="w-full rounded-b-md h-[200px]" resizeMode="cover"/>
            <ButtonScale
            className="absolute w-8 h-8 rounded-full bg-white ml-2 mt-2 border border-borderStandardLight flex items-center justify-center"
            onPress={() => router.back()}
            scale={1.04}>
              <CustomIcons name="anterior" color="#475569" size={24} />
            </ButtonScale>
          </View>
          <View className="flex flex-row justify-between items-end px-[20px] mt-[-75px]">
            <Image source={images.person} className="border-[3px] rounded-full w-[140px] h-[140px]" resizeMode="cover" />
            <HoverColorComponent colorHover={colors.primaryStandardDark.hover} colorPressIn={colors.primaryStandardDark.pressIn}>
              <Text className="underline font-bold" style={{color: colors.primaryStandardDark.standard}}>Editar Perfil</Text>
            </HoverColorComponent>
          </View>
        </View>

        <View className="flex w-full max-w-[700px] px-[10px] gap-[10px]">
          <Text className="font-bold text-xl text-textStandardDark">Rodrigo Silva 1223</Text>
          <Text className="text-base">Olá! 👋 Eu tenho 19 anos, gosto do mundo de algoritmos e sou estudante da Tecnologia da Informação.</Text>
          <View className="w-full mt-1 gap-4 items-center justify-center flex-row">
            <ButtonScale className="flex-col justify-center items-center" scale={1.05}>
              <Text className="text-textStandardDark font-semibold text-lg">1000</Text>
              <Text className="text-textSecondary font-semibold text-lg">Seguidores</Text>
            </ButtonScale>

            <ButtonScale className="flex-col justify-center items-center" scale={1.05}>
              <Text className="text-textStandardDark font-semibold text-lg">1000</Text>
              <Text className="text-textSecondary font-semibold text-lg">Seguindo</Text>
            </ButtonScale>
          </View>
          <View className="w-full items-center mb-4 mt-2">
            <View className="flex-row items-center justify-between w-full h-[50px] rounded-[20px] bg-textStandardDark max-w-[420px] relative">
              <Animated.View style={[styles.activeBar, { transform: [{ translateX }], width: buttonWidth }]} />
              {["Publicações", "Informações"].map((title, index) => (
                <Pressable key={index} className="flex-1 justify-center items-center bg-transparent" onPress={() => moveTo(index)} onLayout={handleButtonLayout}>
                  <Text className="text-white text-lg font-semibold">{title}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Post
              FotoPerfil={base64Image2}
              CategoriaPost="Questões Ambientais"
              Comentarios={null}
              Compartilhamentos={120}
              Curtidas={1220}
              DescricaoPost="A escassez de água afeta milhões de pessoas ao redor do mundo. Este tema explora as causas, como mudanças climáticas e má gestão de recursos hídricos, e sugere soluções sustentáveis para o futuro."
              HashtagPost={['crise', 'sustentabilidade', '']}
              NomePerfil="Rodrigo Silva 1223"
              TituloPost="A Crise Global da Água: Desafios e Soluções"
              ImagemPost={Imagem64Agua}
          />

          <Post
              FotoPerfil={base64Image}
              CategoriaPost="Ambiental"
              Comentarios={null}
              Compartilhamentos={4}
              Curtidas={20}
              DescricaoPost="De acordo com o ministério do meio ambiente, São Paulo está entre as 10 cidades mais poluídas do mundo."
              HashtagPost={['energia', 'sustentabilidade']}
              NomePerfil="AAAA GUilherme"
              TituloPost="Queimadas no Estado de São Paulo"
            />
            
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  activeBar: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#3692C5',
    borderRadius: 20,
  }
});

export default PersonalProfile;