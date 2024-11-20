import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import ButtonScale from './ButtonScale';
import CustomIcons from '@/assets/icons/CustomIcons';
import images from '@/constants/images';
import { getCommentById } from '@/lib/appwriteConfig';
import { useGlobalContext } from '@/context/GlobalProvider';

const Comment = ({ id, onDelete }) => {
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [commentData, setCommentData] = useState(null);
    const { user } = useGlobalContext();

    useEffect(() => {
        const fetchCommentData = async () => {
            try {
                setLoading(true);
                const fetchedComment = await getCommentById(id);
                setCommentData(fetchedComment);
            } catch (error) {
                console.error("Erro ao carregar os dados do comentário:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCommentData();
    }, [id]);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await onDelete(id);
        } catch (error) {
            console.error("Erro ao excluir comentário:", error);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return;

    if (!commentData) return <Text className="text-red-500">Comentário não encontrado.</Text>;

    const { content, creator, $createdAt } = commentData;

    const isUserCreator = user?.$id === creator?.$id;

    const timeAgo = () => {
        const now = new Date(); // Obtém a data atual
        const createdAt = new Date($createdAt); // Converte a string de $createdAt para um objeto Date
        
        if (isNaN(createdAt.getTime())) {
            console.error('Data de criação inválida:', $createdAt);
            return;
        }
    
        const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000); // Converte ambos para milissegundos antes da subtração
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInMonths = Math.floor(diffInDays / 30);
        const diffInYears = Math.floor(diffInMonths / 12);
    
        if (diffInYears > 0) {
            return `há ${diffInYears} ano${diffInYears > 1 ? 's' : ''}`;
        } else if (diffInMonths > 0) {
            return `há ${diffInMonths} mês${diffInMonths > 1 ? 'es' : ''}`;
        } else if (diffInDays > 0) {
            return `há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
        } else if (diffInHours > 0) {
            return `há ${diffInHours}h`;
        } else if (diffInMinutes > 0) {
            return `há ${diffInMinutes}m`;
        } else {
            return `há menos de 1 minuto`;
        }
    };      

    // Usando a função timeAgo para formatar a data
    const formattedDate = timeAgo();

    return (
        <View className="flex-row items-start gap-2">
            <Image
                source={creator?.avatar ? { uri: creator.avatar } : images.person}
                className="w-10 h-10 rounded-full"
                alt={`Avatar de ${creator?.username || 'usuário desconhecido'}`}
            />
            <View className="flex-1">
                <Text className="text-textStandardDark text-sm">{creator?.username}</Text>
                <Text className="text-textStandardDark text-sm">{content}</Text>
                <Text className="text-textSecondary text-xs">{formattedDate}</Text>
            </View>
            <View className="flex justify-center flex-1 max-w-5">
                {isUserCreator ? (
                    <ButtonScale scale={1.09} onPress={handleDelete} className="w-fit">
                        {deleting ? (
                            <ActivityIndicator size={20} color="#FF0000" />
                        ) : (
                            <CustomIcons name="lixeira" size={20} color="#FF0000" />
                        )}
                    </ButtonScale>
                ) : (
                    <ButtonScale scale={1.09} className="w-fit">
                        <CustomIcons name="coracao" size={20} color="#94A3B8" />
                    </ButtonScale>
                )}
            </View>
        </View>
    );    
};

export default Comment;
