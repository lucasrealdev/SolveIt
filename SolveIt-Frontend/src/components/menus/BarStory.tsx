import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, AVPlaybackStatus, ResizeMode } from 'expo-av';
import ButtonScale from "@/components/ButtonScale";
import CustomIcons from "@/assets/icons/CustomIcons";
import { getStories } from '@/lib/appwriteConfig';
import { Image as ExpoImage } from 'expo-image';

interface Story {
  user: any;
  storyUrl: string;
}

const BarStory: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isVideoPlayerVisible, setIsVideoPlayerVisible] = useState(false);
  const [currentStoryUrl, setCurrentStoryUrl] = useState('');
  const videoRef = useRef<Video>(null);

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const fetchedStories = await getStories();
        setStories(fetchedStories);
      } catch (error) {
        console.error('Erro ao buscar stories:', error);
      }
    };

    fetchStories();
  }, []);

  const handleVideoPress = (storyUrl: string) => {
    setCurrentStoryUrl(storyUrl);
    setIsVideoPlayerVisible(true);
  };

  const handleVideoPlayerClose = async () => {
    setIsVideoPlayerVisible(false);
    setCurrentStoryUrl('');
    if (videoRef.current) {
      await videoRef.current.pauseAsync();
      await videoRef.current.unloadAsync();
    }
  };

  const handleStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      if (status.didJustFinish) {
        handleVideoPlayerClose();
      }
    }
  };

  return (
    <View
      aria-label="ContainerStory"
      className="flex h-[115px] px-1 bg-white rounded-[24px] flex-row items-center border border-borderStandardLight"
      style={{
        shadowColor: 'rgba(16, 24, 40, 0.09)',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 1,
      }}>
      <ButtonScale
        scale={1.06}
        className="w-8 h-8 rounded-full bg-white border border-borderStandardLight flex items-center justify-center">
        <CustomIcons name="anterior" color="#475569" size={20} />
      </ButtonScale>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className='w-full h-full items-center px-2'>
        {stories.map((story, index) => (
          <ButtonScale
            key={index}
            scale={1.05}
            className="flex justify-center items-center w-fit"
            onPress={() => handleVideoPress(story.storyUrl)}
          >
            <LinearGradient
              aria-label="ContainerImage"
              colors={['#0172B1', '#0172B1', '#01B198', '#001646']}
              style={styles.containerImage}
              start={{ x: 0.5, y: 0.5 }}
              end={{ x: 1, y: 1 }}
            >
              <ExpoImage
                source={{ uri: story.user.avatar }}
                style={{
                  borderWidth: 2,
                  borderColor: 'white',
                  borderRadius: 9999,
                  width: 64,
                  height: 64
                }}
                contentFit="cover"
                placeholder={{ blurhash }}
                cachePolicy="memory-disk"
              />
            </LinearGradient>
            <Text className="text-textStandardDark font-semibold">{story.user.username}</Text>
          </ButtonScale>
        ))}
      </ScrollView>

      <Modal visible={isVideoPlayerVisible} transparent>
        <View className='px-10 flex-1 justify-center items-center flex-row gap-1' style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
          <ButtonScale
            scale={1.1}
            className="w-8 h-8 rounded-full bg-white border border-borderStandardLight flex items-center justify-center">
            <CustomIcons name="anterior" color="#475569" size={20} />
          </ButtonScale>
          <View className='flex-col w-fit'>
            <Video
              ref={videoRef}
              source={{ uri: currentStoryUrl }}
              style={styles.video}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isLooping
              onPlaybackStatusUpdate={handleStatusUpdate}
              onError={(error) => console.log('Video error:', error)}
            />
            <ButtonScale
              scale={1.1}
              onPress={handleVideoPlayerClose}
              style={styles.closeButton}>
              <CustomIcons name="fechar" color="#475569" size={12} />
            </ButtonScale>
          </View>
          <ButtonScale
            scale={1.1}
            className="w-8 h-8 rounded-full bg-white border border-borderStandardLight flex items-center justify-center">
            <CustomIcons name="proximo" color="#475569" size={20} />
          </ButtonScale>
        </View>
      </Modal>

      <ButtonScale
        scale={1.1}
        className="w-8 h-8 rounded-full bg-white border border-borderStandardLight flex items-center justify-center">
        <CustomIcons name="proximo" color="#475569" size={20} />
      </ButtonScale>
    </View>
  );
};

const styles = StyleSheet.create({
  containerImage: {
    alignSelf: 'flex-start',
    padding: 3,
    borderRadius: 9999,
  },
  video: {
    width: "100%",
    maxWidth: 400,
    aspectRatio: 9 / 16,
    borderRadius: 20,
  },
  closeButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
  },
});

export default BarStory;