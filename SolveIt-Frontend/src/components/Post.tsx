import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, useWindowDimensions, Pressable } from 'react-native';
import { usePathname, useRouter } from 'expo-router';

import CustomIcons from '@/assets/icons/CustomIcons';
import ButtonScale from './ButtonScale';
import HoverColorComponent from './HoverColorComponent';
import colors from '@/constants/colors';
import { getPostById } from '@/lib/appwriteConfig';
import { useGlobalContext } from '@/context/GlobalProvider';
import PostSkeleton from './PostSkeleton';

interface PostProps {
  postId: string; // Agora só passamos o ID do post
}

const Post: React.FC<PostProps> = ({ postId }) => {
  const { width } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState(0);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useGlobalContext();

  const router = useRouter();
  const pathname = usePathname();

  const shouldHideText = containerWidth < 536;
  const iconSize = shouldHideText ? 25 : 20;
  const isMobile = width <= 452 ? "hidden" : "";

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const fetchedPost = await getPostById(postId);
        setPost(fetchedPost);
      } catch (error) {
        console.error("Erro ao buscar o post:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchPost();
  }, [postId]);

  if (loading || !user) {
    return <PostSkeleton />;
  }

  const navigateTo = (route: string) => {
    router[route !== pathname ? 'push' : 'replace'](route);
  };

  const renderImage = () => {
    if (!post.thumbnail) return null;
  
    // Define as proporções permitidas
    const allowedRatios = {
      "1:1": 1, // quadrado
      "16:9": 16 / 9, // widescreen
      "4:5": 4 / 5, // retrato
    };
  
    // Suponha que o backend envia a proporção na propriedade `post.ratio`
    const selectedRatio = allowedRatios[post.thumbnailRatio] || allowedRatios["1:1"]; // Padrão: 1:1
    return (
      <View className='w-full items-center'>
        <View style={{ width: "100%", aspectRatio: selectedRatio, maxWidth: 600 }} accessibilityLabel="ImagePost">
          <Image
            source={{ uri: post.thumbnail }}
            style={{ width: "100%", height: "100%", borderRadius: 16 }}
            resizeMode="cover" // Garante que a imagem preencha o espaço sem distorções
          />
        </View>
      </View>
    );
  };

  const options = [
    { icon: 'curtidas', text: 142 }, // Nome do ícone e texto para "Curtir"
    { icon: 'comentarios', text: 143 },    // Nome do ícone e texto para "Comentar"
    { icon: 'compartilhar', text: post.shares }, // Nome do ícone e texto para "Compartilhar"
  ];

  return (
    <View accessibilityLabel="Post" className='bg-white rounded-[24px] flex w-full border border-borderStandardLight items-center'>
      <View accessibilityLabel="HeaderPost" className='flex w-full px-[20px] py-3 gap-[15px] border-b border-borderStandardLight flex-row items-center'>
        <View accessibilityLabel="ContainerProfile" className='flex flex-1 flex-row gap-[12px] items-center'>
          <Pressable onPress={() => navigateTo(`/profile/${post.creator.accountId}`)}>
            <Image source={{ uri: post.creator.avatar }} className="border-white border-[2px] rounded-full w-[50px] h-[50px]" />
          </Pressable>
          <View accessibilityLabel="ContainerText">
            <Text className='font-bold text-[14px] text-textStandardDark'>{post.creator.username}</Text>
            <Text className='text-[14px] text-textSecondary'>{post.category}</Text>
          </View>
        </View>
        <HoverColorComponent colorHover={colors.textSecondary.standard} colorPressIn={colors.textSecondary.pressIn}>
          <CustomIcons name='tresPontos' color="#94A3B8" size={20} />
        </HoverColorComponent>
      </View>

      <View accessibilityLabel="BodyPost" className='w-full flex px-[20px] py-[16px] gap-[5px]'>
        <Text className='font-bold text-base'>{post.title}</Text>
        <View>
          <Text className="text-base">
            {post.description}
          </Text>

          <Text className="text-base text-accentStandardDark">
            {post.tags}
          </Text>
        </View>

        {renderImage()}

        <View accessibilityLabel="OptionsPost" className='flex w-full flex-row justify-center mt-2' onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}>
          <View accessibilityLabel="ContainerOptions" className='flex flex-row gap-4 flex-1'>
            {options.map(({ icon, text }) => (
              <HoverColorComponent colorHover={colors.textSecondary.pressIn} colorPressIn={colors.primaryStandardDark.standard} key={icon} className='flex flex-row gap-[5px] justify-center items-center'>
                <CustomIcons name={icon} color="#94A3B8" size={iconSize} />
                {!shouldHideText && (
                  <Text className='font-medium text-sm' style={{ color: "#1d283a" }}>
                    {text} {icon.charAt(0).toUpperCase() + icon.slice(1)}
                  </Text>
                )}
              </HoverColorComponent>
            ))}
          </View>

          <HoverColorComponent colorHover={colors.textSecondary.standard} colorPressIn={colors.primaryStandardDark.standard} >
            <CustomIcons name='favorito' color="#94A3B8" size={20} />
          </HoverColorComponent>
        </View>
      </View>

      <View accessibilityLabel="FooterPost" className='px-5 py-2 w-full flex border-t border-borderStandardLight'>
        <View className='flex w-full flex-row items-center h-[60px] gap-2'>
          <View accessibilityLabel="CommentaryPost" className='flex flex-1 flex-row gap-2'>
            <Image source={user.avatar} className={`border-white border-[2px] rounded-full w-[40px] h-[40px] ${isMobile}`} />
            <TextInput accessibilityLabel='Commentary' placeholder="Comente aqui" className='border-borderStandardLight border-[1px] h-[40px] flex flex-1 rounded-[28px] px-3 py-2 text-textStandardDark text-sm font-medium outline-none' />
          </View>

          <View accessibilityLabel='ContainerVectors' className='flex-row gap-2'>
            <ButtonScale className='border-borderStandardLight border-[1px] rounded-full w-[42px] h-[42px] items-center justify-center' scale={1.08}>
              <CustomIcons name="rostoFeliz" size={24} color="#475569" />
            </ButtonScale>

            <ButtonScale className='border-accentStandardDark border-[1px] rounded-full w-[42px] h-[42px] items-center justify-center' scale={1.08}>
              <CustomIcons name="enviar" size={24} color="#01B198" />
            </ButtonScale>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Post;
