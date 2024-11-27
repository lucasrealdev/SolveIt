import React, { useEffect, useState } from "react";
import { Pressable, Text, View, Image, StyleSheet, useWindowDimensions, Animated, ActivityIndicator } from "react-native";
import { usePathname, useRouter } from "expo-router";

import CustomIcons from "@/assets/icons/CustomIcons";
import CardAmigo from "./CardFriend";
import ButtonScale from "./ButtonScale";
import HoverColorComponent from "./HoverColorComponent";
import colors from "@/constants/colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getAllEvents, getSuggestedFriends, toggleUserOnlineStatus } from "@/lib/appwriteConfig";
import { useAlert } from "@/context/AlertContext";

export default function MenuRight() {
  const { width, height } = useWindowDimensions();
  const isMobile = width > 1250;
  const isTablet = height <= 835 ? "hidden" : "";
  const containerWidth = width >= 1400 ? 368 : 320;

  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null); // Inicializa como null
  const { showAlert } = useAlert();

  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [events, setEvents] = useState([]);

  // Supondo que `getSuggestedFriends` é uma função que retorna usuários sugeridos
  useEffect(() => {
    if (!isMobile) return;
  
    const fetchSuggestedFriends = async () => {
      try {
        // Chama a função getSuggestedFriends passando o userId, página 1 e limitando a 5 resultados
        const suggestedFriendsData = await getSuggestedFriends(user?.$id, 1, 5);
  
        // Atualiza o estado com os 5 primeiros amigos sugeridos
        setSuggestedFriends(suggestedFriendsData.documents);
  
        const eventsData = await getAllEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
  
    // Verifica o status do usuário
    if (user?.isOnline !== undefined) {
      // Define o status diretamente como booleano
      setCurrentStatus(user.isOnline);
    }
  
    // Chama a função para buscar os amigos sugeridos
    if (user?.$id) {
      fetchSuggestedFriends();
    }
  }, [user, isMobile]); // Agora o efeito será executado sempre que 'user' ou 'isMobile' mudar

  const handleStatusToggle = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const newStatus = await toggleUserOnlineStatus();
      // Atualiza o status no estado local e global
      setCurrentStatus(newStatus);
      setUser({ ...user, isOnline: newStatus });
      const statusMessage = newStatus ? "Estado alterado para online" : "Estado alterado para offline";
      showAlert("Sucesso!", statusMessage);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  if(!isMobile){
    return null;
  }

  const navigateTo = (route) => {
    pathname !== route ? router.push(route) : router.replace(route);
  };
  
  const renderUserCardsSuggested = () => {
    return suggestedFriends.map((user, index) => (
      <CardAmigo
        label="menu"
        key={`${user.$id}-${index}`}
        idUser={user.$id}
      />
    ));
  };

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
            user && user.avatar && currentStatus !== null ? (
              <ButtonScale
                onPress={handleStatusToggle}
                scale={1.05}
                className="items-end"
                disabled={isLoading}
              >
                <Image
                  source={{ uri: user.avatar }}
                  className="w-12 h-12 rounded-full"
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
          {['chat', 'notificacao'].map((icon, index) => {
            return (
              <ButtonScale
                key={index}
                scale={1.07}
                className="flex p-[11px] border border-borderStandard rounded-full">
                <CustomIcons name={icon} size={24} color="#475569" />
              </ButtonScale>
            );
          })}
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

        <View aria-label="ContainerEventos" className={isTablet}>
          <View aria-label="ContainerTexto" className="flex flex-row justify-between items-center pb-6">
            <Text className="font-bold text-[18px]">Próximos eventos</Text>
          </View>

          {/* Mapeia os eventos dinamicamente */}
          {events.map((event) => renderEventCard(event))}
        </View>
      </View>
    </View>
  );
}