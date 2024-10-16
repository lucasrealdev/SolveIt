import React, { useRef, useEffect, useState } from "react";
import { Text, View, TouchableOpacity, TextInput, Image, StyleSheet, StatusBar, Pressable, SafeAreaView, ScrollView, Animated, useWindowDimensions } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import Post from "@/components/Post";
import { base64Image, base64Image2, Imagem64Agua } from "./base64Image";
import SearchHeader from "@/components/SearchHeader";

export default function Perfil() {
  const animation = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions(); // Obtenha a largura da janela
  const [buttonWidth, setButtonWidth] = useState(0);

  const moveToPublicacoes = () => {
    Animated.timing(animation, {
      toValue: 0, // 0% - Começo da tela
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const moveToInformacoes = () => {
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View accessibilityLabel="Main-Content" className="flex-1 flex gap-[5px] bg-white pb-[40px] items-center">
          <SearchHeader />

          <View accessibilityLabel="BannerPerfil" className="flex w-full max-w-[700px]">
            <Image source={require('../assets/Banner.png')} className="w-full" resizeMode="cover" />
            <View className="w-full flex flex-row justify-between items-end px-[20px] mt-[-75px]">
              <Image source={require('../assets/pessoa.png')} className="border-[3px] rounded-full w-[140px] h-[140px]" resizeMode="cover" />
              <Pressable className="bg-destaqueAzul h-fit px-[20px] py-[12px] rounded-full ">
                <Text className="text-white font-bold text-[16px]">Seguir</Text>
              </Pressable>
            </View>
          </View>

          <View accessibilityLabel="ContainerPerfilInfo" className="flex w-[100%] max-w-[700px] px-[10px] gap-[10px]">
            <Text className="font-bold text-[20px] bg-gradient-to-r from-emerald-400 via-violet-600 to-yellow-500 bg-clip-text text-transparent">Rodrigo Silva 1223</Text>
            <Text className="text-[16px] ">Olá! 👋 Eu tenho 19 anos, gosto do mundo de algoritmos e sou estudante da Tecnologia da Informação.</Text>

            <View accessibilityLabel="Buttons" className="w-full h-[55px] rounded-[20px] flex-row items-center justify-between max-w-[500px] bg-[#252628]">
              <Animated.View style={[styles.activeBar, { transform: [{ translateX }], width: buttonWidth }]} />

              <Pressable style={styles.button} onPress={moveToPublicacoes} onLayout={handleButtonLayout}>
                <Text className="text-white text-[19px] font-bold">Publicações</Text>
              </Pressable>

              <Pressable style={styles.button} onPress={moveToInformacoes} onLayout={handleButtonLayout}>
                <Text className="text-white text-[19px] font-bold">Informações</Text>
              </Pressable>
            </View>

            <View accessibilityLabel="PostMessage">
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
            </View>

            <View accessibilityLabel="PostMessageTwo">
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const SearchBar = () => (
  <View accessibilityLabel="SearchBar" className="flex-1 flex flex-row border-[1.9px] py-[7px] px-[15px] rounded-[123px] border-[#CBD5E1] bg-white items-center">
    <TextInput
      placeholder="Pesquise Problemas"
      className="flex-1 text-[#475569] text-base outline-none font-medium"
      placeholderTextColor="#475569"
    />
    <Ionicons name="search" size={26} color="#475569" />
  </View>
);

const AddPostButton = () => (
  <TouchableOpacity className="ml-4 py-[7px] px-[20px] bg-[#10B981] rounded-[123px] flex-row items-center ">
    <Text className="text-white text-base mr-2 font-bold text-[16px]">Adicionar nova postagem</Text>
    <Ionicons name="add" size={26} color="#fff" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    // Estilos do ScrollView, se necessário
  },
  activeBar: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#3692C5',
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
