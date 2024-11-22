import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, View, Image, StyleSheet, Pressable, ScrollView, Animated, RefreshControl, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import CustomIcons from "@/assets/icons/CustomIcons";
import images from "@/constants/images";
import ButtonScale from "@/components/ButtonScale";
import { getUserPosts, getUserProfile } from "@/lib/appwriteConfig";
import PostSkeleton from "@/components/PostSkeleton";
import Post from "@/components/Post";

interface UserData {
  biography: string;
  username: string;
  email: string;
  avatar: string;
}

const Profile = () => {
  const animation = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [buttonWidth, setButtonWidth] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const { id } = useLocalSearchParams();

  const POSTS_PER_PAGE = 3;

  const fetchPosts = useCallback(
    async (refresh = false) => {
      if (refresh) {
        setLoading(true);
        setPage(1);
        try {
          const profileData = await getUserProfile(id);
          const { documents, pages } = await getUserPosts(id, 1, POSTS_PER_PAGE);
          setUserData(profileData);
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

  const moveTo = (value) => {
    Animated.timing(animation, {
      toValue: value,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, buttonWidth],
  });

  const handleButtonLayout = ({ nativeEvent }) => {
    setButtonWidth(nativeEvent.layout.width);
  };

  const toggleFollow = () => {
    setIsFollowing((prev) => !prev);
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
              onPress={() => handleBackNavigation}
              scale={1.04}
            >
              <CustomIcons name="anterior" color="#475569" size={24} />
            </ButtonScale>
          </View>
          <View className="flex flex-row justify-between items-end px-[5px] mt-[-75px]">
            <Image source={{ uri: userData.avatar }} className="border-[3px] rounded-full w-[140px] h-[140px]" resizeMode="cover" />
            <ButtonScale
              className="bg-primaryStandardDark px-[20px] py-[12px] rounded-full"
              scale={1.06}
              onPress={toggleFollow}
            >
              <Text className="text-white font-bold">{isFollowing ? "Seguindo" : "Seguir"}</Text>
            </ButtonScale>
          </View>
        </View>
        <View className="flex w-full max-w-[700px] px-[10px] gap-[5px]">
          <Text className="font-bold text-xl text-textStandardDark">{userData.username}</Text>
          <Text className="text-base">{userData.biography}</Text>
          <View className="w-full mt-1 gap-4 items-center justify-center flex-row">
            <ButtonScale className="flex-col justify-center items-center" scale={1.05}>
              <Text className="text-textStandardDark font-semibold text-lg">1000</Text>
              <Text className="text-textSecondary font-semibold text-lg">Seguidores</Text>
            </ButtonScale>
            <ButtonScale className="flex-col justify-center items-center" scale={1.05}>
              <Text className="text-textStandardDark font-semibold text-lg">1000</Text>
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
          <View className="gap-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => <PostSkeleton key={`skeleton-${index}`} />)
            ) : (
              posts.map((post) => <Post key={post.$id} postId={post.$id} />)
            )}
            {renderFooter()}
          </View>
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
