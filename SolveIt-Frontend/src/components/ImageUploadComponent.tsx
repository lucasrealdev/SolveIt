import React, { useState } from 'react';
import { View, Text, Pressable, Platform, Linking, Image as RNImage } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CustomIcons from '@/assets/icons/CustomIcons';
import { useAlert } from '@/context/AlertContext';

type AspectRatio = [number, number];

interface ImageUploadProps {
    onImageUpload: (image: any) => void; // Não alterado
    onAspectRatioCalculated?: (ratio: String) => void; // Nova função opcional
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
const ASPECT_RATIO_TOLERANCE = 0.1;

const ImageUploadComponent: React.FC<ImageUploadProps> = ({
    onImageUpload,
    onAspectRatioCalculated,
}) => {
    const { showAlert } = useAlert();
    const [image, setImage] = useState<{ uri: string; aspect?: AspectRatio } | null>(null);

    const [imageWeb, setImageWeb] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const isWeb = Platform.OS === 'web';

    const cropImage = async (aspect: AspectRatio) => {
        if (!image) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect,
            quality: 1,
        });

        if (!result.canceled && result.assets?.[0]) {
            const response = await fetch(result.assets[0].uri);
            const blob = await response.blob();

            const croppedImage = {
                name: 'cropped_image',
                type: blob.type,
                size: blob.size,
                uri: result.assets[0].uri,
            };

            setImage({ uri: croppedImage.uri, aspect });
            onImageUpload(croppedImage);
        }
    };

    const ACCEPTED_ASPECT_RATIOS: AspectRatio[] = [
        [1, 1], // Square
        [16, 9], // Wide
        [4, 5], // Portrait
        [3, 4],
    ];

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
            showAlert('Aviso', 'O tamanho da imagem deve ser menor que 5MB.');
            return false;
        }

        if (isWeb) {
            const img = new Image();
            img.src = uri;
            await new Promise((resolve) => {
                img.onload = resolve;
            });

            if (!verifyImageAspectRatio(img.width, img.height, ACCEPTED_ASPECT_RATIOS)) {
                showAlert('Aviso', 'A imagem deve ter uma proporção válida (1:1, 3:4, 16:9 ou 4:5).');
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
    
            setImage({ uri, aspect: [1, 1] });
            onImageUpload(processedImage);
        } catch (error) {
            console.log(error instanceof Error ? error.message : 'Erro ao processar imagem');
        }
    };

    const pickImage = async () => {
        if (!isWeb) {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                showAlert(
                    "Permissão Necessária",
                    "As permissões de câmera são necessárias para selecionar uma imagem. Vá até as configurações do seu dispositivo e clique em permitir tudo em Fotos e Videos.",
                    [
                        { text: 'Abrir configurações', onPress: () => Linking.openSettings() },
                        { text: 'Recusar', onPress: () => null },
                    ],
                    10000
                );
                return;
            }
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4], // Default aspect ratio for cropping
            quality: 1,
        });

        if (!result.canceled && result.assets?.[0]) {
            const response = await fetch(result.assets[0].uri);
            const blob = await response.blob();
            await processImage(result.assets[0].uri, blob.type, blob.size);
        }
    };

    const validateImage = (file: File, onSuccess: (imageUrl: string, aspectRatio: string) => void) => {
        if (!file) {
            showAlert('Aviso', 'Nenhum arquivo selecionado.');
            return;
        }

        // Verifica se o tamanho do arquivo é menor que 10MB
        const MAX_SIZE_MB = 5;
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            showAlert('Aviso', 'O arquivo selecionado é maior que 5MB. Por favor, escolha outro arquivo.');
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

            // Mapeia os aspect ratios esperados
            const aspectRatios = [
                { label: '1:1', ratio: 1 },
                { label: '16:9', ratio: 16 / 9 },
                { label: '4:5', ratio: 4 / 5 },
                { label: '3:4', ratio: 3 / 4 },
            ];

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
                showAlert('Aviso', 'Formato inválido. Use imagens com proporções 1:1, 3:4, 16:9 ou 4:5.');
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
        validateImage(file, (imageUrl, aspectRatio) => {
            setImageWeb(file);
            setPreviewUrl(imageUrl);
            onImageUpload(file)
            onAspectRatioCalculated(aspectRatio)
        });
    };

    // Função de drop
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            validateImage(file, (imageUrl, aspectRatio) => {
                setImageWeb(file);
                setPreviewUrl(imageUrl);
                onImageUpload(file)
                onAspectRatioCalculated(aspectRatio)
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
                    Formatos suportados: JPG, PNG (10mb cada)
                </Text>
            </>
        )
    }

    const renderCropButton = (label: string, aspect: AspectRatio) => (
        <Pressable
            key={label}
            onPress={() => cropImage(aspect)}
            className="bg-blue-500 rounded-full px-4 py-2 mx-1"
        >
            <Text className="text-white font-bold">{label}</Text>
        </Pressable>
    );

    return (
        <View className="p-[10px] gap-2">
            <Text className="font-bold">Carregar Imagem (Opcional)</Text>

            {!imageWeb && !image ? (
                isWeb ? (
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('fileInput')?.click()}
                        className="rounded-[20px] border-dashed border-2 border-borderStandard flex flex-col justify-center items-center bg-white py-7 px-4"
                    >
                        {componentText()}
                        <input
                            id="fileInput"
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
                    {isWeb ? null : (
                        <View className="flex-row justify-center mt-2">
                            {renderCropButton('1:1', [1, 1])}
                            {renderCropButton('16:9', [16, 9])}
                            {renderCropButton('4:5', [4, 5])}
                            {renderCropButton('3:4', [3, 4])}
                        </View>
                    )}
                    <View className="rounded-[20px] border-2 border-borderStandard overflow-hidden">
                        {isWeb ? (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-[300px] object-contain"
                            />
                        ) : (
                            <RNImage
                                source={{ uri: image.uri }}
                                className="w-full h-[300px]"
                                resizeMode="contain"
                            />
                        )}
                    </View>
                    <Pressable
                        onPress={() => {
                            setImage(null);
                            onImageUpload(null);
                            setImageWeb(null);
                            setPreviewUrl(null);
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

export default ImageUploadComponent; 