import { ScrollView, Text, View, ActivityIndicator, RefreshControl } from "react-native";
import { useEffect, useState, useCallback, useMemo } from "react";
import Post from '@/components/Post';

export default function Favoritos() {
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

  }, []);

  // Função otimizada para buscar mais posts
  const fetchMorePosts = useCallback(async () => {

  }, []);

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

  // const renderPosts = useMemo(() => {
  //   return posts.map((post) => (
  //     <Post key={post.$id} postId={post.$id} />
  //   ));
  // }, [loading, posts]);

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
        }>
        <View className="m-2 mb-4 flex items-center">
          <View className="max-w-[700px] gap-4 w-full">
            
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
