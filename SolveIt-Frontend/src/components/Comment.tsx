import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import ButtonScale from './ButtonScale';
import CustomIcons from '@/assets/icons/CustomIcons';
import images from '@/constants/images';
import { getLikeCountComment, toggleLikeComment, userLikedComment } from '@/lib/appwriteConfig';
import { useGlobalContext } from '@/context/GlobalProvider';
import { usePathname, useRouter } from 'expo-router';
import { Image as ExpoImage } from 'expo-image';

interface CommentProps {
    propCommentData: any; // Objeto do post
    onDelete?: (id: string) => Promise<void>; // Função de deletar comentário
}

const Comment: React.FC<CommentProps> = ({
    propCommentData,
    onDelete,
}) => {
    const [containerHeight, setContainerHeight] = useState(0); // Estado para armazenar a altura do container

    const [deleting, setDeleting] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false); // Estado para controlar o carregamento do like

    const [commentDataLocal, setCommentDataLocal] = useState(propCommentData);
    const [likedLocal, setLikedLocal] = useState(propCommentData.isLiked);
    const [likeCountLocal, setLikeCountLocal] = useState(propCommentData.likeCount);

    const { user } = useGlobalContext();

    const router = useRouter();
    const pathname = usePathname();

    const blurhash =
        '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

    const handleDelete = async () => {
        if (!user) return; // Impede que o usuário exclua o comentário se não estiver logado
        setDeleting(true);
        try {
            if (onDelete) {
                await onDelete(commentDataLocal?.$id); // Passando o ID do comentário para a função de deleção
            }
        } catch (error) {
            console.error("Erro ao excluir comentário:", error);
        } finally {
            setDeleting(false);
        }
    };

    const handleLike = async () => {
        if (!user) return; // Impede que o usuário curta o comentário se não estiver logado
        setLikeLoading(true); // Começa o carregamento do like
        try {
            const likedStatus = await toggleLikeComment(user?.$id, commentDataLocal?.$id);
            setLikedLocal(likedStatus); // Atualiza o estado de like
            const updatedLikeCount = await getLikeCountComment(commentDataLocal?.$id); // Atualiza a contagem de likes
            setLikeCountLocal(updatedLikeCount);
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

    if (!commentDataLocal) return <Text className="text-red-500">Comentário não encontrado.</Text>;

    const { content, creator, $createdAt } = commentDataLocal;

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

    const navigateTo = (route: string) => {
        router[route !== pathname ? 'push' : 'replace'](route);
    };

    const handleNavigateToProfile = (creatorId) => {
        navigateTo(`/profile/${creatorId}`);
    };

    return (
        <View className="flex-row items-start gap-2" aria-label='containerComment' onLayout={onLayout}>
            <ButtonScale scale={1.03} onPress={() => handleNavigateToProfile(creator.$id)}>
                <ExpoImage
                    source={creator?.avatar ? { uri: creator.avatar } : images.person}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 9999
                    }}
                    alt={`Avatar de ${creator?.username || 'usuário desconhecido'}`}
                    contentFit="cover"
                    placeholder={{ blurhash }}
                    cachePolicy="memory-disk"
                />
            </ButtonScale>
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
                                <CustomIcons name="coracao" size={20} color={likedLocal ? "#FF0000" : "#94A3B8"} />
                                <Text className='text-xs'>{likeCountLocal}</Text>
                            </>
                        )}
                    </ButtonScale>
                )}
            </View>
        </View>
    );
};

export default Comment;