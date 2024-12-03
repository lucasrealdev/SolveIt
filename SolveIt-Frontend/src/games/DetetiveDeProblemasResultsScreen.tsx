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
  totalRounds,
  currentRound,
  onNextRound,
  onRestart,
}) {
  const [animatedValue] = useState(new Animated.Value(0));
  // Constantes reutilizáveis para sombras
  const shadowStyle = {
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 8,
  };

  // Métricas de engajamento
  const engagementMetrics = {
    creativityScore: Math.floor(Math.random() * 100),
    innovationLevel: ["Iniciante", "Intermediário", "Avançado", "Expert"][
      Math.floor(Math.random() * 4)
    ],
    potentialImpact: ["Baixo", "Médio", "Alto", "Disruptivo"][
      Math.floor(Math.random() * 4)
    ],
  };

  // Estatísticas do ranking
  const leaderboardStats = [
    { name: "João S.", score: 95, badge: "🏆" },
    { name: "Maria P.", score: 88, badge: "🥈" },
    { name: "Carlos R.", score: 82, badge: "🥉" },
  ];

  // Conquistas
  const badges = [
    {
      name: "Pensador Criativo",
      icon: "💡",
      condition: engagementMetrics.creativityScore > 80,
    },
    { name: "Solucionador Rápido", icon: "⚡", condition: solutionsWithResponses.length <= 2 },
    {
      name: "Estrategista",
      icon: "🧠",
      condition: engagementMetrics.innovationLevel === "Expert",
    },
  ];

  // Função para iniciar animação
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

  const LeaderboardItem = ({ stat, isFirst }) => (
    <View
      className={`flex-row justify-between items-center p-3 ${
        isFirst ? "bg-yellow-100" : "bg-gray-50"
      } rounded-lg mb-2`}
    >
      <Text className="text-lg">
        {stat.badge} {stat.name}
      </Text>
      <Text className="text-lg font-bold">{stat.score}</Text>
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
        <View className="bg-white rounded-2xl p-6 mb-6" style={shadowStyle}>
          <Text className="text-2xl font-semibold text-center mb-4">
            Sua Performance
          </Text>

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
            {badges
              .filter((badge) => badge.condition)
              .map((badge, index) => (
                <Badge key={index} icon={badge.icon} name={badge.name} />
              ))}
          </View>
        </View>

        {/* Seção de ranking */}
        <View className="bg-white rounded-2xl p-6" style={shadowStyle}>
          <Text className="text-2xl font-semibold text-center mb-4">
            Ranking
          </Text>
          {leaderboardStats.map((stat, index) => (
            <LeaderboardItem
              key={index}
              stat={stat}
              isFirst={index === 0}
            />
          ))}
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
