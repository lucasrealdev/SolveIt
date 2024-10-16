import React, { useState } from 'react';
import { Pressable, Text, View, PressableProps } from 'react-native';

interface BotaoProps extends PressableProps {
  className?: string;
  children: React.ReactNode;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
}

const Botao = ({ 
  className = '', 
  children, 
  onHoverIn = () => {}, 
  onHoverOut = () => {}, 
  onPressIn = () => {}, 
  onPressOut = () => {}, 
  ...props // Espalha as props do Pressable
}: BotaoProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleHoverIn = () => {
    setIsHovered(true);
    onHoverIn();
  };

  const handleHoverOut = () => {
    setIsHovered(false);
    onHoverOut();
  };

  return (
    <Pressable
      {...props} // Espalha todas as props recebidas
      className={`${className} ${isHovered ? 'bg-opacity-80' : ''} flex items-center justify-center flex-row`}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
    >
      {children}
    </Pressable>
  );
};

const BotaoTexto = ({ text, style = '' }) => (
  <Text className={`text-white font-bold ${style}`}>{text}</Text>
);

const BotaoIcone = ({ icon }) => (
  <View className="">
    {icon}
  </View>
);

export { Botao, BotaoTexto, BotaoIcone };
