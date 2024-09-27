import React from "react";
import { Pressable, Text, View, Image, StyleSheet, useWindowDimensions } from "react-native";
import IconsPersonalizado from "@/assets/IconesPersonalizados";
import { useRouter, usePathname } from "expo-router";

export default function MenuRight() {
  const router = useRouter();
  const pathname = usePathname();

  const { width, height } = useWindowDimensions();

  const navigateTo = (route: string) => {
    if (pathname !== route) {
      router.push(route);
    } else {
      // Substitui a rota atual, evitando duplicação na stack
      router.replace(route);
    }
  };  

  const renderCardAmigos = () => {
    return(
      <View accessibilityLabel="CardAmigos" className="flex flex-row border-t border-[#E2E8F0] py-[12px] gap-3 items-center">
        <Image style={styles.imageAmigos} source={require('@/assets/pessoa.png')} />
        <View className="flex flex-1">
          <Text className="text-[#475569] font-bold text-[14px]">Júlia Smith</Text>
          <Text className="text-[#475569] font-normal text-[14px]">@juliasmith</Text>
        </View>
        <IconsPersonalizado name="mais" color="#94A3B8" size={20}/>
      </View>
    );
  }

  const isMobile = width > 1250;
  const isTablet = height <= 835 ? "hidden" : "";
  const containerWidth = width >= 1400 ? 368 : 320;
  if(isMobile){
    return (
      <View
        accessibilityLabel="ContainerMenu"
        className="flex h-[100vh] border-l border-[#E2E8F0] max-web:hidden"
        style={{ width: containerWidth }}
      >
        <View accessibilityLabel="ContainerHeaderMenu" className="flex w-full px-6 py-[20px] flex-row justify-between border-b border-[#E2E8F0]">
          <View className="flex justify-center items-end">
            <Image style={styles.image} source={require('@/assets/pessoa.png')} />
            <View className="w-3 h-3 bg-[#22C55E] border-white border-[1.5px] rounded-full mt-[-12px]"></View>
          </View>
  
          <View className="flex flex-row gap-2">
            <Pressable className="flex p-[11px] border border-[#CBD5E1] rounded-full">
              <IconsPersonalizado name="chat" size={24} color="#475569"/>
            </Pressable>
  
            <Pressable className="flex p-[11px] border border-[#CBD5E1] rounded-full">
              <IconsPersonalizado name="notificacao" size={24} color="#475569"/>
            </Pressable>
          </View>
        </View>
  
        <View accessibilityLabel="ContainerSections" className="flex w-full gap-8 p-6 ">
          <View accessibilityLabel="ContainerAmigos" className="flex">
            <View accessibilityLabel="ContainerTexto" className="flex flex-row justify-between items-center pb-6">
              <Text className="font-bold text-[18px]">Sugestão de amigos</Text>
              
              <View className="flex flex-row items-end gap-2">
                <Text className="text-destaqueVerde font-bold text-[14px]">Ver tudo</Text>
                <IconsPersonalizado name="setaDireita" color="#01B198" size={20}/>
              </View>
            </View>
  
            <View accessibilityLabel="ContainerAdicionarAmigos">
              {renderCardAmigos()}
              {renderCardAmigos()}
              {renderCardAmigos()}
              {renderCardAmigos()}
              {renderCardAmigos()}
            </View>
          </View>
  
          <View accessibilityLabel="ContainerEventos" className={`${isTablet}`}>
            <View accessibilityLabel="ContainerTexto" className="flex flex-row justify-between items-center pb-6">
              <Text className="font-bold text-[18px]">Próximos eventos</Text>
              
              <IconsPersonalizado name="tresPontos" color="#CBD5E1" size={24}/>
            </View>
  
            <View accessibilityLabel="CardEvento" className="flex flex-row border-t border-[#E2E8F0] py-[12px] gap-3 items-center">
              <View className="w-[40px] h-[40px] flex items-center justify-center bg-[#EEF2FF] rounded-full">
                <IconsPersonalizado name="presente" color="#01B198" size={20}/>
              </View>
              <View className="flex flex-1">
                <Text className="text-[#475569] font-bold text-[14px]">Aniversário do amigo</Text>
                <Text className="text-[#475569] font-normal text-[14px]">25 de junho de 2028</Text>
              </View>
              <IconsPersonalizado name="notificacao" color="#94A3B8" size={20}/>
            </View>
  
            <View accessibilityLabel="CardEvento" className="flex flex-row border-t border-[#E2E8F0] py-[12px] gap-3 items-center">
              <View className="w-[40px] h-[40px] flex items-center justify-center bg-[#EEF2FF] rounded-full">
                <IconsPersonalizado name="moon" color="#01B198" size={20}/>
              </View>
              <View className="flex flex-1">
                <Text className="text-[#475569] font-bold text-[14px]">Feriado</Text>
                <Text className="text-[#475569] font-normal text-[14px]">28 de junho de 2028</Text>
              </View>
              <IconsPersonalizado name="notificacao" color="#94A3B8" size={20}/>
            </View>
  
            <View accessibilityLabel="CardEvento" className="flex flex-row border-t border-[#E2E8F0] py-[12px] gap-3 items-center">
              <View className="w-[40px] h-[40px] flex items-center justify-center bg-[#EEF2FF] rounded-full">
                <IconsPersonalizado name="team" color="#01B198" size={20}/>
              </View>
              <View className="flex flex-1">
                <Text className="text-[#475569] font-bold text-[14px]">Encontro de grupo</Text>
                <Text className="text-[#475569] font-normal text-[14px]">19 de agosto de 2028</Text>
              </View>
              <IconsPersonalizado name="notificacao" color="#94A3B8" size={20}/>
            </View>
  
            <View accessibilityLabel="CardEvento" className="flex flex-row border-t border-[#E2E8F0] py-[12px] gap-3 items-center">
              <View className="w-[40px] h-[40px] flex items-center justify-center bg-[#EEF2FF] rounded-full">
              <IconsPersonalizado name="graduacao" color="#01B198" size={20}/>
              </View>
              <View className="flex flex-1">
                <Text className="text-[#475569] font-bold text-[14px]">Graduação</Text>
                <Text className="text-[#475569] font-normal text-[14px]">22 de dezembro de 2028</Text>
              </View>
              <IconsPersonalizado name="notificacao" color="#94A3B8" size={20}/>
            </View>
          </View>
  
  
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 48,
    height: 48,
    resizeMode: 'cover',
    borderRadius: 9999,
  },
  imageAmigos: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    borderRadius: 9999,
  },
});
