import React, { useState } from 'react';
import { View, Text, Pressable, Platform, Linking, Image as RNImage } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CustomIcons from '@/assets/icons/CustomIcons';
import { useAlert } from '@/context/AlertContext';
import { Camera } from 'expo-camera';

type AspectRatio = [number, number];

interface ImageUploadProps {
    onImageUpload: (image: any) => void; // Não alterado
    typeImage: 'profile' | 'banner';
    propUrlImage?: string;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
const ASPECT_RATIO_TOLERANCE = 0.1;

const ImageUploadUser: React.FC<ImageUploadProps> = ({
    onImageUpload,
    typeImage,
    propUrlImage
}) => {
    const { showAlert } = useAlert();
    const [image, setImage] = useState<{ uri: string; aspect?: AspectRatio } | null>(null);

    const [imageWeb, setImageWeb] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [urlImage, setUrlImage] = useState(propUrlImage);
    const isWeb = Platform.OS === 'web';

    const ACCEPTED_ASPECT_RATIOS: AspectRatio[] =
        typeImage === 'profile'
            ? [[1, 1]]    // Square for profile
            : typeImage === 'banner'
                ? [[3, 1]] // Wide for banner
                : [];     // No restrictions if no specific type

    const verifyImageAspectRatio = (
        width: number,
        height: number,
        acceptedRatios: AspectRatio[]
    ) => {
        const imageRatio = width / height;
        return acceptedRatios.some(([expectedWidth, expectedHeight]) => {
            const expectedRatio = expectedWidth / expectedHeight;
            return Math.abs(imageRatio - expectedRatio) < ASPECT_RATIO_TOLERANCE;
        });
    };

    const handleImageValidation = async (uri: string, fileType?: string, fileSize?: number) => {
        if (fileType && !ALLOWED_TYPES.includes(fileType)) {
            showAlert('Aviso', 'Formato de imagem não suportado. Use JPG ou PNG.');
            return false;
        }

        if (fileSize && fileSize > MAX_FILE_SIZE) {
            showAlert('Aviso', 'O tamanho da imagem deve ser menor que 50MB.');
            return false;
        }

        if (isWeb) {
            const img = new Image();
            img.src = uri;
            await new Promise((resolve) => {
                img.onload = resolve;
            });

            // Adjust alert message based on typeImage
            const aspectRatioErrorMessage =
                typeImage === 'profile'
                    ? 'A imagem deve ter uma proporção 1:1 (quadrada).'
                    : typeImage === 'banner'
                        ? 'A imagem deve ter uma proporção 3:1 (wide).'
                        : 'A imagem não tem a proporção esperada.';

            if (!verifyImageAspectRatio(img.width, img.height, ACCEPTED_ASPECT_RATIOS)) {
                showAlert('Aviso', aspectRatioErrorMessage);
                return false;
            }
        }

        return true;
    };

    const processImage = async (uri: string, type?: string, size?: number) => {
        try {
            const isValid = await handleImageValidation(uri, type, size);
            if (!isValid) return; // Não prossiga se a validação falhar

            // Ajusta o nome do arquivo baseado no tipo
            const extension = type === 'image/jpeg' ? 'jpg' : type?.split('/')[1];
            const processedImage = {
                name: `uploaded_image.${extension}`, // Usa a extensão ajustada
                type: type || 'image/jpeg',
                size: size || 0,
                uri,
            };

            setImage({ uri, aspect: typeImage === "profile" ? [1, 1] : [3, 1] });
            onImageUpload(processedImage);
        } catch (error) {
            console.log(error instanceof Error ? error.message : 'Erro ao processar imagem');
        }
    };

    const pickImage = async () => {
        // Perguntar se o usuário deseja usar a câmera ou a galeria
        const choice = await new Promise((resolve) => {
            showAlert(
                "Escolha uma Opção",
                "Deseja tirar uma foto ou escolher da galeria?",
                [
                    { text: "Câmera", onPress: () => resolve("camera") },
                    { text: "Galeria", onPress: () => resolve("gallery") },
                    { text: "Cancelar", onPress: () => resolve(null) },
                ]
            );
        });

        if (!choice) return; // O usuário cancelou

        if (choice === "camera") {
            // Verificar permissões da câmera
            const { status } = await Camera.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                showAlert(
                    "Permissão Necessária",
                    "As permissões de câmera são necessárias para tirar uma foto. Vá até as configurações do seu dispositivo e clique em permitir.",
                    [
                        { text: 'Abrir configurações', onPress: () => Linking.openSettings() },
                        { text: 'Recusar', onPress: () => null },
                    ]
                );
                return;
            }

            // Abrir a câmera com corte dinâmico
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: typeImage === "profile" ? [1, 1] : [3, 1],
                quality: 1,
            });


