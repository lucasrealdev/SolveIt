import { ScrollView, View } from "react-native";
import MenuRight from "@/components/MenuRight";
import { useEffect, useState } from "react";
import { fetchPostById } from "@/lib/appwriteConfig";
import { useLocalSearchParams } from "expo-router";
import PostSkeleton from "@/components/PostSkeleton";
import Post from "@/components/Post";
import { useGlobalContext } from "@/context/GlobalProvider";

export default function PostDetails() {
    const [post, setPost] = useState(null); // Armazena o post específico
    const [loadingPost, setLoadingPost] = useState(false); // Controla o estado de carregamento
    const { id } = useLocalSearchParams();
    const { user, isLogged, loading } = useGlobalContext();

    useEffect(() => {
        if(loading){
            return;
        }
        const fetchPost = async () => {
            setLoadingPost(true);

            try {
                const fetchedPost = await fetchPostById(id, isLogged ? user : null);
                setPost(fetchedPost);
            } catch (error) {
                console.error("Erro ao buscar post ou incrementar compartilhamentos:", error);
            } finally {
                setLoadingPost(false);
            }
        };

        if (id) {
            fetchPost();
        }
    }, [id, loading]);

    return (
        <View className="flex-1 flex-row">
            <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1 bg-[#F8FAFC]"
                contentContainerStyle={{ alignItems: "center" }}
                aria-label="scroll">
                {loadingPost || !post ? (
                    <View className="max-w-[700px] w-full my-6 px-3">
                        <PostSkeleton />
                    </View>
                ) : (
                    <View className="max-w-[700px] w-full my-6 px-3">
                        <Post
                            propCommentCount={post.commentCount}
                            propComments={post.comments}
                            propFavoriteCount={post.favoriteCount}
                            propLikeCount={post.likeCount}
                            propPost={post.post}
                            propShareCount={post.shareCount}
                            propIsFavorited={post.isFavorited}
                            propLiked={post.liked}
                            typePost="postDetails" />
                    </View>
                )}
            </ScrollView>
            <MenuRight />
        </View>
    );

}
