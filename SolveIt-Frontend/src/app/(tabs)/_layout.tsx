import React from 'react';
import { Redirect, Stack, usePathname } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';
import Loader from '@/components/Loader';

const TabsLayout = () => {
  const { loading, isLogged } = useGlobalContext();
  const pathname = usePathname();

  // Verifique se a URL atual contém "postdetails", caso contrário, redirecione
  if (!loading && !isLogged && !pathname.includes('postdetails') && !pathname.includes('help')) {
    return <Redirect href="/signin" />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="help" options={{ headerShown: false }} />
        <Stack.Screen name="friends" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="games" options={{ headerShown: false }} />
        <Stack.Screen name="createpost" options={{ headerShown: false }} />
        <Stack.Screen name="profile/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="personalprofile" options={{ headerShown: false }} />
        <Stack.Screen name="postdetails/[id]" options={{ headerShown: false }} />
      </Stack>

      <Loader isLoading={loading} />
    </>
  );
};

export default TabsLayout;
