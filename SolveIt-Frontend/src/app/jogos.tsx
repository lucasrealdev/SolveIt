import React, { useState } from "react";
import { Text, View, ScrollView, TouchableOpacity, TextInput, StyleSheet, Button } from "react-native";
import MenuRight from "@/components/MenuRight";
import Ionicons from '@expo/vector-icons/Ionicons';
import { CiSearch } from "react-icons/ci";
import IconesPersonalizados from "@/assets/IconesPersonalizados";
import DropDownPicker from 'react-native-dropdown-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import { SelectList } from 'react-native-dropdown-select-list';
import Icon from 'react-native-vector-icons/FontAwesome';


export default function Amigos() {

  const [selected, setSelected] = React.useState("");

  const data = [
    { key: '1', value: 'Saúde', icon: 'heart', color: '#FF6347' },
    { key: '2', value: 'Culinária', icon: 'cutlery', color: '#FFA500' },
    { key: '3', value: 'Negócios', icon: 'briefcase', color: '#4682B4' },
    { key: '4', value: 'Carreira', icon: 'line-chart', color: '#4B0082' },
    { key: '5', value: 'Entretenimento', icon: 'film', color: '#FF69B4' },
    { key: '6', value: 'Ciência', icon: 'flask', color: '#8A2BE2' },
  ]

  const UrgencyData = [
    { key: '1', value: 'Leve', icon: 'check-square', color: '#4CAF50' },
    { key: '2', value: 'Intermediario', icon: 'exclamation-triangle', color: '#FFC107' },
    { key: '3', value: 'Grave', icon: 'ban', color: '#F44336' },
  ]

  return (

    <View className="flex flex-1 flex-row bg-[#F8FAFC]">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View accessibilityLabel="Header" className="px-[32px] py-[17.6px] bg-white flex justify-between items-start border-[#E2E8F0] border-b flex-row gap-[30px] flex-wrap">
          <SearchBar />
          <AddPostButton />
        </View>
        <View accessibilityLabel="Main-Content" className="flex-1 flex py-[24px] px-[34px]">
          <TextInputModel />
          <TextInputProblemModel />
          <TextInputProblemTagModel />
          <TextInputModelCEP />
          <TextInputModelPessoasAfetadas />
          <View accessibilityLabel="DropDown-List" className="p-[10px] gap-[10px]">
            <Text accessibilityLabel="Title" className="font-bold">Dê uma categoria ao seu problema </Text>
            <SelectList placeholder="Selecione uma categoria"
              setSelected={setSelected}
              dropdownItemStyles={{ top: 0 }}
              boxStyles={{
                borderStyle: "solid",
                borderRadius: 20,
                borderColor: '#3692C5',
                borderWidth: 1,
                padding: 13,
                height: 48,
                alignContent: "center",
                display: "flex",
              }}
              inputStyles={{
                color: '#333', // cor do texto
                fontSize: 16, // tamanho da fonte
                borderColor: '#FFFFFF',
                borderWidth: 0,
              }}
              search={false}
              data={data.map(item => ({
                key: item.key,
                value: (
                  <View className="flex-row ">
                    <Icon name={item.icon} size={20} color={item.color} style={styles.icon} />
                    <Text>{item.value}</Text>
                  </View>
                ),
              }))}
            />
          </View>
          <View accessibilityLabel="DropDown-Urgency-problem" className="p-[10px] gap-[10px]">
            <Text accessibilityLabel="Title" className="font-bold">Dê uma categoria ao seu problema </Text>
            <SelectList placeholder="Selecione uma categoria"
              setSelected={setSelected} dropdownItemStyles={{ top: 0 }}
              boxStyles={{
                borderStyle: "solid",
                borderRadius: 20,
                borderColor: '#3692C5',
                borderWidth: 1,
                padding: 13,
                height: 48,
                alignContent: "center",
                display: "flex",

              }}
              inputStyles={{
                color: '#333', // cor do texto
                fontSize: 16, // tamanho da fonte
                borderColor: '#FFFFFF',
                borderWidth: 0,
              }}
              search={false}
              data={UrgencyData.map(item => ({
                key: item.key,
                value: (
                  <View className="flex-row ">
                    <Icon name={item.icon} size={20} color={item.color} style={styles.icon} />
                    <Text>{item.value}</Text>
                  </View>
                ),
              }))}
            />
          </View>

          <View accessibilityLabel="UploadContainer" className="rounded-[32px] border-2 h-[152px] p-[10px] my-[16px] border-dashed border-gray-400">
            <View className="justify-center items-center flex-1 ">
              <IconesPersonalizados name="upload" size={60} />
              <View className=" justify-center items-center">
                <Text className="text-[20px]">Click here to upload your file or drag</Text>
                <Text className="text-[#475569] text-[14px]">Supported Format: SVG,JPG,PNG(10mb each)</Text>
              </View>
            </View>
          </View>

          <View accessibilityLabel="ContainerButton" className="h-[56px] justify-end items-start">
            <TouchableOpacity className="border-[1px] w-[180px] h-[56px]  justify-center items-center rounded-[1234px]
             border-[#01B198] flex-1 flex-row p-[20px] size-[20px] gap-[15px] py-[16px] px-[24px]" >
              <IconesPersonalizados name="usuario2" size={24} />
              <Text className="text-[#01B198] text-[18px]">Enviar</Text>
              <IconesPersonalizados name="enviarBotao" size={24} />
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
      <MenuRight />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,

  },
});

