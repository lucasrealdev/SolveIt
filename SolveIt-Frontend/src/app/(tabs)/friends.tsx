import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import CustomIcons from "@/assets/icons/CustomIcons";
import CardAmigo from "@/components/CardFriend";
import SearchHeader from "@/components/SearchHeader";
import HoverColorComponent from "@/components/HoverColorComponent";
import colors from "@/constants/colors";
import { getFollowerCount, getFollowers, getFollowing, getFollowingCount, getSuggestedFriends } from "@/lib/appwriteConfig";
import { useGlobalContext } from "@/context/GlobalProvider";

export default function Friends() {
  const animation = useRef(new Animated.Value(0)).current;
  const [buttonWidth, setButtonWidth] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');
  const { user } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [loadingSuggested, setLoadingSuggested] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // Pagination states
  const [pageFollowers, setPageFollowers] = useState(1);
  const [hasMoreFollowers, setHasMoreFollowers] = useState(true);
  const [pageFollowing, setPageFollowing] = useState(1);
  const [hasMoreFollowing, setHasMoreFollowing] = useState(true);
  const [pageSuggestedFriends, setPageSuggestedFriends] = useState(1);
  const [hasMoreSuggestedFriends, setHasMoreSuggestedFriends] = useState(true);

  const LIMIT = 3; // Número de comentários por página

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setLoadingSuggested(true);

        // Reset pagination
        setPageFollowers(1);
        setPageFollowing(1);
        setPageSuggestedFriends(1);
        setFollowers([]);
        setFollowing([]);
        setSuggestedFriends([]);
        setHasMoreFollowers(true);
        setHasMoreFollowing(true);
        setHasMoreSuggestedFriends(true);

        // Fetch counts
        const followersCount = await getFollowerCount(user?.$id);
        const followingCount = await getFollowingCount(user?.$id);
        setFollowersCount(followersCount);
        setFollowingCount(followingCount);

        // Fetch initial data based on active tab
        if (activeTab === 'followers') {
          const followersData = await getFollowers(user?.$id, 1, LIMIT);
          setFollowers(followersData.documents);
          setHasMoreFollowers(
            followersData.total > LIMIT &&
            followersData.documents.length === LIMIT
          );
        } else {
          const followingData = await getFollowing(user?.$id, 1, LIMIT);
          setFollowing(followingData.documents);
          setHasMoreFollowing(
            followingData.total > LIMIT &&
            followingData.documents.length === LIMIT
          );
        }

        const suggestedFriendsData = await getSuggestedFriends(user?.$id, 1, LIMIT);
        setSuggestedFriends(suggestedFriendsData.documents);
        setHasMoreSuggestedFriends(
          suggestedFriendsData.total > LIMIT &&
          suggestedFriendsData.documents.length === LIMIT
        );
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
        setLoadingSuggested(false);
      }
    };

    fetchInitialData();
  }, [user, activeTab]);

  const fetchMoreUsers = async (type: 'followers' | 'following' | 'suggested') => {
    if (!user || loading) return;

    try {
      switch (type) {
        case 'followers':
          setLoading(true);
          if (!hasMoreFollowers) return;
          const followersData = await getFollowers(
            user?.$id,
            pageFollowers + 1,
            LIMIT
          );
          const newFollowers = followersData.documents.filter(
            newUser => !followers.some(existingUser => existingUser.$id === newUser.$id)
          );
          if (newFollowers.length > 0) {
            setFollowers(prevFollowers => [...prevFollowers, ...newFollowers]);
            setPageFollowers(prev => prev + 1);
          }
          setHasMoreFollowers(
            followersData.total > (pageFollowers + 1) * LIMIT
          );
          break;

        case 'following':
          setLoading(true);
          if (!hasMoreFollowing) return;
          const followingsData = await getFollowing(
            user?.$id,
            pageFollowing + 1,
            LIMIT
          );
          const newFollowing = followingsData.documents.filter(
            newUser => !following.some(existingUser => existingUser.$id === newUser.$id)
          );
          if (newFollowing.length > 0) {
            setFollowing(prevFollowing => [...prevFollowing, ...newFollowing]);
            setPageFollowing(prev => prev + 1);
          }
          setHasMoreFollowing(
            followingsData.total > (pageFollowing + 1) * LIMIT
          );
          break;

        case 'suggested':
          setLoadingSuggested(true);
          if (!hasMoreSuggestedFriends) return;
          const suggestedFriendsData = await getSuggestedFriends(
            user?.$id,
            pageSuggestedFriends + 1,
            LIMIT
          );
          const newSuggestedFriends = suggestedFriendsData.documents.filter(
            newUser => !suggestedFriends.some(existingUser => existingUser.$id === newUser.$id)
          );
          if (newSuggestedFriends.length > 0) {
            setSuggestedFriends(prevSuggestedFriends => [...prevSuggestedFriends, ...newSuggestedFriends]);
            setPageSuggestedFriends(prev => prev + 1);
          }
          setHasMoreSuggestedFriends(
            suggestedFriendsData.total > (pageSuggestedFriends + 1) * LIMIT
          );
          break;
      }
    } catch (error) {
      console.log(`Erro ao carregar ${type}:`, error);
    } finally {
      setLoading(false);
      setLoadingSuggested(false);
    }
  };

  const moveToSeguidores = () => {
    setActiveTab('followers');
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const moveToSeguindo = () => {
    setActiveTab('following');
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, buttonWidth],
  });

  const handleButtonLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setButtonWidth(width);
  };

  const renderUserCards = () => {
    const currentUsers = activeTab === 'followers' ? followers : following;

    if (currentUsers.length === 0 && !loading) {
      return (
        <Text className="font-bold text-textStandardDark text-lg w-full text-center">
          {activeTab === 'followers'
            ? 'Você não tem seguidores.'
            : 'Você não segue ninguém.'}
        </Text>
      );
    }

    return currentUsers.map((user, index) => (
      <CardAmigo
        key={`${activeTab}-${user.$id}-${index}`}
        idUser={activeTab === 'followers'
          ? user.followerId
          : user.followingId}
      />
    ));
  };

  const renderUserCardsSuggested = () => {
    if (suggestedFriends.length === 0 && !loadingSuggested) {
      return <Text className="font-bold text-textStandardDark text-lg w-full text-center">Sem sugestão de amigos.</Text>;
    }
  
    return suggestedFriends.map((user, index) => (
      <CardAmigo
        key={`${user.$id}-${index}`}
        idUser={user.$id}
      />
    ));
  };

  if (!user) {
    return (
      <View className="mt-4">
        <ActivityIndicator size="large" color="#3692C5" />
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1 bg-backgroundStandardDark">
      <SearchHeader />
      <View className="flex-1 bg-backgroundStandardDark items-center">
        <View className="max-w-[1000px] w-full bg-backgroundStandardDark px-[10px] py-6 gap-7">
          <View className="gap-3" aria-label="ContainerPerfil">
            <View className="w-full flex-row flex-wrap justify-between items-center gap-3">
              <Text className="font-bold text-xl text-textStandardDark text-nowrap">
                Seu Perfil
              </Text>

              <View className="flex-row gap-2 items-center justify-end w-fit">
                <View aria-label="Buttons" className="h-[45px] rounded-[20px] flex-row items-center justify-between w-[280px] bg-textStandardDark">
                  <Animated.View style={[styles.activeBar, { transform: [{ translateX }], width: buttonWidth }]} />

                  <Pressable className="flex-1 items-center justify-center bg-transparent" onPress={moveToSeguidores} onLayout={handleButtonLayout}>
                    <Text className="text-white text-[14px] font-bold">Seguidores</Text>
                    <Text className="text-white text-[14px] font-bold">{followersCount}</Text>
                  </Pressable>

                  <Pressable className="flex-1 items-center justify-center bg-transparent" onPress={moveToSeguindo} onLayout={handleButtonLayout}>
                    <Text className="text-white text-[14px] font-bold">Seguindo</Text>
                    <Text className="text-white text-[14px] font-bold">{followingCount}</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View aria-label="ContainerSeguidores" className="rounded-[10px] border border-borderStandardLight bg-white">
              {renderUserCards()}

              {((activeTab === 'followers' && hasMoreFollowers) ||
                (activeTab === 'following' && hasMoreFollowing)) && (
                  <HoverColorComponent
                  className="flex flex-row gap-2 w-full justify-center my-4"
                  colorHover={colors.accentStandardDark.hover}
                  colorPressIn={colors.accentStandardDark.pressIn}
                    onPress={() => fetchMoreUsers(activeTab)}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#01B198" />
                    ) : (
                      <>
                        <Text className="font-bold text-[15px] justify-center" style={{ color: "#01b297" }}>
                          Carregar Mais
                        </Text>
                        <CustomIcons name="mais" color="#01B198" size={20} />
                      </>
                    )}
                  </HoverColorComponent>
                )}
            </View>
          </View>

          <View aria-label="ContainerSugestaoAmigos" className="gap-3">
            <View className="w-full flex flex-row justify-between items-center">
              <Text className="font-bold text-xl text-textStandardDark">
                Sugestão de amigos
              </Text>
            </View>

            <View aria-label="ContainerAmigos" className="rounded-[10px] border border-borderStandardLight bg-white">
              {renderUserCardsSuggested()}

              {hasMoreSuggestedFriends && (
                <HoverColorComponent
                className="flex flex-row gap-2 w-full justify-center my-4"
                colorHover={colors.accentStandardDark.hover}
                colorPressIn={colors.accentStandardDark.pressIn}
                  onPress={() => fetchMoreUsers('suggested')}
                >
                  {loadingSuggested ? (
                    <ActivityIndicator size="small" color="#01B198" />
                  ) : (
                    <>
                      <Text className="font-bold text-[15px] justify-center" style={{ color: "#01b297" }}>
                        Carregar Mais
                      </Text>
                      <CustomIcons name="mais" color="#01B198" size={20} />
                    </>
                  )}
                </HoverColorComponent>
              )}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  activeBar: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#0172B1',
    borderRadius: 20,
  }
});