import React from "react";
import { Image, Text, View } from "react-native";
import { useRouter } from 'expo-router';

import CustomIcons from "@/assets/icons/CustomIcons";
import images from "@/constants/images";
import { Button } from "@/components/Button";

const NotFoundScreen = () => {
  const router = useRouter();

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
    <View className="flex-1 flex items-center justify-center bg-backgroundStandardLight px-4">
      <View aria-label="ContainerErro" className="flex pb-1 items-center justify-center max-w-[600px]">
        <Text className="font-bold text-xl text-primaryStandardDark mb-4">404 Error</Text>
        <Text className="font-extrabold text-4xl sm:text-7xl text-textStandardDark mb-6 text-center">Oops! Página não encontrada.</Text>
        <Text className="font-normal text-lg text-textStandardDark mb-8 text-center">Infelizmente, a página que você está procurando desapareceu ou foi movida :(</Text>

        <View className="flex self-stretch gap-3 justify-center flex-wrap flex-row">
          <Button className="bg-gray-200 border rounded-full border-borderStandard h-14 flex flex-row items-center justify-center gap-3 mb-3 w-full max-w-[220px]" onPress={handleBack}>
            <CustomIcons name="anterior" color="#475569" size={20} />
            <Text className="font-bold text-lg text-textStandardDark">Voltar</Text>
          </Button>

          <Button className="bg-primaryStandardDark border rounded-full border-borderStandard h-14 flex flex-row items-center justify-center gap-3 w-full max-w-[220px]" onPress={() => router.push('/')}>
            <Text className="font-bold text-lg text-white">Voltar ao Começo</Text>
            <CustomIcons name="home" size={24} color="white" />
          </Button>
        </View>
      </View>
      <Image source={images.logoShadow} className="h-[74px] w-[74px]"/>
    </View>
  );
}

export default NotFoundScreen;