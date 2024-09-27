import IconesPersonalizados from "@/assets/IconesPersonalizados";
import { View, Image, Text, useWindowDimensions } from "react-native";

interface HeaderProps {
  notificacao?: number;
  conversas?: number;
}

export default function Header({ notificacao, conversas }: HeaderProps) {
  const { width } = useWindowDimensions();

  const isMobile = width < 770;
  if(isMobile){
    return (
      <View className="w-full flex flex-row px-4 py-3 bg-destaqueAzul justify-between items-center">
        <Image
          style={{width: 115, height: 32}}
          source={{
            uri: 'https://i.ibb.co/wBqcsxM/Logo.png',
          }}
        />

        <View className="flex flex-row gap-[15px]">
          <View className="relative">
            <IconesPersonalizados name="notificacao" size={26} color="#fff"/>
            {notificacao !== undefined && (
              <View className="absolute flex bg-white w-4 h-4 rounded-full items-center justify-center top-[-5px] right-[-10px]">
                <Text className="text-[#0172B1] text-[10px] font-semibold">
                  {notificacao}
                </Text>
              </View>
            )}
          </View>
          <View className="relative">
            <IconesPersonalizados name="chat" size={26} color="#fff"/>
            {conversas !== undefined && (
              <View className="absolute bg-white w-4 h-4 rounded-full items-center justify-center top-[-5px] right-[-10px]">
                <Text className="text-[#0172B1] text-[10px] font-semibold">
                  {conversas}
                </Text>
              </View>
            )}
          </View>
        </View>

      </View>
    );
  }
}
