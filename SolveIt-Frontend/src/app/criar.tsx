import React from "react";
import { TextInput, View, Text } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Criar() {
  return (
    <View className="flex-1 bg-gray-950 flex items-center">
      <SearchBar />

      <Text className="text-white font-montserrat-semiBold text-[22px] mt-[15px] mb-3 ml-1 bg-gray-950 w-full">Cite seu problema</Text>

      <View className="max-w-[600px] gap-5">
        
        <View className="text-wrap bg-white w-full p-[10px] rounded-[8px]">
          <Text className="font-bold text-left text-[18px]">Obrigado por ajudar o mundo a se tornar um lugar melhor 🌎</Text>
          <Text className="text-gray-500 text-left text[18px]">Seu problema pode ser a proxima grande solucao, se ninguem tem problemas as inovacoes acabam</Text>
        </View>

        <View className="flex gap-[20px] flex-col">
          <Text className="text-white w-full text-[16px]">1. Dê um título ao seu problema</Text>
          <TextInput placeholder="Ex: Dificuldade em encontrar taxis disponiveis" className="min-h-[60px] p-2 text-textoCinza border border-white rounded-[6px] text-start w-full text-[16px] font-montserrat-extraBold"
          multiline = {true}
          placeholderTextColor="#888888" />
        </View>

        <View className="flex gap-[20px] flex-col">
          <Text className="text-white w-full text-[16px]">1. Dê um título ao seu problema</Text>
          <TextInput placeholder="Ex: Dificuldade em encontrar taxis disponiveis" className="min-h-[60px] p-2 text-textoCinza border border-white rounded-[6px] text-start w-full text-[16px] font-montserrat-extraBold"
          multiline = {true}
          placeholderTextColor="#888888"/>
        </View>

      </View>

    </View>
  );
}

const SearchBar: React.FC = () => (
  <View className="w-full flex flex-row border-[1.3px] py-[12px] px-[10px] rounded-[10px] border-white bg-gray-950 items-center">
    <TextInput
      placeholder="Procurar Problemas" className="flex-1 text-white text-base outline-none" placeholderTextColor="#FFF" />
      <Ionicons name="filter-outline" size={26} color="white" />
  </View>
);