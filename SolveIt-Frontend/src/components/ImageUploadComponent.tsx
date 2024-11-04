import React, { useState } from "react";
import { Text, View, Pressable, Image, Platform, Linking } from "react-native";
import * as ImagePicker from "expo-image-picker";
import CustomIcons from "@/assets/icons/CustomIcons";
import { useAlert } from "@/context/AlertContext";
import Constants from 'expo-constants';

// Definindo o tipo para o aspect ratio
type AspectRatio = [number, number];

// Interface para o estado da imagem
interface ImageState extends ImagePicker.ImagePickerAsset {
    aspect?: AspectRatio;
}

const ImageUploadComponent = () => {
    const { showAlert } = useAlert();
    const [image, setImage] = useState<ImageState | null>(null);
    const isExpoGo = Constants.appOwnership === 'expo';

    const requestMediaLibraryPermission = async () => {
        if (isExpoGo || Platform.OS === 'web') return true;

        try {
            const { status: currentStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
            
            if (currentStatus === 'granted') {
                return true;
            }

            if (currentStatus === 'undetermined') {
                const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                return newStatus === 'granted';
            }

            if (currentStatus === 'denied') {
                showAlert(
                    "Permissão Necessária",
                    "As permissões de câmera são necessárias para selecionar uma imagem. Vá até as configurações do seu dispositivo e conceda as permissões necessárias.",
                    [
                        { text: 'Abrir configurações', onPress: () => Linking.openSettings() },
                        { text: 'Recusar', onPress: () => null },
                    ],
                    10000
                );
                return false;
            }

            return false;
        } catch (error) {
            console.error('Erro ao verificar permissões:', error);
            return false;
        }
    };

    const selectImage = async (aspectRatio: AspectRatio = [1, 1]) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            aspect: aspectRatio,
            allowsMultipleSelection: false,
            exif: false,
            presentationStyle: Platform.OS === 'ios'
                ? ImagePicker.UIImagePickerPresentationStyle.PAGE_SHEET
                : ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
        });

        return result;
    };

    const handleImageSelection = async (aspectRatio: AspectRatio = [1, 1]) => {
        try {
            const result = await selectImage(aspectRatio);
            if (result.canceled) return;

            const response = await fetch(result.assets[0].uri);
            const blob = await response.blob();
            const fileType = blob.type;
            const fileSize = blob.size;
            const maxSize = 10 * 1024 * 1024;

            if (fileType !== "image/jpeg" && fileType !== "image/png") {
                showAlert("Atenção", "Formato de imagem não suportado. Por favor, envie um arquivo JPG ou PNG.");
                return;
            }

            if (fileSize > maxSize) {
                showAlert("Atenção", "O tamanho da imagem deve ser menor que 10MB");
                return;
            }

            setImage({ 
                ...result.assets[0], 
                aspect: aspectRatio 
            });
        } catch (error) {
            console.error('Erro ao processar imagem:', error);
            showAlert("Erro", "Erro ao processar a imagem. Tente novamente.");
        }
    };

    const pickImage = async (aspectRatio: AspectRatio = [1, 1]) => {
        try {
            const hasPermission = await requestMediaLibraryPermission();
            if (!hasPermission) return;

            await handleImageSelection(aspectRatio);
        } catch (error) {
            console.error('Erro ao selecionar imagem:', error);
            showAlert("Erro", "Erro ao selecionar a imagem. Tente novamente.");
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
    };

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];

        if (!file) return;

        if (file.type !== "image/jpeg" && file.type !== "image/png") {
            showAlert("Atenção", "Formato de imagem não suportado. Por favor, envie um arquivo JPG ou PNG.");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            showAlert("Atenção", "O tamanho da imagem deve ser menor que 10MB");
            return;
        }

        const fileUri = URL.createObjectURL(file);
        setImage({ uri: fileUri, aspect: [1, 1] as AspectRatio } as ImageState);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const AspectRatioButton = ({ 
        label, 
        aspectRatio, 
        currentImage, 
        onPress 
    }: { 
        label: string; 
        aspectRatio: AspectRatio; 
        currentImage: ImageState | null; 
        onPress: (ratio: AspectRatio) => void;
    }) => (
        <Pressable
            onPress={() => onPress(aspectRatio)}
            className={`px-4 py-2 rounded-full ${
                currentImage?.aspect?.[0] === aspectRatio[0] &&
                currentImage?.aspect?.[1] === aspectRatio[1]
                    ? "bg-accentStandardDark"
                    : "bg-gray-200"
            } mr-2`}
        >
            <Text
                className={
                    currentImage?.aspect?.[0] === aspectRatio[0] &&
                    currentImage?.aspect?.[1] === aspectRatio[1]
                        ? "text-white"
                        : "text-black"
                }
            >
                {label}
            </Text>
        </Pressable>
    );

    const pickImageWithAspect = async (aspectRatio: AspectRatio) => {
        await pickImage(aspectRatio);
    };

    return (
        <View className="p-[10px] gap-2">
            <Text className="font-bold">Carregar Imagem (Opcional)</Text>

            {!image ? (
                Platform.OS === 'web' ? (
                    <div
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => pickImage([1, 1])}
                        className="rounded-[20px] border-dashed border-2 border-borderStandard flex flex-col justify-center items-center bg-white py-7 px-4" 
                    >
                        <div className="w-12 h-12 bg-[#CBE2EF] flex items-center justify-center rounded-full">
                            <CustomIcons name="upload" size={24} />
                        </div>
                        <Text className="text-[14px] font-medium text-textStandardDark text-center">
                            <Text className="text-destaqueAzul">Clique aqui</Text> para enviar seu
                            arquivo ou arraste
                        </Text>
                        <Text className="text-textStandard text-[14px] text-center">
                            Formatos suportados: JPG, PNG (10mb cada)
                        </Text>
                    </div>
                ) : (
                    <Pressable
                        onPress={() => pickImage([1, 1])}
                        className="rounded-[20px] border-dashed border-2 border-borderStandard flex justify-center items-center bg-white py-7 px-4"
                    >
                        <View className="w-12 h-12 bg-[#CBE2EF] flex items-center justify-center rounded-full">
                            <CustomIcons name="upload" size={24} />
                        </View>
                        <Text className="text-[14px] font-medium text-textStandardDark text-center">
                            <Text className="text-destaqueAzul">Clique aqui</Text> para enviar seu
                            arquivo
                        </Text>
                        <Text className="text-textStandard text-[14px] text-center">
                            Formatos suportados: JPG, PNG (10mb cada)
                        </Text>
                    </Pressable>
                )
            ) : (
                <View className="gap-1">
                    <View className="flex-row mb-2">
                        <AspectRatioButton
                            label="1:1"
                            aspectRatio={[1, 1] as AspectRatio}
                            currentImage={image}
                            onPress={pickImageWithAspect}
                        />
                        <AspectRatioButton
                            label="16:9"
                            aspectRatio={[16, 9] as AspectRatio}
                            currentImage={image}
                            onPress={pickImageWithAspect}
                        />
                        <AspectRatioButton
                            label="4:5"
                            aspectRatio={[4, 5] as AspectRatio}
                            currentImage={image}
                            onPress={pickImageWithAspect}
                        />
                    </View>

                    <View className="rounded-[20px] border-2 border-borderStandard overflow-hidden">
                        <Image
                            source={{ uri: image.uri }}
                            className="w-full h-[300px]"
                            resizeMode="contain"
                        />
                    </View>

                    <Pressable
                        onPress={handleRemoveImage}
                        className="bg-transparent rounded-full items-start"
                    >
                        <Text className="text-red-500 font-bold">Remover</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
};

export default ImageUploadComponent;