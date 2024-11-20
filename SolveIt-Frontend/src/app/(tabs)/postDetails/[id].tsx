import { ScrollView, View } from "react-native";
import MenuRight from "@/components/MenuRight";
import SearchHeader from "@/components/SearchHeader";
import { useEffect, useState } from "react";
import { getPostById, incrementShares } from "@/lib/appwriteConfig";
import { useLocalSearchParams } from "expo-router";
import PostSkeleton from "@/components/PostSkeleton";
import { useGlobalContext } from "@/context/GlobalProvider";
import Post from "@/components/Post";

export default function PostDetails() {
    const [post, setPost] = useState(null); // Armazena o post específico
    const [loading, setLoading] = useState(false); // Controla o estado de carregamento
    const { id, shared } = useLocalSearchParams();
    const { user } = useGlobalContext();

    useEffect(() => { 
        const fetchPost = async () => {
            setLoading(true);

            try {
                const fetchedPost = await getPostById(id);
                setPost(fetchedPost);

                // Incrementar 'shares' somente se o parâmetro 'shared' existir e o post for carregado
                if (shared && fetchedPost?.$id) {
                    await incrementShares(fetchedPost.$id);
                }
            } catch (error) {
                console.error("Erro ao buscar post ou incrementar compartilhamentos:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPost();
        }
    }, [id, shared]); // Removido 'user' das dependências, pois não é usado diretamente

    if (loading || !post) {
        return (
            <View className="w-full h-full items-center justify-center" aria-label="containerSkeleton">
                <View className="flex-1 max-w-[700px] justify-center items-center">
                    <PostSkeleton />
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 flex-row">
            <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1 bg-[#F8FAFC]"
                contentContainerStyle={{ alignItems: "center" }}
                aria-label="scroll"
            >
                <View className="max-w-[800px] gap-4 w-full my-6 px-3">
                    <Post postId={post.$id} typePost="postDetails" />
                </View>
            </ScrollView>
            <MenuRight />
        </View>
    );
}
