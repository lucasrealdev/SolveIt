import React, { useState } from "react";
import { Text, View, ScrollView, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';
import MenuRight from "@/components/MenuRight";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomIcons from "@/assets/icons/CustomIcons";
import ImageUploadComponent from "@/components/ImageUploadComponent";
import ButtonScale from "@/components/ButtonScale";
import TextInputMask from "@/components/TextInputMask";
import { createPost } from "@/lib/appwriteConfig";
import { useAlert } from "@/context/AlertContext";
import { useGlobalContext } from "@/context/GlobalProvider";
import { usePathname, useRouter } from "expo-router";

const renderSelectItem = (item) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <item.icon.library
      name={item.icon.name}
      size={18}
      color={item.color}
      style={{ marginRight: 8 }}
    />
    <Text>{item.value}</Text>
  </View>
);

const DropdownModel = ({ data, title, placeholder, setSelected }) => (
  <View className=" gap-[5px]">
    <Text className="font-bold">{title}</Text>
    <SelectList
      placeholder={placeholder}
      setSelected={(selectedKey) => {
        const selectedItem = data.find((item) => item.key === selectedKey);
        setSelected(selectedItem ? selectedItem.value : ''); // Define o valor selecionado
      }}
      dropdownItemStyles={{ top: 0 }}
      boxStyles={styles.dropdownBox}
      inputStyles={styles.dropdownInput}
      search={false}
      data={data.map((item) => ({
        key: item.key,
        value: renderSelectItem(item),
      }))}
    />
  </View>
);

