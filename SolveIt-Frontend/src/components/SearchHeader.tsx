import { Pressable, TextInput, View, useWindowDimensions } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Button, IconButton, TextButton } from './Button'; // Ajuste o caminho conforme necessário
import React, { useState } from "react";
import CustomIcons from "@/assets/icons/CustomIcons";
import tinycolor from 'tinycolor2';

export default function SearchHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const color = "#475569";
    const [hovered, setHovered] = useState(false);
    const { width } = useWindowDimensions();
    const isMobile = width <= 520 ? "flex-col" : "flex-row";

    const darkenColor = (color: string) => tinycolor(color).darken(100).toString();

    const navigateTo = (route: string) => {
        pathname !== route ? router.push(route) : router.replace(route);
    };

    return (
        <View className={`bg-white w-full flex px-3 py-[21px] border-b border-[#E2E8F0] gap-2 ${isMobile}`}>
            <View accessibilityLabel="containerInput" className="border border-[#ededed] rounded-full flex flex-row gap-3 p-3 justify-center flex-1">
                <TextInput
                    placeholder="Pesquise problemas"
                    className="flex flex-1 h-5 outline-none text-base text-[#475569] font-medium"
                />
                <Pressable onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)}>
                    <CustomIcons name="pesquisar" size={20} color={hovered ? darkenColor(color) : color} />
                </Pressable>
            </View>
            <Button
                onPress={() => navigateTo("createPost")}
                className="rounded-full bg-destaqueVerde gap-[10px] px-5 py-3"
            >
                <TextButton text="Contribuir no mundo" style="text-white font-bold" />
                <IconButton icon={<CustomIcons name="mais" size={20} color="#fff" />} />
            </Button>
        </View>
    );
}
