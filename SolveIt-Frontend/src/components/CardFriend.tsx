import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import CustomIcons from '@/assets/icons/CustomIcons';
import HoverColorComponent from './HoverColorComponent';
import colors from '@/constants/colors';
import { useGlobalContext } from '@/context/GlobalProvider';
import { followUser, unfollowUser } from '@/lib/appwriteConfig';
import { useAlert } from '@/context/AlertContext';
import { useRouter } from 'expo-router';
import ButtonScale from './ButtonScale';
import { Image as ExpoImage } from 'expo-image';
interface CardFriendProps {
  propFriend: any;
  propIsFollowing?: boolean;
  label?: string;
}

const CardFriend: React.FC<CardFriendProps> = ({ propFriend, propIsFollowing = false, label }) => {
  const { user } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(propIsFollowing);

  const { showAlert } = useAlert();
  const router = useRouter();
  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const showFollowAlert = (action: string) => {
    showAlert("Sucesso", `Você agora está ${action} este usuário!`);
  };

  const showErrorAlert = (action: string) => {
    showAlert("Erro", `Erro ao ${action} o usuário. Tente novamente.`);
  };

  const handleFollow = async () => {
    if (!user?.$id) return;

    setLoading(true);
    try {
      await (isFollowing ? unfollowUser(user.$id, propFriend.$id) : followUser(user.$id, propFriend.$id));
      setIsFollowing(!isFollowing);
      showFollowAlert(isFollowing ? "deixando de seguir" : "seguindo");
    } catch (error) {
      console.error(error);
      showErrorAlert(isFollowing ? "deixar de seguir" : "seguir");
    } finally {
      setLoading(false);
    }
  };

  if (label === "menu" && loading) return null;

  if (loading) {
    return (
      <View className="flex flex-row justify-center items-center py-4">
        <ActivityIndicator size="small" color={colors.primaryStandardDark.standard} />
      </View>
    );
  }

  if (!propFriend) return null;

  const navigateToProfile = () => router.push(`/profile/${propFriend.$id}`);

  return (
    <View className={`flex flex-row border-b border-borderStandardLight ${label !== 'menu' ? 'py-4' : 'py-2'} ${label !== 'menu' ? 'px-[15px]' : ''} gap-3 items-center`}>
      <ButtonScale scale={1.06} onPress={navigateToProfile}>
        <ExpoImage
          source={{ uri: propFriend.avatar }}
          style={{
            borderWidth: 2,
            borderColor: 'white',
            borderRadius: 9999,
            width: label === 'menu' ? 45 : 50,
            height: label === 'menu' ? 45 : 50
          }}
          contentFit="cover"
          placeholder={{ blurhash }}
          cachePolicy="memory-disk"
        />
      </ButtonScale>
      <View className="flex-1 gap-[1px]">
        <Text className="text-textSecondary font-bold text-[14px]">{propFriend.username}</Text>
      </View>
      <HoverColorComponent
        colorHover={isFollowing ? "#D21F3C" : colors.textSecondary.standard}
        colorPressIn={isFollowing ? "#c20826" : colors.primaryStandardDark.standard}
        onPress={handleFollow}
      >
        {isFollowing ? (
          <Text className="text-[14px] font-bold" style={{ color: '#FF0029' }}>Remover</Text>
        ) : (
          <CustomIcons name="mais" color="#94A3B8" size={20} />
        )}
      </HoverColorComponent>
    </View>
  );
};

export default CardFriend;
