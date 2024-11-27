import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, ScrollView, Image as RNImage } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { Image } from 'expo-image';

import CustomIcons from '@/assets/icons/CustomIcons';
import ButtonScale from './ButtonScale';
import HoverColorComponent from './HoverColorComponent';
import colors from '@/constants/colors';
import { addComment, deleteCommentById, deletePostById, getCityAndStateByZipCode, getCommentsForPost, getFavoriteCount, getLikeCount, getPostById, toggleFavorite, toggleLike, userFavoritedPost, userLikedPost } from '@/lib/appwriteConfig';
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
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [postDeleted, setPostDeleted] = useState(false);

  const LIMIT = 10; // Número de comentários por página
  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const fetchPostData = async () => {
    try {
      setLoading(true);

      // Realiza todas as requisições ao mesmo tempo
      const [fetchedPost, likes, comments, favoriteCount] = await Promise.all([
        getPostById(postId),
        getLikeCount(postId),
        getCommentsForPost(postId, page, LIMIT),
        getFavoriteCount(postId)
      ]);

      setPost(fetchedPost);
      setLikeCount(likes);
      setCommentCount(comments.total);
      setComments(comments.documents);
      setFavoriteCount(favoriteCount);

      // Se houver zipCode, buscar a localização
      if (fetchedPost?.zipCode && typePost === "postDetails") {
        const location = await getCityAndStateByZipCode(fetchedPost.zipCode);
        setLocation(location);
      }

      // Verificar se o usuário já curtiu ou favoritou o post
      if (user) {
        const [userLikedState, userFavoritedState] = await Promise.all([
          user?.$id ? userLikedPost(postId, user.$id) : false,
          userFavoritedPost(postId, user.$id)
        ]);
        setLiked(userLikedState);
        setIsFavorited(userFavoritedState);
      }
    } catch (error) {
      console.log("Error fetching post data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPostData();
    }
  }, [postId, user]);

  if (loading) {
    return <PostSkeleton />;
  }

  const renderImage = () => {
    if (!post.thumbnail) return null;

    const allowedRatios = {
      "1:1": 1,
      "16:9": 16 / 9,
      "4:5": 4 / 5,
      "3:4": 3 / 4,
    };

    const selectedRatio = allowedRatios[post.thumbnailRatio] || allowedRatios["1:1"];

    return (
      <View className="w-full items-center">
        <View style={{ width: "100%", aspectRatio: selectedRatio, maxWidth: 600 }} aria-label="ImagePost">
          <Image
            source={{ uri: post.thumbnail }}
            style={{ width: "100%", height: "100%", borderRadius: 16 }}
            contentFit="cover"
            placeholder={{ blurhash }}
            cachePolicy="memory-disk"  // Usa cache para evitar re-downloads
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
      console.log("Error toggling like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const copySharedPostLink = () => {
    try {
      const url = `https://solveitb.netlify.app/postdetails/${post.$id}?shared=true`; // Melhor uso do origin
      Clipboard.setStringAsync(url);
      showAlert('Link Copiado!', 'O link foi copiado para a área de transferência.');
    } catch (error) {
      console.log('Erro ao copiar o link:', error);
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
        action: typePost !== "postDetails" ? () => navigateTo(`/postdetails/${post.$id}`) : undefined,
      },
      {
        icon: 'compartilhar',
        text: post?.shares || 0,
        action: copySharedPostLink,
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

  const handleNavigateToProfile = (creatorId) => {
    navigateTo(`/profile/${creatorId}`);
  };

  const handleBackNavigation = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');  // Vai para a página inicial se não houver uma página anterior
    }
  };

  const renderHeader = () => (
    <View aria-label="HeaderPost" className="flex w-full px-[20px] py-3 gap-[15px] border-b border-borderStandardLight flex-row items-center">
      <View aria-label="ContainerProfile" className="flex flex-1 flex-row gap-[12px] items-center">
        {typePost === "postDetails" ? (
          <View className="flex-row justify-center items-center">
            <ButtonScale scale={1.09} onPress={handleBackNavigation}>
              <CustomIcons name="anterior" color={colors.textStandard.standard} size={24} />
            </ButtonScale>
            <ButtonScale scale={1} onPress={() => handleNavigateToProfile(post.creator.$id)}>
              <RNImage source={{ uri: post.creator.avatar }} className="border-white border-[2px] rounded-full w-[50px] h-[50px]" />
            </ButtonScale>
          </View>
        ) : (
          <ButtonScale scale={1.06} onPress={() => handleNavigateToProfile(post.creator.$id)}>
            <RNImage source={{ uri: post.creator.avatar }} className="border-white border-[2px] rounded-full w-[50px] h-[50px]" />
          </ButtonScale>
        )}
        <View aria-label="ContainerText">
          <Text className="font-bold text-[14px] text-textStandardDark">{post.creator.username}</Text>
          <Text className="text-[14px] text-textSecondary">{post.category}</Text>
        </View>
      </View>
      {typePost !== "postDetails" && (
        <HoverColorComponent colorHover={colors.primaryStandardDark.standard} className="w-fit" onPress={() => navigateTo(`/postdetails/${post.$id}`)}>
          <Text className="text-xs underline" style={{ color: colors.textSecondary.standard }}>Ver Tudo</Text>
        </HoverColorComponent>
      )}
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

      // Adiciona o novo comentário no início da lista de forma otimizada
      setComments((prevComments) => [newComment, ...prevComments]);
      setCommentCount(prevCount => prevCount + 1);
    } catch (error) {
      console.log("Erro ao enviar comentário:", error);
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

        // Atualiza o estado de comentários de forma eficiente
        setComments((prevComments) => prevComments.filter(comment => comment.$id !== id));
        setCommentCount((prevCount) => prevCount - 1);
      }
    } catch (error) {
      console.log("Erro ao excluir comentário:", error);
    }
  };

  const fetchComments = async (isInitial = false) => {
    if (!hasMore && !isInitial) return;  // Previne chamadas desnecessárias

    try {
      setLoadingMore(true);
      const currentPage = isInitial ? 1 : page;

      const commentsData = await getCommentsForPost(postId, LIMIT, currentPage);

      setCommentCount(commentsData.total);

      // Atualiza os comentários de forma eficiente, evitando reprocessamento
      setComments((prevComments) => {
        if (isInitial) {
          return commentsData.documents;
        }
        return [...prevComments, ...commentsData.documents];  // Adiciona os novos comentários
      });

      // Atualiza o estado de 'hasMore' com base na quantidade de comentários carregados
      setHasMore(commentsData.documents.length === LIMIT);

      if (!isInitial) {
        setPage(prev => prev + 1);  // Avança a página se não for a inicial
      }
    } catch (error) {
      console.log("Erro ao carregar comentários:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    // Garante que a requisição não seja feita quando já está carregando ou não há mais dados
    if (isCloseToBottom && !loadingMore && hasMore) {
      fetchComments();  // Carrega mais comentários quando próximo do final
    }
  };

  const renderFooter = () => (
    <View aria-label="FooterPost" className="px-5 py-2 w-full flex border-t border-borderStandardLight">
      <View className="gap-3">
        {comments.length === 0 ? (
          <Text>Seja o primeiro a comentar!</Text>
        ) : (
          comments.slice(0, 2).map((comment) => (
            <Comment
              key={comment.$id}
              id={comment.$id}
              onDelete={handleDeleteComment}
            />
          ))
        )}
      </View>

      <View className="flex w-full flex-row items-center h-[60px] gap-2">
        <View aria-label="CommentaryPost" className="flex flex-1 flex-row gap-2">
          {loadingMessage ? (
            <ActivityIndicator size="small" color="#01B198" />
          ) : null}
          <TextInput
            value={commentContent}
            onChangeText={setCommentContent}
            placeholder="Comente aqui"
            maxLength={150}
            className="border-borderStandardLight border-[1px] h-[40px] flex flex-1 rounded-[28px] px-3 py-2 text-textStandardDark text-sm font-medium outline-none"
          />
        </View>

        <View aria-label="ContainerVectors" className="flex-row gap-2">
          <ButtonScale
            className="border-borderStandardLight border-[1px] rounded-full w-[42px] h-[42px] items-center justify-center"
            scale={1.08}
          >
            <CustomIcons name="rostoFeliz" size={24} color="#475569" />
          </ButtonScale>

          <ButtonScale
            className="border-accentStandardDark border-[1px] rounded-full w-[42px] h-[42px] items-center justify-center"
            scale={1.08}
            onPress={handleCommentSubmit}
          >
            <CustomIcons name="enviar" size={24} color="#01B198" />
          </ButtonScale>
        </View>
      </View>
    </View>
  );

  const renderFooterDetails = () => (
    <View aria-label="FooterPost" className="px-5 py-2 w-full flex border-t border-borderStandardLight">
      <View className="flex w-full flex-row items-center h-[60px] gap-2">
        <View aria-label="CommentaryPost" className="flex flex-1 flex-row gap-2">
          {loadingMessage && (
            <ActivityIndicator size="small" color="#01B198" />
          )}
          <TextInput
            value={commentContent}  // Define o texto no campo de comentário
            onChangeText={setCommentContent}  // Atualiza o estado conforme o usuário digita
            placeholder="Comente aqui"
            maxLength={150}
            className="border-borderStandardLight border-[1px] h-[40px] flex flex-1 rounded-[28px] px-3 py-2 text-textStandardDark text-sm font-medium outline-none"
          />
        </View>

        <View aria-label="ContainerVectors" className="flex-row gap-2">
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
        style={{ maxHeight: 250 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}  // Evita a barra de rolagem para uma experiência visual mais limpa
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
    if (!user?.$id) return;  // Verifica se o usuário está autenticado
    if (loadingFavorite) return;  // Evita múltiplos cliques enquanto processa

    setLoadingFavorite(true);  // Inicia o carregamento do processo de favoritar

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
      console.log("Erro ao alternar favorito:", error);
      showAlert("Erro", "Não foi possível atualizar o status do favorito.");
    } finally {
      setLoadingFavorite(false);  // Finaliza o carregamento
    }
  };

  const renderLocation = () => {
    if (!location) return "Localização não disponível";
    return `${location.city}, ${location.state}, ${location.country}`;
  };

  const deletePost = async () => {
    try {
      setLoadingDelete(true);
      const response = await deletePostById(postId);
      showAlert("Sucesso", "O post foi deletado com sucesso.");
      setPostDeleted(true);
    } catch (error) {
      showAlert("Erro", "Não conseguimos deletar o post");
    } finally {
      setLoadingDelete(false);
    }
  }

  const confirmDelete = async () => {
    showAlert(
      "Deletar Post",
      "Tem certeza que deseja deletar a sua postagem? ela pode ajudar muita gente!",
      [
        { text: 'Deletar', onPress: deletePost },
        { text: 'Recusar', onPress: () => null },
      ],
      10000
    );
  }

  if(postDeleted) return null;

  return (
    <View aria-label="Post" className="bg-white rounded-[24px] flex w-full border border-borderStandardLight items-center">
      {(() => {
        switch (typePost) {
          case 'normal':
            return (
              <>
                {renderHeader()}
                <View aria-label="BodyPost" className="w-full flex px-[20px] py-[16px] gap-[5px]">
                  <Text className="font-bold text-base">{post.title}</Text>
                  <View>
                    <Text className="text-base">{post.description}</Text>
                    <Text className="text-base text-accentStandardDark">{post.tags}</Text>
                  </View>
                  {renderImage()}
                  <View aria-label="OptionsPost" className="flex w-full flex-row justify-center mt-2" onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}>
                    <View aria-label="ContainerOptions" className="flex flex-row gap-4 flex-1">
                      {renderOptions()}
                    </View>
                    <HoverColorComponent
                      colorHover={colors.textSecondary.standard}
                      colorPressIn={colors.primaryStandardDark.standard}
                      className="flex-row items-center ml-[-3px]"
                      onPress={handleToggleFavorite}>
                      {loadingFavorite ? (
                        <ActivityIndicator size="small" color={colors.primaryStandardDark.standard} className='mr-1' />
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
                <View aria-label="BodyPost" className="w-full flex px-[20px] py-[16px] gap-[5px]">
                  <View className='w-full'>
                    <Text className="font-bold text-base">{post.title}</Text>
                  </View>
                  <View>
                    <Text className="text-base">{post.description}</Text>
                    <Text className="text-base text-accentStandardDark">{post.tags}</Text>
                  </View>
                  {renderImage()}
                  <View aria-label="OptionsPost" className="flex w-full flex-col mt-2 gap-3" onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}>
                    <View aria-label="ContainerOptions" className="flex flex-row flex-wrap gap-4 w-full items-start">
                      {renderOptions()}
                    </View>
                    <View className="flex-row w-full justify-between">
                      <HoverColorComponent colorHover={colors.textSecondary.standard} colorPressIn={colors.primaryStandardDark.standard} className="flex-row items-center ml-[-3px]">
                        <CustomIcons name="favorito" color={isFavorited ? "#FFF17D" : "#94A3B8"} size={24} />
                        <Text className="font-medium text-sm" style={{ color: "#1d283a" }}>
                          {favoriteCount}
                        </Text>
                      </HoverColorComponent>
                      <ButtonScale scale={1.09} onPress={confirmDelete} disabled={loadingDelete}>
                        {loadingDelete ? (
                          <ActivityIndicator size="small" color="#D21F3C" />
                        ) : (
                          <CustomIcons name="lixeira" color="#D21F3C" size={24} />
                        )}
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
                    <View aria-label="ContainerOptions" className="flex flex-row flex-wrap gap-4 w-fit">
                      {renderOptions()}
                    </View>
                    <HoverColorComponent
                      colorHover={colors.textSecondary.standard}
                      colorPressIn={colors.primaryStandardDark.standard}
                      className="flex-row items-center ml-[-3px]"
                      onPress={handleToggleFavorite}
                    >
                      {loadingFavorite ? (
                        <ActivityIndicator size="small" color={colors.primaryStandardDark.standard} className='mr-1' />
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
