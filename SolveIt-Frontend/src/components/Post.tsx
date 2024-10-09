import React from 'react';
import { View, Text, Image, TextInput, useWindowDimensions } from 'react-native';
import IconesPersonalizados from '@/assets/IconesPersonalizados';

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
  const { width } = useWindowDimensions();
  
  const isMobile = width <= 873 ? "hidden" : "";
  return (
    <View accessibilityLabel="Post" className='bg-white rounded-[24px] flex w-full border border-[#E2E8F0] hover:cursor-pointer'>
      <View accessibilityLabel="HeaderPost" className='flex w-full p-[20px] gap-[15px] border-b border-[#E2E8F0] flex-row items-center'>
        <View accessibilityLabel="ContainerProfile" className='flex flex-1 flex-row gap-[12px] items-center'>
          <Image source={{ uri: FotoPerfil }}
            className="border-white border-[2px] rounded-full w-[50px] h-[50px]" />

          <View accessibilityLabel="ContainerText">
            <Text className='font-bold text-[14px]'>{NomePerfil}</Text>
            <Text className='text-[14px] text-[#475569]'>{CategoriaPost}</Text>
          </View>
        </View>
        <IconesPersonalizados name='tresPontos' color='#CBD5E1' size={20}/>
      </View>

      <View accessibilityLabel="BodyPost" className='w-full flex px-[20px] py-[16px] gap-[16px]'>
        <Text className='font-bold text-[16px]'>{TituloPost}</Text>
        <Text className='text-[14px]'>{DescricaoPost}</Text>

        <View style={{ height: ImagemPost ? 320 : 0, width: '100%' }} accessibilityLabel="ImagePost">
          {ImagemPost ? (
            <Image
              source={
                ImagemPost.startsWith('data:image/')
                  ? { uri: ImagemPost }
                  : { uri: ImagemPost }
              }
              style={{ width: '100%', height: 320, borderRadius: 16, marginBottom: 16 }}
            />
          ) : (
            <View style={{ padding: 0 }}>

            </View>
          )}
        </View>
        <View accessibilityLabel="OptionsPost" className='flex flex-1 w-full flex-row'>
          <View accessibilityLabel="ContainerOptions" className='flex flex-row gap-4 w-[96%]'>
            <View accessibilityLabel="ContainerLike" className='flex flex-row gap-[8px] justify-center items-center'>
              <IconesPersonalizados name="curtida" size={20} color="#94A3B8" />
              <Text className='font-medium text-[14px]'>{Curtidas} Curtidas</Text>
            </View>

            <View accessibilityLabel="ContainerComents" className='flex flex-row gap-[8px] justify-center items-center'>
              <IconesPersonalizados name='comentario' color='#94A3B8' size={20}/>
              <Text className='font-medium text-[14px]'>{143} Comentarios</Text>
            </View>

            <View accessibilityLabel="ContainerShare" className='flex flex-row gap-[8px] justify-center items-center'>
            <IconesPersonalizados name="compartilhar" size={20} color="#94A3B8" />
              <Text className='font-medium text-[14px]'>{Compartilhamentos} Compartilhamentos</Text>
            </View>
          </View>

          <IconesPersonalizados name="favorito" size={20} color="#94A3B8"/>
        </View>
        <View accessibilityLabel="  FooterPost"
        className='flex w-full border-t border-[#E2E8F0] flex-row items-center h-[60px] gap-2'>
          <View accessibilityLabel="CommentaryPost" className='flex flex-1 flex-row gap-2'>
            <Image source={require('../assets/pessoa.png')} className="border-white border-[2px] rounded-full w-[40px] h-[40px]" />
            <TextInput accessibilityLabel='Commentary' placeholder="Comente aqui"
            className='border-slate-300 border-[1px] h-[40px] flex flex-1 rounded-[28px] px-3 py-2 text-[#475569] text-[14px] font-medium outline-none' />
          </View>

          <View accessibilityLabel='ContainerVectors' className='flex-row gap-2'>
            <View className='border-[#E2E8F0] border-[1px] rounded-full w-[42px] h-[42px]'>
              <View className='items-center justify-center h-[40px] w-[40px]'>
                <IconesPersonalizados name="rostoFeliz" size={24} color="#475569" />
              </View>
            </View>
            <View className='border-destaqueVerde border-[1px] rounded-full h-[42px] w-[42px]'>
              <View className='items-center justify-center h-[40px] w-[40px]'>
                <IconesPersonalizados size={24} name='enviar' color='#01B198'/>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};



export default Post;
