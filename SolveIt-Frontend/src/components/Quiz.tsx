import CustomIcons from '@/assets/icons/CustomIcons';
import images from '@/constants/images';
import { useGlobalContext } from '@/context/GlobalProvider';
import { checkUserVote, fetchQuizById, getVotesCount, updateVote } from '@/lib/appwriteConfig';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, Pressable } from 'react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Quiz = ({ quizId }) => {
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState(null);
    const [userVoted, setUserVoted] = useState(false);
    const [isLoadingVote, setIsLoadingVote] = useState(false);

    const { user, isLogged } = useGlobalContext();

    const [totalVotes, setTotalVotes] = useState(0);
    const [votesCount, setVotesCount] = useState({}); // Para armazenar a contagem de votos por opção

    useEffect(() => {
        const fetchQuiz = async () => {
            if (!quizId || !user?.$id) return; // Garante que quizId e userId estão disponíveis antes de prosseguir

            try {
                setLoading(true);
                const quizData = await fetchQuizById(quizId); // Função backend para buscar quiz por ID.

                // Verificar se o usuário já votou
                const userHasVoted = await checkUserVote(quizId, user?.$id);
                if (userHasVoted != null) {
                    setSelectedOption(userHasVoted.voteIndex)
                    setUserVoted(true);
                }

                // Atualiza os dados do quiz
                setQuiz({ ...quizData });

                // Obter a contagem de votos para as opções
                const votesCount = await getVotesCount(quizId);
                setVotesCount(votesCount);

                // Calcula o total de votos
                const totalVotes = Object.values(votesCount).reduce((acc, count) => acc + count, 0);
                setTotalVotes(totalVotes);
            } catch (error) {
                console.error("Erro ao carregar o quiz:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId, user?.$id]);

    const handleVote = async (optionIndex) => {
        try {
            setIsLoadingVote(true);
    
            // Se o usuário não votou, adicione 1 à opção escolhida e incremente o total de votos
            if (!userVoted) {
                const updatedVotesCount = { ...votesCount };
                updatedVotesCount[optionIndex] = (updatedVotesCount[optionIndex] || 0) + 1;
                setVotesCount(updatedVotesCount);
                
                const newTotalVotes = totalVotes + 1;
                setTotalVotes(newTotalVotes);
            } else {
                // Se o usuário já votou, remova o voto da opção anterior e adicione à nova
                const updatedVotesCount = { ...votesCount };
                updatedVotesCount[selectedOption] = updatedVotesCount[selectedOption] - 1;
                updatedVotesCount[optionIndex] = (updatedVotesCount[optionIndex] || 0) + 1;
                setVotesCount(updatedVotesCount);
            }
    
            // Atualiza a opção selecionada
            setSelectedOption(optionIndex);
    
            // Marca o usuário como tendo votado
            setUserVoted(true);
    
            // Chama o backend para registrar o voto
            await updateVote(quizId, user?.$id, optionIndex);
    
        } catch (error) {
            console.error("Erro ao registrar o voto:", error.message);
        } finally {
            setIsLoadingVote(false);
        }
    };    

    // Se o usuário não estiver logado, exibe mensagem ou redireciona.
    if (!isLogged) {
        return null;
    }

    if (loading || !quiz) {
        return <ActivityIndicator size="small" color="#8AA2BE" />;
    }

    const formattedDate = format(new Date(quiz.$createdAt), 'dd MMMM yyyy', { locale: ptBR });

    return (
        <View className="flex-1 bg-white rounded-3xl border border-[#E2E8F0]">
            <View className="items-start flex-row gap-3 border-b border-[#E2E8F0] p-5">
                <Image source={images.iconVerified} className="w-[45px] h-[45px]" />
                <View className='flex-col gap-0'>
                    <Text className="text-base font-bold text-textStandardDark">SolveIt</Text>
                    <Text className="text-base text-textSecondary">Pergunta do Sistema</Text>
                </View>
            </View>

            <View className='px-5 py-4 gap-4'>
                <Text className="text-base text-textStandardDark">
                    {quiz.title}
                </Text>

                <View className="gap-4 p-4 rounded-2xl border border-[#E2E8F0] items-start">
                    <View className='w-full gap-2'>
                        {quiz?.options.map((option, index) => {
                            // Verificar o número de votos para cada opção
                            const votesForOption = votesCount[index] || 0;
                            const percentage = totalVotes > 0 ? (votesForOption / totalVotes) * 100 : 0;
                            const isSelected = selectedOption == index;

                            return (
                                <Pressable
                                    key={index}
                                    className={`flex-row items-center py-3 px-4 rounded-lg justify-between ${isSelected ? 'bg-[#E0E7FF]' : 'bg-[#F1F5F9]'} ${isSelected ? 'border-[#C7D2FE]' : ''}`}
                                    onPress={() => handleVote(index)}
                                    disabled={isLoadingVote}
                                >
                                    <View className='flex-row items-center'>
                                        <Text className='font-bold text-textStandardDark mr-2'>{percentage.toFixed(0)}%</Text>
                                        <Text className="flex-1 text-base mr-2">{option.text}</Text>
                                        {isSelected && <CustomIcons name="correct" size={20} color="#01B198" />}
                                    </View>
                                    <Text className="text-base font-bold text-textSecondary">{votesForOption}</Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    <Text className="text-sm text-gray-500 text-center mt-4">
                        {formattedDate} — {totalVotes} votos no total
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default Quiz;
