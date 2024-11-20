import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

// Definir as propriedades do componente
interface TextInputMaskProps {
  title: string;
  placeholder: string;
  multiline?: boolean;
  maxLength: number;
  inputMode: "text" | "numeric" | "tel" | "email" | "url"; // Alterado para inputMode
  inputFilter: RegExp;
  value: string;
  onChangeText: (text: string) => void;
  maskType?: "number" | "cep" | "phone" | "cpf" | "cnpj";
}

// Componente TextInputMask
const TextInputMask = ({
  title,
  placeholder,
  multiline = false,
  maxLength,
  inputMode,  // Alterado para inputMode
  inputFilter,
  value,
  onChangeText,
  maskType, // Novo parâmetro para definir o tipo da máscara
}: TextInputMaskProps) => {
  const [isFocused, setIsFocused] = useState(false); // Estado de foco

  // Função para aplicar a máscara personalizada
  const applyMask = (text: string) => {
    switch (maskType) {
      case "number":
        return text.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Máscara de número com separador de milhar
      case "cep":
        return text.replace(/(\d{5})(\d{3})/, "$1-$2"); // Máscara de CEP: 12345-678
      case "phone":
        return text.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3"); // Máscara de telefone
      case "cpf":
        return text.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"); // Máscara de CPF
      case "cnpj":
        return text.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5"); // Máscara de CNPJ
      default:
        return text;
    }
  };

  const handleTextChange = (text: string) => {
    const filteredText = text.replace(inputFilter, "");
    const maskedText = applyMask(filteredText); // Aplica a máscara no texto
    onChangeText(maskedText); // Passa o texto formatado
  };

  return (
    <View className="px-[10px] pb-[10px] pt-0 gap-[10px]">
      <Text className="font-bold">{title}</Text>
      <View
        className={`p-[10px] rounded-[20px] ${multiline ? "h-[144px]" : "h-[48px]"} justify-start border-[1px] ${
          isFocused ? "border-accentStandardDark" : "border-primaryStandardDark"
        } bg-white`}
      >
        <TextInput
          placeholder={placeholder}
          className="outline-none text-[16px] text-textStandardDark"
          numberOfLines={multiline ? 10 : 1}
          maxLength={maxLength}
          multiline={multiline}
          textAlignVertical="top"
          inputMode={inputMode}  // Alterado de keyboardType para inputMode
          value={value}
          onChangeText={handleTextChange}
          onFocus={() => setIsFocused(true)} // Atualiza o estado quando o campo é focado
          onBlur={() => setIsFocused(false)} // Atualiza o estado quando o campo perde o foco
        />
      </View>
    </View>
  );
};

export default TextInputMask;
