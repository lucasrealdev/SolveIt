import { ScrollView, StyleSheet, Text, View, ActivityIndicator, RefreshControl } from "react-native";
import { useEffect, useState, useCallback } from "react";

import MenuRight from "@/components/MenuRight";
import Post from '@/components/Post';
import SearchHeader from "@/components/SearchHeader";
import { getAllPosts } from "@/lib/appwriteConfig";
import PostSkeleton from "@/components/PostSkeleton"; // Import the skeleton component we created earlier

export default function Index() {
  const [posts, setPosts] = useState([]); // Stores all posts
  const [loading, setLoading] = useState(false); // Controls initial loading state
  const [loadingMore, setLoadingMore] = useState(false); // Controls loading more posts state
  const [page, setPage] = useState(1); // Current page
  const [hasMore, setHasMore] = useState(true); // Indicates if there are more posts to load
  const POSTS_PER_PAGE = 3; // Number of posts per page

  // Function to fetch initial posts
  const fetchPosts = async (refresh = false) => {
    if (refresh) {
      setLoading(true);
      setPage(1);
      try {
        const newPosts = await getAllPosts(1, POSTS_PER_PAGE);
        setPosts(newPosts);
        setHasMore(newPosts.length === POSTS_PER_PAGE);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Function to fetch more posts
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
      console.error('Error fetching more posts:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Handle scroll event to detect when we're near the bottom
  const handleScroll = useCallback(({nativeEvent}) => {
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

  // Render footer loading indicator
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
        scrollEventThrottle={16} // Controls how often the scroll event fires
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
            
            {/* Initial loading state */}
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <PostSkeleton key={`skeleton-${index}`} />
              ))
            ) : (
              // Render posts
              posts.map((post) => (
                <Post key={post.$id} postId={post.$id} />
              ))
            )}

            {/* Footer loading indicator */}
            {renderFooter()}

            {/* No more posts message */}
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

// ... rest of your code (BarStory component and styles) remains the same

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