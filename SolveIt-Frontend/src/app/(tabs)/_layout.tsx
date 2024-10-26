import React from 'react';
import { Stack } from 'expo-router';

const TabsLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="help" options={{ headerShown: false }} />
          <Stack.Screen name="friends" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="games" options={{ headerShown: false }} />
          <Stack.Screen name="createPost" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  );
};

export default TabsLayout;
