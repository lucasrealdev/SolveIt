import CustomIcons from "@/assets/icons/CustomIcons";
import { View, Image, Text, useWindowDimensions } from "react-native";

interface HeaderProps {
  notificacao?: number;
  conversas?: number;
}

export default function Header({ notificacao, conversas }: HeaderProps) {
  const { width } = useWindowDimensions();

  if (width >= 770) return null; // Retorna nulo se não for mobile

  const renderBadge = (count?: number) => (
    count !== undefined && (
      <View className="absolute bg-white w-[16px] h-[16px] rounded-full items-center justify-center top-[-5px] right-[-10px]">
        <Text className="text-[#0172B1] text-[10px] leading-3 font-semibold">{count}</Text>
      </View>
    )
  );

  return (
    <View className="w-full flex flex-row px-4 py-3 bg-destaqueAzul justify-between items-center">
      <Image
        style={{ width: 115, height: 32 }}
        source={{ uri: 'https://i.ibb.co/wBqcsxM/Logo.png' }}
      />
      <View className="flex flex-row gap-[15px]">
        <View className="relative">
          <CustomIcons name="notificacao" size={26} color="#fff" />
          {renderBadge(notificacao)}
        </View>
        <View className="relative">
          <CustomIcons name="chat" size={26} color="#fff" />
          {renderBadge(conversas)}
        </View>
      </View>
    </View>
  );
}
