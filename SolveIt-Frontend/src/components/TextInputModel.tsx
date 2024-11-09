import CustomIcons from "@/assets/icons/CustomIcons";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View, TextInputProps } from "react-native";

interface TextInputModelProps {
  title: string;
  placeholder: string;
  multiline?: boolean; // Opcional
  maxLength?: number; // Opcional
  keyboardType?: TextInputProps['keyboardType']; // Corrigido para usar o tipo correto
  inputFilter?: RegExp; // Opcional
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'; // Opcional
  icon?: string | null; // Opcional
  password?: boolean; // Opcional
  strength?: boolean 
  onChangeText?: (text: string) => void; // Opcional
}

const TextInputModel: React.FC<TextInputModelProps> = ({
  title,
  placeholder,
  multiline = false,
  maxLength,
  keyboardType,
  inputFilter,
  autoCapitalize,
  icon = null,
  password = false,
  strength,
  onChangeText,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
    const handleInputChange = (text) => {
      if (inputFilter) {
        text = text.replace(inputFilter, '');
      }
      setValue(text);
      if (onChangeText) {
        onChangeText(text); // Chama a função onChangeText passada pelo pai
      }
    };
  
    return (
      <View className="gap-2 w-full">
        <Text className="font-bold text-textStandardDark">{title}</Text>
        <View className={`p-3 rounded-full flex flex-row gap-2 items-center ${multiline ? 'h-[144px]' : 'h-[48px]'} border ${isFocused ? 'border-accentStandardDark' : 'border-borderStandard'} bg-white`}>
          {icon && (
            <CustomIcons name={icon} size={20} color="#475569" />
          )}
          <TextInput
            placeholder={placeholder}
            className="flex-1 outline-none text-base text-[#475569]"
            numberOfLines={multiline ? 10 : 1}
            maxLength={maxLength}
            multiline={multiline}
            textAlignVertical="top"
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            secureTextEntry={password && !isPasswordVisible}
            value={value}
            onChangeText={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {password && (
            <Pressable onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <CustomIcons name={isPasswordVisible ? 'olhoAberto' : 'olhoFechado'} size={22} color="#CBD5E1" />
            </Pressable>
          )}
        </View>
        {strength && <PasswordStrengthIndicator password={value} />}
      </View>
    );
  };

  const PasswordStrengthIndicator = ({ password }) => {
    const [strength, setStrength] = useState({
      hasMinLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false
    });
  
    useEffect(() => {
      const checks = {
        hasMinLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
      };
      setStrength(checks);
    }, [password]);
  
    // Calculate how many bars should be filled
    const getStrengthLevel = () => {
      const requirements = [
        strength.hasMinLength,
        (strength.hasUpperCase && strength.hasLowerCase),
        strength.hasNumber,
        strength.hasSpecialChar
      ];
      return requirements.filter(Boolean).length;
    };
  
    return (
      <View className="mt-2">
        <View className="flex-row gap-1">
          {[...Array(4)].map((_, index) => (
            <View
              key={index}
              className={`flex-1 h-1 rounded-full ${index < getStrengthLevel() ? 'bg-green-500' : 'bg-gray-200'
                }`}
            />
          ))}
        </View>
        <Text className="text-sm text-gray-600 mt-2">
          Password strength: {
            getStrengthLevel() === 0 ? 'Fraca' :
              getStrengthLevel() === 1 ? 'Razoável' :
                getStrengthLevel() === 2 ? 'Boa' :
                  getStrengthLevel() === 3 ? 'Forte' :
                    'Muito Forte'
          }
        </Text>
        <View className="mt-2">
          <Text className={`text-xs ${strength.hasMinLength ? 'text-green-500' : 'text-gray-500'}`}>
            • Minimo 8 carácteres
          </Text>
          <Text className={`text-xs ${(strength.hasUpperCase && strength.hasLowerCase) ? 'text-green-500' : 'text-gray-500'}`}>
            • Letras maiúsculas e minúsculas
          </Text>
          <Text className={`text-xs ${strength.hasNumber ? 'text-green-500' : 'text-gray-500'}`}>
            • Pelo menos um número
          </Text>
          <Text className={`text-xs ${strength.hasSpecialChar ? 'text-green-500' : 'text-gray-500'}`}>
            • Pelo menos um caractere especial
          </Text>
        </View>
      </View>
    );
  };
  
  export default TextInputModel;
  