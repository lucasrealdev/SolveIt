import React, { useState } from "react";
import { Text, View, ScrollView, StyleSheet, ActivityIndicator, Image, Platform } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';
import MenuRight from "@/components/MenuRight";
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomIcons from "@/assets/icons/CustomIcons";
import ImageUploadComponent from "@/components/ImageUploadComponent";
import ButtonScale from "@/components/ButtonScale";
import TextInputMask from "@/components/TextInputMask";
import { createPost } from "@/lib/appwriteConfig";
import { useAlert } from "@/context/AlertContext";
import { useGlobalContext } from "@/context/GlobalProvider";

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
      setSelected={(selectedKey) => {
        const selectedItem = data.find(item => item.key === selectedKey);
        setSelected(selectedItem ? selectedItem.value : '');  // Passa apenas o valor
      }}
      dropdownItemStyles={{ top: 0 }}
      boxStyles={styles.dropdownBox}
      inputStyles={styles.dropdownInput}
      search={false}
      data={data.map(item => ({ key: item.key, value: renderSelectItem(item) }))}
    />
  </View>
);


export default function CreatePost() {
  const { showAlert } = useAlert();
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);

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
      } catch (error) {
        showAlert("Erro!", "Erro ao fazer publicação, tente novamente!");
        console.log(error)
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
          <View className="w-full py-[24px] px-[5px] max-w-[1000px]">
            <TextInputMask
              title="Dê um título ao seu problema"
              placeholder="Ex: Dificuldade em encontrar táxis disponíveis"
              maxLength={100}
              inputFilter={/[^\p{L}\p{N}\s\p{P}\p{So}]/gu} // Permite letras (com acento), números, espaços, pontuação e emojis
              keyboardType="default"
              value={form.title}
              onChangeText={(text) => updateForm("title", text)}
            />
            <TextInputMask
              title="Descreva seu problema"
              placeholder="Ex: Descrição do problema"
              multiline
              maxLength={1000}
              inputFilter={/[^\p{L}\p{N}\s\p{P}\p{So}]/gu} // Permite letras (com acento), números, espaços, pontuação e emojis
              keyboardType="default"
              value={form.description}
              onChangeText={(text) => updateForm("description", text)}
            />
            <TextInputMask
              title="Quantas pessoas você acha que este problema afeta?"
              placeholder="Ex: 100"
              maxLength={12}
              keyboardType="numeric"
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
              keyboardType="numeric"
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
              keyboardType="default"
              value={form.tags}
              onChangeText={(text) => updateForm("tags", text)}
            />

            <ImageUploadComponent
              onImageUpload={(image) => updateForm("thumbnail", image)}
              onAspectRatioCalculated={(ratio) => updateForm("thumbnailRatio", ratio)}
            />

            <View className="items-start px-[10px] mt-4">
              <ButtonScale
                className="border-[1px] h-12 flex flex-row items-center justify-center rounded-full border-accentStandardDark gap-[10px]"
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
    borderRadius: 20,
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