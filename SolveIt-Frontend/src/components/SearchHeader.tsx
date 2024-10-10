import IconesPersonalizados from "@/assets/IconesPersonalizados";
import { Pressable, Text, TextInput, View, useWindowDimensions } from "react-native";

export default function SearchHeader() {

    const { width } = useWindowDimensions();
    const isMobile = width <= 520 ? "flex-col" : "flex-row";
    return (
        <View className={`bg-white w-full flex px-3 py-[21px] border-b border-[#E2E8F0] gap-2 ${isMobile }`}>
            <View accessibilityLabel="containerInput" className="border border-[#ededed] rounded-full flex flex-row gap-3 p-3 justify-center flex-1">
                <TextInput
                    placeholder="Pesquise problemas"
                    className="flex flex-1 h-5 outline-none text-base text-[#475569] font-medium"
                />
                <IconesPersonalizados name="pesquisar" size={20} color="#475569"/>
            </View>
            
            <Pressable className="px-5 py-3 bg-destaqueVerde rounded-full gap-[10px] flex flex-row justify-center">
                <Text className="text-white font-bold">Contribuir no mundo</Text>
                <IconesPersonalizados name="mais" size={20} color="#fff"/>
            </Pressable>
        </View>
    );
}