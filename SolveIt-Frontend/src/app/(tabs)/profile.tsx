import React, { useRef, useState } from "react";
import { Text, View, Image, StyleSheet, Pressable, ScrollView, Animated } from "react-native";
import { base64Image, base64Image2, Imagem64Agua } from "../../assets/images/base64Image";
import { useRouter } from 'expo-router';
import Post from "@/components/Post";
import CustomIcons from "@/assets/icons/CustomIcons";
import images from "@/constants/images";

const Profile = () => {
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
            <Image source={images.banner} className="w-full" resizeMode="cover"/>
            <Pressable 
              className="absolute w-8 h-8 rounded-full bg-white left-[10px] top-[10px] border border-[#E2E8F0] flex items-center justify-center"
              onPress={() => router.back()}
            >
              <CustomIcons name="anterior" color="#475569" size={24} />
            </Pressable>
          </View>
          <View className="flex flex-row justify-between items-end px-[20px] mt-[-75px]">
            <Image source={images.person} className="border-[3px] rounded-full w-[140px] h-[140px]" resizeMode="cover" />
            <Pressable className="bg-destaqueAzul px-[20px] py-[12px] rounded-full">
              <Text className="text-white font-bold text-[16px]">Seguir</Text>
            </Pressable>
          </View>
        </View>

        <View className="flex w-full max-w-[700px] px-[10px] gap-[10px]">
          <Text className="font-bold text-[20px] bg-gradient-to-r from-emerald-400 via-violet-600 to-yellow-500 bg-clip-text text-transparent">Rodrigo Silva 1223</Text>
          <Text className="text-[16px]">Olá! 👋 Eu tenho 19 anos, gosto do mundo de algoritmos e sou estudante da Tecnologia da Informação.</Text>

          <View className="flex-row items-center justify-between w-full h-[50px] rounded-[20px] bg-[#252628] max-w-[420px] relative">
            <Animated.View style={[styles.activeBar, { transform: [{ translateX }], width: buttonWidth }]} />
            {["Publicações", "Informações"].map((title, index) => (
              <Pressable key={index} className="flex-1 justify-center items-center bg-transparent" onPress={() => moveTo(index)} onLayout={handleButtonLayout}>
                <Text className="text-white text-[19px] font-semibold">{title}</Text>
              </Pressable>
            ))}
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

export default Profile;
