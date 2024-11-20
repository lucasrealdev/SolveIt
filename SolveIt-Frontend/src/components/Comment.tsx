import CustomIcons from '@/assets/icons/CustomIcons';
import images from '@/constants/images';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import ButtonScale from './ButtonScale';
import { getCommentById } from '@/lib/appwriteConfig';
import { useGlobalContext } from '@/context/GlobalProvider'; // Para acessar o usuário logado

const Comment = ({ id, onDelete }) => {
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false); // Controla o estado de exclusão
    const [commentData, setCommentData] = useState(null);
    const { user } = useGlobalContext(); // Acesso ao usuário logado

    useEffect(() => {
        const fetchCommentData = async () => {
            try {
                setLoading(true);
                const fetchedComment = await getCommentById(id); // Função para pegar os dados do comentário
                setCommentData(fetchedComment);
            } catch (error) {
                console.error("Erro ao carregar os dados do comentário:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCommentData();
        }
    }, [id]);

    if (loading) {
        return null; // Enquanto carrega os dados
    }

    if (!commentData) return <Text>Nenhum comentário encontrado.</Text>;

    const { content, creator, createdAt } = commentData;

    const handleDelete = async () => {
        setDeleting(true); // Inicia o estado de exclusão
        try {
            await onDelete(id); // Chama a função de exclusão recebida do pai
        } catch (error) {
            console.error("Erro ao excluir comentário:", error);
        } finally {
            setDeleting(false); // Finaliza o estado de exclusão
        }
    };

    // Verifica se o usuário logado é o mesmo que criou o comentário
    const isUserCreator = user?.$id === creator?.$id;

    return (
        <View className='gap-2 justify-between items-start flex-row'>
            <Image
                source={creator?.avatar ? { uri: creator.avatar } : images.person}
                className='w-10 h-10 rounded-full'
            />
            <View className='flex-col gap-1 flex-1'>
                <Text className='text-xs text-textStandardDark'>{content}</Text>
                <Text className='text-xs text-textStandard'>{createdAt}</Text>
            </View>
            <View className='items-center justify-center'>
                {isUserCreator ? ( // Exibe a lixeira se for o criador
                    <ButtonScale scale={1.09} onPress={handleDelete}>
                        {deleting ? (
                            // Exibe o ActivityIndicator durante o processo de exclusão
                            <ActivityIndicator size={20} color="#94A3B8" />
                        ) : (
                            <CustomIcons
                                name="lixeira" // ícone de lixeira
                                size={20}
                                color="#FF0000" // Cor vermelha
                            />
                        )}
                    </ButtonScale>
                ) : ( // Exibe o coração se não for o criador
                    <ButtonScale scale={1.09}>
                        <CustomIcons
                            name="coracao" // ícone de coração
                            size={20}
                            color="#94A3B8" // Cor cinza
                        />
                    </ButtonScale>
                )}
            </View>
        </View>
    );
};

export default Comment;