const SearchBar: React.FC = () => (
  <View className="flex-1 items-center flex p-[14px] rounded-[28px] bg-white border-slate-300 border-2 flex-row min-w-[238px]">
    <TextInput placeholder="Pesquise problemas" className="w-full flex-1 text-[16px] outline-none border-none bg-transparent text-slate-500 font-Jakarta-Sans">
    </TextInput>
    <Ionicons name="search" size={20} color="black" />
  </View>
);

const AddPostButton: React.FC = () => (
  <TouchableOpacity className="ml-4 py-[7px] px-[20px] bg-[#10B981] rounded-[123px] flex-row items-center ">
    <Text className="text-white text-base mr-2 font-bold text-[16px]">Adicionar nova postagem</Text>
    <Ionicons name="add" size={26} color="#fff" />
  </TouchableOpacity>
);

const TextInputModel: React.FC = () => (
  <View accessibilityLabel="InputModel" className="p-[10px] gap-[10px]">
    <Text accessibilityLabel="Title" className="font-bold">Dê um titulo ao seu problema </Text>
    <View className=" p-[10px] rounded-[20px] h-[48px] justify-center border-[1px] border-[#3692C5]">
      <TextInput placeholder="Ex: Dificuldade em encontrar táxis disponíveis" className="outline-none text-[16px] text-[#475569]">
      </TextInput>
    </View>
  </View>
);

const TextInputProblemModel: React.FC = () => (
  <View accessibilityLabel="InputModel" className="p-[10px] gap-[10px]">
    <Text accessibilityLabel="Title" className="font-bold">Descreva seu problema </Text>
    <View accessibilityLabel="ViewWIthTextInput" className=" p-[10px] rounded-[20px] h-[144px] justify-start border-[1px] border-[#3692C5] text-wrap gap-[10px]">
      <TextInput placeholder="Ex: Sempre que quero encontrar um táxi enfrento dificuldade em encontrar táxis disponíveis,longos tempos de espera e falta de transparência nos preços, mas não sei o que pode ser feito para mudar isso"
        className="h-[100px] outline-none text-[#475569] text-[16px]" textAlignVertical="top" numberOfLines={10} maxLength={1000} multiline>
      </TextInput>
      <View accessibilityLabel="BottomPart" className="flex flex-row justify-between">
        <Text className="text-[12px] text-[#94A3B8]">0/1000</Text>
        <IconesPersonalizados name="iconeAddPost" size={16} />
      </View>
    </View>
  </View>
);

const TextInputProblemTagModel: React.FC = () => (
  <View accessibilityLabel="InputModel" className="p-[10px] gap-[10px]">
    <Text accessibilityLabel="Title" className="font-bold">Tags</Text>
    <View accessibilityLabel="ViewWIthTextInput" className=" p-[10px] rounded-[20px] h-[144px] justify-start border-[1px] border-[#3692C5] text-wrap gap-[10px]">
      <TextInput placeholder="Ex:#Educacao, #Saude,#Bem-Estar"
        className="h-[100px] outline-none text-[#475569] text-[16px] text-justify" textAlignVertical="top" numberOfLines={10} maxLength={300} multiline>
      </TextInput>
      <View accessibilityLabel="BottomPart" className="flex flex-row justify-between">
        <Text className="text-[12px] text-[#94A3B8]">0/300</Text>
        <IconesPersonalizados name="iconeAddPost" size={16} />
      </View>
    </View>
  </View>
);

const TextInputModelCEP: React.FC = () => (
  <View accessibilityLabel="InputModel" className="p-[10px] gap-[10px]">
    <Text accessibilityLabel="Title" className="font-bold">CEP (Opcional) </Text>
    <View className=" p-[12px] rounded-[20px] h-[48px] justify-start border-[1px] border-[#3692C5] flex-row gap-[12px]">
      <IconesPersonalizados name="localizacao" />
      <TextInput placeholder="Ex: 130456-03" className="outline-none text-[16px] text-[#475569] flex flex-1 ">
      </TextInput>
    </View>
  </View>
);

const TextInputModelPessoasAfetadas: React.FC = () => (
  <View accessibilityLabel="InputModel" className="p-[10px] gap-[10px]">
    <Text accessibilityLabel="Title" className="font-bold">Quantas pessoas você acha que este problema afeta? </Text>
    <View className=" p-[12px] rounded-[20px] h-[48px] justify-start border-[1px] border-[#3692C5] flex-row gap-[12px]">
      <IconesPersonalizados name="usuario" size={20} />
      <TextInput placeholder="Ex: 100" className="outline-none text-[16px] text-[#475569] flex flex-1 " >
      </TextInput>
    </View>
  </View>
);


