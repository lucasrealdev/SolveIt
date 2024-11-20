import { ScrollView, StyleSheet, Text, View, ActivityIndicator, RefreshControl } from "react-native";
import { useEffect, useState, useCallback, useMemo } from "react";
import MenuRight from "@/components/MenuRight";
import Post from '@/components/Post';
import SearchHeader from "@/components/SearchHeader";
import { getAllPosts } from "@/lib/appwriteConfig";
import PostSkeleton from "@/components/PostSkeleton";

export default function Index() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
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

  const renderFooter = useMemo(() => {
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="large" color="#01b297" />
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
    if (loading) {
      return Array.from({ length: POSTS_PER_PAGE }).map((_, index) => (
        <PostSkeleton key={`skeleton-${index}`} />
      ));
    }
    return posts.map((post) => (
      <Post key={post.$id} postId={post.$id} />
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
            {renderPosts}
            {renderFooter}
          </View>
        </View>
      </ScrollView>
      <MenuRight />
    </View>
  );
}

const styles = StyleSheet.create({
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
