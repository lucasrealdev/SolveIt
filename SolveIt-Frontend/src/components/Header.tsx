import { Text, View } from "react-native";


export default function Header() {
    return (
      <View className="w-full flex flex-row mb-[13px] justify-between items-center">
        <View className="flex flex-col gap-1">
          <Text className="text-white font-montserrat-semiBold text-[25px]">Oi,Laura👋</Text>
          <Text className="text-textoCinza font-montserrat-medium text-[16px]">Explore o Mundo</Text>
        </View>
        
        <View className="w-[45px] h-[45px] border border-white rounded-full"></View>
      </View>
    );
}