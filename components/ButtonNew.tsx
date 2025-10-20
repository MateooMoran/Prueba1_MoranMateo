import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (gasto: {
    descripcion: string;
    monto: string;
    pagadoPor: string;
    fotoUri: string | null;
  }) => void;
};

const PARTICIPANTES = ['Juan', 'Maria', 'Pedro'];

export default function NuevoGastoModal({ visible, onClose, onSave }: Props) {
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [pagadoPor, setPagadoPor] = useState('');
  const [fotoUri, setFotoUri] = useState<string | null>(null);

  // Pedir permiso para cámara y galería
  const pedirPermisos = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Se necesitan permisos para acceder a las fotos');
      }
    }
  };

  useEffect(() => {
    pedirPermisos();
  }, []);

  // Tomar foto
  const tomarFoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
      allowsEditing: true,
    });
    if (!result.canceled) {
      setFotoUri(result.assets[0].uri);
    }
  };

  // Guardar gasto
  const guardarGasto = () => {
    if (!descripcion.trim()) {
      alert('Por favor ingresa una descripción');
      return;
    }
    if (!monto.trim() || parseFloat(monto) <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }
    if (!pagadoPor) {
      alert('Por favor selecciona quién pagó');
      return;
    }
    if (!fotoUri) {
      alert('Por favor toma una foto del recibo. Es obligatorio.');
      return;
    }
    
    onSave({ descripcion, monto, pagadoPor, fotoUri });
    
    // Resetear campos
    setDescripcion('');
    setMonto('');
    setPagadoPor('');
    setFotoUri(null);
    onClose();
  };

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      transparent 
      presentationStyle="overFullScreen"
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl w-full shadow-2xl" style={{ maxHeight: '90%' }}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
            <Text className="text-2xl font-bold text-gray-900">Nuevo Gasto</Text>
            <TouchableOpacity onPress={onClose} className="p-2 -mr-2">
              <Text className="text-3xl text-gray-400 font-light">×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            className="px-6"
            showsVerticalScrollIndicator={false}
          >
            {/* Descripción */}
            <View className="mb-4">
              <Text className="text-gray-600 text-sm mb-2 font-medium">
                Descripción
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                placeholder="Ej: Cena con amigos"
                placeholderTextColor="#9CA3AF"
                value={descripcion}
                onChangeText={setDescripcion}
              />
            </View>

            {/* Monto */}
            <View className="mb-4">
              <Text className="text-gray-600 text-sm mb-2 font-medium">
                Monto
              </Text>
              <View className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row items-center">
                <Text className="text-gray-400 text-base mr-2">$</Text>
                <TextInput
                  className="flex-1 text-gray-800"
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  value={monto}
                  onChangeText={setMonto}
                />
              </View>
            </View>

            {/* ¿Quién pagó? - Dropdown simulado */}
            <View className="mb-4">
              <Text className="text-gray-600 text-sm mb-2 font-medium">
                ¿Quién pagó?
              </Text>
              <View className="bg-gray-50 border border-gray-200 rounded-xl">
                <TouchableOpacity className="px-4 py-3 flex-row items-center justify-between">
                  <Text className={pagadoPor ? "text-gray-800" : "text-gray-400"}>
                    {pagadoPor || "Seleccionar persona"}
                  </Text>
                  <Text className="text-gray-400">▼</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Participantes - Chips */}
            <View className="mb-5">
              <Text className="text-gray-600 text-sm mb-3 font-medium">
                Participantes
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {PARTICIPANTES.map((p) => (
                  <TouchableOpacity
                    key={p}
                    className={`px-5 py-2 rounded-full ${
                      pagadoPor === p
                        ? 'bg-blue-100'
                        : 'bg-blue-50'
                    }`}
                    onPress={() => setPagadoPor(p)}
                  >
                    <Text
                      className={`${
                        pagadoPor === p 
                          ? 'text-blue-600 font-semibold' 
                          : 'text-blue-500'
                      }`}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Foto del Recibo */}
            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <Text className="text-gray-600 text-sm font-medium mr-2">
                  Foto del Recibo
                </Text>
                <Text className="text-red-500 text-xs">*</Text>
                <View className="bg-red-100 px-2 py-1 rounded ml-2">
                  <Text className="text-red-600 text-xs font-medium">
                    Obligatorio
                  </Text>
                </View>
              </View>

              {fotoUri ? (
                <View className="relative">
                  <Image
                    source={{ uri: fotoUri }}
                    className="w-full h-48 rounded-xl"
                    resizeMode="cover"
                  />
                  <TouchableOpacity 
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow"
                    onPress={() => setFotoUri(null)}
                  >
                    <Text className="text-gray-600">✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  className="border-2 border-dashed border-gray-300 rounded-xl py-10 items-center bg-gray-50"
                  onPress={tomarFoto}
                >
                  <View className="bg-gray-200 rounded-full p-4 mb-3">
                    <Text className="text-4xl">📷</Text>
                  </View>
                  <Text className="text-gray-700 font-semibold text-base mb-1">
                    Tomar Foto del Recibo
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    Es necesario para registrar el gasto
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="px-6 pb-8 pt-4 border-t border-gray-100 bg-white">
            <TouchableOpacity
              className="bg-blue-600 rounded-xl py-4 flex-row items-center justify-center shadow-lg mb-3"
              onPress={guardarGasto}
            >
              <Text className="text-white text-base font-semibold mr-2">📷</Text>
              <Text className="text-white text-base font-semibold">
                Guardar Gasto con Recibo
              </Text>
            </TouchableOpacity>
            
            <View className="flex-row items-center justify-center">
              <Text className="text-gray-400 text-xs mr-1">📷</Text>
              <Text className="text-gray-500 text-xs">
                Todos los gastos deben incluir foto del recibo
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}