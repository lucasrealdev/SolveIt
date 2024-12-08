import React, { useState, useEffect } from "react";
import {
  Animated,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DetetiveDeProblemasResultsScreen({
  problemsWithResponses,
  solutionsWithResponses,
  onNextRound,
  // onRestart,
}) {
  console.log(problemsWithResponses);
  console.log(solutionsWithResponses);
  const [animatedValue] = useState(new Animated.Value(0));
  // Função para calcular médias das notas
  const calculateAverage = (data, keys) => {
    // Extraindo as notas de cada item
    const allResponses = data.flatMap((item) => {
      // Verifica se 'responses' existe e é um array
      if (!item.responses || !Array.isArray(item.responses)) {
        return []; // Retorna um array vazio se 'responses' for indefinido ou não for um array
      }

      return item.responses.map((response) =>
        keys.reduce((acc, key) => {
          acc[key] = response[key] || 0;
          return acc;
        }, {})
      );
    });

    // Calculando os totais
    const totalScores = allResponses.reduce(
      (acc, response) => {
        keys.forEach((key) => {
          acc[key] += response[key] || 0;
        });
        return acc;
      },
      { criatividade: 0, coerencia: 0, viabilidade: 0 }
    );

    // Calculando as médias
    const count = allResponses.length || 1;
    return {
      criatividade: parseFloat((totalScores.criatividade / count).toFixed(1)),
      coerencia: parseFloat((totalScores.coerencia / count).toFixed(1)),
      viabilidade: keys.includes("viabilidade")
        ? parseFloat((totalScores.viabilidade / count).toFixed(1))
        : null,
    };
  };

  // Calculando as médias
  const problemsAverage = calculateAverage(problemsWithResponses || [], [
    "criatividade",
    "coerencia",
  ]);
  const solutionsAverage = calculateAverage(solutionsWithResponses || [], [
    "criatividade",
    "coerencia",
    "viabilidade",
  ]);


  // Determinando badges dinâmicos
  const badges = [
    {
      name: "Pensador Criativo",
      icon: "💡",
      condition: problemsAverage.criatividade > 7,
    },
    {
      name: "Resolver Brilhante",
      icon: "✨",
      condition: solutionsAverage.criatividade > 8,
    },
    {
      name: "Praticidade",
      icon: "🔧",
      condition: solutionsAverage.viabilidade > 7,
    },
    {
      name: "Analista de Coerência",
      icon: "🔍",
      condition:
        problemsAverage.coerencia > 6 && solutionsAverage.coerencia > 6,
    },
  ];

  // Iniciar animação
  const startAnimation = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      friction: 1,
      tension: 20,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    startAnimation();
  }, []);

  // Componentes auxiliares
  const Badge = ({ icon, name }) => (
    <View className="items-center">
      <Text className="text-3xl">{icon}</Text>
      <Text className="text-xs text-gray-600 mt-1">{name}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100">
      <ScrollView contentContainerClassName="p-6">
        {/* Cabeçalho com animação */}
        <Animated.View
          style={{
            transform: [
              {
                scale: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ],
          }}
        >
          <View className="items-center mb-6">
            <Text className="text-4xl font-bold text-blue-800">Parabéns!</Text>
            <Text className="text-xl text-gray-600 text-center mt-2">
              Você completou a rodada com maestria
            </Text>
          </View>
        </Animated.View>

        {/* Seção de performance */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow">
          <Text className="text-2xl font-semibold text-center mb-4">
            Desempenho
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-lg font-bold text-blue-600">
                Criatividade: {problemsAverage.criatividade}
              </Text>
              <Text className="text-lg font-bold text-green-600">
                Coerência: {problemsAverage.coerencia}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold text-purple-600">
                Criatividade: {solutionsAverage.criatividade}
              </Text>
              <Text className="text-lg font-bold text-yellow-600">
                Viabilidade: {solutionsAverage.viabilidade}
              </Text>
              <Text className="text-lg font-bold text-blue-600">
                Coerência: {solutionsAverage.coerencia}
              </Text>
            </View>
          </View>

          {/* Badges */}
          <View className="flex-row justify-center space-x-3 mt-4">
            {badges
              .filter((badge) => badge.condition)
              .map((badge, index) => (
                <Badge key={index} icon={badge.icon} name={badge.name} />
              ))}
          </View>
        </View>

        {/* Botões de ação */}
        <View className="flex-row justify-between mt-6">
          <TouchableOpacity
            className="bg-blue-600 p-4 rounded-lg flex-1 mr-3 items-center"
            onPress={onNextRound}
          >
            <Text className="text-white font-semibold">Próxima Rodada</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-green-600 p-4 rounded-lg flex-1 items-center"
            onPress={() => {
              /* Compartilhar resultados */
            }}
          >
            <Text className="text-white font-semibold">Compartilhar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
