import React, { useState } from 'react';
import { Pressable, Text, View, ActivityIndicator, PressableProps } from 'react-native';

interface ButtonProps extends PressableProps {
  className?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  hoverInColor?: string; // Nova prop apenas para a cor do hover
}

const Button = ({
  className = '',
  children,
  isLoading = false,
  onHoverIn = () => {},
  onHoverOut = () => {},
  onPressIn = () => {},
  onPressOut = () => {},
  hoverInColor,
  ...props
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

   // Determina a classe de fundo usando um operador ternário
   const backgroundClass = isHovered 
   ? (hoverInColor ? `bg-[${hoverInColor}]` : 'bg-opacity-80') 
   : ''; // Se não estiver hoverado, retorna string vazia

 return (
   <Pressable
     {...props} // Espalha todas as props recebidas
     className={`${className} ${backgroundClass} flex items-center justify-center flex-row`}
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
