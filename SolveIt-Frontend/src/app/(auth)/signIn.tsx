import React, { useState } from "react";
import { View, Text, ScrollView, Image, TextInput, Pressable } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Button, TextButton } from "@/components/Button";
import { BlurView } from 'expo-blur';
import { Redirect, useRouter } from 'expo-router';

import images from "@/constants/images";
import CustomIcons from "@/assets/icons/CustomIcons";
import TextInputModel from "@/components/TextInputModel";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getCurrentUser, signIn } from "@/lib/appwriteConfig";
import { handleAppwriteInError } from "@/utils/handleErrors";

export default function SignIn() {
  const router = useRouter();

  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const submit = async () => {
    setSubmitting(true);

    try {
      await signIn(formData.email, formData.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);
      <Redirect href="/" />
    } catch (error) {
      handleAppwriteInError(error);
    } finally {
      setSubmitting(false);
    }
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
        accessibilityLabel="Gradient"
        className="flex-1 justify-between items-center" // Ajusta o layout
        colors={['#EBD4FF', '#ABB9FF', '#0145F3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Container principal para centralizar o conteúdo e separar footer */}
        <View className="flex-1 justify-center items-center w-full p-2">
          <View className="bg-white gap-8 p-6 rounded-[32px] border border-textoCinzaClaro shadow-lg w-full max-w-[480px]" accessibilityLabel="CardSignIn">
            <View className="gap-5">
              <Image source={images.logoShadow} className="w-12 h-12"/>
              <View className="gap-2">
                <Text className="font-extrabold text-4xl text-textoPretoCinza">Entre em Sua Conta.</Text>
                <Text className="text-base text-textoCinzaEscuro">Unleash your inner sloth 4.0 right now.</Text>
              </View>
            </View>

            <View accessibilityLabel="FieldsCard" className="gap-4">
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

            <View accessibilityLabel="ContainerButtonSignin" className="gap-6">
              <Button className="bg-destaqueVerde rounded-full py-3 gap-2"
              onPress={submit}>
                <TextButton text="Entrar"/>
                <CustomIcons name="sair" color="white" size={20}/>
              </Button>

              <View className="w-full flex items-center gap-2">
                <View className="flex-row">
                  <Text className="text-textoPretoCinza font-bold">Não tem uma conta?{' '}</Text>
                  <Pressable onPress={() => router.push('/signUp')}>
                    <Text className="text-destaqueVerde font-bold">Cadastre-se</Text>
                  </Pressable>
                </View>
                <Text className="text-destaqueVerde cursor-pointer font-bold">Esqueci a Senha</Text>
              </View>

            </View>

            <View className="w-full gap-3 flex-row justify-center items-center">
              <View className="h-[1px] flex-1 bg-[#CBD5E1]"></View>
              <Text className="text-[#94A3B8] font-extrabold">OU</Text>
              <View className="h-[1px] flex-1 bg-[#CBD5E1]"></View>
            </View>

            <Pressable className="w-full border border-textoCinzaClaro py-[10px] rounded-full flex flex-row justify-center items-center gap-3">
              <Image source={images.google} className="w-6 h-6"/>
              <Text className="font-bold text-textoPretoCinza">Continuar com Google</Text>
            </Pressable>
          </View>
        </View>

        {/* Footer fixo na parte inferior */}
        <BlurView intensity={50} tint="dark" className="w-full p-4 border border-t-textoCinzaClaro">
          <Text className="text-center text-textoCinzaClaro">© 2024 SolveIt. Todos os direitos reservados.</Text>
        </BlurView>
        
      </LinearGradient>
    </ScrollView>
  );
}