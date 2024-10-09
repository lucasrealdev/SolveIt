import MenuRight from "@/components/MenuRight";
import { Button, ButtonText } from "@/components/button";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import Post from '@/components/Post'
import { base64Image, base64Image2, Imagem64Agua } from "./base64Image";

export default function Index() {
  const comentarios = [
    { autor: 'João', texto: 'Ótima notícia!' },
    { autor: 'Maria', texto: 'Triste saber disso.' },
    { autor: 'Carlos', texto: 'É complicado...' },
  ];
  
  return (
    
    <View className="flex-1 flex-row bg-white">
      {/* Primeira View com largura mínima de 720px apenas em telas maiores que 1024px */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="m-8">
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
      </ScrollView>
      <MenuRight />
    </View>
  );
}
