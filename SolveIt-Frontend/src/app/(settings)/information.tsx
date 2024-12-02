import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, ScrollView, useWindowDimensions, ActivityIndicator } from "react-native";
import CustomIcons from "@/assets/icons/CustomIcons";
import TextInputMask from "@/components/TextInputMask";
import { usePathname, useRouter } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider"; // Contexto global de exemplo
import { updateUser } from "@/lib/appwriteConfig";

export default function Information() {
  const [username, setUsername] = useState("");
  const [numberPhone, setPhoneNumber] = useState("");
  const [biography, setBiography] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, setUser } = useGlobalContext(); // Pega os dados do usuário e o setUser do contexto global
  const { width } = useWindowDimensions();
  const largeScreen = width > 700;
  const paddingClass = largeScreen ? "px-6" : "px-2";

  const router = useRouter();
  const pathname = usePathname();

  // Função para navegar entre telas
  const navigateTo = (route) => {
    router[route !== pathname ? "push" : "replace"](route);
  };

  // Carregar dados do usuário
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setPhoneNumber(user.numberPhone || "");
      setBiography(user.biography || "");
    }
  }, [user]);

  // Função para atualizar os dados do usuário no contexto global
  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      const updatedUser = await updateUser(
        user.$id,        // ID do usuário
        username,        // Novo nome de usuário
        numberPhone,     // Novo número de telefone
        biography        // Nova biografia
      );

      // Atualiza os estados locais
      setUsername(updatedUser.username || "");
      setPhoneNumber(updatedUser.numberPhone || "");
      setBiography(updatedUser.biography || "");

      // Atualiza o contexto global também, se necessário
      setUser(updatedUser);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <View aria-label="Main-Content-Master" className="bg-white flex-1">
      <ScrollView showsVerticalScrollIndicator={false} className={`pb-3 ${paddingClass}`}>
        {/* Header */}
        <View className="gap-6 bg-white my-4">
          <View className="flex flex-row flex-wrap gap-2 justify-between items-center mb-2">
            <View className="flex-col">
              <Text className="text-lg font-bold">Seu Perfil</Text>
              <Text className="text-base text-gray-500">
                Atualize as informações do seu perfil aqui
              </Text>
            </View>
            <View className="flex-row gap-2 items-center">
              <CustomIcons name="info" size={40} />
              <TouchableOpacity
                className="h-10 px-6 bg-accentStandardDark rounded-full flex-row items-center gap-2"
                onPress={() => navigateTo("/premium")}
              >
                <Text className="text-white font-bold text-sm">Premium</Text>
                <CustomIcons name="star" size={22} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Formulário */}
        <View className={`${largeScreen ? "gap-6" : "gap-3"}`}>
          {/* Nome de Usuário */}
          <View className="flex flex-row flex-wrap items-start justify-start gap-3 ">
            <Text className="font-bold text-base w-36">Nome de Usuário</Text>
            <View className="flex-1 min-w-[300px]">
              <TextInputMask
                placeholder={username || "Digite o nome"} // Exibe o username do usuário
                maxLength={24}
                inputFilter={/[^\p{L}\p{N}\s\p{P}\p{So}]/gu}
                inputMode="text"
                value={username}
                onChangeText={setUsername} // Atualiza o valor do estado
                focusColor="#475569"
                blurColor="#CBD5E1"
              />
            </View>
          </View>

          {/* Número de Celular */}
          <View className="flex flex-row flex-wrap items-start justify-start gap-3 ">
            <Text className="font-bold text-base w-36">Número de Celular</Text>
            <View className="flex-1 min-w-[300px]">
              <TextInputMask
                placeholder={numberPhone || "(19) 12345-6789"} // Exibe o número do usuário
                maxLength={11}
                inputFilter={/\D/g}
                inputMode="tel"
                maskType="phone"
                value={numberPhone || ""}
                onChangeText={setPhoneNumber} // Atualiza o valor do estado
                focusColor="#475569"
                blurColor="#CBD5E1"
              />
            </View>
          </View>

          {/* Foto de Perfil */}
          <View className="flex flex-row flex-wrap items-start justify-start gap-3">
            <Text className="font-bold text-base w-36">Foto de Perfil</Text>
            <View className="flex-1 items-center min-w-[300px]">
              <View className="w-full h-52 border border-dashed border-gray-300 rounded-2xl flex items-center justify-center">
                <View className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                </View>
                <Text className="text-sm mt-2">Click Here to upload your file or drag.</Text>
                <Text className="text-sm text-gray-400">
                  Supported Format: SVG, JPG, PNG (10mb each)
                </Text>
              </View>
            </View>
          </View>

          {/* Banner de Perfil */}
          <View className="flex flex-row flex-wrap items-start justify-start gap-3">
            <Text className="font-bold text-base w-36">Banner do Perfil</Text>
            <View className="flex-1 items-center min-w-[300px]">
              <View className="w-full h-52 border border-dashed border-gray-300 rounded-2xl flex items-center justify-center">
                <View className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                </View>
                <Text className="text-sm mt-2">Click Here to upload your file or drag.</Text>
                <Text className="text-sm text-gray-400">
                  Supported Format: SVG, JPG, PNG (10mb each)
                </Text>
              </View>
            </View>
          </View>

          {/* Biografia */}
          <View className="flex flex-row flex-wrap items-start justify-start gap-3">
            <Text className="font-bold text-base w-36">Biografia</Text>
            <View className="flex-1 min-w-[300px]">
              <TextInputMask
                placeholder={biography || "Digite sua biografia"} // Exibe a biografia do usuário
                maxLength={325}
                inputFilter={/[^\p{L}\p{N}\s\p{P}\p{So}]/gu}
                inputMode="text"
                value={biography}
                onChangeText={setBiography} // Atualiza o valor do estado
                multiline
                showCharCount
                focusColor="#475569"
                blurColor="#CBD5E1"
              />
            </View>
          </View>
        </View>

        {/* Botão de Atualizar */}
        <View className="flex justify-end items-start flex-row py-3">
          <TouchableOpacity
            className="px-6 py-4 bg-accentStandardDark rounded-full flex-row items-center gap-2"
            onPress={handleUpdateUser} // Chama a função que atualiza o contexto global
          >
            <Text className="text-white font-semibold text-lg leading-5">Atualizar</Text>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
            <CustomIcons name="correct" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}