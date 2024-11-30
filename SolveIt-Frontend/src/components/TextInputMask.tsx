import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";

// Definindo as propriedades do componente
interface TextInputMaskProps {
  title?: string;
  placeholder: string;
  multiline?: boolean;
  maxLength: number;
  inputMode: "text" | "numeric" | "tel" | "email" | "url";
  inputFilter: RegExp;
  value: string;
  onChangeText: (text: string) => void;
  maskType?: "number" | "cep" | "phone" | "cpf" | "cnpj";
  showCharCount?: boolean;
  focusColor?: string;
  blurColor?: string;
}

const TextInputMask = ({
  title,
  placeholder,
  multiline = false,
  maxLength,
  inputMode,
  inputFilter,
  value,
  onChangeText,
  maskType,
  showCharCount = false,
  focusColor = "#01b297", // Cor padrão do foco
  blurColor = "#0174b2",  // Cor padrão de desfoque
}: TextInputMaskProps) => {
  const [isFocused, setIsFocused] = useState(false);

  // Função para aplicar a máscara
  const applyMask = (text: string) => {
    switch (maskType) {
      case "number": return text.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      case "cep": return text.replace(/(\d{5})(\d{3})/, "$1-$2");
      case "phone":
        return text
          .replace(/^\+55|[^0-9]/g, "") // Remove tudo que não é número, exceto o prefixo +55
          .replace(/(\d{2})(\d{5})(\d{4})/, "+55 ($1) $2-$3"); // Formata no padrão +55 (XX) XXXXX-XXXX
      case "cpf": return text.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      case "cnpj": return text.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
      default: return text;
    }
  };

  // Lidar com mudanças no texto
  const handleTextChange = (text: string) => {
    const filteredText = text.replace(inputFilter, "");
    onChangeText(applyMask(filteredText));
  };

  // Calcular caracteres restantes
  const remainingChars = maxLength - value.length;

  return (
    <View className="w-full gap-[5px] h-fit">
      {title && <Text className="font-bold">{title}</Text>}
      <View
        style={{
          justifyContent: "center",
          height: multiline ? 124 : 48,
          borderColor: isFocused ? focusColor : blurColor, // Use as props para definir a cor da borda
        }}
        className={`rounded-2xl bg-white border flex-col`}>
        <TextInput
          placeholder={placeholder}
          className="outline-none text-base text-textStandardDark pl-2 pt-1"
          numberOfLines={multiline ? 20 : 1}
          maxLength={maxLength}
          multiline={multiline}
          inputMode={inputMode}
          value={value}
          onChangeText={handleTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          textAlignVertical={`${multiline ? "top" : "center"}`}
        />
      </View>
      {showCharCount && (
        <Text className="text-sm text-textSecondary pl-1">
          {remainingChars} Letras Restantes
        </Text>
      )}
    </View>
  );
};

export default TextInputMask;