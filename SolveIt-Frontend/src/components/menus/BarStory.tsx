import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useVideoPlayer, VideoView } from 'expo-video';
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

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const videoPlayer = useVideoPlayer(currentStoryUrl, (player) => {
    player.loop = true;
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
        <View style={styles.videoPlayerContainer}>
          <VideoView
            style={styles.video} // Proporção 4:3 aplicada aqui
            player={videoPlayer}
          />
          <ButtonScale
            scale={1.1}
            onPress={handleVideoPlayerClose} // Fecha o vídeo ao pressionar o botão
            style={styles.closeButton} // Estilos para o botão de fechar
          >
            <CustomIcons name="fechar" color="#475569" size={12} />
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
    padding: 20, // Adicionando um pouco de espaço nas bordas
  },
  video: {
    width: '75%', // Proporção ajustada
    aspectRatio: 4 / 3, // Garantindo 4:3
    maxHeight: '70%', // Limita a altura máxima do vídeo
  },
  closeButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
  },
});

export default BarStory;
