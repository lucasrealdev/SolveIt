import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, View, Image, StyleSheet, Pressable, ScrollView, Animated, RefreshControl, ActivityIndicator, TouchableOpacity, Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import CustomIcons from "@/assets/icons/CustomIcons";
import images from "@/constants/images";
import ButtonScale from "@/components/ButtonScale";
import { checkIfFollowing, followUser, getFollowerCount, getFollowers, getFollowing, getFollowingCount, getUserPosts, getUserProfile, unfollowUser } from "@/lib/appwriteConfig";
import PostSkeleton from "@/components/PostSkeleton";
import Post from "@/components/Post";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useAlert } from "@/context/AlertContext";
import { FontAwesome } from '@expo/vector-icons';

interface UserData {
  biography: string;
  username: string;
  email: string;
  avatar: string;
  accountType: string;
  numberPhone: string;
}

const Profile = () => {
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [buttonWidth, setButtonWidth] = useState(0);
  const { id } = useLocalSearchParams();
  const { user } = useGlobalContext();

  const POSTS_PER_PAGE = 3;

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const [currentStatus, setCurrentStatus] = useState(null);

  const { showAlert } = useAlert();

  const [selectedTab, setSelectedTab] = useState("Publicações"); // Variável que guarda qual opção está selecionada
  const [isAnimating, setIsAnimating] = useState(false); // Controle de animação
  const [translateX] = useState(new Animated.Value(0));
  const [isVisible, setIsVisible] = useState(true); // Estado para controlar visibilidade

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);

      try {
        // 1. Obter o número de seguidores
        const followersCount = await getFollowerCount(id);

        // 2. Obter o número de "seguindo"
        const followingCount = await getFollowingCount(id);

        // 3. Verificar se o usuário atual está seguindo o perfil
        const isFollowing = await checkIfFollowing(user?.$id, id);

        // Definir os dados no estado
        setFollowersCount(followersCount);
        setFollowingCount(followingCount);
        setIsFollowing(isFollowing);

        const profileData = await getUserProfile(id);
        setUserData(profileData);
        // Verifica o status do usuário
        if (user?.isOnline !== undefined) {
          // Define o status diretamente como booleano
          setCurrentStatus(profileData.isOnline);
        }
      } catch (error) {
        console.error("Erro ao buscar informações de amigos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, user?.$id]);

  const fetchPosts = useCallback(
    async (refresh = false) => {
      if (refresh) {
        setLoading(true);
        setPage(1);
        try {
          const { documents, pages } = await getUserPosts(id, 1, POSTS_PER_PAGE);
          setPosts(documents);
          setHasMore(pages > 1);
        } catch (error) {
          console.error("Erro ao buscar posts:", error);
        } finally {
          setLoading(false);
        }
      }
    },
    [id]
  );

  const fetchMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const { documents, pages } = await getUserPosts(id, nextPage, POSTS_PER_PAGE);
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
  }, [id, page, hasMore, loadingMore]);

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

  useEffect(() => {
    if (id) {
      fetchPosts(true);
    }
  }, [id, fetchPosts]);

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

  // Exibe um ActivityIndicator enquanto os dados estão sendo carregados
  if (loading) {
    return (
      <View className="mt-4">
        <ActivityIndicator size="large" color="#3692C5" />
      </View>
    );
  }

  if (!userData) return null;

  // Função para alternar entre "Seguir" e "Seguindo"
  const toggleFollow = async () => {
    if (loading) return; // Evita chamadas repetidas enquanto a ação está em andamento

    if (user?.$id === id) {
      showAlert("Ação inválida", "Você não pode seguir a si mesmo.");
      return; // Retorna para não permitir a ação de seguir
    }

    setLoadingButton(true);
    try {
      if (isFollowing) {
        await unfollowUser(user?.$id, id); // Remove o "follow" no backend
        setIsFollowing(false); // Atualiza o estado local
        setFollowersCount((prevCount) => prevCount - 1); // Decrementa o número de seguidores
      } else {
        await followUser(user?.$id, id); // Adiciona o "follow" no backend
        setIsFollowing(true); // Atualiza o estado local
        setFollowersCount((prevCount) => prevCount + 1); // Incrementa o número de seguidores
      }
    } catch (error) {
      console.error("Erro ao alternar estado de seguir:", error);
      showAlert("Erro", "Erro ao alternar estado de seguir");
    } finally {
      setLoadingButton(false);
    }
  };

  // Renderização da aba "Publicações"
  const renderPublicacoes = () => (
    <View className="gap-3">
      {loading ? (
        Array.from({ length: 3 }).map((_, index) => <PostSkeleton key={`skeleton-${index}`} />)
      ) : posts.length > 0 ? (
        posts.map((post) => <Post key={post.$id} postId={post.$id} />)
      ) : (
        <Text className="text-center text-textSecondary mt-4">Não há posts disponíveis no momento.</Text>
      )}

      {renderFooter()}
    </View>
  );


  const handlePress = () => {
    const number = userData.numberPhone;

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
      scrollEventThrottle={16}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={() => fetchPosts(true)} />}
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
            <View className="relative">
              {userData?.avatar ? (
                <>
                  <ButtonScale scale={1.01} className="flex-row items-center justify-center">
                    <Image
                      source={{ uri: userData.avatar }}
                      className="border-[3px] rounded-full w-[120px] h-[120px] bg-white"
                      resizeMode="cover"
                    />

                    {currentStatus !== null && (
                      <View
                        className={`w-5 h-5 border-white border-[2px] rounded-full absolute bottom-1 right-1 ${currentStatus
                          ? "bg-green-500"  // Se o status for verdadeiro, mostra verde
                          : "bg-red-500"   // Caso contrário, mostra vermelho
                          }`}
                      />
                    )}
                  </ButtonScale>
                </>
              ) : (
                <ActivityIndicator size="small" color="#01B198" />
              )}
            </View>
            <ButtonScale
              className="bg-primaryStandardDark px-[20px] py-[12px] rounded-full"
              scale={1.06}
              onPress={toggleFollow}
            >
              {loadingButton ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-white font-bold">{isFollowing ? "Seguindo" : "Seguir"}</Text>
              )}
            </ButtonScale>
          </View>
        </View>
        <View className="flex w-full max-w-[700px] px-[10px] gap-[5px]">
          <Text className="font-bold text-xl text-textStandardDark">{userData.username}</Text>
          <Text className="text-base">{userData.biography}</Text>
          <View className="w-full mt-1 gap-4 items-center justify-center flex-row">
            <ButtonScale className="flex-col justify-center items-center" scale={1.05}>
              <Text className="text-textStandardDark font-semibold text-lg">{followersCount}</Text>
              <Text className="text-textSecondary font-semibold text-lg">Seguidores</Text>
            </ButtonScale>
            <ButtonScale className="flex-col justify-center items-center" scale={1.05}>
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
            user.accountType === "Premium" ? (
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
                  <Text className="text-lg font-bold text-gray-800">{userData.username}</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-base text-gray-600">{userData.email}</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-base text-gray-600">{userData.numberPhone || "Usuário não adicionou um número de telefone"}</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-base text-gray-600">{"Membro " + userData.accountType}</Text>
                </View>
                {userData.numberPhone ? (
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
            ) : (
              <View className="items-center">
                <View aria-label="CardPremium" className={`flex gap-[16px] p-[16px] bg-secondaryStandardDark rounded-[24px] w-full max-w-[420px]`}>
                  <View className="flex flex-row justify-between">
                    <View className="w-[40px] h-[40px] flex bg-secondaryStandard rounded-full items-center justify-center">
                      <CustomIcons name="perigo" size={20} color="#FFF" />
                    </View>
                  </View>
                  <Text className="text-white text-sm">Para acessar as informações, torne-se um membro Premium. Aproveite os benefícios premiuns do app, exclusivos para você!</Text>
                  <View className="flex flex-row gap-4">
                    <Pressable><Text className="text-[#C7FEF1] font-bold">Garantir</Text></Pressable>
                  </View>
                </View>
              </View>
            )
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  activeBar: {
    position: "absolute",
    height: "100%",
    backgroundColor: "#3692C5",
    borderRadius: 20,
  },
});

export default Profile;
