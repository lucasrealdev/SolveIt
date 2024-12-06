import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, AVPlaybackStatus, ResizeMode } from 'expo-av';
import ButtonScale from "@/components/ButtonScale";
import CustomIcons from "@/assets/icons/CustomIcons";
import { getStories } from '@/lib/appwriteConfig';
import { Image as ExpoImage } from 'expo-image';
import { FontAwesome } from 'react-native-vector-icons';

interface Story {
  storyUrl: string;
}
interface UserStories {
  user: {
    username: string;
    avatar: string;
  };
  stories: Story[];
}

const BarStory: React.FC = () => {
  const [state, setState] = useState({
    stories: [] as UserStories[],
    currentUserStories: [] as Story[],
    currentUserIndex: 0,
    isVideoPlayerVisible: false,
    currentStoryIndex: 0,
    isPlaying: true,
    showControlIcon: false,
    videoDuration: 0,
    currentTime: 0,
  });
  const videoRef = useRef<Video>(null);
  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  const LIMIT_USERS = 10;

  const updateState = (updates: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...updates }));
  };

  const fetchStories = async () => {
    try {
      const { stories, hasMore } = await getStories(LIMIT_USERS, page);
      updateState({ stories });
      setHasMore(hasMore);
    } catch (error) {
      console.error('Erro ao buscar stories:', error);
    } finally {
      setLoadingNext(false);
      setLoadingPrevious(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [page]);

  const handleUserPress = (userStories: Story[], userIndex: number) => {
    updateState({
      currentUserStories: userStories,
      currentUserIndex: userIndex,
      currentStoryIndex: 0,
      isVideoPlayerVisible: true,
      isPlaying: true,
    });
  };

  const handleVideoPlayerClose = async () => {
    if (videoRef.current) {
      await videoRef.current.pauseAsync();
      await videoRef.current.unloadAsync();
    }

    updateState({
      isVideoPlayerVisible: false,
      currentUserStories: [],
      videoDuration: 0,
      isPlaying: false,
    });
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (status?.isLoaded) {
        const isNowPlaying = !state.isPlaying;
        if (isNowPlaying) {
          await videoRef.current.playAsync();
        } else {
          await videoRef.current.pauseAsync();
        }
        updateState({ isPlaying: isNowPlaying, showControlIcon: true });
        setTimeout(() => updateState({ showControlIcon: false }), 1000);
      }
    }
  };

  const handleVideoLoad = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      updateState({
        videoDuration: status.durationMillis ?? 0,
      });
    }
  };

  const handleStatusUpdate = (status: AVPlaybackStatus) => {
    try {
      if (status.isLoaded) {
        const currentTime = status.positionMillis ?? 0;
        const duration = status.durationMillis ?? 0;

        // Ensure we don't update state too frequently
        updateState({
          currentTime,
          videoDuration: duration
        });

        // More aggressive end detection
        if (duration > 0 && currentTime >= duration - 1) {
          // Immediately stop video
          if (videoRef.current) {
            videoRef.current.stopAsync();
          }
          // Transition logic
          if (state.currentStoryIndex < state.currentUserStories.length - 1) {
            updateState({
              currentStoryIndex: state.currentStoryIndex + 1,
              currentTime: 0
            });
          } else if (state.currentUserIndex < state.stories.length - 1) {
            const nextUserIndex = state.currentUserIndex + 1;
            updateState({
              currentUserIndex: nextUserIndex,
              currentUserStories: state.stories[nextUserIndex].stories,
              currentStoryIndex: 0,
              currentTime: 0
            });
          } else {
            handleVideoPlayerClose();
            nextPage();
          }
        }
      }
    } catch (error) {
      console.error('Video status update error:', error);
      handleVideoPlayerClose();
    }
  };

  const nextPage = () => {
    if (hasMore) {
      setLoadingNext(true);
      setPage((prevPage) => prevPage + 1);
    }
  };

  const previousPage = () => {
    if (page > 0) {
      setLoadingPrevious(true);
      setPage((prevPage) => prevPage - 1);
    }
  };

  const goToNextStory = () => {
    if (state.currentStoryIndex < state.currentUserStories.length - 1) {
      // Se há mais stories para avançar
      updateState({ currentStoryIndex: state.currentStoryIndex + 1 });
    } else {
      // Se chegou ao último story do usuário atual, mover para o próximo usuário ou carregar próxima página
      const currentUserIndex = state.stories.findIndex(
        (userStories) => userStories.stories === state.currentUserStories
      );
  
      if (currentUserIndex < state.stories.length - 1) {
        // Se há mais usuários, move para o primeiro story do próximo usuário
        const nextUserStories = state.stories[currentUserIndex + 1].stories;
        updateState({
          currentUserStories: nextUserStories,
          currentStoryIndex: 0,
          currentUserIndex: currentUserIndex + 1
        });
      } else {
        handleVideoPlayerClose();
        nextPage(); // Chama a função de carregar a próxima página de stories
      }
    }
  };
  
  const goToPreviousStory = () => {
    if (state.currentStoryIndex > 0) {
      // Se há stories anteriores
      updateState({ currentStoryIndex: state.currentStoryIndex - 1 });
    } else {
      // Se estamos no primeiro story do usuário atual, move para o último story do usuário anterior
      const currentUserIndex = state.stories.findIndex(
        (userStories) => userStories.stories === state.currentUserStories
      );
  
      if (currentUserIndex > 0) {
        // Se há usuários anteriores, move para o último story do usuário anterior
        const previousUserStories = state.stories[currentUserIndex - 1].stories;
        updateState({
          currentUserStories: previousUserStories,
          currentStoryIndex: previousUserStories.length - 1,
          currentUserIndex: currentUserIndex - 1
        });
      } else {
        handleVideoPlayerClose();
        previousPage(); // Chama a função de carregar a página anterior
      }
    }
  };  

  return (
    <View
      aria-label="ContainerStory"
      className="flex h-[115px] px-1 bg-white rounded-[24px] flex-row items-center border border-borderStandardLight shadow-md shadow-[rgba(16,24,40,0.09)]">
      <ButtonScale
        scale={1.06}
        className="w-8 h-8 rounded-full bg-white border border-borderStandardLight flex items-center justify-center"
        onPress={previousPage}>
        {loadingPrevious ? (
          <ActivityIndicator size="small" color="#3692C5" />
        ) : (
          <CustomIcons name="anterior" color="#475569" size={20} />
        )}
      </ButtonScale>

      <ScrollView
        horizontal
        contentContainerStyle={{ alignItems: 'center', paddingVertical: 10 }}
        showsHorizontalScrollIndicator={false}>
        {state.stories.map((item, index) => (
          <ButtonScale
            key={index}
            scale={1.05}
            className="flex justify-center items-center w-fit mx-2"
            onPress={() => handleUserPress(item.stories, index)}>
            <LinearGradient
              aria-label="ContainerImage"
              colors={['#0172B1', '#0172B1', '#01B198', '#001646']}
              style={{ borderRadius: 999, padding: 3 }}>
              <ExpoImage
                source={{ uri: item.user.avatar }}
                style={{ borderRadius: 9999, borderWidth: 2, borderColor: "#fff", width: 64, height: 64, backgroundColor: "#fff" }}
                contentFit="cover"
                placeholder={{ blurhash }}
                cachePolicy="memory-disk"
              />
            </LinearGradient>
            <Text className="text-textStandardDark font-semibold text-center">
              {item.user.username}
            </Text>
          </ButtonScale>
        ))}
      </ScrollView>

      <Modal visible={state.isVideoPlayerVisible} transparent>
        <View className="px-10 flex-1 justify-center items-center flex-row gap-1 bg-[rgba(0,0,0,0.8)]">
          <ButtonScale
            scale={1.1}
            className="w-8 h-8 rounded-full bg-white border border-borderStandardLight flex items-center justify-center"
            onPress={goToPreviousStory}>
            <CustomIcons name="anterior" color="#475569" size={20} />
          </ButtonScale>

          <Pressable
            className="flex-col w-full max-w-[400px]"
            onPress={togglePlayPause}>
            <View className="bg-textStandardDark w-full h-fit p-2 rounded-t-[20px] flex-col items-center justify-center" aria-label='HeaderStory'>
              <View className='flex-row w-full items-center gap-2'>
                <ExpoImage
                  source={{ uri: state.stories[Math.floor(state.currentUserIndex)]?.user.avatar }}
                  style={{ borderRadius: 9999, borderWidth: 2, borderColor: "#fff", width: 32, height: 32, backgroundColor: "#fff" }}
                  contentFit="cover"
                  placeholder={{ blurhash }}
                  cachePolicy="memory-disk"
                />
                <Text className="font-bold text-lg text-white">
                  {state.stories[Math.floor(state.currentUserIndex)]?.user.username}
                </Text>
                <View className="flex-1 bg-gray-200 h-2 rounded-full">
                  <View
                    className="bg-green-500 h-full rounded-full"
                    style={{ width: `${(state.currentTime / state.videoDuration) * 100}%` }}
                  />
                </View>
              </View>
              <Text className='font-bold text-sm text-white'>{` ${state.currentStoryIndex + 1} de ${state.currentUserStories.length} stories`}</Text>
            </View>

            <Video
              ref={videoRef}
              source={{ uri: state.currentUserStories[state.currentStoryIndex]?.storyUrl }}
              style={{ width: "100%", aspectRatio: 9 / 16, borderEndEndRadius: 20, borderEndStartRadius: 20 }}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isLooping={false}
              onPlaybackStatusUpdate={handleStatusUpdate}
              onLoad={handleVideoLoad}
            />

            <ButtonScale
              scale={1.1}
              onPress={handleVideoPlayerClose}
              className="bg-white rounded-[20px] p-2 mt-2">
              <CustomIcons name="fechar" color="#475569" size={12} />
            </ButtonScale>

            {state.showControlIcon && (
              <View
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: [{ translateX: -24 }, { translateY: -24 }],
                  zIndex: 10,
                }}
              >
                <FontAwesome
                  name={state.isPlaying ? 'pause' : 'play'}
                  size={48}
                  color="#FFF"
                />
              </View>

            )}
          </Pressable>

          <ButtonScale
            scale={1.1}
            className="w-8 h-8 rounded-full bg-white border border-borderStandardLight flex items-center justify-center"
            onPress={goToNextStory}>
            <CustomIcons name="proximo" color="#475569" size={20} />
          </ButtonScale>
        </View>
      </Modal>

      <ButtonScale
        scale={1.1}
        className="w-8 h-8 rounded-full bg-white border border-borderStandardLight flex items-center justify-center"
        onPress={nextPage}>
        {loadingNext ? (
          <ActivityIndicator size="small" color="#3692C5" />
        ) : (
          <CustomIcons name="proximo" color="#475569" size={20} />
        )}
      </ButtonScale>
    </View>
  );

};

export default BarStory;