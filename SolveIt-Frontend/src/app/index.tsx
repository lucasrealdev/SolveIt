import MenuRight from "@/components/MenuRight";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Post from '@/components/Post'
import { base64Image2, Imagem64Agua } from "./base64Image";
import SearchHeader from "@/components/SearchHeader";
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
  const comentarios = [
    { autor: 'João', texto: 'Ótima notícia!' },
    { autor: 'Maria', texto: 'Triste saber disso.' },
    { autor: 'Carlos', texto: 'É complicado...' },
  ];
  
  return (
    
    <View className="flex-1 flex-row">
      {/* Primeira View com largura mínima de 720px apenas em telas maiores que 1024px */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 bg-[#F8FAFC]">
        <SearchHeader/>
        <View className="m-2 flex items-center">
          <View className="max-w-[700px] gap-4">
          <BarStory/>
          <Post
            FotoPerfil={base64Image2}
            CategoriaPost="Questões Ambientais"
            Comentarios={comentarios} // Passando o array de comentários
            Compartilhamentos={241}
            Curtidas={1674}
            DescricaoPost="A escassez de água afeta milhões de pessoas ao redor do mundo. Este tema explora as causas, como mudanças climáticas e má gestão de recursos hídricos, e sugere soluções sustentáveis para o futuro."
            HashtagPost={['energia', 'sustentabilidade', 'inovação']}
            NomePerfil="Rodrigo Silva 1223"
            TituloPost="A Crise Global da Água: Desafios e Soluções"
            ImagemPost={Imagem64Agua}
          />
          </View>
        </View>
      </ScrollView>
      <MenuRight />
    </View>
  );
}

const BarStory: React.FC = () => (
  <View accessibilityLabel="ContainerStory" className="flex p-[20px] gap-[16px] bg-white rounded-[24px] shadow-custom flex-row max-w-[700px]">
    <View accessibilityLabel="ContainerProfile" className="flex justify-center items-center w-fit">
      <LinearGradient accessibilityLabel="ContainerImage" colors={['#4F46E5', '#C622FF', '#FF2222', '#FFA439']}
        style={styles.containerImage}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}>
        <Image source={require('../assets/pessoa.png')} className="border-white border-[2px] rounded-full w-[64px] h-[64px]" />
      </LinearGradient>

      <Text>Hihanna</Text>
    </View>

    <View accessibilityLabel="ContainerProfile" className="flex justify-center items-center w-fit">
      <LinearGradient accessibilityLabel="ContainerImage" colors={['#4F46E5', '#C622FF', '#FF2222', '#FFA439']}
        style={styles.containerImage}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}>
        <Image source={require('../assets/pessoa.png')} className="border-white border-[2px] rounded-full w-[64px] h-[64px]" />
      </LinearGradient>

      <Text>Hihanna</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  containerImage: {
    alignSelf: 'flex-start',
    padding: 3,
    borderRadius: 9999, // full rounded
  },
});