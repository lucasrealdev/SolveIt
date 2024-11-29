import { ScrollView, Text, View, ActivityIndicator, RefreshControl, Image, StyleSheet } from "react-native";
import { useEffect, useState, useCallback, useMemo } from "react";
import MenuRight from "@/components/MenuRight";
import Post from '@/components/Post';
import SearchHeader from "@/components/SearchHeader";
import { fetchAllQuizIds, getAllPosts } from "@/lib/appwriteConfig";
import ButtonScale from "@/components/ButtonScale";
import images from "@/constants/images";
import CustomIcons from "@/assets/icons/CustomIcons";
import { LinearGradient } from 'expo-linear-gradient';
import Quiz from "@/components/Quiz";

export default function Index() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [quizes, setQuizes] = useState([]);
  const POSTS_PER_PAGE = 3;

  const [isRequesting, setIsRequesting] = useState(false);

  // Função otimizada para buscar posts iniciais
  const fetchInitialPosts = useCallback(async () => {
    setLoading(true);
    setPage(1); // Sempre reinicia a página ao recarregar
    try {
      const newPosts = await getAllPosts(1, POSTS_PER_PAGE);
      setPosts(newPosts);
      setHasMore(newPosts.length === POSTS_PER_PAGE);

      const quizIds = await fetchAllQuizIds();
      setQuizes(quizIds);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função otimizada para buscar mais posts
  const fetchMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore || isRequesting) return; // Evita requisições duplicadas
    setIsRequesting(true);
    setLoadingMore(true);

    try {
      const nextPage = page + 1;
      const newPosts = await getAllPosts(nextPage, POSTS_PER_PAGE);

      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setPage(nextPage);
      setHasMore(newPosts.length === POSTS_PER_PAGE);
    } catch (error) {
      console.error('Erro ao buscar mais posts:', error);
    } finally {
      setLoadingMore(false);
      setTimeout(() => setIsRequesting(false), 500); // Delay para controle de múltiplas requisições
    }
  }, [loadingMore, hasMore, page, isRequesting]);

  // Lógica otimizada para scroll
  const handleScroll = useCallback(({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 100) {
      fetchMorePosts(); // Inicia o carregamento quando próximo ao final
    }
  }, [fetchMorePosts]);

  useEffect(() => {
    fetchInitialPosts(); // Carrega os posts ao iniciar
  }, [fetchInitialPosts]);

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

  const renderPosts = useMemo(() => {
    return posts.map((post) => (
      <Post key={post.$id} postId={post.$id} />
    ));
  }, [loading, posts]);

  const renderQuiz = useMemo(() => {
    return quizes.map((quiz) => (
      <Quiz key={quiz.$id} quizId={quiz.$id} />
    ));
  }, [loading, posts]);

  return (
    <View className="flex-1 flex-row">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-[#F8FAFC]"
        onScroll={handleScroll}
        scrollEventThrottle={16} // Reduz o intervalo de chamadas do onScroll
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchInitialPosts}
          />
        }
      >
        <SearchHeader />
        <View className="m-2 mb-4 flex items-center">
          <View className="max-w-[700px] gap-4 w-full">
            <BarStory/>
            <Quiz quizId="6748e9ee000aa15da23b"/>
            {renderPosts}
            {renderFooter()}
          </View>
        </View>
      </ScrollView>
      <MenuRight />
    </View>
  );
}

const BarStory: React.FC = () => {
  const users = [
    { name: "x_ae-23b" },
    { name: "maisenpai" },
  ];

  return (
    <View accessibilityLabel="ContainerStory" className="flex p-[20px] gap-[16px] bg-white rounded-[24px] shadow-[0px_12px_16px_-4px_rgba(16,_24,_40,_0.09)] flex-row items-center border border-borderStandardLight">
      {users.map((user, index) => (
        <ButtonScale key={index} scale={1.05} className="flex justify-center items-center w-fit">
          <LinearGradient
            accessibilityLabel="ContainerImage"
            colors={['#4F46E5', '#C622FF', '#FF2222', '#FFA439']}
            style={styles.containerImage}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 1, y: 1 }}
          >
            <Image source={images.person} className="border-white border-[2px] rounded-full w-[64px] h-[64px]" />
          </LinearGradient>
          <Text className="text-textStandardDark font-semibold">{user.name}</Text>
        </ButtonScale>
      ))}
      <ButtonScale
        scale={1.1}
        className="w-8 h-8 rounded-full bg-white border border-borderStandardLight flex items-center absolute justify-center right-3"
      >
        <CustomIcons name="proximo" color="#475569" size={20} />
      </ButtonScale>
    </View>
  );
};

const styles = StyleSheet.create({
  containerImage: {
    alignSelf: 'flex-start',
    padding: 3,
    borderRadius: 9999, // full rounded
  },
});