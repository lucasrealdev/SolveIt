import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Platform, Modal, Pressable, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import ButtonScale from "@/components/ButtonScale";
import CustomIcons from "@/assets/icons/CustomIcons";
import { useAlert } from '@/context/AlertContext';
import { useGlobalContext } from '@/context/GlobalProvider';
import { createStory } from '@/lib/appwriteConfig';

const CreateStory: React.FC = () => {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const { user, isLoading } = useGlobalContext();

  useEffect(() => {
    if (isPreviewVisible && videoRef.current) {
      const resetVideo = async () => {
        await videoRef.current?.playAsync();
        setIsPlaying(true);
      };
      resetVideo();
    }
  }, [isPreviewVisible, videoUri]);

  const handleMobileVideoSelect = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        showAlert('Permissão necessária', 'Por favor, conceda permissão de câmera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const { uri, duration, width, height } = result.assets[0];

        // Validar duração (máximo 60 segundos)
        if (duration > 180000) {
          showAlert('Erro', 'O vídeo deve ter no máximo 1 minuto.');
          return;
        }

        // Validar proporção 9:16, 16:9 ou 4:3
        const aspectRatio = width / height;
        const tolerancia = 0.2; // Tolerância de 20% para variações na proporção

        // Verificar proporções válidas com tolerância
        const proporcao9_16Valida = Math.abs(aspectRatio - (9 / 16)) <= tolerancia;
        const proporcao16_9Valida = Math.abs(aspectRatio - (16 / 9)) <= tolerancia;

        if (!proporcao9_16Valida && !proporcao16_9Valida) {
          showAlert('Erro', 'O vídeo deve estar na proporção 9:16.');
          return;
        }

        setVideoUri(uri);
        setIsPreviewVisible(true);
      }
    } catch (error) {
      console.error('Erro ao capturar vídeo:', error);
    }
  };

  const handleMobileGallerySelect = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const { uri, duration, width, height } = result.assets[0];

        // Validar duração (máximo 60 segundos)
        if (duration > 180000) {
          showAlert('Erro', 'O vídeo deve ter no máximo 1 minuto.');
          return;
        }

        // Validar proporção 9:16 ou 16:9
        const aspectRatio = width / height;
        const tolerancia = 0.2; // Tolerância de 20% para variações na proporção

        // Verificar se a proporção é 9:16 ou 16:9 com tolerância
        const proporcao9_16Valida = Math.abs(aspectRatio - (9 / 16)) <= tolerancia;
        const proporcao16_9Valida = Math.abs(aspectRatio - (16 / 9)) <= tolerancia;

        if (!proporcao9_16Valida && !proporcao16_9Valida) {
          showAlert('Erro', 'O vídeo deve estar na proporção 9:16 ou 16:9.');
          return;
        }

        setVideoUri(uri);
        setIsPreviewVisible(true);
      }
    } catch (error) {
      console.error('Erro ao selecionar vídeo:', error);
    }
  };

  const openVideoSelector = () => {
    if (!isLoading && !user?.$id) {
      showAlert("Aviso", "Você precisa estar logado para criar um story");
      return;
    }
    if (Platform.OS === 'web') {
      fileInputRef.current?.click();
    } else {
      showAlert(
        "Escolha uma Opção",
        "Deseja tirar uma foto ou escolher da galeria?",
        [
          { text: "Câmera", onPress: handleMobileVideoSelect },
          { text: "Galeria", onPress: handleMobileGallerySelect },
          { text: "Cancelar", onPress: () => undefined },
        ],
        5000
      );
    }
  };

  const handleWebVideoSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Criar URL temporário
      const videoUri = URL.createObjectURL(file);

      // Criar elemento de vídeo para validar
      const videoElement = document.createElement('video');
      videoElement.src = videoUri;

      videoElement.onloadedmetadata = async () => {
        // Validar duração
        if (videoElement.duration > 180) {
          showAlert('Erro', 'O vídeo deve ter no máximo 1 minuto.');
          return;
        }

        // Validar proporção
        const width = videoElement.videoWidth;
        const height = videoElement.videoHeight;
        const aspectRatio = width / height;
        const tolerancia = 0.2; // Tolerância de 10%

        // Verificar se a proporção é 9:16 ou 4:3 com tolerância
        const proporcao9_16Valida = Math.abs(aspectRatio - (9 / 16)) <= tolerancia;

        if (!proporcao9_16Valida) {
          showAlert('Erro', 'O vídeo deve estar na proporção 9:16.');
          return;
        }

        setVideoUri(videoUri);
        setIsPreviewVisible(true);
      };
    }
  };

  const processMobileVideo = async (uri: string) => {
    try {
      // Faz o fetch da URI e converte para Blob
      const response = await fetch(uri);
      const blob = await response.blob();

      const processedVideo = {
        name: `video_${Date.now()}.mp4`, // Usa a extensão ajustada
        type: blob.type || 'image/jpeg',
        size: blob.size || 0,
        uri,
      };

      // Retorna o vídeo no formato necessário
      return processedVideo;
    } catch (error) {
      console.error('Erro ao processar vídeo no mobile:', error);
      throw new Error('Erro ao processar vídeo no mobile.');
    }
  };

  const handleConfirmVideo = async () => {
    if (videoUri) {
      try {
        setLoading(true);
        // Determina o arquivo a ser enviado
        const fileToUpload = Platform.OS === 'web'
          ? fileInputRef.current?.files?.[0] // Envia o arquivo diretamente na web
          : await processMobileVideo(videoUri); // Processa o vídeo no mobile

        const uploadResult = await createStory(fileToUpload, Platform.OS === 'web', user?.$id);

        if (uploadResult) {
          setVideoUri(null);
          setIsPreviewVisible(false);
          showAlert('Sucesso', 'Story postado com Sucesso!');
        }
      } catch (error) {
        showAlert('Erro', error.message);
        setVideoUri(null);
        setIsPreviewVisible(false);
        showAlert('Erro', 'Erro ao postar story!');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelVideo = () => {
    setVideoUri(null);
    setIsPreviewVisible(false);
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    }
  };

  return (
    <>
      {Platform.OS === 'web' && (
        <input
          type="file"
          ref={fileInputRef}
          accept="video/*"
          style={{ display: 'none' }}
          onChange={handleWebVideoSelect}
        />
      )}

      <ButtonScale
        scale={1.05}
        className="flex justify-center items-center w-fit mx-2"
        onPress={openVideoSelector}>
        <LinearGradient
          aria-label="ContainerImage"
          colors={['#0172B1', '#0172B1', '#01B198', '#001646']}
          style={{ borderRadius: 999, padding: 3 }}>
          <View className='rounded-full w-[62px] h-[62px] bg-gray-500 items-center justify-center'>
            <CustomIcons name='mais' color='#fff' size={26} />
          </View>
        </LinearGradient>
        <Text className="text-textStandardDark font-semibold text-center">
          Criar
        </Text>
      </ButtonScale>

      <Modal
        visible={isPreviewVisible}
        transparent
        animationType="slide"
      >
        <View className="flex-1 justify-center items-center bg-black/80 p-4">
          {videoUri && (
            <View className="w-full max-w-md bg-white rounded-lg p-4">
              <View className="relative">
                <Pressable
                  onPress={togglePlayPause}>
                  <Video
                    ref={videoRef}
                    source={{ uri: videoUri }}
                    style={{ width: '100%', aspectRatio: 9 / 16 }}
                    resizeMode={ResizeMode.CONTAIN}
                    shouldPlay
                    isLooping={false}
                    onPlaybackStatusUpdate={handleVideoStatusUpdate}
                  />
                </Pressable>
              </View>
              <View className="flex-row justify-between mt-4">
                <ButtonScale
                  onPress={handleConfirmVideo}
                  className="bg-green-500 px-4 py-2 rounded-lg"
                  scale={1.06}>
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text className="text-white">Enviar</Text>
                  )}
                </ButtonScale>
                <ButtonScale
                  onPress={handleCancelVideo}
                  className="bg-red-500 px-4 py-2 rounded-lg"
                  scale={1.06}
                >
                  <Text className="text-white">Cancelar</Text>
                </ButtonScale>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
};

export default CreateStory;