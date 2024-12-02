import DetetiveDeProblemas from '@/games/DetetiveDeProblemas';
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const GameCard = ({ title, description, imageUrl, onStart }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View className="bg-white rounded-2xl mx-4 my-3 overflow-hidden border border-gray-200 max-w-[600px] w-full" style={styles.sombra}>
      <Image source={{ uri: imageUrl }} className="w-full h-48 object-cover" resizeMode="cover" />
      <View className="p-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-800">{title}</Text>
          <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} className="p-2">
            <Icon name="info-outline" color="#667085" size={24} />
          </TouchableOpacity>
        </View>
        {isExpanded && (
          <Text className="text-gray-600 mt-2 mb-4">{description}</Text>
        )}
        <View className="flex-row flex mt-4 gap-2">
          <TouchableOpacity onPress={onStart} className="flex-row bg-accentStandardDark px-4 py-3 rounded-lg items-center justify-center flex-1">
            <Icon name="play-arrow" color="white" size={20} />
            <Text className="text-white font-semibold text-base ml-2">Iniciar Jogo</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-100 p-3 rounded-lg items-center justify-center">
            <Icon name="star-border" color="#667085" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function Games() {
  const [activeGame, setActiveGame] = useState(null);

  const handleStartGame = (game) => {
    setActiveGame(game);
  };

  const handleBackToMenu = () => {
    setActiveGame(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {activeGame ? (
        // Mostrar somente o componente do jogo ativo
        <View className="flex-1">
          <TouchableOpacity onPress={handleBackToMenu} className='absolute left-1 bottom-1 z-10 bg-primaryStandardDark bg-opacity-30 rounded-lg w-[70px] h-[30px] items-center justify-center'>
            <Text className="text-white font-bold text-base">Menu</Text>
          </TouchableOpacity>
          {activeGame === 'problemDetective' && <DetetiveDeProblemas />}
        </View>
      ) : (
        // Mostrar o menu principal com a lista de jogos
        <ScrollView className="flex-1">
          <View className="flex-1 items-center">
            <View className="bg-white p-4 border-b border-gray-200 flex-row items-center justify-center w-full gap-2" style={styles.sombra}>
              <Icon name="games" color="#1F2937" size={26} />
              <Text className="text-3xl font-bold text-gray-900">JOGOS</Text>
            </View>
            <View className="mt-4 w-full items-center px-2">
              <GameCard
                title="Detetive dos Problemas"
                description="O Detetive de Problemas é um minigame projetado para estimular a criatividade e o pensamento crítico dos jogadores ao identificar problemas e soluções inovadoras. A ideia do jogo é ajudar os usuários a aprenderem a reconhecer questões que podem ser transformadas em oportunidades de negócios ou invenções, ao mesmo tempo que promovem um ambiente colaborativo e de reflexão."
                imageUrl="https://cloud.appwrite.io/v1/storage/buckets/671d9fc20001e9236357/files/674cf148002473651202/view?project=671d0f4d00153dc7c867&project=671d0f4d00153dc7c867&mode=admin"
                onStart={() => handleStartGame('problemDetective')}
              />
              <View className="items-center mt-4 w-full">
                <Text className="text-gray-500 text-center">Mais jogos em breve...</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sombra: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
});
