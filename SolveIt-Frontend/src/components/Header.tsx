import CustomIcons from "@/assets/icons/CustomIcons";
import images from "@/constants/images";
import { usePathname, useRouter } from "expo-router";
import { View, Image, Text, useWindowDimensions, Pressable } from "react-native";

export default function Header({ }) {
  const { width } = useWindowDimensions();

  const router = useRouter();
  const pathname = usePathname();

  if (width >= 770) return null; // Retorna nulo se não for mobile

  const navigateTo = (route: string) => {
    router[route !== pathname ? 'push' : 'replace'](route);
  };


  return (
    <View className="w-full flex flex-row px-4 py-3 bg-destaqueAzul justify-between items-center">
      <Image
        style={{ width: 115, height: 32 }}
        source={images.logo}
      />
      <View className="flex flex-row gap-[15px]">
        <Pressable className="relative" onPress={() => navigateTo("/help")}>
          <CustomIcons name="ajuda" size={26} color="#fff" />
        </Pressable>
        <Pressable className="relative" onPress={() => navigateTo("/settings")}>
          <CustomIcons name="settings" size={26} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}
