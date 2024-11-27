import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import CustomIcons from '@/assets/icons/CustomIcons';
import HoverColorComponent from './HoverColorComponent';
import colors from '@/constants/colors';
import { useGlobalContext } from '@/context/GlobalProvider';
import { checkIfFollowing, followUser, getUserProfile, unfollowUser } from '@/lib/appwriteConfig';
import { useAlert } from '@/context/AlertContext';
import { usePathname, useRouter } from 'expo-router';
import ButtonScale from './ButtonScale';

interface CardFriendProps {
  idUser: string; // ID do usuário
  label?: string;
}

const CardFriend: React.FC<CardFriendProps> = ({ idUser, label }) => {
  const { user } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(undefined);
  const [isFollowing, setIsFollowing] = useState(false);
  const { showAlert } = useAlert();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);

      try {
        const profileData = await getUserProfile(idUser);
        setUserData(profileData);

        // Verifica se está seguindo
        const alreadyFollowing = await checkIfFollowing(user.$id, idUser);
        setIsFollowing(alreadyFollowing);
      } catch (err) {
        console.error("Erro ao buscar informações de amigos:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.$id) {
      fetchPost();
    }
  }, [user?.$id, idUser]);

  const handleRemove = async () => {
    if (!user?.$id) return;
    setLoading(true);

    try {
      if (isFollowing) {
        await unfollowUser(user.$id, idUser); // Remove o follow
        setIsFollowing(false); // Atualiza o estado
        showAlert("Sucesso", "Você deixou de seguir este usuário."); // Alerta de sucesso
      }
    } catch (error) {
      console.error("Erro ao remover:", error);
      showAlert("Erro", "Erro ao deixar de seguir. Tente novamente."); // Alerta de erro
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user?.$id) return;
    setLoading(true);

    try {
      if (!isFollowing) {
        await followUser(user.$id, idUser); // Adiciona o follow
        setIsFollowing(true); // Atualiza o estado
        showAlert("Sucesso", "Você agora está seguindo este usuário!"); // Alerta de sucesso
      }
    } catch (error) {
      console.error("Erro ao seguir:", error);
      showAlert("Erro", "Erro ao seguir o usuário. Tente novamente."); // Alerta de erro
    } finally {
      setLoading(false);
    }
  };

  if(label === "menu" && loading){
    return null;
  }

  if (loading) {
    return (
      <View className="flex flex-row justify-center items-center py-4">
        <ActivityIndicator size="small" color={colors.primaryStandardDark.standard} />
      </View>
    );
  }

  if (!userData) {
    return null; // Se não houver dados, não renderiza nada
  }

  const navigateTo = (route: string) => {
    router[route !== pathname ? 'push' : 'replace'](route);
  };

  const handleNavigateToProfile = (creatorId) => {
    navigateTo(`/profile/${creatorId}`);
  };

  return (
    <View
      aria-label="Amigo"
      className={`flex flex-row border-b border-borderStandardLight ${label !== 'menu' ? 'py-4' : 'py-2'}  ${label !== 'menu' ? 'px-[15px]' : ''} gap-3 items-center`}
    >
      <ButtonScale scale={1.06} onPress={() => handleNavigateToProfile(idUser)}>
        <Image
          source={{ uri: userData.avatar }}
          className={`border-white border-[2px] rounded-full ${label === 'menu' ? 'w-[45px] h-[45px]' : 'w-[50px] h-[50px]'}`}
        />
      </ButtonScale>
      <View className="flex-1 gap-[1px]">
        <Text className="text-textSecondary font-bold text-[14px]">{userData.username}</Text>
      </View>
      {isFollowing ? (
        <HoverColorComponent
          colorHover="#D21F3C"
          colorPressIn="#c20826"
          onPress={handleRemove}
        >
          <Text className="text-[14px] font-bold" style={{ color: '#FF0029' }}>
            Remover
          </Text>
        </HoverColorComponent>
      ) : (
        <HoverColorComponent
          colorHover={colors.textSecondary.standard}
          colorPressIn={colors.primaryStandardDark.standard}
          onPress={handleFollow}
        >
          <CustomIcons
            name="mais"
            color="#94A3B8"
            size={20}
          />
        </HoverColorComponent>
      )}
    </View>

  );
};

export default CardFriend;
