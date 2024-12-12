import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, ScrollView, useWindowDimensions, ActivityIndicator, Platform } from "react-native";
import CustomIcons from "@/assets/icons/CustomIcons";
import TextInputMask from "@/components/TextInputMask";
import { usePathname, useRouter } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider"; // Contexto global de exemplo
import { updateUser } from "@/lib/appwriteConfig";
import { useAlert } from "@/context/AlertContext";
import ImageUploadUser from "@/components/media/ImageUploadUser";
import Tooltip from "@/components/Tooltip"

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

  const [previousForm, setPreviousForm] = useState({
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

      setPreviousForm((prev) => ({
        ...prev,
        "username": user.username || "",
        "numberPhone": user.numberPhone?.replace(/^\+55\s*/, "") || "", // Remove o +55 do início
        "biography": user.biography || "",
        "profile": user.avatar || "",
        "banner": user.banner || "",
      }));
    }
  }, [user]);

  const hasFormChanged = () => {
    return Object.keys(form).some((key) => form[key] !== previousForm[key]);
  };

  // Função para atualizar os dados do usuário no contexto global
  const handleUpdateUser = async () => {
    try {
      // Validacao para garantir que o nome de Usuario tem no minimo 6 caracteres
      const cleanedUser = form.username;
      if (cleanedUser.length < 6) {
        showAlert("Aviso", "O nome de Usuario deve ter no minimo 6 caracteres.");
        return; // Interrompe a execução
      }
      // Validacao para garantir que o numero de telefone tem no minimo 11 caracteres
      const cleanedNumber = form.numberPhone.replace(/[^\d]/g, ""); // Remove não numéricos
      if (cleanedNumber.length > 0 && cleanedNumber.length < 11) {
        showAlert("Aviso", "O número de telefone deve ter no mínimo 11 dígitos.");
        return; // Interrompe a execução
      }
      // Validacao para garantir que o nome de Usuario não esta vazia
      if (!form.username.trim()) {
        showAlert("Aviso", "Por favor, preencha o nome de usuário.");
        return; // Interrompe a execução
      }
      // Validacao para garantir que a biografia tem no minimo 10 caracteres
      const cleanedBiography = form.biography;
      if (cleanedBiography.length < 10) {
        showAlert("Aviso", "A biografia precisa ter no mínimo 10 caracteres.")
        return;
      }
      // Validacao para garantir que a biografia nao esta vazia
      if (!form.biography.trim()) {
        showAlert("Aviso", "Por favor, preencha a biografia.");
        return; // Interrompe a execução
      }

      // Adiciona o prefixo +55 ao numberPhone, se necessário
      const numberPhoneWithPrefix = form.numberPhone && form.numberPhone.trim() !== ""
        ? form.numberPhone.startsWith("+55")
          ? form.numberPhone
          : `+55 ${form.numberPhone.trim()}`
        : null; // Retorna null caso numberPhone esteja vazio

      setLoading(true);

      const updatedForm = {
        ...form,
        numberPhone: numberPhoneWithPrefix,
      };

      const isWeb = Platform.OS === "web";
      if (hasFormChanged()) {
        const updatedUser = await updateUser(user.$id, updatedForm, isWeb, user.bannerId, user.avatarId);

        setForm(updatedForm); // Atualiza o form com os novos dados
        setPreviousForm(updatedForm); // Atualiza o previousForm com os novos dados

        setUser(updatedUser);

        showAlert("Sucesso", "Dados atualizados com sucesso!");
        navigateTo("personalprofile");
      } else {
        showAlert("Aviso", "Nenhuma mudança detectada.");
      }
    } catch (error) {
      console.error(error.message);
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
              <Tooltip
                title="Informações dos dados"
                content="Ninguem pode visualizar os dados do seu perfil se não tiver uma assinatura premium"
                iconSize={40}
                iconColor="#1E40AF"
                backgroundColor="#1E293B"
                textColor="#F8FAFC"
              />
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
                minLength={6}
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
                minLength={11}
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
                minLength={10}
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