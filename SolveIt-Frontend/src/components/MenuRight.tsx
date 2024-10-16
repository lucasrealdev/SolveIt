import React, { useState } from "react";
import { Pressable, Text, View, Image, StyleSheet, useWindowDimensions, Animated } from "react-native";
import IconsPersonalizado from "@/assets/IconesPersonalizados";

export default function MenuRight() {
  const { width, height } = useWindowDimensions();

  const [scaleChat] = useState(new Animated.Value(1));
  const [scaleNotificacao] = useState(new Animated.Value(1));
  const [isHoveredVerTudo, setIsHoveredVerTudo] = useState(false);
  
  // Estado para hover de amigos
  const [hoveredFriends, setHoveredFriends] = useState(Array(5).fill(false));

  const handleHoverIn = (scaleValue) => {
    Animated.spring(scaleValue, {
      toValue: 1.08, // Aumenta o tamanho
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleHoverOut = (scaleValue) => {
    Animated.spring(scaleValue, {
      toValue: 1, // Volta ao tamanho original
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const renderCardAmigos = (key) => {
    return (
      <View
        key={key}
        accessibilityLabel="CardAmigos"
        className="flex flex-row border-t border-[#E2E8F0] py-[12px] gap-3 items-center"
      >
        <Image style={styles.imageAmigos} source={require('@/assets/pessoa.png')} />
        <View className="flex flex-1">
          <Text className="text-[#475569] font-bold text-[14px]">Júlia Smith</Text>
          <Text className="text-[#475569] font-normal text-[14px]">@juliasmith</Text>
        </View>
        <Pressable
          onHoverIn={() => {
            const newHovered = [...hoveredFriends];
            newHovered[key] = true; // Define como hovered
            setHoveredFriends(newHovered);
          }}
          onHoverOut={() => {
            const newHovered = [...hoveredFriends];
            newHovered[key] = false; // Remove hover
            setHoveredFriends(newHovered);
          }}
        >
          <IconsPersonalizado
            name="mais"
            color={hoveredFriends[key] ? "#373C42" : "#94A3B8"} // Cor muda conforme o estado do hover
            size={20}
          />
        </Pressable>
      </View>
    );
  };

  const renderEventCard = (title, date, iconName, key) => (
    <View key={key} accessibilityLabel="CardEvento" className="flex flex-row border-t border-[#E2E8F0] py-[12px] gap-3 items-center">
      <View className="w-[40px] h-[40px] flex items-center justify-center bg-[#EEF2FF] rounded-full">
        <IconsPersonalizado name={iconName} color="#01B198" size={20} />
      </View>
      <View className="flex flex-1">
        <Text className="text-[#475569] font-bold text-[14px]">{title}</Text>
        <Text className="text-[#475569] font-normal text-[14px]">{date}</Text>
      </View>
      <IconsPersonalizado name="notificacao" color="#94A3B8" size={20} />
    </View>
  );

  const isMobile = width > 1250;
  const isTablet = height <= 835 ? "hidden" : "";
  const containerWidth = width >= 1400 ? 368 : 320;

  if (isMobile) {
    return (
      <View
        accessibilityLabel="ContainerMenu"
        className="flex h-[100vh] border-l border-[#E2E8F0] bg-white"
        style={{ width: containerWidth }}
      >
        <View accessibilityLabel="ContainerHeaderMenu" className="flex w-full px-6 py-[20px] flex-row justify-between border-b border-[#E2E8F0]">
          <Pressable className="flex justify-center items-end">
            <Image style={styles.image} source={require('@/assets/pessoa.png')} />
            <View className="w-3 h-3 bg-[#22C55E] border-white border-[1.5px] rounded-full mt-[-12px]"></View>
          </Pressable>
          <View className="flex flex-row gap-2">
            {['chat', 'notificacao'].map((icon, index) => {
              const scaleValue = icon === 'chat' ? scaleChat : scaleNotificacao;
              return (
                <Pressable
                  key={index}
                  className="flex p-[11px] border border-[#CBD5E1] rounded-full"
                  onHoverIn={() => handleHoverIn(scaleValue)}
                  onHoverOut={() => handleHoverOut(scaleValue)}
                >
                  <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                    <IconsPersonalizado name={icon} size={24} color="#475569" />
                  </Animated.View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View accessibilityLabel="ContainerSections" className="flex w-full gap-8 p-6">
          <View accessibilityLabel="ContainerAmigos" className="flex">
            <View accessibilityLabel="ContainerTexto" className="flex flex-row justify-between items-center pb-6">
              <Text className="font-bold text-[18px]">Sugestão de amigos</Text>
              <Pressable
                onHoverIn={() => setIsHoveredVerTudo(true)}
                onHoverOut={() => setIsHoveredVerTudo(false)}
                className="flex flex-row items-end gap-2"
              >
                <Text className={`font-bold text-[14px] ${isHoveredVerTudo ? 'text-[#049681]' : 'text-destaqueVerde'}`}>
                  Ver tudo
                </Text>
                <IconsPersonalizado name="setaDireita" 
                  color={isHoveredVerTudo ? '#049681' : '#01B198'}
                  size={20} />
              </Pressable>
            </View>
            <View accessibilityLabel="ContainerAdicionarAmigos">
              {[...Array(5)].map((_, index) => renderCardAmigos(index))}
            </View>
          </View>

          <View accessibilityLabel="ContainerEventos" className={`${isTablet}`}>
            <View accessibilityLabel="ContainerTexto" className="flex flex-row justify-between items-center pb-6">
              <Text className="font-bold text-[18px]">Próximos eventos</Text>
            </View>
            {[
              { title: "Aniversário do amigo", date: "25 de junho de 2028", icon: "presente" },
              { title: "Feriado", date: "28 de junho de 2028", icon: "moon" },
              { title: "Encontro de grupo", date: "19 de agosto de 2028", icon: "team" },
              { title: "Graduação", date: "22 de dezembro de 2028", icon: "graduacao" },
            ].map((event, index) => renderEventCard(event.title, event.date, event.icon, index))}
          </View>
        </View>
      </View>
    );
  }

  return null; // Adiciona um retorno padrão caso não seja mobile
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
