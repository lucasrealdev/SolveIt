import React, { useEffect, useRef, useState } from "react";
import { Text, View, Image, StyleSheet, Pressable, ScrollView, Animated } from "react-native";
import { useLocalSearchParams, useRouter } from 'expo-router';
import CustomIcons from "@/assets/icons/CustomIcons";
import images from "@/constants/images";
import ButtonScale from "@/components/ButtonScale";
import { getUserProfile } from "@/lib/appwriteConfig";

interface UserData {
    biography: string;
    username: string;
    email: string;
    avatar: string;
}

const Profile = () => {
    const animation = useRef(new Animated.Value(0)).current;
    const router = useRouter();
    const [buttonWidth, setButtonWidth] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const { id } = useLocalSearchParams();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof id !== 'string') return;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Busca dados do perfil
                const profileData = await getUserProfile(id);
                setUserData(profileData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao carregar perfil');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (!userData) return;


    const moveTo = (value) => {
        Animated.timing(animation, {
            toValue: value,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const translateX = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, buttonWidth],
    });

    const handleButtonLayout = ({ nativeEvent }) => {
        setButtonWidth(nativeEvent.layout.width);
    };

    const toggleFollow = () => {
        setIsFollowing(!isFollowing);
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 bg-white">
            <View className="flex-1 bg-white pb-[40px] items-center">
                <View className="flex w-full max-w-[700px]">
                    <View className="relative">
                        <Image source={images.banner} className="w-full rounded-b-md h-[200px]" resizeMode="cover" />
                        <ButtonScale
                            className="absolute w-8 h-8 rounded-full bg-white ml-2 mt-2 border border-borderStandardLight flex items-center justify-center"
                            onPress={() => router.back()}
                            scale={1.04}>
                            <CustomIcons name="anterior" color="#475569" size={24} />
                        </ButtonScale>
                    </View>
                    <View className="flex flex-row justify-between items-end px-[5px] mt-[-75px]">
                        <Image source={{uri: userData.avatar}} className="border-[3px] rounded-full w-[140px] h-[140px]" resizeMode="cover" />
                        <ButtonScale
                            className="bg-primaryStandardDark px-[20px] py-[12px] rounded-full"
                            scale={1.06}
                            onPress={toggleFollow} // Função de alternância ao pressionar
                        >
                            <Text className="text-white font-bold">
                                {isFollowing ? "Seguindo" : "Seguir"}
                            </Text>
                        </ButtonScale>
                    </View>
                </View>

                <View className="flex w-full max-w-[700px] px-[10px] gap-[5px]">
                    <Text className="font-bold text-xl text-textStandardDark">{userData.username}</Text>
                    <Text className="text-base">{userData.biography}</Text>
                    <View className="w-full mt-1 gap-4 items-center justify-center flex-row">
                        <ButtonScale className="flex-col justify-center items-center" scale={1.05}>
                            <Text className="text-textStandardDark font-semibold text-lg">1000</Text>
                            <Text className="text-textSecondary font-semibold text-lg">Seguidores</Text>
                        </ButtonScale>

                        <ButtonScale className="flex-col justify-center items-center" scale={1.05}>
                            <Text className="text-textStandardDark font-semibold text-lg">1000</Text>
                            <Text className="text-textSecondary font-semibold text-lg">Seguindo</Text>
                        </ButtonScale>
                    </View>
                    <View className="w-full items-center mb-4 mt-2">
                        <View className="flex-row items-center justify-between w-full h-[50px] rounded-[20px] bg-textStandardDark max-w-[420px] relative">
                            <Animated.View style={[styles.activeBar, { transform: [{ translateX }], width: buttonWidth }]} />
                            {["Publicações", "Informações"].map((title, index) => (
                                <Pressable key={index} className="flex-1 justify-center items-center bg-transparent" onPress={() => moveTo(index)} onLayout={handleButtonLayout}>
                                    <Text className="text-white text-lg font-semibold">{title}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    activeBar: {
        position: 'absolute',
        height: '100%',
        backgroundColor: '#3692C5',
        borderRadius: 20,
    }
});

export default Profile;