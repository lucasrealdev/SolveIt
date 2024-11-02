import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';
import Loader from '@/components/Loader';

const TabsLayout = () => {
  const {loading, isLogged} = useGlobalContext();
  if (!loading && !isLogged) return <Redirect href="/signIn" />;
  
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="help" options={{ headerShown: false }} />
        <Stack.Screen name="friends" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="games" options={{ headerShown: false }} />
        <Stack.Screen name="createPost" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
      </Stack>

      <Loader isLoading={loading} />
    </>
  );
};

export default TabsLayout;
