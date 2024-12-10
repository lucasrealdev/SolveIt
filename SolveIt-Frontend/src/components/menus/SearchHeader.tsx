import { Pressable, TextInput, View, useWindowDimensions, ScrollView, Text, ActivityIndicator } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Button, IconButton, TextButton } from '../Button'; // Ajuste o caminho conforme necessário
import React, { useEffect, useState } from "react";
import CustomIcons from "@/assets/icons/CustomIcons";
import { searchResult } from "@/lib/appwriteConfig";
import HoverColorComponent from "../HoverColorComponent";
import colors from "@/constants/colors";
import { useAlert } from "@/context/AlertContext";

// Tipando as props para passar o `setPosts` do componente principal
interface SearchHeaderProps {
    setSearchResults: React.Dispatch<React.SetStateAction<any[]>>; // Renomeia para setSearchResults
}

export default function SearchHeader({ setSearchResults }: SearchHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { width } = useWindowDimensions();
    const isMobile = width <= 520 ? "flex-col" : "flex-row";

    const [search, setSearch] = useState(""); // Adicionado o estado para o campo de pesquisa
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();

    // Função para navegar entre telas
    const navigateTo = (route) => {
        router[route !== pathname ? "push" : "replace"](route);
    };

    const handleSearch = async () => {
        setLoading(true); // Exibe o indicador de carregamento
        try {
            const results = await searchResult(search); // Busca os posts com base no texto digitado
            // Verifica se results é um array antes de atualizar o estado
            if (Array.isArray(results) && results.length > 0) {
                setSearchResults(results); // Atualiza o estado no componente pai
            } else {
                // Se a lista estiver vazia, mostra o alerta
                showAlert('Nenhum resultado', 'Não foram encontrados posts com essa pesquisa.');
            }
        } catch (error) {
            console.error("Erro ao buscar posts:", error);
        } finally {
            setLoading(false); // Oculta o indicador de carregamento
        }
        if (pathname !== '/') {
            navigateTo("/");
        }
    };

    useEffect(() => {
        if (search.length > 2) {
            const debounceTimeout = setTimeout(() => handleSearch(), 500);
            return () => clearTimeout(debounceTimeout);
        }
    }, [search]);

    return (
        <View className={`bg-white w-full flex px-3 py-[21px] border-b border-borderStandardLight gap-2 ${isMobile}`}>
            <View aria-label="containerInput" className="border border-borderStandardLight rounded-full flex flex-row gap-3 px-3 h-11 items-center flex-1">
                <TextInput
                    placeholder="Pesquise problemas"
                    value={search}
                    onChangeText={(text) => setSearch(text)} // Atualizando o estado ao digitar
                    onKeyPress={(e) => {
                        // Verificar se a tecla pressionada é "Enter" (código da tecla 13)
                        if (e.nativeEvent.key === 'Enter') {
                            handleSearch(); // Chama a função handleSearch quando "Enter" for pressionado
                        }
                    }}
                    className="flex flex-1 outline-none text-base text-textStandardDark font-medium"
                />
                <View className="gap-2 flex-row">
                    {loading ? (
                        <View className="flex justify-center items-center">
                            <ActivityIndicator size="small" color={colors.textStandardDark.standard} />
                        </View>
                    ) : (
                        <HoverColorComponent onPress={handleSearch} colorHover={colors.textSecondary.hover} colorPressIn={colors.textSecondary.pressIn}>
                            <CustomIcons name="pesquisar" size={20} color={colors.textSecondary.standard} />
                        </HoverColorComponent>
                    )}

                    <HoverColorComponent colorHover={colors.textSecondary.hover} colorPressIn={colors.textSecondary.pressIn}>
                        <CustomIcons name="filtro" size={20} color={colors.textSecondary.standard} />
                    </HoverColorComponent>
                </View>
            </View>

            <Button
                onPress={() => navigateTo("createpost")}
                className="rounded-full bg-accentStandardDark gap-[10px] px-5 py-3">
                <TextButton text="Contribuir no mundo" style="text-white font-bold" />
                <IconButton icon={<CustomIcons name="mais" size={20} color="#fff" />} />
            </Button>
        </View>
    );
}