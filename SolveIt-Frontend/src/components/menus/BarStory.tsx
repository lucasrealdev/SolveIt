import React, { useState, useEffect } from 'react';
import { View, Text, Image, Modal, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useVideoPlayer, VideoView } from 'expo-video';
import ButtonScale from "@/components/ButtonScale";
import CustomIcons from "@/assets/icons/CustomIcons";
import { getStories } from '@/lib/appwriteConfig';

interface Story {
  user: any;
  storyUrl: string;
}

const BarStory: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isVideoPlayerVisible, setIsVideoPlayerVisible] = useState(false);
  const [currentStoryUrl, setCurrentStoryUrl] = useState('');

  const videoPlayer = useVideoPlayer(currentStoryUrl, (player) => {
    player.loop = true;
    if (isVideoPlayerVisible) player.play();
  });

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

  const handleVideoPlayerClose = () => {
    setIsVideoPlayerVisible(false);
    setCurrentStoryUrl('');
    videoPlayer.pause(); // Pausa o vídeo ao fechar o modal
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
              <Image
                source={{ uri: story.user.avatar }}
                className="border-white border-[2px] rounded-full w-[64px] h-[64px]"
              />
            </LinearGradient>
            <Text className="text-textStandardDark font-semibold">{story.user.username}</Text>
          </ButtonScale>
        ))}
      </ScrollView>

      <Modal visible={isVideoPlayerVisible} transparent>
        <View style={styles.videoPlayerContainer}>
          <VideoView
            style={styles.video}
            player={videoPlayer}
            allowsFullscreen
            allowsPictureInPicture
          />
          <ButtonScale
            scale={1.1}
            onPress={handleVideoPlayerClose}
            style={styles.closeButton}
          >
            <CustomIcons name="close" color="#475569" size={20} />
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
  videoPlayerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '90%',
    height: 300,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
  },
});

export default BarStory;
