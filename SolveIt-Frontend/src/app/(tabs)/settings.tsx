import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, ScrollView, Pressable, Image } from "react-native";
import CustomIcons from "@/assets/icons/CustomIcons";
import CheckBox from "@/components/CheckBox"
import images from '@/constants/images';
import CharacterLimitedTextInput from "@/components/LimitedCharacters";


export default function Configuracoes() {
   
  return (
    <View accessibilityLabel="Main-Content-Master" className="gap-y-[24px] bg-white flex flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View accessibilityLabel="Header-Configuration" className=" bg-white h-[152px] w-full justify-center pt-[32px] px-[32px] gap-[24px]">
          <View className="flex-row justify-between items-center w-full">
            <Text className="text-black text-[30px] font-bold">Configurações</Text>
            <View accessibilityLabel="containerInput" className="border border-[#ededed] rounded-full flex flex-row gap-3 p-3 justify-center w-[20%]">
              <TextInput
                placeholder="Procurar Configurações"
                className="flex flex-1 h-5 outline-none text-base text-[#475569] font-medium"
                maxLength={100}
              />
              <CustomIcons name="pesquisar" size={20} color="#475569" />
            </View>
          </View>
          <View accessibilityLabel="OptionsContainer" className="flex-row flex gap-x-[24px] border-b-[1px] border-[#CBD5E1] h-[48px] w-full items-center 
            hover:cursor-pointer ">
            <View className="hover:border-b-[3px] border-[#4F46E5] h-full justify-center">
              <Text className="text-[16px] font-semibold hover:border-[#4F46E5]">Geral</Text>
            </View>
            <View className="hover:border-b-[3px] border-[#4F46E5] h-full justify-center">
              <Text className="text-[16px] font-semibold hover:border-[#4F46E5]">Premium</Text>
            </View>
            <View className="hover:border-b-[3px] border-[#4F46E5] h-full justify-center">
              <Text className="text-[16px] font-semibold hover:border-[#4F46E5]">Favoritos</Text>
            </View>
            <View className="hover:border-b-[3px] border-[#4F46E5] h-full justify-center">
              <Text className="text-[16px] font-semibold hover:border-[#4F46E5] ">Informações</Text>
            </View>
          </View>
        </View>
        <View accessibilityLabel="Content" className="px-[32px] gap-[24px] bg-white">
          {/* Primeiro Container */}
          <View accessibilityLabel="FirstContainer" className="w-full flex h-[81px] justify-start flex-row items-center border-b-[1px] border-[#E2E8F0]">
            <View className="flex-wrap justify-start items-start gap-[3px] h-[57px] w-[85%]">
              <Text className="text-[20px] font-bold">Seu Perfil</Text>
              <Text className="text-[16px] text-[#475569]">Atualize as informações do seu perfil aqui</Text>
            </View>
            <View accessibilityLabel="ContainerOptions" className="flex-row flex gap-[10px]">
              <CustomIcons name="info" size={40} />
              <TouchableOpacity className="w-[136px] h-[40px]  justify-start items-center rounded-[1234px]
               flex-row  px-[24px] bg-[#4F46E5] gap-[10px] " >

                <Text className="text-white text-[14px] font-bold">Premium</Text>
                <CustomIcons name="star" size={22} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Segundo Container */}
        <View accessibilityLabel="Main-Container" className="w-full flex-1 flex  p-[32px] gap-[24px]">

          <View className="flex-row justify-between items-start gap-[32px]">
            <Text className="text-[16px] font-bold text-start w-[20%]">Nome de Usuário</Text>
            <View accessibilityLabel="Teste" className="flex-1 flex justify-center items-center">
              <View className="w-[520px] h-[48px] items-center justify-between border-[1px] border-gray-300 rounded-[999px] px-[12px] flex-row">
                <TextInput placeholder="Procurar Configurações"
                  className="flex h-5 outline-none text-base text-[#475569] font-medium w-[80%]"
                  maxLength={60}
                />
                <CustomIcons name="infoSettings" size={20} />
              </View>
            </View>
          </View>

          {/* View Vazia */}
          <View className="border-[1px] border-[#E2E8F0]"></View>

          {/* Terceiro Container */}
          <View accessibilityLabel="ThreeContainer" className="w-full h-[48px] flex-row gap-[32px]">
            <Text className="text-[16px] font-bold text-start w-[20%]">Numero de Celular</Text>
            <View className="flex-1 flex justify-center items-center">
              <View className="w-[520px] h-[48px] items-center justify-between border-[1px] border-gray-300 rounded-[999px] px-[12px] flex-row gap-[20px] bg-white">
                <Pressable>
                  <View className="gap-[10px] flex-row border-[#475569] border-r-[1px] h-[90%] w-fit items-center bg-white pr-2">

                    <CustomIcons name="bandeiraBrasil" size={20} />

                    <CustomIcons name="cliqueAbaixo" size={20} />
                  </View>
                </Pressable>
                <TextInput placeholder="(19) 99999-9999"
                  className="flex h-5 outline-none text-base text-[#475569] font-medium w-[100%]"
                  maxLength={15}
                  
                  
                />
              </View>
            </View>
          </View>

          {/* View Vazia */}
          <View className="border-[1px] border-[#E2E8F0]"></View>

          {/* Quarto Container */}
          <View accessibilityLabel="FourContainer" className="w-full h-[64px] flex-row gap-[32px] flex">
            <Text className="text-[16px] font-bold w-[43%]">Imagem de Perfil</Text>
            <View className="flex-1 flex w-[40%]  items-center flex-row gap-[20px]">
              <Image source={images.person} className={`border-white border-[2px] rounded-full w-[60px] h-[60px] `} />
              <View className="flex-row gap-[10px]">
                <TouchableOpacity className="bg-[#1E293B] w-[59px] h-[40px] justify-center items-center rounded-[1234px]">
                  <Text className="text-white font-semibold">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-[#F43F5E] w-[59px] h-[40px] justify-center items-center rounded-[1234px]">
                  <Text className="text-white font-semibold">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* View Vazia */}
          <View className="border-[1px] border-[#E2E8F0]"></View>

          {/* Quinto Container */}
          <View accessibilityLabel="FiveContainer" className="flex-row flex flex-1 gap-[32px]">
            <View className="flex-row gap-2 w-[20%]">
              <Text className="font-bold">Biografia</Text>
              <CustomIcons name="question" size={20} />
            </View>
            <View className="flex-1 flex justify-center items-center">
              <View accessibilityLabel="ViewWIthTextInput" className="p-[6px] rounded-[20px] justify-start items-center text-wrap gap-[10px]">
                <CharacterLimitedTextInput />
                <View accessibilityLabel="BottomPart" className="flex flex-row justify-between w-[98%]">
                  <Text className="text-[12px] text-[#94A3B8]">

                  </Text>
                 
                </View>
              </View>

            </View>
          </View>

          {/* View Vazia */}
          <View className="border-[1px] border-[#E2E8F0]"></View>

          {/* Sexto Container */}
          <View accessibilityLabel="SixContainer" className="flex-row gap-[400px] ">
            <Text className="font-bold w-[20%]">Notificacoes</Text>
            <View accessibilityLabel="ContainerNotification" className="flex-1 gap-[24px]">
              <View accessibilityLabel="FirstCheckBox" className="flex flex-row items-center">
                <CheckBox />
                <View className="text-wrap">
                  <Text className="font-bold text-[16px]">Email Notification </Text>
                  <View className="flex flex-wrap flex-1">
                    <Text className="font-[42px] text-[#475569]">You will be notified when a new email arrives.</Text>
                  </View>
                </View>
              </View>
              <View accessibilityLabel="Second-CheckBox" className="flex flex-row items-center">
                <CheckBox />
                <View className="text-wrap">
                  <Text className="font-bold text-[16px]">Sound Notification </Text>
                  <View className="flex flex-wrap flex-1">
                    <Text className="font-[42px] text-[#475569]">You will be notified with sound when someone messages you.</Text>
                  </View>
                </View>
              </View>
              <View accessibilityLabel="Three-CheckBox" className="flex flex-row items-center">
                <CheckBox />
                <View className="text-wrap">
                  <Text className="font-bold text-[16px]">Subscription </Text>
                  <View className="flex flex-wrap flex-1">
                    <Text className="font-[42px] text-[#475569]">You will be notified when you subscribe to an account.</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          {/* View Vazia */}
          <View className="border-[1px] border-[#E2E8F0]"></View>

          <View accessibilityLabel="FinalContainer" className="flex justify-end items-end h-[64px] flex-row gap-[8px]">
            <TouchableOpacity className="w-[108px] h-[40px] border-[1px] border-[#CBD5E1] rounded-[1234px] justify-center items-center flex-row gap-[5px] hover:cursor-pointer">
              <Text className="text-[#475569] font-semibold text-[14px]">Cancel</Text>
              <CustomIcons name="iconX" size={18} color="#475569" />
            </TouchableOpacity>
            <TouchableOpacity className="w-[108px] h-[40px] bg-[#4F46E5] tex-white rounded-[1234px] justify-center items-center flex-row gap-[5px] hover:cursor-pointer">
              <Text className="text-white font-semibold text-[14px]">Save</Text>
              <CustomIcons name="iconCheck" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View >

  );
}
