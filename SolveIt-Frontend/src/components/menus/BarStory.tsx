import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, Pressable, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';
import ButtonScale from "@/components/ButtonScale";
import CustomIcons from "@/assets/icons/CustomIcons";
import { getStories } from '@/lib/appwriteConfig';
import { Image as ExpoImage } from 'expo-image';
import { FontAwesome } from 'react-native-vector-icons';
import CreateStory from '../media/CreateStory';

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
  const [stories, setStories] = useState<UserStories[]>([]);
  const [currentUserStories, setCurrentUserStories] = useState<Story[]>([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [isVideoPlayerVisible, setIsVideoPlayerVisible] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControlIcon, setShowControlIcon] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const videoRef = useRef<Video>(null);
  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const LIMIT_USERS = 6;

  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.innerHTML = `
        ::-webkit-scrollbar {
          height: 7px;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #0172B1;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-track {
          background-color: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb:hover {
          background-color: #555;
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  const fetchStories = async () => {
    try {
      const { stories, hasMore } = await getStories(LIMIT_USERS, page);
      setStories(stories);
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

  const handleUserPress = (userStories, userIndex) => {
    setCurrentUserStories(userStories);
    setCurrentUserIndex(userIndex);
    setCurrentStoryIndex(0);
    setIsVideoPlayerVisible(true);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const handleVideoPlayerClose = async () => {
    if (videoRef.current) {
      await videoRef.current.pauseAsync();
    }

    setIsVideoPlayerVisible(false);
    setCurrentUserStories([]);
    setVideoDuration(0);
    setIsPlaying(false);
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (status?.isLoaded) {
        const isNowPlaying = !isPlaying;
        if (isNowPlaying) {
          await videoRef.current.playAsync();
        } else {
          await videoRef.current.pauseAsync();
        }
        setIsPlaying(isNowPlaying);
        setShowControlIcon(true);
        setTimeout(() => setShowControlIcon(false), 2000);
      }
    }
  };

  useEffect(() => {
    if (Platform.OS === "android" && videoRef.current && isPlaying) {
      const intervalId = setInterval(async () => {
        const status = await videoRef.current?.getStatusAsync();
        if (status?.isLoaded && isPlaying) {
          handleStatusUpdate(status);
        }
      }, 500); // Intervalo otimizado

      return () => clearInterval(intervalId); // Cleanup para evitar múltiplos intervalos
    }
  }, [videoRef.current, isPlaying]);

  const handleStatusUpdate = (status) => {
    try {
      if (status.isLoaded && isPlaying && !isTransitioning) {
        const currentTime = status.positionMillis ?? 0;
        const duration = status.durationMillis ?? 0;

        setCurrentTime(currentTime);
        setVideoDuration(duration);
      }
    } catch (error) {
      console.error('Video status update error:', error);
      handleVideoPlayerClose();
    }
  };

  // Função genérica para alterar a página
  const changePage = (direction) => {
    if (direction === "next" && hasMore) {
      setLoadingNext(true);
      setPage((prevPage) => prevPage + 1);
    } else if (direction === "previous" && page > 0) {
      setLoadingPrevious(true);
      setPage((prevPage) => prevPage - 1);
    }
  };

  const nextPage = () => changePage("next");
  const previousPage = () => changePage("previous");

  const goToStory = (direction) => {
    setIsTransitioning(true);
    setCurrentTime(0);
    const currentUserIndex = stories.findIndex(
      (userStories) => userStories.stories === currentUserStories
    );

    if (direction === "next") {
      if (currentStoryIndex < currentUserStories.length - 1) {
        // Avança para o próximo story
        setCurrentStoryIndex((prevStoryIndex) => prevStoryIndex + 1);
      } else if (currentUserIndex < stories.length - 1) {
        // Avança para o próximo usuário
        const nextUserStories = stories[currentUserIndex + 1].stories;
        setCurrentUserStories(nextUserStories);
        setCurrentStoryIndex(0);
        setCurrentUserIndex((prevUserIndex) => prevUserIndex + 1);
      } else {
        // Carrega a próxima página
        handleVideoPlayerClose();
        nextPage();
      }
    } else if (direction === "previous") {
      if (currentStoryIndex > 0) {
        // Retrocede para o story anterior
        setCurrentStoryIndex((prevStoryIndex) => prevStoryIndex - 1);
      } else if (currentUserIndex > 0) {
        // Retrocede para o usuário anterior
        const previousUserStories = stories[currentUserIndex - 1].stories;
        setCurrentUserStories(previousUserStories);
        setCurrentStoryIndex(previousUserStories.length - 1);
        setCurrentUserIndex((prevUserIndex) => prevUserIndex - 1);
      } else {
        // Carrega a página anterior
        handleVideoPlayerClose();
        previousPage();
      }
    }
  };

  const goToNextStory = () => goToStory("next");
  const goToPreviousStory = () => goToStory("previous");

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
        contentContainerStyle={{ alignItems: 'center', paddingVertical: Platform.OS === 'web' ? 3 : 0 }}
        showsHorizontalScrollIndicator={Platform.OS === 'web' ? true : false}
      >
        <CreateStory />
        {stories.map((item, index) => (
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

      <Modal visible={isVideoPlayerVisible} transparent>
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
                  source={{ uri: stories[Math.floor(currentUserIndex)]?.user.avatar }}
                  style={{ borderRadius: 9999, borderWidth: 2, borderColor: "#fff", width: 32, height: 32, backgroundColor: "#fff" }}
                  contentFit="cover"
                  placeholder={{ blurhash }}
                  cachePolicy="memory-disk"
                />
                <Text className="font-bold text-lg text-white">
                  {stories[Math.floor(currentUserIndex)]?.user.username}
                </Text>
                <View className="flex-1 bg-gray-200 h-2 rounded-full" aria-label='TimeIndicator'>
                  <View
                    className="bg-green-500 h-full rounded-full"
                    style={{ width: `${(currentTime / videoDuration) * 100}%` }}
                  />
                </View>
              </View>
              <Text className='font-bold text-sm text-white'>{` ${currentStoryIndex + 1} de ${currentUserStories.length} stories`}</Text>
            </View>

            <View className='w-full'>
              <Video
                ref={videoRef}
                source={{ uri: currentUserStories[currentStoryIndex]?.storyUrl }}
                style={{ width: "100%", aspectRatio: 9 / 16, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping={false}
                onPlaybackStatusUpdate={handleStatusUpdate}
                onLoad={() => setIsTransitioning(false)}
              />
              {showControlIcon && (
                <View
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: [{ translateX: -18 }, { translateY: -40 }],
                    zIndex: 10,
                  }}
                >
                  <FontAwesome
                    name={isPlaying ? 'pause' : 'play'}
                    size={48}
                    color="#FFF"
                  />
                </View>
              )}
            </View>

            <ButtonScale
              scale={1.1}
              onPress={handleVideoPlayerClose}
              className="bg-white rounded-[20px] p-2 mt-2">
              <CustomIcons name="fechar" color="#475569" size={12} />
            </ButtonScale>
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