import { ScrollView, StyleSheet, Text, View, ActivityIndicator, RefreshControl } from "react-native";
import { useEffect, useState, useCallback } from "react";

import MenuRight from "@/components/MenuRight";
import Post from '@/components/Post';
import SearchHeader from "@/components/SearchHeader";
import { getAllPosts } from "@/lib/appwriteConfig";
import PostSkeleton from "@/components/PostSkeleton"; // Importa o componente esqueleto criado anteriormente

export default function Index() {
  const [posts, setPosts] = useState([]); // Armazena todos os posts
  const [loading, setLoading] = useState(false); // Controla o estado de carregamento inicial
  const [loadingMore, setLoadingMore] = useState(false); // Controla o estado de carregar mais posts
  const [page, setPage] = useState(1); // Página atual
  const [hasMore, setHasMore] = useState(true); // Indica se há mais posts para carregar
  const POSTS_PER_PAGE = 3; // Número de posts por página

  // Função para buscar posts iniciais
  const fetchPosts = async (refresh = false) => {
    if (refresh) {
      setLoading(true);
      setPage(1);
      try {
        const newPosts = await getAllPosts(1, POSTS_PER_PAGE);
        setPosts(newPosts);
        setHasMore(newPosts.length === POSTS_PER_PAGE);
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Função para buscar mais posts
  const fetchMorePosts = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const newPosts = await getAllPosts(nextPage, POSTS_PER_PAGE);

      if (newPosts.length > 0) {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setPage(nextPage);
        setHasMore(newPosts.length === POSTS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erro ao buscar mais posts:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Lida com o evento de rolagem para detectar quando está próximo do final da lista
  const handleScroll = useCallback(({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isNearBottom = (layoutMeasurement.height + contentOffset.y)
      >= (contentSize.height - layoutMeasurement.height);

    if (isNearBottom && !loadingMore && hasMore) {
      fetchMorePosts();
    }
  }, [loadingMore, hasMore]);

  useEffect(() => {
    fetchPosts(true);
  }, []);

  // Renderiza o indicador de carregamento no rodapé
  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color="#01b297" />
      </View>
    );
  };

  return (
    <View className="flex-1 flex-row">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-[#F8FAFC]"
        onScroll={handleScroll}
        scrollEventThrottle={16} // Controla com que frequência o evento de rolagem é disparado
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => fetchPosts(true)}
          />
        }
      >
        <SearchHeader />
        <View className="m-2 mb-4 flex items-center">
          <View className="max-w-[800px] gap-4 w-full">

            {/* Estado inicial de carregamento */}
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <PostSkeleton key={`skeleton-${index}`} />
              ))
            ) : (
              // Renderiza os posts
              posts.map((post) => (
                <Post key={post.$id} postId={post.$id} />
              ))
            )}

            {/* Indicador de carregamento no rodapé */}
            {renderFooter()}

            {/* Mensagem de "não há mais posts" */}
            {!hasMore && posts.length > 0 && (
              <View className="py-4 items-center">
                <Text className="text-textSecondary">Não há mais posts para carregar</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <MenuRight />
    </View>
  );
}

const styles = StyleSheet.create({
  containerImage: {
    alignSelf: 'flex-start',
    padding: 3,
    borderRadius: 9999,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
