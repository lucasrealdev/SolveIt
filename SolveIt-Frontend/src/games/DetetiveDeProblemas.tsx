import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import quizData from '@/assets/games/detetiveDeProblemas.json'; // Adjust path as needed
import { useAlert } from '@/context/AlertContext';
// Results Screen Component
const ResultsScreen = ({ solutions, totalRounds, currentRound, onNextRound, onRestart }) => {
  const [animatedValue] = useState(new Animated.Value(0));

  // Psychological Engagement Metrics
  const engagementMetrics = {
    creativityScore: Math.floor(Math.random() * 100),
    innovationLevel: ['Iniciante', 'Intermediário', 'Avançado', 'Expert'][Math.floor(Math.random() * 4)],
    potentialImpact: ['Baixo', 'Médio', 'Alto', 'Disruptivo'][Math.floor(Math.random() * 4)],
  };

  // Social Proof and Competitive Elements
  const leaderboardStats = [
    { name: "João S.", score: 95, badge: "🏆" },
    { name: "Maria P.", score: 88, badge: "🥈" },
    { name: "Carlos R.", score: 82, badge: "🥉" },
  ];

  // Trigger Psychological Biases
  const badges = [
    { name: "Pensador Criativo", icon: "💡", condition: engagementMetrics.creativityScore > 80 },
    { name: "Solucionador Rápido", icon: "⚡", condition: solutions.length <= 2 },
    { name: "Estrategista", icon: "🧠", condition: engagementMetrics.innovationLevel === 'Expert' },
  ];

  // Animation for celebration
  React.useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: 1,
      friction: 1,
      tension: 20,
      useNativeDriver: true
    }).start();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100">
      <ScrollView contentContainerClassName="p-6">
        <Animated.View
          style={{
            transform: [
              {
                scale: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1]
                })
              }
            ]
          }}
        >
          <View className="items-center mb-6">
            <Text className="text-4xl font-bold text-blue-800">Parabéns!</Text>
            <Text className="text-xl text-gray-600 text-center mt-2">
              Você completou a rodada com maestria
            </Text>
          </View>
        </Animated.View>

        <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <Text className="text-2xl font-semibold text-center mb-4">Sua Performance</Text>

          <View className="flex-row flex-wrap justify-between mb-4">
            <View className="items-center">
              <Text className="text-3xl font-bold text-blue-600">
                {engagementMetrics.creativityScore}
              </Text>
              <Text className="text-gray-600">Criatividade</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold text-green-600">
                {engagementMetrics.innovationLevel}
              </Text>
              <Text className="text-gray-600">Nível</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold text-purple-600">
                {engagementMetrics.potentialImpact}
              </Text>
              <Text className="text-gray-600">Impacto</Text>
            </View>
          </View>

          <View className="flex-row justify-center space-x-3 mt-4">
            {badges.filter(badge => badge.condition).map((badge, index) => (
              <View key={index} className="items-center">
                <Text className="text-3xl">{badge.icon}</Text>
                <Text className="text-xs text-gray-600 mt-1">{badge.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-lg">
          <Text className="text-2xl font-semibold text-center mb-4">Ranking</Text>
          {leaderboardStats.map((stat, index) => (
            <View
              key={index}
              className={`flex-row justify-between items-center p-3 ${index === 0 ? 'bg-yellow-100' : 'bg-gray-50'
                } rounded-lg mb-2`}
            >
              <Text className="text-lg">{stat.badge} {stat.name}</Text>
              <Text className="text-lg font-bold">{stat.score}</Text>
            </View>
          ))}
        </View>

        <View className="flex-row justify-between mt-6">
          <TouchableOpacity
            className="bg-blue-600 p-4 rounded-lg flex-1 mr-3 items-center"
            onPress={onNextRound}
          >
            <Text className="text-white font-semibold">Próxima Rodada</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-green-600 p-4 rounded-lg flex-1 items-center"
            onPress={() => {/* Share Results */ }}
          >
            <Text className="text-white font-semibold">Compartilhar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Main Quiz Game Component
const DetetiveDeProblemas = () => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [currentStage, setCurrentStage] = useState('problems'); // 'problems', 'solutions', or 'results'
  const [problems, setProblems] = useState(['']);
  const [solutions, setSolutions] = useState(['']);

  const currentRound = quizData.rounds[currentRoundIndex];

  const { showAlert } = useAlert();

  const addInput = (type) => {
    if (type === 'problems' && problems.length < 3) {
      setProblems([...problems, '']);
    } else if (type === 'solutions' && solutions.length < 3) {
      setSolutions([...solutions, '']);
    }
  };

  const updateInput = (type, index, value) => {
    if (type === 'problems') {
      const newProblems = [...problems];
      newProblems[index] = value;
      setProblems(newProblems);
    } else {
      const newSolutions = [...solutions];
      newSolutions[index] = value;
      setSolutions(newSolutions);
    }
  };

  const removeInput = (type, index) => {
    if (type === 'problems' && problems.length > 1) {
      const newProblems = problems.filter((_, i) => i !== index);
      setProblems(newProblems);
    } else if (type === 'solutions' && solutions.length > 1) {
      const newSolutions = solutions.filter((_, i) => i !== index);
      setSolutions(newSolutions);
    }
  };

  const proceedToNextStage = () => {
    if (currentStage === 'problems') {
      const validProblems = problems.filter(p => p.trim() !== '');
      if (validProblems.length === 0) {
        showAlert('Erro', 'Por favor, adicione pelo menos um problema.');
        return;
      }
      setCurrentStage('solutions');
    } else if (currentStage === 'solutions') {
      const validSolutions = solutions.filter(s => s.trim() !== '');
      if (validSolutions.length === 0) {
        showAlert('Erro', 'Por favor, adicione pelo menos uma solução.');
        return;
      }
      setCurrentStage('results');
    }
  };

  const navigateRound = (direction) => {
    if (direction === 'next' && currentRoundIndex < quizData.rounds.length - 1) {
      setCurrentRoundIndex(currentRoundIndex + 1);
      setCurrentStage('problems');
      setProblems(['']);
      setSolutions(['']);
    } else if (direction === 'prev' && currentRoundIndex > 0) {
      setCurrentRoundIndex(currentRoundIndex - 1);
      setCurrentStage('problems');
      setProblems(['']);
      setSolutions(['']);
    }
  };

  const renderInputs = (type) => {
    const currentInputs = type === 'problems' ? problems : solutions;

    return currentInputs.map((input, index) => (
      <View key={index} className="flex-row items-center mb-2">
        <TextInput
          placeholder={`${type === 'problems' ? 'Problema' : 'Solução'} ${index + 1}`}
          value={input}
          onChangeText={(text) => updateInput(type, index, text)}
          className="flex-1 border border-gray-300 p-2 rounded-lg mr-2"
        />
        {currentInputs.length > 1 && (
          <TouchableOpacity
            onPress={() => removeInput(type, index)}
            className="p-2"
          >
            <Icon name="delete" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>
    ));
  };

  // If we've reached the results stage, show the results screen
  if (currentStage === 'results') {
    return (
      <ResultsScreen
        solutions={solutions}
        totalRounds={quizData.rounds.length}
        currentRound={currentRound}
        onNextRound={() => {
          navigateRound('next');
          setCurrentStage('problems');
        }}
        onRestart={() => {
          setCurrentRoundIndex(0);
          setCurrentStage('problems');
          setProblems(['']);
          setSolutions(['']);
        }}
      />
    );
  }

  return (
    <SafeAreaView className="w-full bg-gray-50">
      <View className="flex-row justify-between items-center p-4 bg-white">
        <TouchableOpacity
          onPress={() => navigateRound('prev')}
          disabled={currentRoundIndex === 0}
        >
          <Icon
            name="arrow-back"
            size={24}
            color={currentRoundIndex === 0 ? 'gray' : 'black'}
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold">
          Rodada {currentRoundIndex + 1}
        </Text>
        <TouchableOpacity
          onPress={() => navigateRound('next')}
          disabled={currentRoundIndex === quizData.rounds.length - 1}
        >
          <Icon
            name="arrow-forward"
            size={24}
            color={currentRoundIndex === quizData.rounds.length - 1 ? 'gray' : 'black'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="p-4 items-center">
        <Text className='text-center font-bold mb-2 text-xl'>{currentRound.title}</Text>
        <Image
          source={{ uri: currentRound.image }}
          className="w-full h-48 rounded-lg mb-4"
          resizeMode="cover"
        />
        {currentRound?.image2 && (
          <Image
            source={{ uri: currentRound.image2 }}
            className="w-full h-48 rounded-lg mb-4"
            resizeMode="cover"
          />
        )}
        {currentRound?.image3 && (
          <Image
            source={{ uri: currentRound.image3 }}
            className="w-full h-48 rounded-lg mb-4"
            resizeMode="cover"
          />
        )}

        <View className="bg-white p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold mb-2">
            {currentStage === 'problems'
              ? currentRound.problemStage.instruction
              : currentRound.solutionStage.instruction}
          </Text>

          {currentStage === 'problems' && (
            <View>
              {renderInputs('problems')}
              {problems.length < 3 && (
                <TouchableOpacity
                  onPress={() => addInput('problems')}
                  className="bg-blue-500 p-2 rounded-lg items-center mt-2"
                >
                  <Text className="text-white">Adicionar Problema</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {currentStage === 'solutions' && (
            <View>
              {problems.map((problem, index) => (
                <View key={index} className="mb-4 p-3 bg-gray-100 rounded-lg">
                  <Text className="font-bold mb-2">Problema {index + 1}:</Text>
                  <Text>{problem}</Text>
                  <Text className="text-gray-600 mt-2 italic">
                    Resposta fictícia: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </Text>
                </View>
              ))}

              {renderInputs('solutions')}
              {solutions.length < 3 && (
                <TouchableOpacity
                  onPress={() => addInput('solutions')}
                  className="bg-green-500 p-2 rounded-lg items-center mt-2"
                >
                  <Text className="text-white">Adicionar Solução</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View className="flex-row justify-between">
          <Text className="text-sm text-gray-600">
            Soluções Ótimas: {currentRound.optimalSolutions}
          </Text>
          <Text className="text-sm text-gray-600">
            Soluções Viáveis: {currentRound.viableSolutions}
          </Text>
          <Text className="text-sm text-gray-600">
            Soluções Ruins: {currentRound.poorSolutions}
          </Text>
        </View>

        <TouchableOpacity
          onPress={proceedToNextStage}
          className="bg-blue-600 p-3 rounded-lg items-center mt-4"
        >
          <Text className="text-white font-semibold">
            {currentStage === 'problems' ? 'Próxima Etapa' : 'Enviar Respostas'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetetiveDeProblemas;