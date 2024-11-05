import React, { useState } from 'react';
import { Pressable, Text, View, ActivityIndicator, PressableProps } from 'react-native';

interface ButtonProps extends PressableProps {
  className?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
  hoverInColor?: string; // Nova prop apenas para a cor do hover
}

const Button = ({
  className = '',
  children,
  isLoading = false,
  onHoverIn = () => {},
  onHoverOut = () => {},
  hoverInColor,
  ...props
}: ButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleHoverIn = () => {
    setIsHovered(true);
    onHoverIn();
  };

  const handleHoverOut = () => {
    setIsHovered(false);
    onHoverOut();
  };

  // Agora as funções onPressIn e onPressOut recebem o evento corretamente
  const onPressIn = (event: any) => {
    setIsPressed(true); // Marca como pressionado
    if (props.onPressIn) { // Se uma função onPressIn for passada, chama-a
      props.onPressIn(event);
    }
  };

  const onPressOut = (event: any) => {
    setIsPressed(false); // Marca como não pressionado
    if (props.onPressOut) { // Se uma função onPressOut for passada, chama-a
      props.onPressOut(event);
    }
  };

  // Determina a classe de fundo usando um operador ternário
  const backgroundClass = isPressed
    ? 'bg-opacity-90' // Aplica opacidade de 90% quando pressionado
    : isHovered
    ? (hoverInColor ? `bg-[${hoverInColor}]` : 'bg-opacity-80') // Aplica cor de hover ou opacidade de 80%
    : ''; // Caso contrário, sem fundo especial

  return (
    <Pressable
      {...props} // Espalha todas as props recebidas
      className={`${className} ${backgroundClass} flex items-center justify-center flex-row`}
      onPressIn={onPressIn} // Passando o evento para onPressIn
      onPressOut={onPressOut} // Passando o evento para onPressOut
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
  <View className="">{icon}</View>
);

export { Button, TextButton, IconButton };
