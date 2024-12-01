import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, View, Image, StyleSheet, Pressable, ScrollView, Animated, ActivityIndicator, RefreshControl, TouchableOpacity, Linking } from "react-native";
import { usePathname, useRouter } from 'expo-router';
import CustomIcons from "@/assets/icons/CustomIcons";
import images from "@/constants/images";
import ButtonScale from "@/components/ButtonScale";
import HoverColorComponent from "@/components/HoverColorComponent";
import colors from "@/constants/colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { fetchPostsUser, getFollowerCount, getFollowingCount, signOut, toggleUserOnlineStatus } from "@/lib/appwriteConfig";
import Post from "@/components/Post";
import { useAlert } from "@/context/AlertContext";
import { FontAwesome } from '@expo/vector-icons';

const PersonalProfile = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [buttonWidth, setButtonWidth] = useState(0);
  const { user, setUser, isLogged, loading } = useGlobalContext();

  const [posts, setPosts] = useState([]); // Armazena todas as postagens
  const [loadingPosts, setLoadingPosts] = useState(false); // Controla o estado de carregamento inicial
  const [loadingMore, setLoadingMore] = useState(false); // Controla o estado de carregamento de mais postagens
  const [page, setPage] = useState(1); // Página atual
  const [hasMore, setHasMore] = useState(true); // Indica se há mais postagens para carregar
  const POSTS_PER_PAGE = 3; // Número de postagens por página

  const [currentStatus, setCurrentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const { showAlert } = useAlert();

  const [selectedTab, setSelectedTab] = useState("Publicações"); // Variável que guarda qual opção está selecionada
  const [isAnimating, setIsAnimating] = useState(false); // Controle de animação
  const [translateX] = useState(new Animated.Value(0));

  useEffect(() => {
    if(!user) return;
    const fetchPost = async () => {
      try {
        // 1. Obter o número de seguidores
        const followersCount = await getFollowerCount(user.$id);

        // 2. Obter o número de "seguindo"
        const followingCount = await getFollowingCount(user.$id);

        // Definir os dados no estado
        setFollowersCount(followersCount);
        setFollowingCount(followingCount);

        // Verifica o status do usuário
        if (user?.isOnline !== undefined) {
          // Define o status diretamente como booleano
          setCurrentStatus(user.isOnline);
        }
      } catch (error) {
        console.error("Erro ao buscar informações de amigos:", error);
      }
    };

    if (user?.$id) {
      fetchPost();
    }
  }, [loading, user]);

  // Função para buscar posts iniciais
  const fetchPosts = async (refresh = false) => {
    if (refresh && user) { // Só faz a requisição se o usuário estiver carregado
      setLoadingPosts(true);
      setPage(1);
      try {
        const { documents, pages } = await fetchPostsUser(user.$id, 1, POSTS_PER_PAGE, user); // Obtém posts do usuário
        setPosts(documents); // Armazena os posts
        setHasMore(pages > 1); // Define se há mais postagens

        // 1. Obter o número de seguidores
        const followersCount = await getFollowerCount(user.$id);

        // 2. Obter o número de "seguindo"
        const followingCount = await getFollowingCount(user.$id);

        // Definir os dados no estado
        setFollowersCount(followersCount);
        setFollowingCount(followingCount);

        // Verifica o status do usuário
        if (user?.isOnline !== undefined) {
          // Define o status diretamente como booleano
          setCurrentStatus(user.isOnline);
        }
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      } finally {
        setLoadingPosts(false);
      }
    }
  };

  useEffect(() => {
    if (user?.$id) {
      fetchPosts(true);
    }
  }, [loading, user]);

  // Função para buscar mais posts
  const fetchMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore || !user) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const { documents, pages } = await fetchPostsUser(user.$id, nextPage, POSTS_PER_PAGE, user);
      if (documents.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...documents]);
        setPage(nextPage);
        setHasMore(pages > nextPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Erro ao buscar mais posts:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [user, page, hasMore, loadingMore]);

  const handleStatusToggle = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const newStatus = await toggleUserOnlineStatus();
      // Atualiza o status no estado local e global
      setCurrentStatus(newStatus);
      setUser({ ...user, isOnline: newStatus });
      const statusMessage = newStatus ? "Estado alterado para online" : "Estado alterado para offline";
      showAlert("Sucesso!", statusMessage);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = useCallback(
    ({ nativeEvent }) => {
      const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
      const isNearBottom =
        layoutMeasurement.height + contentOffset.y >= contentSize.height - layoutMeasurement.height * 1.5;
      if (isNearBottom && !loadingMore && hasMore) {
        fetchMorePosts();
      }
    },
    [loadingMore, hasMore, fetchMorePosts]
  );

  const moveTo = (index) => {
    if (!isAnimating) {
      setIsAnimating(true);
      const newTranslateX = index * buttonWidth; // Calcula a nova posição

      // Inicia a animação
      Animated.timing(translateX, {
        toValue: newTranslateX,
        duration: 300, // duração da animação
        useNativeDriver: true,
      }).start(() => {
        // Após a animação terminar, atualize o estado
        setSelectedTab(index === 0 ? "Publicações" : "Informações");
        setIsAnimating(false); // Finaliza a animação
      });
    }
  };

  const handleButtonLayout = ({ nativeEvent }) => {
    setButtonWidth(nativeEvent.layout.width);
  };

  const handleBackNavigation = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');  // Vai para a página inicial se não houver uma página anterior
    }
  };

  const renderProfileIcon = () => {
    const iconColor = "#01B198"; // Cor ativa, pode ajustar conforme necessário

    return (
      <View className="relative">
        {user ? (
          <>
            <ButtonScale scale={1.01} onPress={handleStatusToggle} disabled={isLoading} className="flex-row items-center justify-center">
              <Image
                source={{ uri: user.avatar }}
                className="border-[3px] rounded-full w-[120px] h-[120px] bg-white"
                resizeMode="cover"
              />

              {currentStatus !== null && (
                <View
                  className={`w-5 h-5 border-white border-[2px] rounded-full absolute bottom-1 right-1 ${isLoading
                    ? "bg-gray-400"  // Se estiver carregando, mostra o status cinza
                    : currentStatus
                      ? "bg-green-500"  // Se o status for verdadeiro, mostra verde
                      : "bg-red-500"   // Caso contrário, mostra vermelho
                    }`}
                />
              )}
            </ButtonScale>
          </>
        ) : (
          <ActivityIndicator size="small" color={iconColor} />
        )}
      </View>
    );
  };

  // Renderiza o indicador de carregamento no rodapé
  const renderFooter = useCallback(() => {
    if (loadingMore) {
      return (
        <View className="px-5 items-center justify-center">
          <ActivityIndicator size="large" color="#3692C5" />
        </View>
      );
    }

    if (!hasMore && posts.length > 0) {
      return (
        <View className="py-4 items-center">
          <Text className="text-textSecondary">Não há mais posts para carregar</Text>
        </View>
      );
    }

    return null;
  }, [loadingMore, hasMore, posts.length]);

  const navigateTo = (route: string) => {
    router[route !== pathname ? 'push' : 'replace'](route);
  };

  const logout = async () => {
    setLoadingLogout(true);
    await signOut();
    setUser(null);

    showAlert("Sucesso", "Você saiu da conta com sucesso!");
    setLoadingLogout(false);
    router.replace("/signin");
  };

  // Renderização da aba "Publicações"
  const renderPublicacoes = () => (
    <View className="gap-3">
      {loadingPosts ? (
        <ActivityIndicator size="large" color="#3692C5" />
      ) : posts.length > 0 ? (
        posts.map((post) => <Post
          key={post.post.$id}
          propCommentCount={post.commentCount}
          propComments={post.comments}
          propFavoriteCount={post.favoriteCount}
          propLikeCount={post.likeCount}
          propPost={post.post}
          propShareCount={post.shareCount}
          propIsFavorited={post.isFavorited}
          propLiked={post.liked}
          typePost="ownProfile"/>)
      ) : (
        <Text className="text-center text-textSecondary mt-4">Não há posts disponíveis no momento.</Text>
      )}
      {renderFooter()}
    </View>
  );

  const handlePress = () => {
    const number = user.numberPhone;

    // Remover caracteres especiais do número de telefone
    const cleanedNumber = number.replace(/\D/g, '');  // Remove tudo que não é número

    // Concatena o número limpo ao link
    const whatsappURL = `https://wa.me/${cleanedNumber}`;

    // Abre o link
    Linking.openURL(whatsappURL).catch(err => console.error("Erro ao tentar abrir o link: ", err));
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1 bg-white"
      onScroll={handleScroll}
      scrollEventThrottle={16} // Controla a frequência do evento de rolagem
      refreshControl={
        <RefreshControl
          refreshing={loadingPosts}
          onRefresh={() => fetchPosts(true)}
        />
      }
    >
      <View className="flex-1 bg-white pb-[40px] items-center">
        <View className="flex w-full max-w-[700px]">
          <View className="relative">
            <Image source={images.banner} className="w-full rounded-b-md h-[200px]" resizeMode="cover" />
            <ButtonScale
              className="absolute w-8 h-8 rounded-full bg-white ml-2 mt-2 border border-borderStandardLight flex items-center justify-center"
              onPress={() => handleBackNavigation()}
              scale={1.04}
            >
              <CustomIcons name="anterior" color="#475569" size={24} />
            </ButtonScale>
          </View>
          <View className="flex flex-row justify-between items-end px-[5px] mt-[-75px]">
            {renderProfileIcon()}
            <HoverColorComponent colorHover={colors.primaryStandardDark.hover} colorPressIn={colors.primaryStandardDark.pressIn}>
              <Text className="underline font-bold" style={{ color: colors.primaryStandardDark.standard }}>Editar Perfil</Text>
            </HoverColorComponent>
          </View>
        </View>

        <View className="flex w-full max-w-[700px] px-[10px]">
          <View className="flex-row gap-1 mt-2 w-full justify-between">
            <Text className="font-bold text-xl text-textStandardDark">{user?.username || "Nome do Usuário"}</Text>
            {loadingLogout ? (
              <ActivityIndicator
                size="small"
                color="#8AA2BE"
              />
            ) : (
              <ButtonScale
                scale={1.04}
                className="w-fit h-fit p-[3px] border-[2px] border-[#CBD5E1] rounded-full"
                onPress={logout}
              >
                <CustomIcons name="exit" size={24} color="#8AA2BE" />
              </ButtonScale>
            )}
          </View>
          <Text className="text-base">{user?.biography || "Opa, sou novo por aqui!"}</Text>
          <View className="w-full mt-6 mb-3 gap-4 items-center justify-center flex-row">
            <ButtonScale className="flex-col justify-center items-center" scale={1.05} onPress={() => navigateTo("/friends")}>
              <Text className="text-textStandardDark font-semibold text-lg">{followersCount}</Text>
              <Text className="text-textSecondary font-semibold text-lg">Seguidores</Text>
            </ButtonScale>

            <ButtonScale className="flex-col justify-center items-center" scale={1.05} onPress={() => navigateTo("/friends")}>
              <Text className="text-textStandardDark font-semibold text-lg">{followingCount}</Text>
              <Text className="text-textSecondary font-semibold text-lg">Seguindo</Text>
            </ButtonScale>
          </View>
          <View className="w-full items-center mb-4 mt-2">
            <View className="flex-row items-center justify-between w-full h-[50px] rounded-[20px] bg-textStandardDark max-w-[420px] relative">
              <Animated.View style={[styles.activeBar, { transform: [{ translateX }], width: buttonWidth }]} />
              {["Publicações", "Informações"].map((title, index) => (
                <Pressable key={index} className="flex-1 justify-center items-center bg-transparent" onPress={() => moveTo(index)} onLayout={handleButtonLayout}>
                  <Text className="text-white text-lg font-semibold">{title}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {selectedTab === "Publicações" ? renderPublicacoes() : (
            <View
              className="bg-white rounded-xl p-4 mt-2 items-start"
              style={{
                shadowColor: '#000', // Cor da sombra
                shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
                shadowOpacity: 0.15, // Opacidade da sombra
                shadowRadius: 10, // Raio da sombra
                elevation: 5, // Sombra no Android
              }}
            >
              <View className="flex-row items-center">
                <Text className="text-lg font-bold text-gray-800">{user.username}</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-base text-gray-600">{user.email}</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-base text-gray-600">{user.numberPhone || "Você ainda não adicionou um número de telefone"}</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-base text-gray-600">{"Membro " + user.accountType}</Text>
              </View>
              {user.numberPhone ? (
                <TouchableOpacity
                  className="bg-primaryStandardDark py-3 px-6 rounded-xl items-center mt-6 active:opacity-90 w-full"
                  onPress={handlePress}
                >
                  <View className='flex-row gap-2'>
                    <Text className="text-white text-base font-semibold">
                      Ir para whatsapp
                    </Text>
                    <FontAwesome name="whatsapp" size={24} color="#ffffff" />
                  </View>
                </TouchableOpacity>
              ) : (
                null
              )}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  activeBar: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#3692C5',
    borderRadius: 20,
  }
});

export default PersonalProfile;
