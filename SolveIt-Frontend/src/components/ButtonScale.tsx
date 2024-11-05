import React, { useState } from 'react';
import { Pressable, Animated, View, ViewStyle, DimensionValue, PressableProps } from 'react-native';

interface ButtonScaleProps extends PressableProps {
  children: React.ReactNode; // Para os filhos do botão
  scale?: number; // Fator de escala
  className?: string; // Classes para estilos
}

const ButtonScale: React.FC<ButtonScaleProps> = ({
  children,
  scale = 1.3,
  onPress,
  className = "",
  ...props // Espalha todas as props restantes
}) => {
  const [animatedValue] = useState(new Animated.Value(1));

  const scaleButton = (toValue: number) => {
    Animated.spring(animatedValue, {
      toValue,
      useNativeDriver: true,
    }).start();
  };

  const convertToDimensionValue = (value: string): DimensionValue => {
    const numValue = parseInt(value);
    if (!Number.isNaN(numValue)) {
      return numValue;
    }
    return value as DimensionValue; // Para valores como 'auto' ou porcentagens
  };

  const getStyleFromClassName = (classString: string | undefined): { positionStyle: ViewStyle, remainingClassName: string } => {
    if (!classString) return { positionStyle: {}, remainingClassName: '' };
    
    const classes = classString.split(' ');
    const positionStyle: ViewStyle = {};
    const otherClasses: string[] = [];

    // Extraindo estilos de posição e outras classes
    classes.forEach(cls => {
      if (cls.includes('absolute')) {
        positionStyle.position = 'absolute';
      } else if (cls.startsWith('top-')) {
        const value = cls.replace('top-', '');
        positionStyle.top = convertToDimensionValue(value);
      } else if (cls.startsWith('bottom-')) {
        const value = cls.replace('bottom-', '');
        positionStyle.bottom = convertToDimensionValue(value);
      } else if (cls.startsWith('left-')) {
        const value = cls.replace('left-', '');
        positionStyle.left = convertToDimensionValue(value);
      } else if (cls.startsWith('right-')) {
        const value = cls.replace('right-', '');
        positionStyle.right = convertToDimensionValue(value);
      } else {
        otherClasses.push(cls);
      }
    });

    return {
      positionStyle,
      remainingClassName: otherClasses.join(' ')
    };
  };

  const { positionStyle, remainingClassName } = getStyleFromClassName(className);

  return (
    <View style={positionStyle}>
      <Animated.View
        style={{
          transform: [{ scale: animatedValue }],
          alignSelf: 'center'
        }}
      >
        <Pressable
          onPress={onPress}
          onHoverIn={() => scaleButton(scale)}
          onHoverOut={() => scaleButton(1)}
          className={remainingClassName}
          {...props} // Passa todas as props do Pressable
        >
          {children}
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default ButtonScale;
