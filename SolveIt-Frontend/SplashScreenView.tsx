import React, { useRef, useEffect } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

export default function SplashScreenView() {
  // Referência animada para a escala da imagem
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Função para iniciar a animação de zoom in e out
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2, // Zoom in
            duration: 2000, // 2 segundos
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1, // Zoom out
            duration: 2000, // 2 segundos
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    startAnimation();
  }, [scaleAnim]);

  return (
    <View className="flex-1 flex justify-center items-center bg-gradient-to-b from-[#0172B2] to-[#001645]">
      <Animated.Image
        style={[styles.image, { transform: [{ scale: scaleAnim }] }]}
        source={require('@/assets/splash.png')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    minWidth: 256,
    maxWidth: 500,
    width: '60%',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
});
