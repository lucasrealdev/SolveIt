import React, { useState } from 'react';
import { Pressable, Text, View, ActivityIndicator, PressableProps } from 'react-native';

interface ButtonProps extends PressableProps {
  className?: string;
  children: React.ReactNode;
  isLoading?: boolean; // Prop para exibir loader
  onHoverIn?: () => void;
  onHoverOut?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
}

const Button = ({ 
  className = '', 
  children, 
  isLoading = false, // Define padrão como false
  onHoverIn = () => {}, 
  onHoverOut = () => {}, 
  onPressIn = () => {}, 
  onPressOut = () => {}, 
  ...props // Espalha as props do Pressable
}: ButtonProps) => {
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
      disabled={isLoading} // Desativa o botão enquanto carrega
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#FFF" /> // Exibe o loader se isLoading for true
      ) : (
        children
      )}
    </Pressable>
  );
};

const TextButton = ({ text, style = '' }) => (
  <Text className={`text-white font-bold ${style}`}>{text}</Text>
);

const IconButton = ({ icon }) => (
  <View className="">
    {icon}
  </View>
);

export { Button, TextButton, IconButton };
