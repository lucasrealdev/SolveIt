import CustomIcons from '@/assets/icons/CustomIcons';
import images from '@/constants/images';
import { useGlobalContext } from '@/context/GlobalProvider';
import { updateVote } from '@/lib/appwriteConfig';
import React, { useState } from 'react';
import { View, Text, Image, ActivityIndicator, Pressable } from 'react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface QuizProps {
    quiz: any; // Objeto do post
}

const Quiz: React.FC<QuizProps> = ({
    quiz,
}) => {
    const [isLoadingVote, setIsLoadingVote] = useState(false);

    const [selectedOptionLocal, setSelectedOptionLocal] = useState(quiz.userVoted);
    const [userVotedLocal, setUserVotedLocal] = useState(quiz.userVoted != null);
    const [totalVotesLocal, setTotalVotesLocal] = useState(quiz.totalVotes);
    const [votesCountLocal, setVotesCountLocal] = useState(quiz.voteCount); // Para armazenar a contagem de votos por opção

    const { user, isLogged } = useGlobalContext();
    const handleVote = async (optionIndex) => {
        try {
            setIsLoadingVote(true);

            // Se o usuário não votou, adicione 1 à opção escolhida e incremente o total de votos
            if (!userVotedLocal) {
                const updatedVotesCount = { ...votesCountLocal };
                updatedVotesCount[optionIndex] = (updatedVotesCount[optionIndex] || 0) + 1;
                setVotesCountLocal(updatedVotesCount);

                const newTotalVotes = totalVotesLocal + 1;
                setTotalVotesLocal(newTotalVotes);
            } else {
                // Se o usuário já votou, remova o voto da opção anterior e adicione à nova
                const updatedVotesCount = { ...votesCountLocal };
                updatedVotesCount[selectedOptionLocal] = updatedVotesCount[selectedOptionLocal] - 1;
                updatedVotesCount[optionIndex] = (updatedVotesCount[optionIndex] || 0) + 1;
                setVotesCountLocal(updatedVotesCount);
            }

            // Atualiza a opção selecionada
            setSelectedOptionLocal(optionIndex);

            // Marca o usuário como tendo votado
            setUserVotedLocal(true);

            // Chama o backend para registrar o voto
            await updateVote(quiz?.$id, user?.$id, optionIndex);

        } catch (error) {
            console.error("Erro ao registrar o voto:", error.message);
        } finally {
            setIsLoadingVote(false);
        }
    };

    if (!isLogged) {
        return null;
    }

    if (!quiz) {
        return null;
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
                            const votesForOption = votesCountLocal[index] || 0;
                            const percentage = totalVotesLocal > 0 ? (votesForOption / totalVotesLocal) * 100 : 0;
                            const isSelected = selectedOptionLocal == index;

                            return (
                                <Pressable
                                    key={index}
                                    className={`flex-row items-center py-3 px-4 w-full rounded-lg justify-between ${isSelected ? 'bg-[#E0E7FF]' : 'bg-[#F1F5F9]'} ${isSelected ? 'border-[#C7D2FE]' : ''}`}
                                    onPress={() => handleVote(index)}
                                    disabled={isLoadingVote}
                                >
                                    <View className='flex-row items-center flex-1 mr-2'>
                                        <Text className='font-bold text-textStandardDark mr-2'>{percentage.toFixed(0)}%</Text>
                                        <Text
                                            className="text-base flex-1 flex-wrap"
                                            numberOfLines={10}
                                        >
                                            {option.text}
                                        </Text>
                                        {isSelected && <CustomIcons name="correct" size={20} color="#01B198" />}
                                    </View>
                                    <Text className="text-base font-bold text-textSecondary">{votesForOption}</Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    <Text className="text-sm text-gray-500 text-center mt-4">
                        {formattedDate} — {totalVotesLocal} votos no total
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default Quiz;
