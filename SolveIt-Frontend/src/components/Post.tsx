import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, TextInput, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { usePathname, useRouter } from 'expo-router';

import CustomIcons from '@/assets/icons/CustomIcons';
import ButtonScale from './ButtonScale';
import HoverColorComponent from './HoverColorComponent';
import colors from '@/constants/colors';
import { addComment, deleteCommentById, getCityAndStateByZipCode, getCommentsForPost, getFavoriteCount, getLikeCount, getPostById, toggleFavorite, toggleLike, userFavoritedPost, userLikedPost } from '@/lib/appwriteConfig';
import PostSkeleton from './PostSkeleton';
import { useGlobalContext } from '@/context/GlobalProvider';
import * as Clipboard from 'expo-clipboard';
import { useAlert } from '@/context/AlertContext';
import Comment from './Comment';

interface PostProps {
  postId: string;
  typePost?: 'normal' | 'ownProfile' | 'postDetails';
}

const Post: React.FC<PostProps> = ({ postId, typePost = 'normal' }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [post, setPost] = useState<any>(true);
  const [loading, setLoading] = useState(true);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { user } = useGlobalContext();
  const { showAlert } = useAlert();

  const shouldHideText = containerWidth < 536;
  const iconSize = shouldHideText ? 25 : 20;

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [isLiking, setIsLiking] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [location, setLocation] = useState(null);

  const [commentContent, setCommentContent] = useState("");
  const [loadingMessage, setloadingMessage] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const LIMIT = 10; // Número de comentários por página

  const fetchPostData = async () => {
    try {
      setLoading(true);
      const fetchedPost = await getPostById(postId);
      setPost(fetchedPost);

      const likes = await getLikeCount(postId);
      setLikeCount(likes);

      const comments = await getCommentsForPost(postId, page, LIMIT);
      setCommentCount(comments.total);
      setComments(comments.documents);

      const favoriteCount = await getFavoriteCount(postId);
      setFavoriteCount(favoriteCount);

      if (fetchedPost?.zipCode && typePost === "postDetails") {
        const location = await getCityAndStateByZipCode(fetchedPost.zipCode);
        setLocation(location);
      }

      if (user) {
        const userLiked = user?.$id
          ? await userLikedPost(postId, user.$id)
          : false;
        setLiked(userLiked);

        const favorited = await userFavoritedPost(postId, user.$id);
        setIsFavorited(favorited);
      }
    } catch (error) {
      console.error("Error fetching post data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPostData();
    }
  }, [postId, user]);

  if (loading || !post || !post.creator) {
    return <PostSkeleton />;
  }

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

  const navigateTo = (route: string) => {
    router[route !== pathname ? 'push' : 'replace'](route);
  };

  const handleLikeToggle = async () => {
    if (!user?.$id) {
      return;
    }

    try {
      setIsLiking(true);
      const newLikedState = await toggleLike(postId, user.$id);
      setLiked(newLikedState);

      const updatedLikeCount = await getLikeCount(postId);
      setLikeCount(updatedLikeCount);
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const copySharedPostLink = () => {
    try {
      // Constroi o link completo
      const url = `http://localhost:8081/postDetails/${post.$id}?shared=true`;

      // Copia a URL para a área de transferência
      Clipboard.setStringAsync(url);

      // Exibe um alerta informando que o link foi copiado
      showAlert('Link Copiado!', 'O link foi copiado para a área de transferência.');
    } catch (error) {
      console.error('Erro ao copiar o link:', error);
      showAlert('Erro', 'Não foi possível copiar o link. Tente novamente.');
    }
  };

  const renderOptions = () => {
    const options = [
      {
        icon: 'curtidas',
        text: likeCount,
        action: handleLikeToggle,
        isLoading: isLiking,
        color: liked ? colors.primaryStandardDark.standard : "#94A3B8",
      },
      {
        icon: 'comentarios',
        text: commentCount,
        action: typePost !== "postDetails" ? () => navigateTo(`/postDetails/${post.$id}`) : undefined,
      },
      {
        icon: 'compartilhar',
        text: post?.shares || 0,
        action: () => copySharedPostLink(),
      },
    ];

    return options.map(({ icon, text, action, isLoading, color }) => (
      <HoverColorComponent
        key={icon}
        colorHover={colors.textSecondary.pressIn}
        colorPressIn={colors.primaryStandardDark.standard}
        className="flex flex-row gap-[5px] justify-center items-center"
        onPress={action}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#94A3B8" />
        ) : (
          <CustomIcons
            name={icon}
            color={color || "#94A3B8"}
            size={iconSize}
          />
        )}
        <Text className="font-medium text-sm" style={{ color: "#1d283a" }}>
          {shouldHideText ? text : `${text} ${icon.charAt(0).toUpperCase() + icon.slice(1)}`}
        </Text>
      </HoverColorComponent>
    ));
  };

  const renderHeader = () => (
    <View accessibilityLabel="HeaderPost" className="flex w-full px-[20px] py-3 gap-[15px] border-b border-borderStandardLight flex-row items-center">
      <View accessibilityLabel="ContainerProfile" className="flex flex-1 flex-row gap-[12px] items-center">
        {
          typePost === "postDetails" ? (
            <View className="flex-row justify-center items-center">
              <ButtonScale scale={1.09}
                onPress={() => {
                  if (router.canGoBack()) {
                    router.back();  // Se houver uma página anterior, volta
                  } else {
                    router.push('/');  // Caso contrário, vai para a página inicial
                  }
                }}>
                <CustomIcons name="anterior" color={colors.textStandard.standard} size={24} />
              </ButtonScale>
              <Pressable onPress={() => navigateTo(`/profile/${post.creator.accountId}`)}>
                <Image source={{ uri: post.creator.avatar }} className="border-white border-[2px] rounded-full w-[50px] h-[50px]" />
              </Pressable>
            </View>
          ) : (
            <Pressable onPress={() => navigateTo(`/profile/${post.creator.$id}`)}>
              <Image source={{ uri: post.creator.avatar }} className="border-white border-[2px] rounded-full w-[50px] h-[50px]" />
            </Pressable>
          )
        }
        <View accessibilityLabel="ContainerText">
          <Text className="font-bold text-[14px] text-textStandardDark">{post.creator.username}</Text>
          <Text className="text-[14px] text-textSecondary">{post.category}</Text>
        </View>
      </View>
      <HoverColorComponent colorHover={colors.primaryStandardDark.standard} className='w-fit'
        onPress={typePost !== "postDetails" ? () => navigateTo(`/postDetails/${post.$id}`) : undefined}>
        <Text className='text-xs underline' style={{ color: colors.textSecondary.standard }}>Ver Tudo</Text>
      </HoverColorComponent>
    </View>
  );

  const handleCommentSubmit = async () => {
    if (!commentContent.trim() || !user?.$id) {
      return;
    }

    try {
      setloadingMessage(true);
      const newComment = await addComment(postId, user.$id, commentContent);
      setCommentContent("");

      // Adiciona o novo comentário no início da lista
      setComments((prevComments) => [newComment, ...prevComments]);
      setCommentCount(prev => prev + 1);
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
    } finally {
      setloadingMessage(false);
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      const confirmDelete = await new Promise((resolve) => {
        showAlert(
          "Excluir Comentário",
          "Tem certeza que deseja excluir este comentário?",
          [
            { text: 'Cancelar', onPress: () => resolve(false) },
            { text: 'Excluir', onPress: () => resolve(true) },
          ],
          10000
        );
      });

      if (confirmDelete) {
        // Chama a função que exclui o comentário
        await deleteCommentById(id);

        // Remove o comentário da lista
        setComments((prevComments) => prevComments.filter(comment => comment.$id !== id));
        setCommentCount(commentCount - 1)
      }
    } catch (error) {
      console.error("Erro ao excluir comentário:", error);
    }
  };

  const fetchComments = async (isInitial = false) => {
    try {
      if (!hasMore && !isInitial) return;

      setLoadingMore(true);
      const currentPage = isInitial ? 1 : page;

      const commentsData = await getCommentsForPost(postId, LIMIT, currentPage);

      setCommentCount(commentsData.total);

      if (isInitial) {
        setComments(commentsData.documents);
      } else {
        setComments(prev => [...prev, ...commentsData.documents]);
      }

      // Verifica se há mais comentários para carregar
      setHasMore(commentsData.documents.length === LIMIT);

      if (!isInitial) {
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isCloseToBottom && !loadingMore && hasMore) {
      fetchComments();
    }
  };

  const renderFooter = () => (
    <View accessibilityLabel="FooterPost" className="px-5 py-2 w-full flex border-t border-borderStandardLight">
      <View className="gap-3">
        {comments.length === 0 ? (
          <Text>Seja o primeiro a comentar!</Text>
        ) : (
          comments.slice(0, 2).map((comment) => (
            <Comment
              key={comment.$id}
              id={comment.$id}
              onDelete={handleDeleteComment}  // Passando a função para deletar
            />
          ))
        )}
      </View>

      <View className="flex w-full flex-row items-center h-[60px] gap-2">
        <View accessibilityLabel="CommentaryPost" className="flex flex-1 flex-row gap-2">
          {loadingMessage ? (
            // Exibe o ActivityIndicator enquanto está carregando
            <ActivityIndicator size="small" color="#01B198" />
          ) : null}
          <TextInput
            value={commentContent}  // Define o texto no campo de comentário
            onChangeText={setCommentContent}  // Atualiza o estado conforme o usuário digita
            placeholder="Comente aqui"
            className="border-borderStandardLight border-[1px] h-[40px] flex flex-1 rounded-[28px] px-3 py-2 text-textStandardDark text-sm font-medium outline-none"
          />
        </View>

        <View accessibilityLabel="ContainerVectors" className="flex-row gap-2">
          <ButtonScale
            className="border-borderStandardLight border-[1px] rounded-full w-[42px] h-[42px] items-center justify-center"
            scale={1.08}
          >
            <CustomIcons name="rostoFeliz" size={24} color="#475569" />
          </ButtonScale>

          <ButtonScale
            className="border-accentStandardDark border-[1px] rounded-full w-[42px] h-[42px] items-center justify-center"
            scale={1.08}
            onPress={handleCommentSubmit}  // Chama a função ao clicar no botão
          >
            <CustomIcons name="enviar" size={24} color="#01B198" />
          </ButtonScale>
        </View>
      </View>
    </View>
  );
  const renderFooterDetails = () => (
    <View accessibilityLabel="FooterPost" className="px-5 py-2 w-full flex border-t border-borderStandardLight">
      <View className="flex w-full flex-row items-center h-[60px] gap-2">
        <View accessibilityLabel="CommentaryPost" className="flex flex-1 flex-row gap-2">
          {loadingMessage ? (
            // Exibe o ActivityIndicator enquanto está carregando
            <ActivityIndicator size="small" color="#01B198" />
          ) : null}
          <TextInput
            value={commentContent}  // Define o texto no campo de comentário
            onChangeText={setCommentContent}  // Atualiza o estado conforme o usuário digita
            placeholder="Comente aqui"
            className="border-borderStandardLight border-[1px] h-[40px] flex flex-1 rounded-[28px] px-3 py-2 text-textStandardDark text-sm font-medium outline-none"
          />
        </View>

        <View accessibilityLabel="ContainerVectors" className="flex-row gap-2">
          <ButtonScale
            className="border-borderStandardLight border-[1px] rounded-full w-[42px] h-[42px] items-center justify-center"
            scale={1.08}
          >
            <CustomIcons name="rostoFeliz" size={24} color="#475569" />
          </ButtonScale>

          <ButtonScale
            className="border-accentStandardDark border-[1px] rounded-full w-[42px] h-[42px] items-center justify-center"
            scale={1.08}
            onPress={handleCommentSubmit}  // Chama a função ao clicar no botão
          >
            <CustomIcons name="enviar" size={24} color="#01B198" />
          </ButtonScale>
        </View>
      </View>
      <ScrollView
        style={{ maxHeight: 100 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View className="gap-3">
          {comments.length === 0 ? (
            <Text>Seja o primeiro a comentar!</Text>
          ) : (
            comments.map((comment) => (
              <Comment
                key={comment.$id}
                id={comment.$id}
                onDelete={handleDeleteComment}
              />
            ))
          )}
        </View>

        {loadingMore && (
          <View className="py-2">
            <ActivityIndicator size="small" color="#01B198" />
          </View>
        )}

        {!hasMore && comments.length > 0 && (
          <Text className="text-center py-2 text-textSecondary">
            Não há mais comentários para carregar
          </Text>
        )}
      </ScrollView>
    </View>
  );

  const handleToggleFavorite = async () => {
    if (!user?.$id) return;
    if (loadingFavorite) return; // Evita múltiplos cliques enquanto processa
    setLoadingFavorite(true);

    try {
      const favorited = await toggleFavorite(postId, user.$id);
      setIsFavorited(favorited);
      const favoriteCount = await getFavoriteCount(postId);
      setFavoriteCount(favoriteCount);
      showAlert(
        "Favorito",
        favorited
          ? "O post foi adicionado aos favoritos."
          : "O post foi removido dos favoritos."
      );
    } catch (error) {
      console.error("Erro ao alternar favorito:", error);
      showAlert("Erro", "Não foi possível atualizar o status do favorito.");
    } finally {
      setLoadingFavorite(false);
    }
  };

  const renderLocation = () => {
    if (!location) return "Localização não disponível";
    return `${location.city}, ${location.state}, ${location.country}`;
  };

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
                    <HoverColorComponent
                      colorHover={colors.textSecondary.standard}
                      colorPressIn={colors.primaryStandardDark.standard}
                      className="flex-row items-center ml-[-3px]"
                      onPress={handleToggleFavorite}
                    >
                      {loadingFavorite ? (
                        <ActivityIndicator size="small" color={colors.primaryStandardDark.standard} />
                      ) : (
                        <CustomIcons
                          name="favorito"
                          color={isFavorited ? "#FFF17D" : "#94A3B8"}
                          size={24}
                        />
                      )}
                      <Text
                        className="font-medium text-sm"
                        style={{ color: "#1d283a", marginLeft: loading ? 8 : 0 }}
                      >
                        {favoriteCount}
                      </Text>
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
                      {renderOptions()}
                    </View>
                    <View className="flex-row w-full justify-between">
                      <HoverColorComponent colorHover={colors.textSecondary.standard} colorPressIn={colors.primaryStandardDark.standard} className="flex-row items-center ml-[-3px]">
                        <CustomIcons name="favorito" color={isFavorited ? "#FFF17D" : "#94A3B8"} size={24} />
                        <Text className="font-medium text-sm" style={{ color: "#1d283a" }}>
                          {favoriteCount}
                        </Text>
                      </HoverColorComponent>
                      <ButtonScale scale={1.09}>
                        <CustomIcons name="lixeira" color="#D21F3C" size={24} />
                      </ButtonScale>
                    </View>
                  </View>
                </View>
                {renderFooter()}
              </>
            );
          case 'postDetails':
            return (
              <>
                {renderHeader()}
                <View aria-label="BodyPost" className="w-full flex px-[20px] py-[16px] gap-[5px]">
                  <Text className="font-bold text-base">{post.title}</Text>
                  <View>
                    <Text className="text-base">{post.description}</Text>
                    <Text className="text-base text-accentStandardDark">{post.tags}</Text>
                  </View>
                  <View className="flex-col gap-1 mb-3">
                    <View className="flex-row gap-1 items-center">
                      <View className="min-w-6">
                        <CustomIcons name="grupoPessoas" color="#94A3B8" size={24} />
                      </View>
                      <Text className="text-textStandardDark text-base">Número de pessoas que esse problema pode afetar: {post.peopleAffects}</Text>
                    </View>
                    <View className="flex-row gap-1 items-center">
                      <View className="min-w-6">
                        <CustomIcons name="atencao" color="#94A3B8" size={24} />
                      </View>
                      <Text className="text-textStandardDark text-base">Urgência do problema: {post.urgencyProblem}</Text>
                    </View>
                    <View className="flex-row gap-1 items-center">
                      <View className="min-w-6">
                        <CustomIcons name="pontoMapa" color="#94A3B8" size={24} />
                      </View>
                      <Text className="text-textStandardDark text-base">
                        {renderLocation()}
                      </Text>
                    </View>
                  </View>
                  {renderImage()}
                  <View aria-label="OptionsPost" className="flex w-full justify-between flex-row flex-wrap gap-2 mt-2" onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}>
                    <View accessibilityLabel="ContainerOptions" className="flex flex-row flex-wrap gap-4 w-fit">
                      {renderOptions()}
                    </View>
                    <HoverColorComponent
                      colorHover={colors.textSecondary.standard}
                      colorPressIn={colors.primaryStandardDark.standard}
                      className="flex-row items-center ml-[-3px]"
                      onPress={handleToggleFavorite}
                    >
                      {loadingFavorite ? (
                        <ActivityIndicator size="small" color={colors.primaryStandardDark.standard} />
                      ) : (
                        <CustomIcons
                          name="favorito"
                          color={isFavorited ? "#FFF17D" : "#94A3B8"}
                          size={24}
                        />
                      )}
                      <Text
                        className="font-medium text-sm"
                        style={{ color: "#1d283a", marginLeft: loading ? 8 : 0 }}
                      >
                        {favoriteCount}
                      </Text>
                    </HoverColorComponent>
                  </View>
                </View>
                {renderFooterDetails()}
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
