import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import MenuRight from "@/components/MenuRight";
import SearchHeader from "@/components/SearchHeader";
import HoverColorComponent from "@/components/HoverColorComponent";
import ButtonScale from "@/components/ButtonScale";
import CustomIcons from "@/assets/icons/CustomIcons";
import { useEffect, useState } from "react";
import { getCityAndStateByZipCode, getPostById } from "@/lib/appwriteConfig";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import colors from "@/constants/colors";
import PostSkeleton from "@/components/PostSkeleton";

export default function PostDetails() {
    const [post, setPosts] = useState(null); // Armazena todos os posts
    const [loading, setLoading] = useState(false); // Controla o estado de carregamento inicial
    const { id } = useLocalSearchParams();
    const [location, setLocation] = useState(null);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const post = await getPostById(id);
                setPosts(post);

                // Buscando informações de localização com base no zipCode
                if (post.zipCode) {
                    const location = await getCityAndStateByZipCode(post.zipCode);
                    setLocation(location);
                }
            } catch (error) {
                console.error("Erro ao buscar post ou localização:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, []);

    if (loading || !post) {
        return (
            <View className="w-full h-full items-center justify-center" aria-label="containerSkeleton">
                <View className="flex-1 max-w-[700px] justify-center items-center">
                    <PostSkeleton />
                </View>
            </View>
        );
    }

    const navigateTo = (route: string) => {
        router[route !== pathname ? 'push' : 'replace'](route);
    };

    const renderHeader = () => (
        <View aria-label="HeaderPost" className="flex w-full px-[20px] py-3 gap-[15px] border-b border-borderStandardLight flex-row items-center">
            <View aria-label="ContainerProfile" className="flex flex-1 flex-row gap-[12px] items-center">
                <View className="flex-row justify-center items-center">
                    <ButtonScale scale={1.09} onPress={() => router.back()}>
                        <CustomIcons name="anterior" color={colors.textStandard.standard} size={24} />
                    </ButtonScale>
                    <Pressable onPress={() => navigateTo(`/profile/${post.creator.accountId}`)}>
                        <Image source={{ uri: post.creator.avatar }} className="border-white border-[2px] rounded-full w-[50px] h-[50px]" />
                    </Pressable>
                </View>
                <View aria-label="ContainerText">
                    <Text className="font-bold text-[14px] text-textStandardDark">{post.creator.username}</Text>
                    <Text className="text-[14px] text-textSecondary">{post.category}</Text>
                </View>
            </View>
        </View>
    );

    const renderFooter = () => (
        <View aria-label="FooterPost" className="px-5 py-2 w-full flex border-t border-borderStandardLight">
            <View className="flex w-full flex-row items-center h-[60px] gap-2">
                <View aria-label="CommentaryPost" className="flex flex-1 flex-row gap-2">
                    <TextInput
                        aria-label="Commentary"
                        placeholder="Comente aqui"
                        className="border-borderStandardLight border-[1px] h-[40px] flex flex-1 rounded-[28px] px-3 py-2 text-textStandardDark text-sm font-medium outline-none"
                    />
                </View>

                <View aria-label="ContainerVectors" className="flex-row gap-2">
                    <ButtonScale className="border-borderStandardLight border-[1px] rounded-full w-[42px] h-[42px] items-center justify-center" scale={1.08}>
                        <CustomIcons name="rostoFeliz" size={24} color="#475569" />
                    </ButtonScale>

                    <ButtonScale className="border-accentStandardDark border-[1px] rounded-full w-[42px] h-[42px] items-center justify-center" scale={1.08}>
                        <CustomIcons name="enviar" size={24} color="#01B198" />
                    </ButtonScale>
                </View>
            </View>
        </View>
    );

    const renderImage = () => {
        if (!post.thumbnail) return null;

        const allowedRatios = {
            "1:1": 1,
            "16:9": 16 / 9,
            "4:5": 4 / 5,
        };

        const selectedRatio = allowedRatios[post.thumbnailRatio] || allowedRatios["1:1"];
        return (
            <View className="w-full items-center">
                <View style={{ width: "100%", aspectRatio: selectedRatio, maxWidth: 600 }} aria-label="ImagePost">
                    <Image
                        source={{ uri: post.thumbnail }}
                        style={{ width: "100%", height: "100%", borderRadius: 16 }}
                        resizeMode="cover"
                    />
                </View>
            </View>
        );
    };

    const renderOptions = () => {
        const options = [
            { icon: 'curtidas', text: 142 },
            { icon: 'comentarios', text: 143 },
            { icon: 'compartilhar', text: post.shares },
        ];

        return options.map(({ icon, text }) => (
            <HoverColorComponent key={icon} colorHover={colors.textSecondary.pressIn} colorPressIn={colors.primaryStandardDark.standard} className="flex flex-row gap-[5px] justify-center items-center w-fit">
                <CustomIcons name={icon} color="#94A3B8" size={24} />
                <Text className="font-medium text-sm" style={{ color: "#1d283a" }}>
                    {text} {icon.charAt(0).toUpperCase() + icon.slice(1)}
                </Text>
            </HoverColorComponent>
        ));
    };

    const renderLocation = () => {
        if (!location) return "Localização não disponível";
        return `${location.city}, ${location.state}, ${location.country}`;
    };

    return (
        <View className="flex-1 flex-row">
            <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1 bg-[#F8FAFC]"
                contentContainerStyle={{ alignItems: "center" }}
                aria-label="scroll"
            >
                <SearchHeader />

                <View className="max-w-[800px] gap-4 w-full my-6 px-3">
                    <View aria-label="Post" className="bg-white rounded-[24px] flex w-full border border-borderStandardLight items-center">
                        {renderHeader()}
                        <View aria-label="BodyPost" className="w-full flex px-[20px] py-[16px] gap-[5px]">
                            <Text className="font-bold text-base">{post.title}</Text>
                            <View>
                                <Text className="text-base">{post.description}</Text>
                                <Text className="text-base text-accentStandardDark">{post.tags}</Text>
                            </View>
                            <View className="flex-col gap-1 mb-3">
                                <View className="flex-row gap-1 items-center">
                                    <View className="min-w-6">
                                        <CustomIcons name="grupoPessoas" color="#94A3B8" size={24} />
                                    </View>
                                    <Text className="text-textStandardDark text-base">Número de pessoas que esse problema pode afetar: {post.peopleAffects}</Text>
                                </View>
                                <View className="flex-row gap-1 items-center">
                                    <View className="min-w-6">
                                        <CustomIcons name="atencao" color="#94A3B8" size={24} />
                                    </View>
                                    <Text className="text-textStandardDark text-base">Urgência do problema: {post.urgencyProblem}</Text>
                                </View>
                                <View className="flex-row gap-1 items-center">
                                    <View className="min-w-6">
                                        <CustomIcons name="pontoMapa" color="#94A3B8" size={24} />
                                    </View>
                                    <Text className="text-textStandardDark text-base">
                                        {renderLocation()}
                                    </Text>
                                </View>
                            </View>
                            {renderImage()}
                            <View aria-label="OptionsPost" className="flex w-full justify-between flex-row flex-wrap gap-2 mt-2">
                                <View accessibilityLabel="ContainerOptions" className="flex flex-row flex-wrap gap-4 w-fit">
                                    {renderOptions()}
                                </View>
                                <HoverColorComponent colorHover={colors.textSecondary.standard} colorPressIn={colors.primaryStandardDark.standard} className="w-fit">
                                    <CustomIcons name="favorito" color="#94A3B8" size={24} />
                                </HoverColorComponent>
                            </View>
                        </View>
                        {renderFooter()}
                    </View>
                </View>
            </ScrollView>
            <MenuRight />
        </View>
    );
}