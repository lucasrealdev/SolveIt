import React, { useEffect, useState } from "react";
import { Pressable, Text, View, useWindowDimensions, ActivityIndicator } from "react-native";
import { usePathname, useRouter } from "expo-router";

import CustomIcons from "@/assets/icons/CustomIcons";
import CardAmigo from "../CardFriend";
import ButtonScale from "../ButtonScale";
import HoverColorComponent from "../HoverColorComponent";
import colors from "@/constants/colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getAllEvents, getSuggestedFriends, toggleUserOnlineStatus } from "@/lib/appwriteConfig";
import { useAlert } from "@/context/AlertContext";
import { Image as ExpoImage } from 'expo-image';

export default function MenuRight() {
  const { width, height } = useWindowDimensions();
  const isMobile = width > 1250;
  const isTablet = height <= 835 ? "hidden" : "";
  const containerWidth = width >= 1400 ? 368 : 320;

  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null); // Inicializa como null
  const { showAlert } = useAlert();

  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [events, setEvents] = useState([]);

  const { user, loading, isLogged } = useGlobalContext();

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  useEffect(() => {
    setIsLoadingMenu(true);
    if (!isMobile || !isLogged || loading) return;

    const fetchMenuData = async () => {
      try {
        const [friendsData, eventsData] = await Promise.all([
          getSuggestedFriends(user?.$id, 1, 5),
          getAllEvents(),
        ]);
        setSuggestedFriends(friendsData.documents || []);
        setEvents(eventsData || []);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      } finally {
        setIsLoadingMenu(false);
      }
    };

    // Verifica o status do usuário
    if (user?.isOnline !== undefined) {
      // Define o status diretamente como booleano
      setCurrentStatus(user.isOnline);
    }

    fetchMenuData();
  }, [user, isMobile, loading, isLogged]);

  const handleStatusToggle = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const newStatus = await toggleUserOnlineStatus();
      setCurrentStatus(newStatus);
      showAlert("Sucesso!", newStatus ? "Estado alterado para online" : "Estado alterado para offline");
    } catch (error) {
      console.error("Error toggling status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMobile || isLoadingMenu) {
    return null;
  }

  const navigateTo = (route) => {
    pathname !== route ? router.push(route) : router.replace(route);
  };

  const renderUserCardsSuggested = () =>
    suggestedFriends.map((friend, index) => (
      <CardAmigo
        key={`${friend.$id}-${index}`}
        propFriend={friend}
        propIsFollowing={false}
        label="menu"
      />
    ));

  const renderEventCard = (event) => {
    return (
      <View key={event.$id} aria-label="CardEvento" className="flex flex-row border-t border-borderStandardLight py-[12px] gap-3 items-center">
        <View className="w-[40px] h-[40px] flex items-center justify-center bg-[#EEF2FF] rounded-full">
          <CustomIcons name={event.icon} color="#01B198" size={20} />
        </View>
        <View className="flex flex-1">
          <Text className="text-textSecondary font-bold text-[14px]">{event.title}</Text>
          <Text className="text-textSecondary font-normal text-[14px]">{event.dateEvent}</Text>
        </View>
        <CustomIcons name="notificacao" color="#94A3B8" size={20} />
      </View>
    );
  };

  return (
    <View aria-label="ContainerMenu" className="flex h-[100vh] border-l border-borderStandardLight bg-white" style={{ width: containerWidth }}>
      <View aria-label="ContainerHeaderMenu" className="flex w-full px-6 py-[19px] flex-row justify-between border-b border-borderStandardLight">
        <Pressable className="flex justify-center">
          {
            user ? (
              <ButtonScale
                onPress={handleStatusToggle}
                scale={1.05}
                className="items-end"
                disabled={isLoading}
              >
                <ExpoImage
                  source={{ uri: user.avatar }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 9999
                  }}
                  contentFit="cover"
                  placeholder={{ blurhash }}
                  cachePolicy="memory-disk"
                />
                <View
                  className={`w-3 h-3 border-white border-[1.5px] rounded-full mt-[-12px] ${isLoading
                    ? "bg-gray-400"
                    : currentStatus
                      ? "bg-green-500"
                      : "bg-red-500"
                    }`}
                />
              </ButtonScale>
            ) : (
              // Exibe o ActivityIndicator enquanto user.avatar não estiver disponível
              <ActivityIndicator size="small" color="#C0C0C0" />
            )
          }
        </Pressable>
        <View className="flex flex-row gap-2">
          <ButtonScale
            scale={1.07}
            className="flex p-[11px] border border-borderStandard rounded-full"
            onPress={() => navigateTo("/premium")}>
            <CustomIcons name="upgrade" size={24} color="#475569" />
          </ButtonScale>
        </View>
      </View>

      <View aria-label="ContainerSections" className="flex w-full gap-8 p-6">
        <View aria-label="ContainerAmigos" className="flex">
          <View aria-label="ContainerTexto" className="flex flex-row justify-between items-center pb-6">
            <Text className="font-bold text-[18px]">Sugestão de amigos</Text>
            <HoverColorComponent className="flex flex-row items-end gap-2"
              onPress={() => navigateTo("/friends")}
              colorHover={colors.accentStandardDark.hover}
              colorPressIn={colors.accentStandardDark.pressIn}>
              <Text className="font-bold text-[14px]" style={{ color: "#01b297" }}>
                Ver tudo
              </Text>
              <CustomIcons name="setaDireita" color="#01B198" size={20} />
            </HoverColorComponent>
          </View>
          {renderUserCardsSuggested()}
        </View>

        {events.length > 0 && (
          <View aria-label="ContainerEventos" className={isTablet}>
            <View aria-label="ContainerTexto" className="flex flex-row justify-between items-center pb-6">
              <Text className="font-bold text-[18px]">Próximos eventos</Text>
            </View>

            {/* Mapeia os eventos dinamicamente */}
            {events.map((event) => renderEventCard(event))}
          </View>
        )}
      </View>
    </View>
  );
}