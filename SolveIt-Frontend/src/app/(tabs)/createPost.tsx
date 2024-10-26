import React, { useState } from "react";
import { Text, View, ScrollView, TextInput, StyleSheet, Pressable, Animated} from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';

import MenuRight from "@/components/MenuRight";
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomIcons from "@/assets/icons/CustomIcons";

const handleHoverIn = (scaleValue) => {
  Animated.spring(scaleValue, {
    toValue: 1.04, // Aumenta o tamanho
    friction: 3,
    useNativeDriver: true,
  }).start();
};

const handleHoverOut = (scaleValue) => {
  Animated.spring(scaleValue, {
    toValue: 1, // Volta ao tamanho original
    friction: 3,
    useNativeDriver: true,
  }).start();
};

const scaleValue = new Animated.Value(1)

const renderSelectItem = (item) => (
  <View className="flex-row">
    <Icon name={item.icon} size={20} color={item.color} style={styles.icon} />
    <Text>{item.value}</Text>
  </View>
);

const DropdownModel = ({ data, title, placeholder, setSelected }) => (
  <View className="p-[10px] gap-[10px]">
    <Text className="font-bold">{title}</Text>
    <SelectList
      placeholder={placeholder}
      setSelected={setSelected}
      dropdownItemStyles={{ top: 0 }}
      boxStyles={styles.dropdownBox}
      inputStyles={styles.dropdownInput}
      search={false}
      data={data.map(item => ({ key: item.key, value: renderSelectItem(item) }))}
    />
  </View>
);

const TextInputModel = ({ title, placeholder, multiline = false, maxLength, keyboardType, inputFilter }) => {
  const [isFocused, setIsFocused] = useState(false); // Estado de foco

  const handleInputChange = (text) => {
    // Aplicar filtro ao texto
    if (inputFilter) {
      text = text.replace(inputFilter, ''); // Remove caracteres que não se encaixam no filtro
    }
    return text;
  };

  return (
    <View className="p-[10px] gap-[10px]">
      <Text className="font-bold">{title}</Text>
      <View className={`p-[10px] rounded-[20px] ${multiline ? 'h-[144px]' : 'h-[48px]'} justify-start border-[1px] ${isFocused ? 'border-[#01B198]' : 'border-[#3692C5]'} bg-white`}>
        <TextInput
          placeholder={placeholder}
          className="outline-none text-[16px] text-[#475569]"
          numberOfLines={multiline ? 10 : 1}
          maxLength={maxLength}
          multiline={multiline}
          textAlignVertical="top"
          keyboardType={keyboardType}
          onChangeText={(text) => handleInputChange(text)}
          onFocus={() => setIsFocused(true)}  // Atualiza o estado quando o campo é focado
          onBlur={() => setIsFocused(false)}   // Atualiza o estado quando o campo perde o foco
        />
      </View>
    </View>
  );
};

export default function CreatePost() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedUrgency, setSelectedUrgency] = useState("");

  const categories = [
    { key: '1', value: 'Saúde', icon: 'heart', color: '#FF6347' },
    { key: '2', value: 'Culinária', icon: 'cutlery', color: '#FFA500' },
    { key: '3', value: 'Negócios', icon: 'briefcase', color: '#4682B4' },
    { key: '4', value: 'Carreira', icon: 'line-chart', color: '#4B0082' },
    { key: '5', value: 'Entretenimento', icon: 'film', color: '#FF69B4' },
    { key: '6', value: 'Ciência', icon: 'flask', color: '#8A2BE2' },
  ];
  
  const urgencies = [
    { key: '1', value: 'Leve', icon: 'check-square', color: '#4CAF50' },
    { key: '2', value: 'Intermediário', icon: 'exclamation-triangle', color: '#FFC107' },
    { key: '3', value: 'Grave', icon: 'ban', color: '#F44336' },
  ];
  
  return (
    <View className="flex flex-1 flex-row bg-[#F8FAFC]">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="flex-1 flex items-center">
          <View className="w-full py-[24px] px-[5px] max-w-[1000px]">
            <TextInputModel
              title="Dê um título ao seu problema"
              placeholder="Ex: Dificuldade em encontrar táxis disponíveis"
              maxLength={100}
              inputFilter={/[^a-zA-Z\s]/g}  // Apenas letras e espaços
              keyboardType="default"  
            />
            <TextInputModel
              title="Descreva seu problema"
              placeholder="Ex: Descrição do problema"
              multiline
              maxLength={1000}
              inputFilter={/[^a-zA-Z\s]/g} 
              keyboardType="default"  
            />
            <TextInputModel
              title="Tags"
              placeholder="Ex: #Educação, #Saúde"
              multiline
              maxLength={200}
              inputFilter={/[^a-zA-Z\s]/g}
              keyboardType="default"  
            />
            <TextInputModel
              title="CEP (Opcional)"
              placeholder="Ex: 130456-03"
              maxLength={9}
              keyboardType="numeric" 
              inputFilter={/[^0-9]/g}  
            />
            <TextInputModel
              title="Quantas pessoas você acha que este problema afeta?"
              placeholder="Ex: 100"
              maxLength={8}
              keyboardType="numeric"  
              inputFilter={/[^0-9]/g}  
            />

            <DropdownModel data={categories} title="Dê uma categoria ao seu problema" placeholder="Selecione uma categoria" setSelected={setSelectedCategory} />
            <DropdownModel data={urgencies} title="Urgência do problema" placeholder="Selecione uma urgência" setSelected={setSelectedUrgency} />

            <Pressable className="p-[10px]">
              <View className="rounded-[20px] border-dashed border-2 border-[#CBD5E1] flex justify-center items-center bg-white py-5 px-4">
                <View className="w-12 h-12 bg-[#CBE2EF] flex items-center justify-center rounded-full">
                  <CustomIcons name="upload" size={24} />
                </View>
                <Text className="text-[14px] font-medium text-[#475569] text-center"><Text className="text-destaqueAzul">Clique aqui</Text> para enviar seu arquivo ou arraste</Text>
                <Text className="text-[#94A3B8] text-[14px] text-center">Formatos suportados: SVG, JPG, PNG (10mb cada)</Text>
              </View>
            </Pressable>
            <Animated.View style={{ transform: [{ scale: scaleValue }], width: 150, height: 52 }}>
              <Pressable className="border-[1px] w-full h-full justify-center items-center rounded-[1234px] border-[#01B198] flex-row gap-[10px] py-[16px] px-[24px] ml-[10px] mt-3 shadow-[0px_4px_6px_0px_rgba(1,_177,_152,_0.25)]"
              onHoverIn={() => handleHoverIn(scaleValue)}
              onHoverOut={() => handleHoverOut(scaleValue)}>
                <Text className="text-[#01B198] text-[18px] font-semibold">Enviar</Text>
                <CustomIcons name="enviarBotao" size={24}/>
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </ScrollView>
      <MenuRight />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: { marginRight: 8 },
  dropdownBox: {
    borderStyle: "solid",
    borderRadius: 20,
    borderColor: '#3692C5',
    borderWidth: 1,
  },
  dropdownInput: {
    color: '#333',
    fontSize: 16,
    display: "flex",
    alignItems: "center"
  },
});