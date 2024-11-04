import React, { useState } from 'react';
import { View, Text, Image, TextInput, useWindowDimensions, Pressable, Animated } from 'react-native';
import { usePathname, useRouter } from 'expo-router';

import CustomIcons from '@/assets/icons/CustomIcons';
import tinycolor from 'tinycolor2';
import images from '@/constants/images';

interface Comentario {
  autor: string;
  texto: string;
}

interface PostProps {
  FotoPerfil: string;
  NomePerfil: string;
  CategoriaPost: string;
  TituloPost: string;
  DescricaoPost: string;
  HashtagPost: string[];
  Curtidas: number;
  Comentarios: Comentario[];
  Compartilhamentos: number;
  ImagemPost?: string;
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

  const router = useRouter();
  const pathname = usePathname();

  const navigateTo = (route: string) => {
    router[route !== pathname ? 'push' : 'replace'](route);
  };

  const shouldHideText = containerWidth < 536;
  const iconSize = shouldHideText ? 25 : 20;
  const isMobile = width <= 452 ? "hidden" : "";
  const color = "#94A3B8";

  const darkenColor = (color: string) => tinycolor(color).darken(10).toString();
  const [scaleRostoFeliz] = useState(new Animated.Value(1));
  const [scaleEnviar] = useState(new Animated.Value(1));

  const handleHover = (scaleValue: Animated.Value, toValue: number) => {
    Animated.spring(scaleValue, {
      toValue,
      useNativeDriver: true,
    }).start();
  };

  const renderImage = () => (
    ImagemPost ? (
      <Image
        source={{ uri: ImagemPost.startsWith('data:image/') ? ImagemPost : ImagemPost }}
        style={{ width: '100%', height: 320, borderRadius: 16, marginBottom: 16 }}
      />
    ) : null
  );

  const options = [
    { icon: 'curtidas', text: Curtidas }, // Nome do ícone e texto para "Curtir"
    { icon: 'comentarios', text: 143 },    // Nome do ícone e texto para "Comentar"
    { icon: 'compartilhar', text: Compartilhamentos }, // Nome do ícone e texto para "Compartilhar"
  ];

  return (
    <View accessibilityLabel="Post" className='bg-white rounded-[24px] flex w-full border border-borderStandardLight items-center'>
      <View accessibilityLabel="HeaderPost" className='flex w-full px-[20px] py-3 gap-[15px] border-b border-borderStandardLight flex-row items-center'>
        <View accessibilityLabel="ContainerProfile" className='flex flex-1 flex-row gap-[12px] items-center'>
          <Pressable onPress={() => navigateTo("profile")}>
            <Image source={{ uri: FotoPerfil }} className="border-white border-[2px] rounded-full w-[50px] h-[50px]" />
          </Pressable>
          <View accessibilityLabel="ContainerText">
            <Text className='font-bold text-[14px] text-textStandardDark'>{NomePerfil}</Text>
            <Text className='text-[14px] text-textSecondary'>{CategoriaPost}</Text>
          </View>
        </View>
        <Pressable
          onHoverIn={() => setIconHovered(prev => ({ ...prev, favorite: true }))}
          onHoverOut={() => setIconHovered(prev => ({ ...prev, favorite: false }))}
        >
          <CustomIcons name='tresPontos' color={iconHovered.favorite ? darkenColor(color) : color} size={20} />
        </Pressable>
      </View>

      <View accessibilityLabel="BodyPost" className='w-full flex px-[20px] py-[16px] gap-[14px]'>
        <Text className='font-bold text-base'>{TituloPost}</Text>
        <Text className='text-sm'>
          {DescricaoPost}
          {/* Renderizando as Hashtags */}
          {HashtagPost && HashtagPost.length > 0 && (
            <View className='ml-1 flex-row'>
            {HashtagPost.map((hashtag, index) => (
              <Text key={index} className='text-sm text-accentStandardDark'>
                {`#${hashtag} `}
              </Text>
            ))}
            </View>
          )}
        </Text>

        <View style={{ height: ImagemPost ? 320 : 0, width: '100%' }} accessibilityLabel="ImagePost">
          {renderImage()}
        </View>

        <View accessibilityLabel="OptionsPost" className='flex w-full flex-row justify-center' onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}>
          <View accessibilityLabel="ContainerOptions" className='flex flex-row gap-4 flex-1'>
            {options.map(({ icon, text }) => (
              <Pressable
                key={icon}
                onHoverIn={() => setIconHovered(prev => ({ ...prev, [icon]: true }))}
                onHoverOut={() => setIconHovered(prev => ({ ...prev, [icon]: false }))}
                accessibilityLabel={`Container${icon.charAt(0).toUpperCase() + icon.slice(1)}`}
                className='flex flex-row gap-[5px] justify-center items-center'
              >
                <CustomIcons name={icon} size={iconSize} color={iconHovered[icon] ? darkenColor(color) : color} />
                {!shouldHideText && (
                  <Text className='font-medium text-sm text-textStandardDark'>
                    {text} {icon.charAt(0).toUpperCase() + icon.slice(1)}
                  </Text>
                )}
              </Pressable>
            ))}
          </View>

          <Pressable
            onHoverIn={() => setIconHovered(prev => ({ ...prev, favorite: true }))}
            onHoverOut={() => setIconHovered(prev => ({ ...prev, favorite: false }))}
          >
            <CustomIcons name="favorito" size={iconSize} color={iconHovered.favorite ? darkenColor(color) : color} />
          </Pressable>
        </View>
      </View>

      <View accessibilityLabel="FooterPost" className='px-5 py-2 w-full flex border-t border-borderStandardLight'>
        <View className='flex w-full flex-row items-center h-[60px] gap-2'>
          <View accessibilityLabel="CommentaryPost" className='flex flex-1 flex-row gap-2'>
            <Image source={images.person} className={`border-white border-[2px] rounded-full w-[40px] h-[40px] ${isMobile}`} />
            <TextInput accessibilityLabel='Commentary' placeholder="Comente aqui" className='border-borderStandardLight border-[1px] h-[40px] flex flex-1 rounded-[28px] px-3 py-2 text-textStandardDark text-sm font-medium outline-none' />
          </View>

          <View accessibilityLabel='ContainerVectors' className='flex-row gap-2'>
            <Animated.View style={{ transform: [{ scale: scaleRostoFeliz }] }}>
              <Pressable
                onHoverIn={() => handleHover(scaleRostoFeliz, 1.08)}
                onHoverOut={() => handleHover(scaleRostoFeliz, 1)}
                className='border-borderStandardLight border-[1px] rounded-full w-[42px] h-[42px] items-center justify-center'
              >
                <CustomIcons name="rostoFeliz" size={24} color="#475569" />
              </Pressable>
            </Animated.View>

            <Animated.View style={{ transform: [{ scale: scaleEnviar }] }}>
              <Pressable
                onHoverIn={() => handleHover(scaleEnviar, 1.08)}
                onHoverOut={() => handleHover(scaleEnviar, 1)}
                className='border-accentStandardDark border-[1px] rounded-full w-[42px] h-[42px] items-center justify-center'
              >
                <CustomIcons size={24} name='enviar' color='#01B198' />
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Post;