            if (!result.canceled && result.assets?.[0]) {
                const response = await fetch(result.assets[0].uri);
                const blob = await response.blob();
                await processImage(result.assets[0].uri, blob.type, blob.size);
            }
        } else if (choice === "gallery") {
            // Verificar permissões da galeria
            if (!isWeb) {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    showAlert(
                        "Permissão Necessária",
                        "As permissões de galeria são necessárias para selecionar uma imagem. Vá até as configurações do seu dispositivo e clique em permitir.",
                        [
                            { text: 'Abrir configurações', onPress: () => Linking.openSettings() },
                            { text: 'Recusar', onPress: () => null },
                        ]
                    );
                    return;
                }
            }

            // Abrir a galeria com corte dinâmico
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: typeImage === "profile" ? [1, 1] : [3, 1],
                quality: 1,
            });

            if (!result.canceled && result.assets?.[0]) {
                const response = await fetch(result.assets[0].uri);
                const blob = await response.blob();
                await processImage(result.assets[0].uri, blob.type, blob.size);
            }
        }
    };

    const validateImage = (file: File, onSuccess: (imageUrl: string, aspectRatio: string) => void) => {
        if (!file) {
            showAlert('Aviso', 'Nenhum arquivo selecionado.');
            return;
        }

        const MAX_SIZE_MB = 50;
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            showAlert('Aviso', 'O arquivo selecionado é maior que 50MB. Por favor, escolha outro arquivo.');
            return;
        }

        // Cria uma URL temporária para analisar as dimensões da imagem
        const imageUrl = URL.createObjectURL(file);
        const img = new Image();
        img.src = imageUrl;

        img.onload = () => {
            const width = img.width;
            const height = img.height;

            // Calcula o aspect ratio
            const ratio = width / height;

            const aspectRatios =
                typeImage === 'profile'
                    ? [{ label: '1:1', ratio: 1 }] // Apenas 1:1 para "profile"
                    : typeImage === 'banner'
                        ? [{ label: '3:1', ratio: 3 / 1 }] // Apenas 3:1 para "banner"
                        : []; // Retorna vazio para outros valores de typeImage

            // Encontra o aspecto mais próximo
            let closestAspectRatio = aspectRatios[0]; // Padrão é 1:1
            let minDifference = Math.abs(ratio - aspectRatios[0].ratio);

            aspectRatios.forEach((r) => {
                const diff = Math.abs(ratio - r.ratio);
                if (diff < minDifference) {
                    closestAspectRatio = r;
                    minDifference = diff;
                }
            });

            // Verifica se o aspecto encontrado é suficientemente próximo de um dos formatos válidos
            if (minDifference > 0.05) {
                const message = typeImage === 'profile'
                    ? 'Formato inválido. Use imagens com proporção 1:1.'
                    : typeImage === 'banner'
                        ? 'Formato inválido. Use imagens com proporção 3:1.'
                        : 'Formato inválido. Use proporções válidas.';

                showAlert('Aviso', message);
                return;
            }

            // Chama a função de sucesso com a URL da imagem e o aspect ratio correto
            onSuccess(imageUrl, closestAspectRatio.label);
        };

        img.onerror = () => {
            showAlert('Aviso', 'Erro ao carregar a imagem. Por favor, tente novamente.');
        };
    };

    // Função de seleção de imagem
    const pickImageWeb = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            validateImage(file, (imageUrl) => {
                setImageWeb(file);
                setPreviewUrl(imageUrl);
                onImageUpload(file)
            });
        }
    };

    // Função de drop
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            validateImage(file, (imageUrl) => {
                setImageWeb(file);
                setPreviewUrl(imageUrl);
                onImageUpload(file)
            });
        }
    };

    const componentText = () => {
        return (
            <>
                <View className="w-12 h-12 bg-[#CBE2EF] flex items-center justify-center rounded-full">
                    <CustomIcons name="upload" size={24} />
                </View>
                <Text className="text-[14px] font-medium text-textStandardDark text-center">
                    <Text className="text-destaqueAzul">Clique aqui</Text> para enviar seu
                    arquivo
                </Text>
                <Text className="text-textStandard text-[14px] text-center">
                    {typeImage === 'profile'
                        ? 'Formato suportado: 1:1 (JPG, PNG até 50MB)'
                        : typeImage === 'banner'
                            ? 'Formato suportado: 3:1 (JPG, PNG até 50MB)'
                            : 'Formatos suportados: JPG, PNG (50MB cada)'}
                </Text>
            </>
        )
    }

    return (
        <View className="flex-1 min-w-[300px]">
            {!imageWeb && !image && !urlImage ? (
                isWeb ? (
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('fileInput' + typeImage)?.click()}
                        className="rounded-[20px] border-dashed border-2 border-borderStandard flex flex-col justify-center items-center bg-white py-7 px-4"
                    >
                        {componentText()}
                        <input
                            id={`fileInput${typeImage}`}
                            type="file"
                            accept="image/png, image/jpeg, image/jpg" // Define os tipos de arquivo permitidos
                            onChange={pickImageWeb} // Função para lidar com a seleção de arquivos
                            className="hidden" // Oculta o input
                        />
                    </div>
                ) : (
                    <Pressable
                        onPress={pickImage}
                        className="rounded-[20px] border-dashed border-2 border-borderStandard flex justify-center items-center bg-white py-7 px-4"
                    >
                        {componentText()}
                    </Pressable>
                )
            ) : (
                <View className="gap-1">
                    <View className="rounded-[20px] border-2 border-borderStandard overflow-hidden items-center">
                        {isWeb ? (
                            <img
                                src={urlImage && urlImage.trim() !== '' ? urlImage : previewUrl}
                                alt="Preview"
                                style={{
                                    width: '100%',
                                    aspectRatio: typeImage === 'profile' ? '1 / 1' : '3 / 1', // Verifica o tipo de imagem
                                    objectFit: 'contain',
                                    maxWidth: typeImage === 'profile' ? '30%' : '1000px', // Define largura máxima para profile

                                    borderRadius: typeImage === 'profile' ? 9999 : 20,
                                    border: typeImage === 'profile' ? '2px solid black' : 'none', // Borda preta somente para profile
                                }}
                            />
                        ) : (
                            <RNImage
                                source={{ uri: urlImage && urlImage.trim() !== '' ? urlImage : image.uri }}
                                resizeMode="contain"
                                style={{
                                    width: typeImage === 'profile' ? '50%' : '100%',  // Define largura para 'profile' como 30% e 'banner' como 100%
                                    aspectRatio: typeImage === 'profile' ? 1 : 3,     // Mantém a proporção 1:1 para profile e 3:1 para banner
                                    maxWidth: typeImage === 'profile' ? '50%' : 1000,  // Define largura máxima para profile como 30% e banner como 1000px
                                    borderRadius: typeImage === 'profile' ? 9999 : 20, // Borda arredondada para 'profile'
                                    borderWidth: typeImage === 'profile' ? 2 : 0,      // Borda preta somente para profile
                                    borderColor: typeImage === 'profile' ? 'black' : 'transparent', // Borda preta somente para profile
                                    overflow: 'hidden', // Garante que a borda arredondada não ultrapasse a imagem
                                }}
                            />
                        )}
                    </View>
                    <Pressable
                        onPress={() => {
                            setImage(null);
                            onImageUpload(null);
                            setImageWeb(null);
                            setPreviewUrl(null);
                            setUrlImage(null);
                        }}
                        className="bg-transparent rounded-full items-start"
                    >
                        <Text className="text-red-500 font-bold">Remover</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
};

export default ImageUploadUser; 