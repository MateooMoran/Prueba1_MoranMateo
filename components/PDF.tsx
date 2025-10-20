import React from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import { X } from 'lucide-react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  imageUri: string;
  descripcion: string;
  monto: number;
};

export default function ReciboModal({
  visible,
  onClose,
  imageUri,
  descripcion,
  monto,
}: Props) {
  const { width, height } = Dimensions.get('window');

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black">
        {/* Header */}
        <View className="absolute top-0 left-0 right-0 z-10 pt-12 pb-4 px-6 bg-black/50">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-white text-lg font-bold mb-1">
                {descripcion}
              </Text>
              <Text className="text-white text-sm opacity-80">
                ${monto.toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="bg-white/20 rounded-full p-2 ml-4"
            >
              <X size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Imagen del recibo */}
        <View className="flex-1 justify-center items-center">
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{
                width: width,
                height: height,
              }}
              resizeMode="contain"
            />
          ) : (
            <View className="items-center">
              <Text className="text-white text-lg mb-2">
                No hay imagen de recibo
              </Text>
              <Text className="text-white/60 text-sm">
                Este gasto no tiene foto adjunta
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View className="absolute bottom-0 left-0 right-0 pb-8 pt-4 px-6 bg-black/50">
          <TouchableOpacity
            onPress={onClose}
            className="bg-white rounded-xl py-4"
          >
            <Text className="text-black text-center text-base font-semibold">
              Cerrar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}