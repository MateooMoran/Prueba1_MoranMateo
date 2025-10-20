import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Camera, Search } from 'lucide-react-native';
import { useGastos } from '@/contexts/GastosContext';
import ReciboModal from '@/components/Recibo';

export default function Recibos() {
  const { gastos } = useGastos();
  const [modalVisible, setModalVisible] = useState(false);
  const [reciboSeleccionado, setReciboSeleccionado] = useState<{
    uri: string;
    descripcion: string;
    monto: number;
  } | null>(null);

  const verRecibo = (uri: string, descripcion: string, monto: number) => {
    setReciboSeleccionado({ uri, descripcion, monto });
    setModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header naranja */}
      <View className="bg-orange-600 pt-12 pb-8 px-6">
        <Text className="text-white text-3xl font-bold mb-2">
          Galería de Recibos
        </Text>
        <Text className="text-orange-100 text-base">
          {gastos.length} recibos registrados
        </Text>
      </View>

      <ScrollView className="flex-1">
        {/* Info de Recibos Verificados */}
        <View className="mx-6 mt-6 mb-4 bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <View className="flex-row items-start">
            <Camera size={24} color="#3b82f6" className="mr-3" />
            <View className="flex-1">
              <Text className="text-blue-700 text-base font-semibold mb-1">
                Recibos Verificados
              </Text>
              <Text className="text-blue-600 text-sm">
                Todos los gastos incluyen foto del recibo para mayor control
              </Text>
            </View>
          </View>
        </View>

        {gastos.length === 0 ? (
          <View className="px-6 py-20 items-center">
            <Text className="text-gray-400 text-lg mb-2">
              No hay recibos aún
            </Text>
            <Text className="text-gray-400 text-sm text-center">
              Agrega gastos desde la pantalla principal
            </Text>
          </View>
        ) : (
          <>
            {/* Grid de Recibos */}
            <View className="px-6 pb-6">
              <View className="flex-row flex-wrap justify-between">
                {gastos.map((gasto) => (
                  <View key={gasto.id} className="w-[48%] mb-4">
                    {/* Card del recibo */}
                    <TouchableOpacity
                      onPress={() => verRecibo(gasto.fotoUri, gasto.descripcion, gasto.monto)}
                      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                    >
                      {/* Área de imagen */}
                      <View className="bg-gray-100 h-40 items-center justify-center relative">
                        {gasto.fotoUri ? (
                          <Image
                            source={{ uri: gasto.fotoUri }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        ) : (
                          // Ícono de recibo placeholder
                          <View className="items-center">
                            <View className="bg-purple-200 rounded-2xl px-6 py-8 shadow-sm">
                              <View className="space-y-1">
                                <View className="bg-purple-400 h-1 w-16 rounded" />
                                <View className="bg-purple-400 h-1 w-16 rounded" />
                                <View className="bg-purple-400 h-1 w-16 rounded" />
                                <View className="bg-purple-400 h-1 w-12 rounded" />
                              </View>
                            </View>
                          </View>
                        )}

                        {/* Botón de búsqueda/zoom */}
                        <View className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md">
                          <Search size={16} color="#6b7280" />
                        </View>
                      </View>

                      {/* Info del recibo */}
                      <View className="p-3">
                        <Text className="text-gray-900 text-base font-semibold mb-1">
                          {gasto.descripcion}
                        </Text>
                        <View className="flex-row justify-between items-center">
                          <Text className="text-gray-500 text-sm">
                            {gasto.fecha}
                          </Text>
                          <Text className="text-blue-600 text-base font-bold">
                            ${gasto.monto}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* Footer con total */}
            <View className="items-center py-8 border-t border-gray-200 mx-6">
              <Text className="text-gray-900 text-5xl font-bold mb-2">
                {gastos.length}
              </Text>
              <Text className="text-gray-500 text-base">Total Recibos</Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* Modal para ver recibo completo */}
      {reciboSeleccionado && (
        <ReciboModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          imageUri={reciboSeleccionado.uri}
          descripcion={reciboSeleccionado.descripcion}
          monto={reciboSeleccionado.monto}
        />
      )}
    </SafeAreaView>
  );
}