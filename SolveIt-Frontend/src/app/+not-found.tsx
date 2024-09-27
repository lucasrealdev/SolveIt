import React from "react";
import { Image, Pressable, Text, View, useWindowDimensions  } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import IconesPersonalizados from "@/assets/IconesPersonalizados";
import { useRouter } from 'expo-router';

const NotFoundScreen = () => {
    const router = useRouter();

    const { width } = useWindowDimensions();

    const handleBack = () => {
        // Verifique se existe uma tela anterior
        if (router.canGoBack()) {
          router.back();
        } else {
          // Caso não haja, você pode redirecionar para a home ou outra página
          router.push('/');
        }
      };

    return (
        <View className="flex-1 flex items-center justify-center bg-white px-4">
        <View accessibilityLabel="ContainerErro" className="flex pb-10 items-center justify-center max-w-[600px]">
            <Text className="font-bold text-xl text-destaqueAzul mb-4">404 Error</Text>
            <Text className="font-extrabold text-4xl sm:text-7xl text-[#1E293B] mb-6 text-center">Oops! Página não encontrada.</Text>
            <Text className="font-normal text-lg text-[#475569] mb-8 text-center">Infelizmente, a página que você está procurando desapareceu ou foi movida :(</Text>

            <View className="flex self-stretch gap-3 justify-center items-center flex-wrap flex-row">
              <Pressable className="bg-transparent border rounded-full border-[#CBD5E1] h-14 flex flex-row items-center justify-center gap-3 mb-3 w-full max-w-[220px]" onPress={handleBack}>
                  <MaterialIcons name="arrow-back-ios-new" size={20} color="#475569" />
                  <Text className="font-bold text-lg text-[#475569]">Voltar</Text>
              </Pressable>

              <Pressable className="bg-destaqueAzul border rounded-full border-[#CBD5E1] h-14 flex flex-row items-center justify-center gap-3 w-full max-w-[220px]" onPress={() => router.push('/')}>
                  <Text className="font-bold text-lg text-white">Voltar ao Começo</Text>
                  <IconesPersonalizados name="home" size={24} color="white" />
              </Pressable>
            </View>
        </View>
        <Image style={{width: 64, height: 64, resizeMode: "cover"}} source={require('@/assets/LogoSombra.png')} />
        </View>
    );
}

export default NotFoundScreen;