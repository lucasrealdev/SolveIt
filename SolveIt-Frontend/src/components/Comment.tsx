import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import ButtonScale from './ButtonScale';
import CustomIcons from '@/assets/icons/CustomIcons';
import images from '@/constants/images';
import { getCommentById, getLikeCountComment, toggleLikeComment, userLikedComment } from '@/lib/appwriteConfig';
import { useGlobalContext } from '@/context/GlobalProvider';

const Comment = ({ id, onDelete }) => {
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [commentData, setCommentData] = useState(null);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [likeLoading, setLikeLoading] = useState(false); // Estado para controlar o carregamento do like
    const { user } = useGlobalContext();

    const [containerHeight, setContainerHeight] = useState(0); // Estado para armazenar a altura do container
    const containerRef = useRef(null); // Ref para o container

    useEffect(() => {
        const fetchCommentData = async () => {
            try {
                setLoading(true);
                const fetchedComment = await getCommentById(id);
                setCommentData(fetchedComment);

                // Verificar se o usuário curtiu o comentário e obter a contagem de likes
                const userLiked = await userLikedComment(user?.$id, id);
                setLiked(userLiked);

                const likesCount = await getLikeCountComment(id);
                setLikeCount(likesCount);
            } catch (error) {
                console.error("Erro ao carregar os dados do comentário:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id && user?.$id) fetchCommentData();
    }, [id, user?.$id]);

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

    const handleLike = async () => {
        setLikeLoading(true); // Começa o carregamento do like
        try {
            const likedStatus = await toggleLikeComment(user?.$id, id);
            setLiked(likedStatus); // Atualiza o estado de like
            const updatedLikeCount = await getLikeCountComment(id); // Atualiza a contagem de likes
            setLikeCount(updatedLikeCount);
        } catch (error) {
            console.error("Erro ao alternar like no comentário:", error);
        } finally {
            setLikeLoading(false); // Termina o carregamento do like
        }
    };

    const onLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        setContainerHeight(height); // Armazena a altura do container
    };

    if (loading) return null;

    if (!commentData) return <Text className="text-red-500">Comentário não encontrado.</Text>;

    const { content, creator, $createdAt } = commentData;

    const isUserCreator = user?.$id === creator?.$id;

    const timeAgo = () => {
        const now = new Date();
        const createdAt = new Date($createdAt);
        
        if (isNaN(createdAt.getTime())) {
            console.error('Data de criação inválida:', $createdAt);
            return;
        }
    
        const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInMonths = Math.floor(diffInDays / 30);
        const diffInYears = Math.floor(diffInMonths / 12);
    
        if (diffInYears > 0) return `há ${diffInYears} ano${diffInYears > 1 ? 's' : ''}`;
        if (diffInMonths > 0) return `há ${diffInMonths} mês${diffInMonths > 1 ? 'es' : ''}`;
        if (diffInDays > 0) return `há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
        if (diffInHours > 0) return `há ${diffInHours}h`;
        if (diffInMinutes > 0) return `há ${diffInMinutes}m`;
        return `há menos de 1 minuto`;
    };       

    const formattedDate = timeAgo();

    return (
        <View className="flex-row items-start gap-2" aria-label='containerComment' onLayout={onLayout}>
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
            <View className="flex justify-center h-full items-center" style={{ maxHeight: containerHeight }}>
                {isUserCreator ? (
                    <ButtonScale scale={1.09} onPress={handleDelete} className="w-fit mr-[6px]">
                        {deleting ? (
                            <ActivityIndicator size={20} color="#FF0000" />
                        ) : (
                            <CustomIcons name="lixeira" size={20} color="#FF0000" />
                        )}
                    </ButtonScale>
                ) : (
                    <ButtonScale scale={1.09} onPress={handleLike} className="w-fit flex-row items-center justify-center">
                        {likeLoading ? (
                            <ActivityIndicator size={20} color="#94A3B8" />
                        ) : (
                            <>
                                <CustomIcons name="coracao" size={20} color={liked ? "#FF0000" : "#94A3B8"} />
                                <Text className='text-xs'>{likeCount}</Text>
                            </>
                        )}
                    </ButtonScale>
                )}
            </View>
        </View>
    );    
};

export default Comment;