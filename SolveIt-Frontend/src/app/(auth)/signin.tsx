import React, { useState } from "react";
import { View, Text, ScrollView, Image, TextInput, Pressable } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Button, TextButton } from "@/components/Button";
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';

import images from "@/constants/images";
import CustomIcons from "@/assets/icons/CustomIcons";
import TextInputModel from "@/components/TextInputModel";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getCurrentUser, signIn } from "@/lib/appwriteConfig";
import { handleAppwriteInError } from "@/utils/handleErrors";
import { useAlert } from "@/context/AlertContext";
import HoverColorComponent from "@/components/HoverColorComponent";
import colors from "@/constants/colors";

export default function SignIn() {
  const router = useRouter();
  const { showAlert } = useAlert();

  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const submit = async () => {
    if (!validateForm(formData)) {
      return;
    }

    setSubmitting(true);

    let result = null; // Inicializa a variável result

    try {
      await signIn(formData.email, formData.password);
      result = await getCurrentUser(); // Atribui o valor a result

      if (!result) {
        return;
      }

      setUser(result);
      setIsLogged(true);
      showAlert("Sucesso", "Bem Vindo! Entrou com sucesso");
      router.push("/")
    } catch (error) {
      const { title, message } = handleAppwriteInError(error);
      showAlert(title, message);
    } finally {
      setSubmitting(false);
    }
  };


  // Função de validação de formulário
  const validateForm = (form: { email: string; password: string }): boolean => {
    const { email, password } = form;

    if (!email.trim() || !password.trim()) {
      showAlert("Campos obrigatórios", "Por favor, preencha todos os campos obrigatórios.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert("E-mail inválido", "Por favor, insira um endereço de e-mail válido.");
      return false;
    }

    if (password.length < 8) {
      showAlert("Senha curta", "Sua senha deve ter pelo menos 8 caracteres.");
      return false;
    }

    return true;
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value, // Atualiza o valor do campo correspondente
    }));
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient
        aria-label="Gradient"
        className="flex-1 justify-between items-center" // Ajusta o layout
        colors={['#EBD4FF', '#ABB9FF', '#0145F3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Container principal para centralizar o conteúdo e separar footer */}
        <View className="flex-1 justify-center items-center w-full p-2">
          <View className="bg-backgroundStandardLight gap-8 p-6 rounded-[32px] border border-borderStandard shadow-lg w-full max-w-[480px]" aria-label="CardSignIn">
            <View className="gap-2">
              <Image source={images.logoShadow} className="w-12 h-12 ml-[-7px]" />
              <View className="gap-2">
                <Text className="font-extrabold text-4xl text-textStandardDark">Entre em Sua Conta.</Text>
                <Text className="text-base text-textStandardDark">Unleash your inner sloth 4.0 right now.</Text>
              </View>
            </View>

            <View aria-label="FieldsCard" className="gap-4">
              <TextInputModel
                title="Digite seu e-mail"
                placeholder="exemplo@dominio.com"
                maxLength={50}
                inputFilter={/[^a-zA-Z0-9@._-]/g}  // Apenas letras, números, '@', '.', '_' e '-'
                keyboardType="email-address"
                autoCapitalize="none"
                icon="email"
                onChangeText={(value) => handleInputChange('email', value)}
              />
              <TextInputModel
                title="Digite sua Senha"
                placeholder="*************"
                maxLength={50}
                inputFilter={/[^a-zA-Z0-9@#._-]/g}  // Apenas letras, números, '@', '.', '_' e '-'
                keyboardType="default"
                autoCapitalize="none"
                icon="cadeado"
                password
                onChangeText={(value) => handleInputChange('password', value)}
              />
            </View>

            <View aria-label="ContainerButtonSignin" className="gap-6">
              <Button className="bg-accentStandardDark rounded-full py-3 gap-2"
                onPress={submit}
                isLoading={isSubmitting}>
                <TextButton text="Entrar" />
                <CustomIcons name="sair" color="white" size={20} />
              </Button>

              <View className="w-full flex items-center gap-2">
                <View className="flex-row">
                  <Text className="text-textStandardDark font-bold">Não tem uma conta?{' '}</Text>
                  <HoverColorComponent onPress={() => router.push('/signup')} colorHover={colors.accentStandardDark.hover} colorPressIn={colors.accentStandardDark.pressIn}>
                  <Text className="font-bold" style={{color: "#01b297"}}>Cadastre-se</Text>
                </HoverColorComponent>
                </View>
                <HoverColorComponent onPress={() => router.push('/forgotPassword')} colorHover={colors.accentStandardDark.hover} colorPressIn={colors.accentStandardDark.pressIn}>
                  <Text className="font-bold" style={{color: "#01b297"}}>Esqueci a Senha</Text>
                </HoverColorComponent>
              </View>

            </View>

            <View className="w-full gap-3 flex-row justify-center items-center">
              <View className="h-[1px] flex-1 bg-borderStandard"></View>
              <Text className="text-[#94A3B8] font-extrabold">OU</Text>
              <View className="h-[1px] flex-1 bg-borderStandard"></View>
            </View>

            <Pressable className="w-full border border-borderStandard py-[10px] rounded-full flex flex-row justify-center items-center gap-3">
              <Image source={images.google} className="w-6 h-6" />
              <Text className="font-bold text-textoPretoCinza">Continuar com Google</Text>
            </Pressable>
          </View>
        </View>

        {/* Footer fixo na parte inferior */}
        <BlurView intensity={50} tint="dark" className="w-full p-4 border border-t-borderStandard">
          <Text className="text-center text-textStandard">© 2024 SolveIt. Todos os direitos reservados.</Text>
        </BlurView>
      </LinearGradient>
    </ScrollView>
  );
}