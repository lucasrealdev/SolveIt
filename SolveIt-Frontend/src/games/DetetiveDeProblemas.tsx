import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import quizData from '@/assets/games/detetiveDeProblemas.json'; // Ajuste conforme necessário
import { useAlert } from '@/context/AlertContext';
import DetetiveDeProblemasResultsScreen from './DetetiveDeProblemasResultsScreen';
import ChatbotService from '@/lib/chatBotService';

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
        className={`p-2 rounded-lg items-center mt-2 ${type === 'problems' ? 'bg-blue-500' : 'bg-green-500'
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
  const [isLoading, setIsLoading] = useState(false);

  const [problemsWithResponsesFinal, setProblemsWithResponsesFinal] = useState([]);

  const currentRound = quizData.rounds[currentRoundIndex];
  const { showAlert } = useAlert();
  const { sendMessageToChatbot } = ChatbotService();

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

  const generateProblemsResponse = async (input) => {
    const response = await sendMessageToChatbot(`
      A partir de agora, você irá receber uma descrição de uma imagem e um possível problema que o jogador pode ter encontrado no cenário dessa imagem. Sua tarefa é avaliar esse problema de forma objetiva e construtiva. Avalie a criatividade do problema identificado. Você deve analisar se o problema é inovador, interessante e se foge do óbvio. A criatividade deve ser avaliada em uma escala de 0 a 10 (não seja muito criterioso). Avalie a coerência do problema com a descrição da imagem. O problema faz sentido com o que é descrito na imagem? Está bem fundamentado na descrição visual? A coerência também deve ser avaliada em uma escala de 0 a 10. Lembre se também que o usuário não deve dar uma solução e sim um problema então avalie sobre o problema.
      Formato da resposta: Sua resposta deve estar no formato JSON para facilitar a extração dos dados. Use o seguinte modelo:
      {
        "NotaCriatividade": <0 a 10>,
        "NotaCoerencia": <0 a 10>,
        "ComentarioFinal": "<Comentário positivo e construtivo, ou explicação educada sobre possíveis erros no problema apresentado, pode usar emojis para uma linguagem mais interativa e seja objetivo>"
      }
  
      Se o problema contiver textos obscenos ou inadequados, a IA deve responder no campo Comentário Final da seguinte forma: "Por favor, reformule seu problema para que ele seja mais respeitoso e adequado ao contexto do jogo. A solução precisa estar alinhada com o tema proposto." E dar 0 na nota de Criatividade e Coerência
      Agora, você receberá a descrição de uma imagem e um possível problema. Avalie com base nas orientações acima.
      Descricao da imagem: ${currentRound.description}
      problema: ${input}
    `);

    // Remover caracteres de formatação extra (ex.: "```json")
    const cleanedResponse = response.replace(/```json|```/g, '').trim();

    try {
      // Tenta fazer o parse do JSON
      const jsonResponse = JSON.parse(cleanedResponse);

      setProblemsWithResponsesFinal((prevResponses) => [
        ...prevResponses, // Mantém as respostas existentes
        {
          problema: input, // Problema atual que está sendo avaliado
          NotaCriatividade: jsonResponse.NotaCriatividade,
          NotaCoerencia: jsonResponse.NotaCoerencia,
          ComentarioFinal: jsonResponse.ComentarioFinal,
        },
      ]);

      // Construção do objeto simplificado
      return `
Nota de Criatividade: ${jsonResponse.NotaCriatividade}
Nota de Coerência: ${jsonResponse.NotaCoerencia}
Comentário Final: ${jsonResponse.ComentarioFinal}
      `;
    } catch (error) {
      console.error('Erro ao processar o JSON da resposta:', error);
      throw new Error('A resposta não está no formato esperado.');
    }
  };

  const generateSolutionsResponse = async (input) => {
    const response = await sendMessageToChatbot(`
     A partir de agora, você irá receber uma descrição de uma imagem e um possível problema que o jogador pode ter encontrado no cenário dessa imagem. Sua tarefa é avaliar esse problema de forma objetiva e construtiva. Avalie a criatividade do problema identificado. Você deve analisar se o problema é inovador, interessante e se foge do óbvio. A criatividade deve ser avaliada em uma escala de 0 a 10. Avalie a coerência do problema com a descrição da imagem. O problema faz sentido com o que é descrito na imagem? Está bem fundamentado na descrição visual? A coerência também deve ser avaliada em uma escala de 0 a 10. Lembre se também que o usuário não deve dar uma solução e sim um problema então avalie sobre o problema.
     Formato da resposta: Sua resposta deve estar no formato JSON para facilitar a extração dos dados. Use o seguinte modelo:
     {
       "NotaCriatividade": <0 a 10>,
       "NotaCoerencia": <0 a 10>,
       "ComentarioFinal": "<Comentário positivo e construtivo, ou explicação educada sobre possíveis erros no problema apresentado, pode usar emojis para uma linguagem mais interativa e seja objetivo>"
     }

     Se o problema contiver textos obscenos ou inadequados, a IA deve responder no campo Comentário Final da seguinte forma: "Por favor, reformule seu problema para que ele seja mais respeitoso e adequado ao contexto do jogo. A solução precisa estar alinhada com o tema proposto." E dar 0 na nota de Criatividade e Coerência
     Agora, você receberá a descrição de uma imagem e um possível problema. Avalie com base nas orientações acima.
     Descricao da imagem: ${currentRound.description}
     problema: ${input}
   `);

    return "response"; // Retorna a resposta diretamente
  };

  const proceedToNextStage = () => {
    setIsLoading(true);
    if (currentStage === 'problems') {
      const validProblems = problems.filter((p) => p.trim() !== '');
      if (validProblems.length === 0) {
        showAlert('Erro', 'Adicione pelo menos um problema válido.');
        setIsLoading(false);
        return;
      }

      const handleGenerateResponses = async () => {
        // Resolve todas as Promises geradas por generateFictitiousResponse
        const problemsWithGeneratedResponses = await Promise.all(
          validProblems.map(async (problem) => ({
            problem,
            fictitiousResponse: await generateProblemsResponse(problem),
          }))
        );

        // Atualiza o estado com os problemas e respostas resolvidas
        setProblemsWithResponses(problemsWithGeneratedResponses);
        setCurrentStage('solutions');
        setIsLoading(false);
      };

      // Chame handleGenerateResponses em um momento apropriado (por exemplo, ao clicar em um botão ou ao montar o componente)
      handleGenerateResponses();
    } else if (currentStage === 'solutions') {
      const validSolutions = solutions.filter((s) => s.trim() !== '');
      if (validSolutions.length === 0) {
        showAlert('Erro', 'Adicione pelo menos uma solução válida.');
        return;
      }

      const solutionsWithGeneratedResponses = validSolutions.map((solution) => ({
        solution,
        fictitiousResponse: generateSolutionsResponse(solution),
      }));
      setSolutionsWithResponses(solutionsWithGeneratedResponses);
      setCurrentStage('results');
      setIsLoading(false);
    }
  };

  const navigateRound = (direction) => {
    if (direction === 'next' && currentRoundIndex < quizData.rounds.length - 1) {
      setCurrentRoundIndex(currentRoundIndex + 1);
      resetGameState();
    } else if (direction === 'prev' && currentRoundIndex > 0) {
      setCurrentRoundIndex(currentRoundIndex - 1);
      resetGameState();
    } else {
      showAlert("Aviso", "O jogo acabou, aguarde mais fases");
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
        problemsWithResponses={problemsWithResponsesFinal}
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
      <ScrollView style={{ padding: 4, width: "100%", maxWidth: 700 }} showsVerticalScrollIndicator={false}>
        <Text className="text-center font-bold mb-2 text-xl">{currentRound.title}</Text>
        <View className='w-full items-center justify-center bg-gray-200 rounded-lg mb-4'>
          <Image
            source={{ uri: currentRound.image }}
            className="w-[300px] rounded-lg"
            resizeMode="cover"
            style={{ aspectRatio: 1 }}
          />
        </View>
        {currentStage === 'solutions' && (
          <View className="bg-gray-100 p-4 rounded-lg mb-4">
            <Text className="text-lg font-bold mb-2">Problemas Identificados:</Text>
            {problemsWithResponses.map((item, index) => (
              <View key={index} className="mb-2 p-3 bg-white rounded-lg shadow">
                <Text className="font-semibold">Problema {index + 1}:</Text>
                <Text className="mb-2">{item.problem}</Text>
                <Text className="text-gray-500 italic">
                  {item.fictitiousResponse}
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
          {currentStage === 'problems' ? (
            <DynamicInputList
              inputs={problems}
              type={currentStage}
              addInput={(type) => {
                addInput(type);
              }}
              updateInput={(type, index, text) => {
                updateInput(type, index, text);
                if (type === 'problems') {
                  const filledProblems = problems.map((p, i) =>
                    i === index ? text : p
                  ).filter((p) => p.trim() !== '');
                  setSolutions(filledProblems.map((_, i) => solutions[i] || ''));
                }
              }}
              removeInput={(type, index) => {
                removeInput(type, index);
                if (type === 'problems') {
                  const filledProblems = problems
                    .filter((_, i) => i !== index)
                    .filter((p) => p.trim() !== '');
                  setSolutions(filledProblems.map((_, i) => solutions[i] || ''));
                }
              }}
              maxInputs={3}
            />
          ) : (
            solutions.map((input, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <TextInput
                  placeholder={`Solução ${index + 1}`}
                  value={input}
                  onChangeText={(text) => updateInput('solutions', index, text)}
                  className="flex-1 border border-gray-300 p-2 rounded-lg mr-2"
                />
              </View>
            ))
          )}
        </View>
        <TouchableOpacity
          onPress={proceedToNextStage}
          className="bg-blue-600 p-3 rounded-lg items-center my-4"
        >
          <Text className="text-white font-semibold">
            {
              isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                currentStage === 'problems' ? 'Próxima Etapa' : 'Enviar Respostas'
              )
            }
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetetiveDeProblemas;
