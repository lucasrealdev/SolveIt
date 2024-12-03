import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import quizData from '@/assets/games/detetiveDeProblemas.json'; // Ajuste conforme necessário
import { useAlert } from '@/context/AlertContext';
import DetetiveDeProblemasResultsScreen from './DetetiveDeProblemasResultsScreen';

const QuizHeader = ({ currentRoundIndex, totalRounds, navigateRound }) => (
  <View className="flex-row justify-between items-center p-4 bg-white w-full">
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
    <Text className="text-xl font-bold">Rodada {currentRoundIndex + 1}</Text>
    <TouchableOpacity
      onPress={() => navigateRound('next')}
      disabled={currentRoundIndex === totalRounds - 1}
    >
      <Icon
        name="arrow-forward"
        size={24}
        color={currentRoundIndex === totalRounds - 1 ? 'gray' : 'black'}
      />
    </TouchableOpacity>
  </View>
);

const DynamicInputList = ({ inputs, type, addInput, updateInput, removeInput, maxInputs }) => (
  <>
    {inputs.map((input, index) => (
      <View key={index} className="flex-row items-center mb-2">
        <TextInput
          placeholder={`${type === 'problems' ? 'Problema' : 'Solução'} ${index + 1}`}
          value={input}
          onChangeText={(text) => updateInput(type, index, text)}
          className="flex-1 border border-gray-300 p-2 rounded-lg mr-2"
        />
        {inputs.length > 1 && (
          <TouchableOpacity
            onPress={() => removeInput(type, index)}
            className="p-2"
          >
            <Icon name="delete" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>
    ))}
    {inputs.length < maxInputs && (
      <TouchableOpacity
        onPress={() => addInput(type)}
        className={`p-2 rounded-lg items-center mt-2 ${
          type === 'problems' ? 'bg-blue-500' : 'bg-green-500'
        }`}
      >
        <Text className="text-white">Adicionar {type === 'problems' ? 'Outro Problema' : 'Outra Solução'}</Text>
      </TouchableOpacity>
    )}
  </>
);

const DetetiveDeProblemas = () => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [currentStage, setCurrentStage] = useState('problems');
  const [problems, setProblems] = useState(['']);
  const [solutions, setSolutions] = useState(['']);
  const [problemsWithResponses, setProblemsWithResponses] = useState([]);
  const [solutionsWithResponses, setSolutionsWithResponses] = useState([]);

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
    const list = type === 'problems' ? [...problems] : [...solutions];
    list[index] = value;
    type === 'problems' ? setProblems(list) : setSolutions(list);
  };

  const removeInput = (type, index) => {
    const list = type === 'problems' ? [...problems] : [...solutions];
    if (list.length > 1) {
      const updatedList = list.filter((_, i) => i !== index);
      type === 'problems' ? setProblems(updatedList) : setSolutions(updatedList);
    }
  };

  const generateFictitiousResponse = (input) => {
    return `Resposta fictícia para "${input}" gerada automaticamente.`;
  };

  const proceedToNextStage = () => {
    if (currentStage === 'problems') {
      const validProblems = problems.filter((p) => p.trim() !== '');
      if (validProblems.length === 0) {
        showAlert('Erro', 'Adicione pelo menos um problema válido.');
        return;
      }

      const problemsWithGeneratedResponses = validProblems.map((problem) => ({
        problem,
        fictitiousResponse: generateFictitiousResponse(problem),
      }));

      setProblemsWithResponses(problemsWithGeneratedResponses);
      setCurrentStage('solutions');
    } else if (currentStage === 'solutions') {
      const validSolutions = solutions.filter((s) => s.trim() !== '');
      if (validSolutions.length === 0) {
        showAlert('Erro', 'Adicione pelo menos uma solução válida.');
        return;
      }

      const solutionsWithGeneratedResponses = validSolutions.map((solution) => ({
        solution,
        fictitiousResponse: generateFictitiousResponse(solution),
      }));

      setSolutionsWithResponses(solutionsWithGeneratedResponses);
      setCurrentStage('results');
    }
  };

  const navigateRound = (direction) => {
    if (direction === 'next' && currentRoundIndex < quizData.rounds.length - 1) {
      setCurrentRoundIndex(currentRoundIndex + 1);
      resetGameState();
    } else if (direction === 'prev' && currentRoundIndex > 0) {
      setCurrentRoundIndex(currentRoundIndex - 1);
      resetGameState();
    }
  };

  const resetGameState = () => {
    setCurrentStage('problems');
    setProblems(['']);
    setSolutions(['']);
    setProblemsWithResponses([]);
    setSolutionsWithResponses([]);
  };

  if (currentStage === 'results') {
    return (
      <DetetiveDeProblemasResultsScreen
        problemsWithResponses={problemsWithResponses}
        solutionsWithResponses={solutionsWithResponses}
        totalRounds={quizData.rounds.length}
        currentRound={currentRound}
        onNextRound={() => navigateRound('next')}
        onRestart={() => {
          setCurrentRoundIndex(0);
          resetGameState();
        }}
      />
    );
  }

  return (
    <SafeAreaView className="bg-gray-50 flex-1 items-center">
      <QuizHeader
        currentRoundIndex={currentRoundIndex}
        totalRounds={quizData.rounds.length}
        navigateRound={navigateRound}
      />
      <ScrollView style={{padding: 4}} showsVerticalScrollIndicator={false}>
        <Text className="text-center font-bold mb-2 text-xl">{currentRound.title}</Text>
        <Image
          source={{ uri: currentRound.image }}
          className="w-full h-48 rounded-lg mb-4"
          resizeMode="cover"
        />
        {currentStage === 'solutions' && (
          <View className="bg-gray-100 p-4 rounded-lg mb-4">
            <Text className="text-lg font-bold mb-2">Problemas Identificados:</Text>
            {problemsWithResponses.map((item, index) => (
              <View key={index} className="mb-2 p-3 bg-white rounded-lg shadow">
                <Text className="font-semibold">Problema {index + 1}:</Text>
                <Text className="mb-2">{item.problem}</Text>
                <Text className="text-gray-500 italic">
                  Resposta fictícia: {item.fictitiousResponse}
                </Text>
              </View>
            ))}
          </View>
        )}
        <View className="bg-white p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold mb-2">
            {currentStage === 'problems'
              ? currentRound.problemStage.instruction
              : currentRound.solutionStage.instruction}
          </Text>
          <DynamicInputList
            inputs={currentStage === 'problems' ? problems : solutions}
            type={currentStage}
            addInput={addInput}
            updateInput={updateInput}
            removeInput={removeInput}
            maxInputs={3}
          />
        </View>
        <TouchableOpacity
          onPress={proceedToNextStage}
          className="bg-blue-600 p-3 rounded-lg items-center my-4"
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
