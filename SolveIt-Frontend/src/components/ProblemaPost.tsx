import React from 'react';
import { View, Text, Image } from 'react-native';
import { SlOptionsVertical } from "react-icons/sl";
import { CiBookmark } from "react-icons/ci";
import { LuThumbsUp } from "react-icons/lu";
import { PiChatDotsBold, PiShareFatBold } from "react-icons/pi"; 

interface Comentario {
  autor: string;
  texto: string;
}

interface PostProps {
  FotoPerfil: string; // URL da imagem do perfil
  NomePerfil: string; // Nome do usuário
  CategoriaPost: string; // Categoria do post
  TituloPost: string; // Título do post
  DescricaoPost: string; // Descrição do post
  HashtagPost: string[]; // Array de hashtags
  Curtidas: number; // Número de curtidas
  Comentarios: Comentario[]; // Array de objetos de comentários
  Compartilhamentos: number; // Número de compartilhamentos
  ImagemPost?: string; // URL da imagem do post (opcional)
}

const Post: React.FC<PostProps> = ({
  FotoPerfil,
  NomePerfil,
  CategoriaPost,
  TituloPost,
  DescricaoPost,
  HashtagPost,
  Curtidas,
  Comentarios,
  Compartilhamentos,
  ImagemPost,
}) => {
  return (
    <View accessibilityLabel="Post" className='bg-white rounded-[24px] flex w-full border border-[#E2E8F0]'>
      <View accessibilityLabel="HeaderPost" className='flex w-full p-[20px] gap-[15px] border-b border-[#E2E8F0] flex-row items-center'>
        <View accessibilityLabel="ContainerProfile" className='flex flex-1 flex-row '>
          <Image source={{ uri: FotoPerfil }}
          className="border-white border-[2px] rounded-full w-[64px] h-[64px]"/>

          <View accessibilityLabel="ContainerText">
            <Text>{NomePerfil}</Text>
            <Text>{CategoriaPost}</Text>
          </View>
        </View>
        <SlOptionsVertical color='#CBD5E1'/>
      </View>
      
      <View accessibilityLabel="BodyPost" className='w-full flex px-[20px] py-[16px] gap-[16px]'>
        <Text>{TituloPost}</Text>
        <Text>{DescricaoPost}</Text>
        {ImagemPost && (
          <Image source={{ uri: ImagemPost }} className="w-full h-[260px] rounded-[16px]" />
        )}

        <View accessibilityLabel="OptionsPost" className='w-full flex gap-[20px]'>
          <View accessibilityLabel="ContainerOptions">
            <View accessibilityLabel="ContainerLike" className='flex flex-row gap-[8px] justify-center items-center'>
              <LuThumbsUp color='#94A3B8'/>
              <Text>{Curtidas} Curtidas</Text>
            </View>

            <View accessibilityLabel="ContainerComents" className='flex flex-row gap-[8px] justify-center items-center'>
              <PiChatDotsBold color='#94A3B8'/>
              <Text>{Curtidas} Comentarios</Text>
            </View>

            <View accessibilityLabel="ContainerShare" className='flex flex-row gap-[8px] justify-center items-center'>
              <PiShareFatBold color='#94A3B8'/>
              <Text>{Compartilhamentos} Compartilhamentos</Text>
            </View>
          </View>

          <CiBookmark color='#94A3B8'/>
        </View>
      </View>

      <View accessibilityLabel="FooterPost">
        
      </View>

      
      
      
      {/* <FlatList
        data={HashtagPost}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>#{item}</Text>}
        horizontal // Modo horizontal
        showsHorizontalScrollIndicator={false} // Remove a barra de rolagem
      /> */}

      
      <Text>Curtidas: {Curtidas}</Text>
      <Text>Compartilhamentos: {Compartilhamentos}</Text>

      <View>
        <Text>Comentários</Text>
        {/* <FlatList
          data={Comentarios}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2} // Certifique-se de que o número de colunas está correto
          columnWrapperStyle={{ justifyContent: 'space-between' }} // Estilo inline
          renderItem={({ item }) => (
            <View>
              <Text>{item.autor}:</Text>
              <Text>{item.texto}</Text>
            </View>
          )}
        /> */}
      </View>
    </View>
  );
};

export default Post;
