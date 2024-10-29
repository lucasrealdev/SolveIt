import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Loader from "@/components/Loader";
import { useGlobalContext } from "@/context/GlobalProvider";

const AuthLayout = () => {
  const { loading, isLogged } = useGlobalContext();
  const router = useRouter();

  // Redireciona para a página inicial se o usuário estiver logado e o carregamento tiver terminado
  if (!loading && isLogged) {
    router.replace("/");
  }

  return (
    <>
      <Stack>
        <Stack.Screen
          name="signIn"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="signUp"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <Loader isLoading={loading} />
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;
