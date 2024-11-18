import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, useWindowDimensions, Pressable } from 'react-native';
import { usePathname, useRouter } from 'expo-router';

import CustomIcons from '@/assets/icons/CustomIcons';
import ButtonScale from './ButtonScale';
import HoverColorComponent from './HoverColorComponent';
import colors from '@/constants/colors';
import { getPostById } from '@/lib/appwriteConfig';
import PostSkeleton from './PostSkeleton';

interface PostProps {
  postId: string;
  typePost?: 'normal' | 'ownProfile' | 'informativo';
}

const Post: React.FC<PostProps> = ({ postId, typePost = 'normal' }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const shouldHideText = containerWidth < 536;
  const iconSize = shouldHideText ? 25 : 20;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const fetchedPost = await getPostById(postId);
        setPost(fetchedPost);
      } catch (error) {
        console.error("Erro ao buscar o post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (loading) {
    return <PostSkeleton />;
  }

  const navigateTo = (route: string) => {
    router[route !== pathname ? 'push' : 'replace'](route);
  };

  const renderImage = () => {
    if (!post.thumbnail) return null;

    const allowedRatios = {
      "1:1": 1,
      "16:9": 16 / 9,
      "4:5": 4 / 5,
    };

    const selectedRatio = allowedRatios[post.thumbnailRatio] || allowedRatios["1:1"];
    return (
      <View className="w-full items-center">
        <View style={{ width: "100%", aspectRatio: selectedRatio, maxWidth: 600 }} accessibilityLabel="ImagePost">
          <Image
            source={{ uri: post.thumbnail }}
            style={{ width: "100%", height: "100%", borderRadius: 16 }}
            resizeMode="cover"
          />
        </View>
      </View>
    );
  };

  const renderOptions = () => {
    const options = [
      { icon: 'curtidas', text: 142 },
      { icon: 'comentarios', text: 143 },
      { icon: 'compartilhar', text: post.shares },
    ];

    return options.map(({ icon, text }) => (
      <HoverColorComponent key={icon} colorHover={colors.textSecondary.pressIn} colorPressIn={colors.primaryStandardDark.standard} className='flex flex-row gap-[5px] justify-center items-center'>
        <CustomIcons name={icon} color="#94A3B8" size={iconSize} />
        {!shouldHideText && (
          <Text className="font-medium text-sm" style={{ color: "#1d283a" }}>
            {text} {icon.charAt(0).toUpperCase() + icon.slice(1)}
          </Text>
        )}
      </HoverColorComponent>
    ));
  };

  const renderOptionsOwnProfile = () => {
    const options = [
      { icon: 'curtidas', text: 142 },
      { icon: 'comentarios', text: 143 },
      { icon: 'compartilhar', text: post.shares },
    ];

    return options.map(({ icon, text }) => (
      <HoverColorComponent key={icon} colorHover={colors.textSecondary.pressIn} colorPressIn={colors.primaryStandardDark.standard} className="flex flex-row gap-[5px] justify-center items-center w-fit">
        <CustomIcons name={icon} color="#94A3B8" size={iconSize} />
        <Text className="font-medium text-sm" style={{ color: "#1d283a" }}>
          {text} {icon.charAt(0).toUpperCase() + icon.slice(1)}
        </Text>
      </HoverColorComponent>
    ));
  };

  const renderHeader = () => (
    <View accessibilityLabel="HeaderPost" className="flex w-full px-[20px] py-3 gap-[15px] border-b border-borderStandardLight flex-row items-center">
      <View accessibilityLabel="ContainerProfile" className="flex flex-1 flex-row gap-[12px] items-center">
        <Pressable onPress={() => navigateTo(`/profile/${post.creator.$id}`)}>
          <Image source={{ uri: post.creator.avatar }} className="border-white border-[2px] rounded-full w-[50px] h-[50px]" />
        </Pressable>
        <View accessibilityLabel="ContainerText">
          <Text className="font-bold text-[14px] text-textStandardDark">{post.creator.username}</Text>
          <Text className="text-[14px] text-textSecondary">{post.category}</Text>
        </View>
      </View>
      <HoverColorComponent colorHover={colors.primaryStandardDark.standard} className='w-fit' onPress={() => navigateTo(`/postDetails/${post.$id}`)}>
        <Text className='text-xs underline' style={{ color: colors.textSecondary.standard }}>Ver Detalhes</Text>
      </HoverColorComponent>
    </View>
  );

  const renderFooter = () => (
    <View accessibilityLabel="FooterPost" className="px-5 py-2 w-full flex border-t border-borderStandardLight">
      <View className="flex w-full flex-row items-center h-[60px] gap-2">
        <View accessibilityLabel="CommentaryPost" className="flex flex-1 flex-row gap-2">
          <TextInput
            accessibilityLabel="Commentary"
            placeholder="Comente aqui"
            className="border-borderStandardLight border-[1px] h-[40px] flex flex-1 rounded-[28px] px-3 py-2 text-textStandardDark text-sm font-medium outline-none"
          />
        </View>

        <View accessibilityLabel="ContainerVectors" className="flex-row gap-2">
          <ButtonScale className="border-borderStandardLight border-[1px] rounded-full w-[42px] h-[42px] items-center justify-center" scale={1.08}>
            <CustomIcons name="rostoFeliz" size={24} color="#475569" />
          </ButtonScale>

          <ButtonScale className="border-accentStandardDark border-[1px] rounded-full w-[42px] h-[42px] items-center justify-center" scale={1.08}>
            <CustomIcons name="enviar" size={24} color="#01B198" />
          </ButtonScale>
        </View>
      </View>
    </View>
  );

  return (
    <View accessibilityLabel="Post" className="bg-white rounded-[24px] flex w-full border border-borderStandardLight items-center">
      {(() => {
        switch (typePost) {
          case 'normal':
            return (
              <>
                {renderHeader()}
                <View accessibilityLabel="BodyPost" className="w-full flex px-[20px] py-[16px] gap-[5px]">
                  <Text className="font-bold text-base">{post.title}</Text>
                  <View>
                    <Text className="text-base">{post.description}</Text>
                    <Text className="text-base text-accentStandardDark">{post.tags}</Text>
                  </View>
                  {renderImage()}
                  <View accessibilityLabel="OptionsPost" className="flex w-full flex-row justify-center mt-2" onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}>
                    <View accessibilityLabel="ContainerOptions" className="flex flex-row gap-4 flex-1">
                      {renderOptions()}
                    </View>
                    <HoverColorComponent colorHover={colors.textSecondary.standard} colorPressIn={colors.primaryStandardDark.standard}>
                      <CustomIcons name="favorito" color="#94A3B8" size={24} />
                    </HoverColorComponent>
                  </View>
                </View>
                {renderFooter()}
              </>
            );
          case 'ownProfile':
            return (
              <>
                <View accessibilityLabel="BodyPost" className="w-full flex px-[20px] py-[16px] gap-[5px]">
                  <View className='w-full'>
                    <Text className="font-bold text-base">{post.title}</Text>
                  </View>
                  <View>
                    <Text className="text-base">{post.description}</Text>
                    <Text className="text-base text-accentStandardDark">{post.tags}</Text>
                  </View>
                  {renderImage()}
                  <View accessibilityLabel="OptionsPost" className="flex w-full flex-col mt-2 gap-3" onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}>
                    <View accessibilityLabel="ContainerOptions" className="flex flex-row flex-wrap gap-4 w-full items-start">
                      {renderOptionsOwnProfile()}
                    </View>
                    <View className="flex-row w-full justify-between">
                      <HoverColorComponent colorHover={colors.textSecondary.standard} colorPressIn={colors.primaryStandardDark.standard} className="flex-row items-center ml-[-3px]">
                        <CustomIcons name="favorito" color="#94A3B8" size={24} />
                        <Text className="font-medium text-sm" style={{ color: "#1d283a" }}>
                          0 Favoritos
                        </Text>
                      </HoverColorComponent>
                      <ButtonScale scale={1.09}>
                        <CustomIcons name="lixeira" color="#D21F3C" size={24} />
                      </ButtonScale>
                    </View>
                  </View>
                </View>
              </>
            );
          default:
            return null; // Caso não seja nem 'normal' nem 'ownProfile', retorna null
        }
      })()}
    </View>
  );
};

export default Post;
