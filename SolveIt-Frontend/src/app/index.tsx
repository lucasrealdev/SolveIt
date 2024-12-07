import { ScrollView, Text, View, ActivityIndicator, RefreshControl } from "react-native";
import { useEffect, useState, useCallback, useMemo } from "react";
import MenuRight from "@/components/menus/MenuRight";
import Post from '@/components/Post';
import SearchHeader from "@/components/menus/SearchHeader";
import { fetchEntirePosts, fetchEntiresQuiz } from "@/lib/appwriteConfig";
import Quiz from "@/components/Quiz";
import { useGlobalContext } from "@/context/GlobalProvider";
import BarStory from "@/components/menus/BarStory";

export default function Index() {
  const [quizes, setQuizes] = useState([]);

  const [loadingPost, setLoadingPost] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [isRequesting, setIsRequesting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [posts, setPosts] = useState([]);
  const POSTS_PER_PAGE = 5;

  const { user, isLogged, loading } = useGlobalContext();

  // Função otimizada para buscar posts iniciais
  const fetchInitialPosts = useCallback(async () => {
    if (loading) return;

    setLoadingPost(true);
    setPage(1);
    try {
      const enrichedPosts = await fetchEntirePosts(1, POSTS_PER_PAGE, isLogged ? user : null);
      setPosts(enrichedPosts);
      setHasMore(enrichedPosts.length === POSTS_PER_PAGE);

      const fetchedQuizes = await fetchEntiresQuiz(user);
      setQuizes(fetchedQuizes);
    } catch (error) {
      console.error("Erro ao buscar dados iniciais:", error);
    } finally {
      setLoadingPost(false);
    }
  }, [isLogged, loading]);

  const handleRefresh = async () => {
    fetchInitialPosts;
    setRefreshKey(prevKey => prevKey + 1); // Atualiza a key para forçar a re-renderização
  }

  // Função otimizada para buscar mais posts
  const fetchMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore || isRequesting || loading) return;

    setIsRequesting(true);
    setLoadingMore(true);

    try {
      const nextPage = page + 1;
      const newPosts = await fetchEntirePosts(nextPage, POSTS_PER_PAGE, isLogged ? user : null);
      setPosts((prev) => [...prev, ...newPosts]);
      setPage(nextPage);
      setHasMore(newPosts.length === POSTS_PER_PAGE);
    } catch (error) {
      console.error("Erro ao carregar mais posts:", error);
    } finally {
      setLoadingMore(false);
      setTimeout(() => setIsRequesting(false), 500);
    }
  }, [page, hasMore, loadingMore, isLogged, isRequesting, loading]);

  // Lógica otimizada para scroll
  const handleScroll = useCallback(({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 400) {
      fetchMorePosts(); // Inicia o carregamento quando próximo ao final
    }
  }, [fetchMorePosts]);

  useEffect(() => {
    fetchInitialPosts(); // Carrega os posts ao iniciar
  }, [fetchInitialPosts]);

  const renderFooter = useCallback(() => {
    if (loadingMore && !loadingPost) {
      return (
        <View className="px-5 items-center justify-center">
          <ActivityIndicator size="large" color="#3692C5" />
        </View>
      );
    }

    if (!hasMore && posts.length > 0 && !loadingPost) {
      return (
        <View className="py-4 items-center">
          <Text className="text-textSecondary">Não há mais posts para carregar</Text>
        </View>
      );
    }

    return null;
  }, [loadingMore, hasMore, posts.length]);

  const renderPosts = useMemo(() => {
    if (loadingPost) return <ActivityIndicator size="large" color="#3692C5" />;
    return posts.map((EntirePost) => (
      <Post
        key={EntirePost.post.$id}
        propCommentCount={EntirePost.commentCount}
        propComments={EntirePost.comments}
        propFavoriteCount={EntirePost.favoriteCount}
        propLikeCount={EntirePost.likeCount}
        propPost={EntirePost.post}
        propShareCount={EntirePost.shareCount}
        propIsFavorited={EntirePost.isFavorited}
        propLiked={EntirePost.liked}
        typePost="normal"
      />
    ));
  }, [loadingPost, posts]);

  return (
    <View className="flex-1 flex-row">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-[#F8FAFC]"
        onScroll={handleScroll}
        scrollEventThrottle={16} // Reduz o intervalo de chamadas do onScroll
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={handleRefresh}
          />
        }>
        <SearchHeader />
        <View className="m-2 mb-4 flex items-center">
          <View className="max-w-[700px] gap-4 w-full">
            <BarStory key={refreshKey}/>
            {quizes.map((quiz) => (
              <Quiz key={quiz.$id} quiz={quiz} />
            ))}
            {renderPosts}
            {renderFooter()}
          </View>
        </View>
      </ScrollView>
      <MenuRight />
    </View>
  );
}