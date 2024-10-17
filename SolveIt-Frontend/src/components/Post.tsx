import React, { useState } from 'react';
import { View, Text, Image, TextInput, useWindowDimensions, Pressable, Animated } from 'react-native';
import IconesPersonalizados from '@/assets/IconesPersonalizados';
import tinycolor from 'tinycolor2';
import { usePathname, useRouter } from 'expo-router';

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

  const [containerWidth, setContainerWidth] = useState(0);
  const [iconHovered, setIconHovered] = useState({ like: false, comment: false, share: false, favorite: false });

  const handleLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const router = useRouter();
  const pathname = usePathname();

  const navigateTo = (route: string) => {
    if (pathname !== route) {
      router.push(route);
    } else {
      router.replace(route); // Substitui a rota atual, evitando duplicação
    }
  };

  const shouldHideText = containerWidth < 536; // Ajuste o valor conforme necessário
  const iconSize = shouldHideText ? 25 : 20;

  const isMobile = width <= 452 ? "hidden" : "";

  const color = "#94A3B8"; // Cor padrão dos ícones
  const darkenColor = (color) => tinycolor(color).darken(10).toString(); // Função para escurecer a cor

  const [scaleRostoFeliz] = useState(new Animated.Value(1));
  const [scaleEnviar] = useState(new Animated.Value(1));

  const handleHoverIn = (scaleValue) => {
    Animated.spring(scaleValue, {
      toValue: 1.08, // Aumenta o tamanho
      useNativeDriver: true,
    }).start();
  };

  const handleHoverOut = (scaleValue) => {
    Animated.spring(scaleValue, {
      toValue: 1, // Volta ao tamanho original
      useNativeDriver: true,
    }).start();
  };

  return (
    <View accessibilityLabel="Post" className='bg-white rounded-[24px] flex w-full border border-[#E2E8F0] items-center'>
      <View accessibilityLabel="HeaderPost" className='flex w-full px-[20px] py-3 gap-[15px] border-b border-[#E2E8F0] flex-row items-center'>
        <View accessibilityLabel="ContainerProfile" className='flex flex-1 flex-row gap-[12px] items-center'>
          <Pressable onPress={() => navigateTo("perfil")}>
            <Image source={{ uri: FotoPerfil }}
            className="border-white border-[2px] rounded-full w-[50px] h-[50px]" />
          </Pressable>

          <View accessibilityLabel="ContainerText">
            <Text className='font-bold text-[14px]'>{NomePerfil}</Text>
            <Text className='text-[14px] text-[#475569]'>{CategoriaPost}</Text>
          </View>
        </View>
        <Pressable
          onHoverIn={() => setIconHovered((prev) => ({ ...prev, favorite: true }))}
          onHoverOut={() => setIconHovered((prev) => ({ ...prev, favorite: false }))}
        >
          <IconesPersonalizados name='tresPontos' color={iconHovered.favorite ? darkenColor(color) : color} size={20} />
        </Pressable>
      </View>

      <View accessibilityLabel="BodyPost" className='w-full flex px-[20px] py-[16px] gap-[16px]'>
        <Text className='font-bold text-[16px]'>{TituloPost}</Text>
        <Text className='text-[14px]'>{DescricaoPost}</Text>

        <View style={{ height: ImagemPost ? 320 : 0, width: '100%' }} accessibilityLabel="ImagePost">
          {ImagemPost ? (
            <Image
              source={ImagemPost.startsWith('data:image/') ? { uri: ImagemPost } : { uri: ImagemPost }}
              style={{ width: '100%', height: 320, borderRadius: 16, marginBottom: 16 }}
            />
          ) : (
            <View style={{ padding: 0 }}></View>
          )}
        </View>

        <View accessibilityLabel="OptionsPost" className='flex w-full flex-row justify-center' onLayout={handleLayout}>
          <View accessibilityLabel="ContainerOptions" className='flex flex-row gap-4 flex-1'>
            {/* Curtidas */}
            <Pressable
              onHoverIn={() => setIconHovered((prev) => ({ ...prev, like: true }))}
              onHoverOut={() => setIconHovered((prev) => ({ ...prev, like: false }))}
              accessibilityLabel="ContainerLike"
              className='flex flex-row gap-[8px] justify-center items-center'
            >
              <IconesPersonalizados name="curtida" size={iconSize} color={iconHovered.like ? darkenColor(color) : color} />
              {!shouldHideText && <Text className='font-medium text-[14px]'>{Curtidas} Curtidas</Text>}
            </Pressable>

            {/* Comentários */}
            <Pressable
              onHoverIn={() => setIconHovered((prev) => ({ ...prev, comment: true }))}
              onHoverOut={() => setIconHovered((prev) => ({ ...prev, comment: false }))}
              accessibilityLabel="ContainerComents"
              className='flex flex-row gap-[8px] justify-center items-center'
            >
              <IconesPersonalizados name='comentario' color={iconHovered.comment ? darkenColor(color) : color} size={iconSize} />
              {!shouldHideText && <Text className='font-medium text-[14px]'>{143} Comentários</Text>}
            </Pressable>

            {/* Compartilhamentos */}
            <Pressable
              onHoverIn={() => setIconHovered((prev) => ({ ...prev, share: true }))}
              onHoverOut={() => setIconHovered((prev) => ({ ...prev, share: false }))}
              accessibilityLabel="ContainerShare"
              className='flex flex-row gap-[8px] justify-center items-center'
            >
              <IconesPersonalizados name="compartilhar" size={iconSize} color={iconHovered.share ? darkenColor(color) : color} />
              {!shouldHideText && <Text className='font-medium text-[14px]'>{Compartilhamentos} Compartilhamentos</Text>}
            </Pressable>
          </View>

          {/* Favorito */}
          <Pressable
            onHoverIn={() => setIconHovered((prev) => ({ ...prev, favorite: true }))}
            onHoverOut={() => setIconHovered((prev) => ({ ...prev, favorite: false }))}
          >
            <IconesPersonalizados name="favorito" size={iconSize} color={iconHovered.favorite ? darkenColor(color) : color} />
          </Pressable>
        </View>
      </View>

      <View accessibilityLabel="FooterPost" className='px-5 py-2 w-full flex border-t border-[#E2E8F0]'>
        <View className='flex w-full flex-row items-center h-[60px] gap-2'>
          <View accessibilityLabel="CommentaryPost" className='flex flex-1 flex-row gap-2'>
            <Image source={require('../assets/pessoa.png')} className={`border-white border-[2px] rounded-full w-[40px] h-[40px] ${isMobile}`} />
            <TextInput accessibilityLabel='Commentary' placeholder="Comente aqui"
              className='border-slate-300 border-[1px] h-[40px] flex flex-1 rounded-[28px] px-3 py-2 text-[#475569] text-[14px] font-medium outline-none' />
          </View>

          <View accessibilityLabel='ContainerVectors' className='flex-row gap-2'>
            <Animated.View style={{ transform: [{ scale: scaleRostoFeliz }] }}>
              <Pressable
                onHoverIn={() => handleHoverIn(scaleRostoFeliz)}
                onHoverOut={() => handleHoverOut(scaleRostoFeliz)}
                className='border-[#E2E8F0] border-[1px] rounded-full w-[42px] h-[42px] items-center justify-center'
              >
                <IconesPersonalizados name="rostoFeliz" size={24} color="#475569" />
              </Pressable>
            </Animated.View>

            <Animated.View style={{ transform: [{ scale: scaleEnviar }] }}>
              <Pressable
                onHoverIn={() => handleHoverIn(scaleEnviar)}
                onHoverOut={() => handleHoverOut(scaleEnviar)}
                className='border-destaqueVerde border-[1px] rounded-full w-[42px] h-[42px] items-center justify-center'
              >
                <IconesPersonalizados size={24} name='enviar' color='#01B198' />
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Post;
