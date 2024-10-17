import IconesPersonalizados from '@/assets/IconesPersonalizados';
import React, { useState } from 'react';
import { View, Image, Text, Pressable } from 'react-native';

interface CardAmigoProps {
  label: string;
}

const CardAmigo: React.FC<CardAmigoProps> = ({ label }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <View
      accessibilityLabel="Amigo"
      className={`flex flex-row border-b border-[#E2E8F0] py-3 ${label === 'menu' ? '' : 'px-[10px]'} gap-3 items-center`}
    >
      <Image className="w-[40px] h-[40px] rounded-full" source={require('@/assets/pessoa.png')} />
      <View className="flex-1">
        <Text className="text-[#475569] font-bold text-[14px]">Júlia Smith</Text>
        <Text className="text-[#475569] font-normal text-[14px]">@juliasmith</Text>
      </View>
      <Pressable
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
      >
        {label === "seguidores" ? (
          <Text className={`text-[14px] font-bold ${hovered ? 'text-[#D21F3C]' : 'text-[#FF0029]'}`}>
            Remover
          </Text>
        ) : (label === "amigo" || label === "menu") ? (
          <IconesPersonalizados
            name="mais" // Substitua pelo nome do ícone que você deseja usar
            color={hovered ? '#373C42' : '#94A3B8'}
            size={20}
          />
        ) : null}
      </Pressable>
    </View>
  );
};

export default CardAmigo;
