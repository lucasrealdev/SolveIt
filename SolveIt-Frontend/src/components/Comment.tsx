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

    const { content, creator, createdAt } = commentData;

    const isUserCreator = user?.$id === creator?.$id;

    return (
        <View className="flex-row justify-between items-start gap-2">
            <Image
                source={creator?.avatar ? { uri: creator.avatar } : images.person}
                className="w-10 h-10 rounded-full"
                alt={`Avatar de ${creator?.username || 'usuário desconhecido'}`}
            />
            <View className="flex-1">
                <Text className="text-textStandardDark text-sm">{content}</Text>
                <Text className="text-textSecondary text-xs">{createdAt}</Text>
            </View>
            <View>
                {isUserCreator ? (
                    <ButtonScale scale={1.09} onPress={handleDelete}>
                        {deleting ? (
                            <ActivityIndicator size={20} color="#FF0000" />
                        ) : (
                            <CustomIcons name="lixeira" size={20} color="#FF0000" />
                        )}
                    </ButtonScale>
                ) : (
                    <ButtonScale scale={1.09}>
                        <CustomIcons name="coracao" size={20} color="#94A3B8" />
                    </ButtonScale>
                )}
            </View>
        </View>
    );
};

export default Comment;
