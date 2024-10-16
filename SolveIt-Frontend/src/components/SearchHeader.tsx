import IconesPersonalizados from "@/assets/IconesPersonalizados";
import { Pressable, TextInput, View, useWindowDimensions } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Botao, BotaoTexto, BotaoIcone } from './Botao'; // Ajuste o caminho conforme necessário
import React, { useState } from "react";
import tinycolor from 'tinycolor2';

export default function SearchHeader() {
    const router = useRouter();
    const pathname = usePathname();

    const color = "#475569";
    const [hovered, setHovered] = useState(false);

    const darkenColor = (color: string) => {
        return tinycolor(color).darken(100).toString(); // Escurece a cor em 10%
    };

    const navigateTo = (route: string) => {
        if (pathname !== route) {
          router.push(route);
        } else {
          // Substitui a rota atual, evitando duplicação na stack
          router.replace(route);
        }
      };

    const { width } = useWindowDimensions();
    const isMobile = width <= 520 ? "flex-col" : "flex-row";

    return (
        <View className={`bg-white w-full flex px-3 py-[21px] border-b border-[#E2E8F0] gap-2 ${isMobile }`}>
            <View accessibilityLabel="containerInput" className="border border-[#ededed] rounded-full flex flex-row gap-3 p-3 justify-center flex-1">
                <TextInput
                    placeholder="Pesquise problemas"
                    className="flex flex-1 h-5 outline-none text-base text-[#475569] font-medium"
                />
                <Pressable
                onHoverIn={() => setHovered(true)}
                onHoverOut={() => setHovered(false)}
                >
                    <IconesPersonalizados name="pesquisar" size={20} color={hovered ? darkenColor(color) : color}/>
                </Pressable>
            </View>
            
            <Botao
            onPress={() => navigateTo("adicionarPost")}
            className="rounded-full bg-destaqueVerde gap-[10px] px-5 py-3"
            >
                <BotaoTexto text="Contribuir no mundo" style="text-white font-bold"/>
                <BotaoIcone icon={<IconesPersonalizados name="mais" size={20} color="#fff"/>} />
            </Botao>
        </View>
    );
}