import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Button, TextButton } from "@/components/Button";
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { createUser, signOut } from '@/lib/appwriteConfig';
import images from "@/constants/images";
import CustomIcons from "@/assets/icons/CustomIcons";
import TextInputModel from "@/components/TextInputModel";
import { useGlobalContext } from "@/context/GlobalProvider";
import { handleAppwriteUpError } from "@/utils/handleErrors";
import { useAlert } from "@/context/AlertContext";
import HoverColorComponent from "@/components/HoverColorComponent";
import colors from "@/constants/colors";

export default function SignUp() {
  const router = useRouter();
  const { showAlert } = useAlert();

  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const sendUser = async () => {
    if (!validateForm(formData)) {
      return;
    }

    setSubmitting(true);

    try {
      await signOut();
      const result = await createUser(formData.email, formData.password, formData.username);

      if (!result) {
        showAlert("Erro", "Não foi possível criar o usuário");
        throw new Error("Não foi possível criar o usuário");
      }

      setUser(result);
      setIsLogged(true);
      showAlert("Sucesso", "Conta Criada com Sucesso, login automatico!");
      router.push("/");

    } catch (error) {
      const { title, message } = handleAppwriteUpError(error);
      showAlert(title, message);
    } finally {
      setSubmitting(false);
    }
  };

  // Função de validação
  const validateForm = (form: { username: string; email: string; password: string }): boolean => {
    const { username, email, password } = form;
  
    if (!username.trim() || !email.trim() || !password.trim()) {
      showAlert("Campos obrigatórios", "Por favor, preencha todos os campos obrigatórios.");
      return false;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert("E-mail inválido", "Por favor, insira um endereço de e-mail válido.");
      return false;
    }
  
    if (password.length < 8) {
      showAlert("Senha muito curta", "Sua senha deve ter pelo menos 8 caracteres.");
      return false;
    }
  
    return true;
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient
        accessibilityLabel="Gradient"
        className="flex-1 justify-between items-center"
        colors={['#EBD4FF', '#ABB9FF', '#0145F3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View className="flex-1 justify-center items-center w-full p-2">
          <View className="bg-backgroundStandardLight gap-8 p-6 rounded-[32px] border border-borderStandard shadow-lg w-full max-w-[480px]" accessibilityLabel="CardSignUp">
            <View className="gap-2">
              <Image source={images.logoShadow} className="w-12 h-12 ml-[-7px]"/>
              <View className="gap-2">
                <Text className="font-extrabold text-4xl text-textStandardDark">Cadastre-se gratuitamente.</Text>
                <Text className="text-base text-textStandardDark">Unleash your inner sloth 4.0 right now.</Text>
              </View>
            </View>

            <View accessibilityLabel="FieldsCard" className="gap-4">
              <TextInputModel
                title="Nome de Usuario"
                placeholder="X_AE_A_13b"
                maxLength={20}
                inputFilter={/[^a-zA-Z0-9@._-]/g}
                keyboardType="default"
                autoCapitalize="none"
                icon="usuario"
                onChangeText={(value) => handleInputChange('username', value)}
              />
              <TextInputModel
                title="Digite seu e-mail"
                placeholder="exemplo@dominio.com"
                maxLength={30}
                inputFilter={/[^a-zA-Z0-9@._-]/g}
                keyboardType="email-address"
                autoCapitalize="none"
                icon="email"
                onChangeText={(value) => handleInputChange('email', value)}
              />
              <TextInputModel
                title="Digite sua Senha"
                placeholder="*************"
                maxLength={20}
                inputFilter={/[^a-zA-Z0-9@#._-]/g}
                keyboardType="default"
                autoCapitalize="none"
                icon="cadeado"
                password
                strength
                onChangeText={(value) => handleInputChange('password', value)}
              />
            </View>

            <View accessibilityLabel="ContainerButtonSignUp" className="gap-6">
              <Button className="bg-accentStandardDark rounded-full py-3 gap-2"  isLoading={isSubmitting}
                onPress={sendUser}
              >
                <TextButton text="Cadastrar" />
                <CustomIcons name="sair" color="white" size={20} />
              </Button>

              <View className="w-full flex items-center flex-row justify-center">
                <Text className="text-textStandardDark font-bold">Você já tem uma conta?{' '}</Text>
                <HoverColorComponent onPress={() => router.push('/signIn')} colorHover={colors.accentStandardDark.hover} colorPressIn={colors.accentStandardDark.pressIn}>
                  <Text className="font-bold" style={{color: "#01b297"}}>Entre</Text>
                </HoverColorComponent>
              </View>
            </View>

            <View className="w-full gap-3 flex-row justify-center items-center">
              <View className="h-[1px] flex-1 bg-borderStandard"></View>
              <Text className="text-[#94A3B8] font-extrabold">OU</Text>
              <View className="h-[1px] flex-1 bg-borderStandard"></View>
            </View>

            <Pressable className="w-full border border-textStandard py-[10px] rounded-full flex flex-row justify-center items-center gap-3">
              <Image source={images.google} className="w-6 h-6" />
              <Text className="font-bold text-textStandardDark">Continuar com Google</Text>
            </Pressable>
          </View>
        </View>

        <BlurView intensity={50} tint="dark" className="w-full p-4 border border-t-borderStandard">
          <Text className="text-center text-textStandard">© 2024 SolveIt. Todos os direitos reservados.</Text>
        </BlurView>
      </LinearGradient>
    </ScrollView>
  );
}
