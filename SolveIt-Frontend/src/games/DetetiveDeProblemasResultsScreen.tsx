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
  inspiration = undefined,
}) {
  const [animatedValue] = useState(new Animated.Value(0));

  // Estados para armazenar as notas
  const [problemsAverage, setProblemsAverage] = useState({
    criatividade: 0,
    coerencia: 0,
  });
  const [solutionsAverage, setSolutionsAverage] = useState({
    criatividade: 0,
    coerencia: 0,
    viabilidade: 0,
  });

  // Função para calcular médias das notas
  const calculateAverage = (data, keys) => {
    let totalCriatividadeProblems = 0;
    let totalCoerenciaProblems = 0;
    let totalCriatividadeSolutions = 0;
    let totalCoerenciaSolutions = 0;
    let totalViabilidade = 0;

    let countCriatividadeProblems = 0;
    let countCoerenciaProblems = 0;
    let countCriatividadeSolutions = 0;
    let countCoerenciaSolutions = 0;
    let countViabilidade = 0;

    data.forEach((item) => {
      // Se "NotaViabilidade" estiver nas chaves, use solutionsAverage
      if (keys.includes("NotaViabilidade")) {
        if (item.NotaCriatividade !== undefined) {
          totalCriatividadeSolutions += item.NotaCriatividade;
          countCriatividadeSolutions++;
        }
        if (item.NotaCoerencia !== undefined) {
          totalCoerenciaSolutions += item.NotaCoerencia;
          countCoerenciaSolutions++;
        }
        if (item.NotaViabilidade !== undefined) {
          totalViabilidade += item.NotaViabilidade;
          countViabilidade++;
        }
      } else {
        // Se "NotaViabilidade" não estiver nas chaves, use problemsAverage
        if (item.NotaCriatividade !== undefined) {
          totalCriatividadeProblems += item.NotaCriatividade;
          countCriatividadeProblems++;
        }
        if (item.NotaCoerencia !== undefined) {
          totalCoerenciaProblems += item.NotaCoerencia;
          countCoerenciaProblems++;
        }
      }
    });

    // Calcular as médias para problemas
    const averageCriatividadeProblems = countCriatividadeProblems
      ? totalCriatividadeProblems / countCriatividadeProblems
      : 0;
    const averageCoerenciaProblems = countCoerenciaProblems
      ? totalCoerenciaProblems / countCoerenciaProblems
      : 0;

    // Calcular as médias para soluções
    const averageCriatividadeSolutions = countCriatividadeSolutions
      ? totalCriatividadeSolutions / countCriatividadeSolutions
      : 0;
    const averageCoerenciaSolutions = countCoerenciaSolutions
      ? totalCoerenciaSolutions / countCoerenciaSolutions
      : 0;
    const averageViabilidade = countViabilidade
      ? totalViabilidade / countViabilidade
      : 0;

    // Atualiza o estado de acordo com a presença de "NotaViabilidade"
    if (keys.includes("NotaViabilidade")) {
      setSolutionsAverage({
        criatividade: averageCriatividadeSolutions,
        coerencia: averageCoerenciaSolutions,
        viabilidade: averageViabilidade,
      });
    } else {
      setProblemsAverage({
        criatividade: averageCriatividadeProblems,
        coerencia: averageCoerenciaProblems,
      });
    }
  };

  // Atualizar médias ao montar o componente
  useEffect(() => {
    calculateAverage(
      problemsWithResponses || [], // Garante que o array não seja nulo
      ["NotaCriatividade", "NotaCoerencia"] // Certifique-se de usar as chaves corretas
    );
    calculateAverage(
      solutionsWithResponses || [], // Garante que o array não seja nulo
      ["NotaCriatividade", "NotaCoerencia", "NotaViabilidade"] // Certifique-se de usar as chaves corretas
    );
  }, [problemsWithResponses, solutionsWithResponses]);

  // Determinando badges dinâmicos
  const badges = [
    // Badges para notas altas
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

    // Badges para notas medianas
    {
      name: "Esforço Promissor",
      icon: "🌱",
      condition:
        (problemsAverage.criatividade >= 4 &&
          problemsAverage.criatividade <= 7) ||
        (solutionsAverage.criatividade >= 4 &&
          solutionsAverage.criatividade <= 7),
    },
    {
      name: "Coerência em Construção",
      icon: "🧱",
      condition:
        (problemsAverage.coerencia >= 4 && problemsAverage.coerencia <= 6) ||
        (solutionsAverage.coerencia >= 4 && solutionsAverage.coerencia <= 6),
    },
    {
      name: "Viabilidade Razoável",
      icon: "🛠️",
      condition:
        solutionsAverage.viabilidade >= 4 && solutionsAverage.viabilidade <= 7,
    },

    // Badges para notas baixas
    {
      name: "Criatividade Básica",
      icon: "🧐",
      condition:
        problemsAverage.criatividade > 0 && problemsAverage.criatividade < 4,
    },
    {
      name: "Resolver em Progresso",
      icon: "🔄",
      condition:
        solutionsAverage.criatividade > 0 && solutionsAverage.criatividade < 4,
    },
    {
      name: "Coerência Inicial",
      icon: "📖",
      condition: problemsAverage.coerencia > 0 && problemsAverage.coerencia < 4,
    },
    {
      name: "Viabilidade em Ajuste",
      icon: "⚙️",
      condition:
        solutionsAverage.viabilidade > 0 && solutionsAverage.viabilidade < 4,
    },

    // Badge especial para todas as notas zeradas
    {
      name: "Começando do Zero",
      icon: "🌀",
      condition:
        problemsAverage.criatividade === 0 &&
        problemsAverage.coerencia === 0 &&
        solutionsAverage.criatividade === 0 &&
        solutionsAverage.coerencia === 0 &&
        solutionsAverage.viabilidade === 0,
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

  // Estatísticas do ranking
  const leaderboardStats = [
    { name: "João S.", score: 50, badge: "🏆" },
    { name: "Maria P.", score: 45, badge: "🥈" },
    { name: "Carlos R.", score: 42, badge: "🥉" },
  ];

  const score =
    problemsAverage.criatividade +
    problemsAverage.coerencia +
    solutionsAverage.coerencia +
    solutionsAverage.criatividade +
    solutionsAverage.viabilidade;

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100">
      <ScrollView
        contentContainerClassName="p-6"
        showsVerticalScrollIndicator={false}
      >
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
          <View className="flex-row flex-wrap justify-center gap-10">
            <View className="items-center">
              <Text className="text-lg font-bold text-textSecondary">
                Notas Medias Problemas:
              </Text>
              <Text className="text-lg font-bold text-blue-600">
                Criatividade: {problemsAverage.criatividade}
              </Text>
              <Text className="text-lg font-bold text-green-600">
                Coerência: {problemsAverage.coerencia}
              </Text>
              <Text className="text-lg font-bold text-yellow-600">
                Score: {score}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold text-textSecondary">
                Notas Medias Soluções:
              </Text>
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
          <View className="flex-row flex-wrap justify-center space-x-3 mt-4">
            {badges
              .filter((badge) => badge.condition)
              .map((badge, index) => (
                <Badge key={index} icon={badge.icon} name={badge.name} />
              ))}
          </View>

          {inspiration != null && (
            <View className="w-full justify-center mt-5 flex-row">
              <Text className="text-lg font-bold text-textStandardDark">
                Esse cenário foi inspirado em:{" "}
                <Text className="text-lg font-bold text-green-400">
                {inspiration}
              </Text>
              </Text>
            </View>
          )}
        </View>

        {/* Seção de ranking */}
        <View
          className="bg-white rounded-2xl p-6"
          style={{
            shadowColor: "rgba(0, 0, 0, 0.1)",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 6,
            elevation: 8,
          }}
        >
          <Text className="text-2xl font-semibold text-center mb-4">
            Ranking
          </Text>
          {leaderboardStats.map((stat, index) => (
            <LeaderboardItem key={index} stat={stat} isFirst={index === 0} />
          ))}
        </View>

        {/* Botões de ação */}
        <View className="flex-row justify-between mt-6 mb-8">
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
