import CustomIcons from '@/assets/icons/CustomIcons';
import React, { useState } from 'react';
import { View, Image, Text, Pressable } from 'react-native';
import images from '@/constants/images';

interface CardFriendProps {
  label: string;
}

const CardFriend: React.FC<CardFriendProps> = ({ label }) => {
  const [hovered, setHovered] = useState(false);
  const isFollower = label === "seguidores";
  const isFriendOrMenu = label === "amigo" || label === "menu";

  return (
    <View
      accessibilityLabel="Amigo"
      className={`flex flex-row border-b border-borderStandardLight py-4 ${label !== 'menu' ? 'px-[15px]' : ''} gap-3 items-center`}
    >
      <Image className="w-[40px] h-[40px] rounded-full" source={images.person} />
      <View className="flex-1 gap-[1px]">
        <Text className="text-textSecondary font-bold text-[14px]">Júlia Smith</Text>
        <Text className="text-textSecondary font-medium text-[14px]">@juliasmith</Text>
      </View>
      <Pressable
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
      >
        {isFollower ? (
          <Text className={`text-[14px] font-bold ${hovered ? 'text-[#D21F3C]' : 'text-[#FF0029]'}`}>
            Remover
          </Text>
        ) : isFriendOrMenu ? (
          <CustomIcons
            name="mais" // Substitua pelo nome do ícone que você deseja usar
            color={hovered ? '#373C42' : '#94A3B8'}
            size={20}
          />
        ) : null}
      </Pressable>
    </View>
  );
};

export default CardFriend;
