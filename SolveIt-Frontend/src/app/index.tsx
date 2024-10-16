import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import MenuRight from "@/components/MenuRight";
import Post from '@/components/Post';
import { base64Image2, Imagem64Agua } from "./base64Image";
import SearchHeader from "@/components/SearchHeader";
import { LinearGradient } from 'expo-linear-gradient';
import IconesPersonalizados from "@/assets/IconesPersonalizados";

export default function Index() {
  const comentarios = [
    { autor: 'João', texto: 'Ótima notícia!' },
    { autor: 'Maria', texto: 'Triste saber disso.' },
    { autor: 'Carlos', texto: 'É complicado...' },
  ];

  return (
    <View className="flex-1 flex-row">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 bg-[#F8FAFC]">
        <SearchHeader />
        <View className="m-2 flex items-center">
          <View className="max-w-[800px] gap-4">
            <BarStory />
            <Post
              FotoPerfil={base64Image2}
              CategoriaPost="Questões Ambientais"
              Comentarios={comentarios}
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

const BarStory: React.FC = () => {
  const users = [
    { name: "x_ae-23b" },
    { name: "maisenpai" },
  ];

  return (
    <View accessibilityLabel="ContainerStory" className="flex p-[20px] gap-[16px] bg-white rounded-[24px] shadow-[0px_12px_16px_-4px_rgba(16,_24,_40,_0.09)] flex-row items-center border border-[#E2E8F0]">
      {users.map((user, index) => (
        <Pressable key={index} accessibilityLabel="ContainerProfile" className="flex justify-center items-center w-fit">
          <LinearGradient
            accessibilityLabel="ContainerImage"
            colors={['#4F46E5', '#C622FF', '#FF2222', '#FFA439']}
            style={styles.containerImage}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 1, y: 1 }}
          >
            <Image source={require('../assets/pessoa.png')} className="border-white border-[2px] rounded-full w-[64px] h-[64px]" />
          </LinearGradient>
          <Text className="text-textoCinzaEscuro font-semibold">{user.name}</Text>
        </Pressable>
      ))}
      <Pressable className="w-8 h-8 absolute rounded-full bg-white right-[10px] border border-[#E2E8F0] flex items-center justify-center">
        <IconesPersonalizados name="proximo" color="#475569" size={20} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  containerImage: {
    alignSelf: 'flex-start',
    padding: 3,
    borderRadius: 9999, // full rounded
  },
});
