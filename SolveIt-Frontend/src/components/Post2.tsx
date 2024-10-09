import React from 'react';
import { View, Text, Image, FlatList, TextInput } from 'react-native';
import { SlOptionsVertical } from "react-icons/sl";
import { CiBookmark } from "react-icons/ci";
import { LuThumbsUp } from "react-icons/lu";
import { PiChatDotsBold, PiShareFatBold } from "react-icons/pi";
import { RiEmotionHappyLine } from "react-icons/ri";
import { LuSendHorizonal } from "react-icons/lu";

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
        <View accessibilityLabel="Post" className='bg-white rounded-[24px] flex w-full border border-[#E2E8F0] hover:cursor-pointer'>
            <View accessibilityLabel="HeaderPost" className='flex w-full p-[20px] gap-[15px] border-b border-[#E2E8F0] flex-row items-center'>
                <View accessibilityLabel="ContainerProfile" className='flex flex-1 flex-row gap-[20px] '>
                    <Image source={{ uri: FotoPerfil }}
                        className="border-white border-[2px] rounded-full w-[55px] h-[55px]" />

                    <View accessibilityLabel="ContainerText">
                        <Text className='font-bold text-[14px]'>{NomePerfil}</Text>
                        <Text className='text-[14px]'>{CategoriaPost}</Text>
                    </View>
                </View>
                <SlOptionsVertical color='#CBD5E1' />
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
                    <View accessibilityLabel="ContainerOptions" className='flex flex-row flex-wrap gap-4 w-[96%] sm:gap-[16px] sm:w-[98%] '>
                        <View accessibilityLabel="ContainerLike" className='flex flex-row gap-[8px] justify-center items-center'>
                            <LuThumbsUp color='#94A3B8' />
                            <Text className='font-medium text-[14px]'>{Curtidas} Curtidas</Text>
                        </View>

                        <View accessibilityLabel="ContainerComents" className='flex flex-row gap-[8px] justify-center items-center'>
                            <PiChatDotsBold color='#94A3B8' />
                            <Text className='font-medium text-[14px]'>{200} Comentarios</Text>
                        </View>

                        <View accessibilityLabel="ContainerShare" className='flex flex-row gap-[8px] justify-center items-center'>
                            <PiShareFatBold color='#94A3B8' />
                            <Text className='font-medium text-[14px]'>{Compartilhamentos} Compartilhamentos</Text>
                        </View>
                    </View>

                    <CiBookmark color='#94A3B8' />
                </View>
                <View accessibilityLabel="FooterPost" className='flex w-full border-t border-[#E2E8F0] flex-row flex-wrap items-center h-[60px] sm:h-[78px]'>
                    <View accessibilityLabel="CommentaryPost" className='flex flex-row gap-2 w-[50%] sm:w-[70%]'>
                        <Image source={require('../assets/pessoa.png')} className="border-white border-[2px] rounded-full w-[40px] h-[40px]" />
                        <TextInput accessibilityLabel='Commentary' placeholder="Comente aqui" className='border-slate-300 border-[1px] h-[40px] w-full sm:w-[700px] rounded-[28px] p-[20px] text-[14px] font-medium' />
                    </View>

                    <View accessibilityLabel='ContainerVectors' className='flex-row items-end justify-end flex-1 gap-2 sm:mt-0 sm:gap-[15px]'>
                        <View className='border-[#E2E8F0] border-[1px] rounded-full w-[42px] h-[42px]'>
                            <View className='items-center justify-center h-[40px] w-[40px]'>
                                <RiEmotionHappyLine className='size-[24px]' />
                            </View>
                        </View>
                        <View className='border-destaqueVerde border-[1px] rounded-full h-[42px] w-[42px]'>
                            <View className='items-center justify-center h-[40px] w-[40px]'>
                                <LuSendHorizonal className='size-[24px]' />
                            </View>
                        </View>
                    </View>
                </View>
            </View>



            {/* <FlatList
        data={HashtagPost}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>#{item}</Text>}
        horizontal // Modo horizontal
        showsHorizontalScrollIndicator={false} // Remove a barra de rolagem
      /> */}


            {/* <Text>Curtidas: {Curtidas}</Text>
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
        /> *
      </View> */}
        </View>
    );
};



export default Post;
