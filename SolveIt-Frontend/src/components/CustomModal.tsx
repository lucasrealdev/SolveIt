import React from 'react';
import { Modal, View, Text, TouchableOpacity, Pressable } from 'react-native';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm?: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ 
  visible, 
  onClose, 
  title, 
  message, 
  onConfirm 
}) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 justify-center items-center bg-transparent px-2" onPress={onClose}>
        <View className="bg-[#1d1e22] rounded-lg p-6 max-w-[500px] transform scale-100 transition-transform duration-300 ease-in-out">
          <Text className="text-lg font-bold mb-2 text-white">{title}</Text>
          <Text className="text-base mb-4 text-[#6a6b6d]">{message}</Text>
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="bg-[#303137] rounded-md px-4 py-2"
              onPress={onClose}
            >
              <Text className="text-center text-white">Entendi</Text>
            </TouchableOpacity>
            {onConfirm && (
              <TouchableOpacity
                className="bg-blue-500 rounded-md px-4 py-2"
                onPress={() => {
                  if (onConfirm) onConfirm();
                  onClose();
                }}
              >
                <Text className="text-center text-white">Confirmar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default CustomModal;
