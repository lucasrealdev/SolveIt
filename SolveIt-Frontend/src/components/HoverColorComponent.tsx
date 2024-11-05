import React, { useState, ReactNode, ReactElement } from 'react';
import { Pressable, PressableProps } from 'react-native';

interface HoverColorComponentProps extends PressableProps {
  colorHover: string;       // Cor ao passar o mouse (hover)
  colorPressIn?: string;    // Cor ao pressionar o botão
  children: ReactNode;
}

const HoverColorComponent = ({
  colorHover,
  colorPressIn,            // Cor ao pressionar
  children,
  onPress,                 // Função passada para o onPress do Pressable
  ...pressableProps        // Espalha todas as outras props do Pressable
}: HoverColorComponentProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleHoverIn = () => setIsHovered(true);
  const handleHoverOut = () => setIsHovered(false);

  const handlePressIn = () => setIsPressed(true);
  const handlePressOut = () => setIsPressed(false);

  // Função para aplicar o estilo de hover e press
  const applyHoverPressStyle = (child: ReactNode) => {
    if (React.isValidElement(child)) {
      const { type, props } = child as ReactElement;

      // Verifica se o tipo do filho é CustomIcons e aplica a cor na propriedade 'color'
      if (type && (type as any).name === 'CustomIcons') {
        return React.cloneElement(child as ReactElement, {
          color: isPressed
            ? colorPressIn || props.color  // Se pressionado, usa a cor de PressIn (ou a cor original)
            : isHovered
            ? colorHover
            : props.color,              // Caso contrário, aplica a cor original
        });
      }

      // Para outros componentes, aplica a cor via 'style'
      const style = isPressed
        ? { color: colorPressIn || props.style?.color }   // Cor ao pressionar
        : isHovered
        ? { color: colorHover }
        : {};

      return React.cloneElement(child as ReactElement, {
        style: { ...props.style, ...style },
      });
    }
    return child;
  };

  return (
    <Pressable
      onPress={onPress}              // Passa a função onPress
      onPressIn={handlePressIn}      // Define a cor ao pressionar
      onPressOut={handlePressOut}    // Restaura a cor ao soltar
      onHoverIn={handleHoverIn}      // Lida com o hover
      onHoverOut={handleHoverOut}
      {...pressableProps}            // Espalha as outras props para o Pressable
    >
      {React.Children.map(children, (child) => applyHoverPressStyle(child))}
    </Pressable>
  );
};

export default HoverColorComponent;
