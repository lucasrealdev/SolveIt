import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { useRouter, usePathname } from 'expo-router';
 
export default function MenuConfig() {
  const router = useRouter();
  const pathname = usePathname();
 
  // Navegação e verificação de rota ativa
  const navigateTo = (route) => {
    router[route !== pathname ? 'push' : 'replace'](route);
  };
 
  const isActive = (route) => pathname === route;
 
  // Configuração das abas
  const tabs = [
    { label: 'Informações', route: '/information' },
    { label: 'Favoritos', route: '/favorites' },
    { label: 'Premium', route: '/premium' },
  ];
 
  return (
    <View
      aria-label="Main-Content"
      className="flex pt-4 px-4 bg-[#F8FAFC] border-b border-[#CBD5E1]"
    >
      <View aria-label="Header" className="flex gap-5">
        {/* Header */}
        <View className="flex flex-row flex-wrap justify-between items-center gap-2">
          <Text className="font-bold text-2xl">Configurações</Text>
        </View>
 
        {/* Tabs */}
        <View
          aria-label="Tab-Groups"
          className="flex flex-row gap-7 items-center"
        >
          {tabs.map((tab) => (
            <Pressable
              key={tab.route}
              onPress={() => navigateTo(tab.route)}
              className={`items-center w-fit pb-3 ${ isActive(tab.route) ? 'border-b-2 border-[#01B198]' : ''}`}
            >
              <Text
                className={`text-base font-semibold text-center`}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}