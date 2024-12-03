import React, { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useAlert } from "@/context/AlertContext";
import { continueWithGoogle } from "@/lib/appwriteConfig";
import { Image, Pressable, Text, ActivityIndicator } from 'react-native';
import images from '@/constants/images';
import { useGlobalContext } from '@/context/GlobalProvider';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();
const GoogleAuth = () => {
  const router = useRouter();
  const { showAlert } = useAlert();
  const { setUser, setIsLogged } = useGlobalContext();
  
  // Estados para controle de carregamento
  const [isLoading, setIsLoading] = useState(false);

  const webClientId = "256081770609-f902fkdcl1cp0cf3mv9p0equ5g01mttu.apps.googleusercontent.com";
  const iosClientId = "256081770609-re7ojq66qvf8f9v2f2b7gba88m7useuu.apps.googleusercontent.com";
  const androidClientId = "256081770609-munq9cqfnjc2jh6netpf0kfgffdtqkqv.apps.googleusercontent.com";

  const config = {
    webClientId,
    iosClientId,
    androidClientId
  };

  const [request, response, promptAsync] = Google.useAuthRequest(config);

  const submitGoogle = async (user) => {
    console.log("user google auth", user);
    setIsLoading(true); // Ativa o carregamento

    try {
      const result = await continueWithGoogle(user.email, user.id, user.email.split('@')[0], user.picture);
      if (result.status === "logged_in") {
        setIsLogged(true);
        setUser(result.user);
        showAlert("Sucesso", "Usuário logado com sucesso");
        router.push("/");
        return;
      }
      if(result.status === "created_and_logged_in"){
        setIsLogged(true);
        setUser(result.newUser);
        showAlert("Sucesso", "Usuário logado com sucesso");
        router.push("/");
        return;
      }
    } catch (error) {
      console.error("Erro ao continuar com Google:", error.message);
      if (error.code === 409) {
        // Caso o erro seja sobre o email já estar cadastrado
        showAlert("E-mail já cadastrado", "Já existe uma conta associada a este e-mail. Tente fazer login com a senha.");
      } else {
        showAlert("Erro", "Houve um erro ao fazer login com o Google");
      }
    } finally {
      setIsLoading(false); // Desativa o carregamento
    }
  };

  const getUserProfile = async (token) => {
    if (!token) return;
    try {
      const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      submitGoogle(user);
    } catch (error) {
      console.log(error);
      showAlert("Erro", "Houve um erro ao fazer login com o Google");
    }
  };

  useEffect(() => {
    if (response) {
      switch (response.type) {
        case 'error':
        case 'cancel':
          showAlert("Erro", "Houve um erro ao fazer login com o Google");
          break;
        case 'success':
          const { authentication } = response;
          const token = authentication?.accessToken;
          getUserProfile(token);
          break;
        default:
          break;
      }
    }
  }, [response]);

  return (
    <Pressable 
      onPress={() => promptAsync()} 
      disabled={!request || isLoading} // Desabilita o botão enquanto estiver carregando
      className="w-full border border-borderStandard py-[10px] rounded-full flex flex-row justify-center items-center gap-3"
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#01b297" />
      ) : (
        <>
          <Image source={images.google} className="w-6 h-6" />
          <Text className="font-bold text-textoPretoCinza">Continuar com Google</Text>
        </>
      )}
    </Pressable>
  );
};

export default GoogleAuth;
