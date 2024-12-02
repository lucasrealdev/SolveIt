import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, ScrollView, useWindowDimensions, ActivityIndicator, Platform } from "react-native";
import CustomIcons from "@/assets/icons/CustomIcons";
import TextInputMask from "@/components/TextInputMask";
import { usePathname, useRouter } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider"; // Contexto global de exemplo
import { updateUser } from "@/lib/appwriteConfig";
import ImageUploadUser from "@/components/ImageUploadUser";
import { useAlert } from "@/context/AlertContext";

export default function Information() {
  const [loading, setLoading] = useState(false);

  const { user, setUser } = useGlobalContext(); // Pega os dados do usuário e o setUser do contexto global
  const { width } = useWindowDimensions();
  const largeScreen = width > 700;
  const paddingClass = largeScreen ? "px-6" : "px-2";

  const router = useRouter();
  const pathname = usePathname();
  const { showAlert } = useAlert();

  // Função para navegar entre telas
  const navigateTo = (route) => {
    router[route !== pathname ? "push" : "replace"](route);
  };

  const [form, setForm] = useState({
    username: "",
    numberPhone: "",
    biography: "",
    profile: "",
    banner: "",
  });

  // Carregar dados do usuário
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        "username": user.username || "",
        "numberPhone": user.numberPhone?.replace(/^\+55\s*/, "") || "", // Remove o +55 do início
        "biography": user.biography || "",
        "profile": user.avatar || "",
        "banner": user.banner || "",
      }));
    }
  }, [user]);

  // Função para atualizar os dados do usuário no contexto global
  const handleUpdateUser = async () => {
    try {
      // Validações para username e biography
      if (!form.username.trim()) {
        showAlert("Aviso", "Por favor, preencha o nome de usuário.");
        return; // Interrompe a execução
      }
  
      if (!form.biography.trim()) {
        showAlert("Aviso", "Por favor, preencha a biografia.");
        return; // Interrompe a execução
      }
  
      setLoading(true);
  
      // Adiciona o prefixo +55 ao numberPhone, se ainda não estiver presente
      const numberPhoneWithPrefix = form.numberPhone.startsWith("+55")
        ? form.numberPhone
        : `+55 ${form.numberPhone.trim()}`;
  
      // Atualiza o form com o número ajustado
      const updatedForm = {
        ...form,
        numberPhone: numberPhoneWithPrefix,
      };
  
      // Verifica se a plataforma é 'web'
      const isWeb = Platform.OS === "web";
  
      // Passa o valor baseado na plataforma
      const updatedUser = await updateUser(user.$id, updatedForm, isWeb);
  
      setForm((prev) => ({
        ...prev,
        username: updatedUser.username || "",
        numberPhone: updatedUser.numberPhone || "",
        biography: updatedUser.biography || "",
        profile: updatedUser.avatar || "valorpadrao",
        banner: updatedUser.banner || "valorpadrao",
      }));
  
      // Atualiza o contexto global também, se necessário
      setUser(updatedUser);

      showAlert("Sucesso", "Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error.message);
    } finally {
      setLoading(false);
    }
  };  

  const updateForm = (field, value) => {
    // Verifica se o campo é válido, e se o valor não é null ou undefined
    if (field) {
      const newValue = (value === null || value === undefined) ? "valorpadrao" : value;
      setForm((prev) => ({
        ...prev,
        [field]: newValue,
      }));
    }
  };  

  if (!form.profile) {
    return;
  }

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
                placeholder={form.username || "Digite o nome"} // Exibe o username do usuário
                maxLength={30}
                inputFilter={/[^\p{L}\p{N}\s\p{P}\p{So}]/gu}
                inputMode="text"
                value={form.username}
                onChangeText={(text) => updateForm("username", text)}
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
                placeholder={form.numberPhone || "(19) 12345-6789"} // Exibe o número do usuário
                maxLength={15}
                inputFilter={/\D/g}
                inputMode="tel"
                maskType="phone"
                value={form.numberPhone || ""}
                onChangeText={(text) => updateForm("numberPhone", text)}
                focusColor="#475569"
                blurColor="#CBD5E1"
              />
            </View>
          </View>

          {/* Foto de Perfil */}
          <View className="flex flex-row flex-wrap items-start justify-start gap-3">
            <Text className="font-bold text-base w-36">Foto de Perfil</Text>
            <ImageUploadUser
              onImageUpload={(image) => updateForm("profile", image)}
              typeImage="profile"
              propUrlImage={form.profile} />
          </View>

          {/* Banner de Perfil */}
          <View className="flex flex-row flex-wrap items-start justify-start gap-3">
            <Text className="font-bold text-base w-36">Banner do Perfil</Text>
            <ImageUploadUser
              onImageUpload={(image) => updateForm("banner", image)}
              typeImage="banner"
              propUrlImage={form.banner} />
          </View>

          {/* Biografia */}
          <View className="flex flex-row flex-wrap items-start justify-start gap-3">
            <Text className="font-bold text-base w-36">Biografia</Text>
            <View className="flex-1 min-w-[300px]">
              <TextInputMask
                placeholder={form.biography || "Digite sua biografia"} // Exibe a biografia do usuário
                maxLength={325}
                inputFilter={/[^\p{L}\p{N}\s\p{P}\p{So}]/gu}
                inputMode="text"
                value={form.biography}
                onChangeText={(text) => updateForm("biography", text)}
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