export default function CreatePost() {
  const { showAlert } = useAlert();
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const navigateTo = (route: string) => {
    router[route !== pathname ? 'push' : 'replace'](route);
  };

  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    zipCode: "",
    peopleAffects: "",
    category: "",
    urgencyProblem: "",
    thumbnail: "",
    shares: "0",
    thumbnailRatio: "1",
  });

  const updateForm = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const categories = [
    { key: '1', value: 'Saúde', icon: { name: 'heartbeat', library: FontAwesome5 }, color: '#FF6347' },
    { key: '2', value: 'Culinária', icon: { name: 'utensils', library: FontAwesome5 }, color: '#FFA500' },
    { key: '3', value: 'Negócios', icon: { name: 'briefcase', library: FontAwesome }, color: '#4682B4' },
    { key: '4', value: 'Carreira', icon: { name: 'chart-line', library: FontAwesome5 }, color: '#4B0082' },
    { key: '5', value: 'Entretenimento', icon: { name: 'film', library: FontAwesome }, color: '#FF69B4' },
    { key: '6', value: 'Ciência', icon: { name: 'flask', library: FontAwesome }, color: '#8A2BE2' },
    { key: '7', value: 'Família', icon: { name: 'users', library: FontAwesome }, color: '#FFD700' },
    { key: '8', value: 'Educação', icon: { name: 'graduation-cap', library: FontAwesome }, color: '#6A5ACD' },
    { key: '9', value: 'Sustentabilidade', icon: { name: 'leaf', library: FontAwesome }, color: '#228B22' },
    { key: '10', value: 'Lazer', icon: { name: 'videogame-asset', library: MaterialIcons }, color: '#00CED1' },
    { key: '11', value: 'Finanças', icon: { name: 'dollar-sign', library: FontAwesome5 }, color: '#2E8B57' },
    { key: '12', value: 'Transporte', icon: { name: 'car', library: FontAwesome }, color: '#FF4500' },
    { key: '13', value: 'Pets', icon: { name: 'paw', library: FontAwesome }, color: '#FFB6C1' },
    { key: '14', value: 'Moda', icon: { name: 'tshirt', library: FontAwesome5 }, color: '#4682B4' },
    { key: '15', value: 'Segurança', icon: { name: 'shield-alt', library: FontAwesome5 }, color: '#B22222' },
    { key: '16', value: 'Arte', icon: { name: 'palette', library: FontAwesome5 }, color: '#8B4513' },
    { key: '17', value: 'Viagens', icon: { name: 'plane', library: FontAwesome }, color: '#4682B4' },
    { key: '18', value: 'Inclusão', icon: { name: 'universal-access', library: FontAwesome5 }, color: '#2F4F4F' },
    { key: '19', value: 'Infantil', icon: { name: 'baby', library: FontAwesome5 }, color: '#ADD8E6' },
    { key: '20', value: 'Comunidade', icon: { name: 'hands-helping', library: FontAwesome5 }, color: '#8FBC8F' },
    { key: '21', value: 'Digital', icon: { name: 'mobile-alt', library: FontAwesome5 }, color: '#696969' },
  ];

  const urgencies = [
    { key: '1', value: 'Leve', icon: { name: 'check-square', library: FontAwesome }, color: '#4CAF50' },
    { key: '2', value: 'Intermediário', icon: { name: 'exclamation-triangle', library: FontAwesome }, color: '#FFC107' },
    { key: '3', value: 'Grave', icon: { name: 'ban', library: FontAwesome }, color: '#F44336' },
  ];

  const validateForm = () => {
    const { title, description, peopleAffects, category, urgencyProblem, zipCode, tags } = form;

    // Verifica se os campos obrigatórios estão preenchidos
    if (!title || !description || !peopleAffects || !category || !urgencyProblem) {
      showAlert('Aviso', 'Por favor, preencha todos os campos obrigatórios.');
      return false;
    }

    // Verifica se o zipCode não está vazio e tem 9 caracteres
    if (zipCode && zipCode.length !== 9) {
      showAlert('Aviso', 'O CEP deve ter exatamente 9 caracteres.');
      return false;
    }

    // Verifica se as tags estão no formato correto
    const tagPattern = /^#\w+(\s#\w+)*$/; // Cada tag deve começar com '#' e ser seguida por uma palavra
    if (tags && !tagPattern.test(tags)) {
      showAlert('Aviso', 'As tags devem seguir o formato #palavra #palavra...');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setUploading(true)

        const isWeb = Platform.OS === 'web';

        const formWithUserId = {
          ...form,
          userId: user.$id,  // Adiciona o userId no form
        };

        await createPost(formWithUserId, isWeb);

        showAlert("Sucesso!", "Sua publicação foi criada com sucesso!");
        navigateTo("/");
      } catch (error) {
        showAlert("Erro!", "Erro ao fazer publicação, tente novamente!");
      }
      finally {
        setUploading(false)
      }
    }
  };

  return (
    <View className="flex flex-1 flex-row bg-[#F8FAFC]">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="flex-1 flex items-center">
          <View className="w-full pb-[24px] pt-3 px-[10px] max-w-[1000px] gap-[10px]">
            <TextInputMask
              title="Dê um título ao seu problema"
              placeholder="Ex: Dificuldade em encontrar táxis disponíveis"
              maxLength={100}
              inputFilter={/[^\p{L}\p{N}\s\p{P}\p{So}]/gu} // Permite letras (com acento), números, espaços, pontuação e emojis
              inputMode="text"
              value={form.title}
              onChangeText={(text) => updateForm("title", text)}
            />
            <TextInputMask
              title="Descreva seu problema"
              placeholder="Ex: Descrição do problema"
              multiline
              maxLength={1000}
              inputFilter={/[^\p{L}\p{N}\s\p{P}\p{So}]/gu} // Permite letras (com acento), números, espaços, pontuação e emojis
              inputMode="text"
              value={form.description}
              onChangeText={(text) => updateForm("description", text)}
              showCharCount
            />
            <TextInputMask
              title="Quantas pessoas você acha que este problema afeta?"
              placeholder="Ex: 100"
              maxLength={12}
              inputMode="numeric"
              maskType="number"
              inputFilter={/[^0-9]/g}
              value={form.peopleAffects}
              onChangeText={(text) => updateForm("peopleAffects", text)}
            />
            <DropdownModel
              data={categories}
              title="Dê uma categoria ao seu problema"
              placeholder="Selecione uma categoria"
              setSelected={(value) => updateForm("category", value)}
            />
            <DropdownModel
              data={urgencies}
              title="Urgência do problema"
              placeholder="Selecione uma urgência"
              setSelected={(value) => updateForm("urgencyProblem", value)}
            />
            <TextInputMask
              title="CEP (Opcional)"
              placeholder="Ex: 130456-03"
              maxLength={9}
              inputMode="numeric"
              maskType="cep"
              inputFilter={/[^0-9]/g}
              value={form.zipCode}
              onChangeText={(text) => updateForm("zipCode", text)}
            />
            <TextInputMask
              title="Tags (Opcional)"
              placeholder="Ex: #Educação, #Saúde"
              multiline
              maxLength={200}
              inputFilter={/[^a-zA-ZÀ-ÿ0-9\s#]/g}
              inputMode="text"
              value={form.tags}
              onChangeText={(text) => updateForm("tags", text)}
              showCharCount
            />

            <ImageUploadComponent
              onImageUpload={(image) => updateForm("thumbnail", image)}
              onAspectRatioCalculated={(ratio) => updateForm("thumbnailRatio", ratio)}
            />

            <View className="items-start mt-2">
              <ButtonScale
                className="border-[1px] h-12 flex flex-row items-center justify-center rounded-3xl border-accentStandardDark gap-[10px]"
                scale={1.02}
                style={{ width: 130 }}
                onPress={handleSubmit}>
                {uploading ? (
                  <ActivityIndicator color="#01b297" />
                ) : (
                  <Text className="text-accentStandardDark text-[18px] font-semibold" style={{ lineHeight: 22 }}>
                    Enviar
                  </Text>
                )}
                <CustomIcons name="enviarBotao" size={24} />
              </ButtonScale>
            </View>
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
    borderRadius: 16,
    borderColor: '#3692C5',
    borderWidth: 1,
    backgroundColor: '#fff'
  },
  dropdownInput: {
    color: '#333',
    fontSize: 16,
    display: "flex",
    alignItems: "center"
  },
});