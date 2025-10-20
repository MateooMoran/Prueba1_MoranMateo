import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Users } from 'lucide-react-native';
import NuevoGastoModal from '@/components/ButtonNew';
import { useGastos } from '@/contexts/GastosContext';

type NuevoGasto = {
  descripcion: string;
  monto: string;
  pagadoPor: string;
  participantes: string[];
  fotoUri: string | null;
};

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const { gastos, agregarGasto, totalGastos, cargando } = useGastos();

  const handleGuardarGasto = async (nuevoGasto: NuevoGasto) => {
    await agregarGasto({
      descripcion: nuevoGasto.descripcion,
      monto: Number(nuevoGasto.monto),
      pagadoPor: nuevoGasto.pagadoPor,
      fotoUri: nuevoGasto.fotoUri || '',
      participantes: nuevoGasto.participantes, 
      categoria: 'General',
    });
    setModalVisible(false);
  };

  if (cargando) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-gray-600 mt-4">Cargando gastos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header con gradiente azul */}
      <View className="bg-blue-600 rounded-b-3xl pt-12 pb-8 px-6 shadow-lg">
        <Text className="text-white text-3xl font-bold mb-6">
          Gastos Compartidos
        </Text>

        {/* Card de Total Gastado */}
        <View className="bg-blue-500 bg-opacity-40 rounded-2xl p-5">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-blue-100 text-sm font-medium">Total gastado</Text>
            <View className="bg-white bg-opacity-20 rounded-full p-2">
              <Users size={18} color="#ffffff" />
            </View>
          </View>
          <Text className="text-white text-4xl font-bold mb-1">
            ${totalGastos.toFixed(2)}
          </Text>
          <Text className="text-blue-100 text-sm">Octubre 2025</Text>
        </View>
      </View>

      {/* Lista de Gastos */}
      <View className="flex-1 px-6 pt-6">
        <Text className="text-gray-900 text-xl font-bold mb-4">Gastos</Text>

        {gastos.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-400 text-lg mb-2">No hay gastos aún</Text>
            <Text className="text-gray-400 text-sm">Presiona el botón + para agregar uno</Text>
          </View>
        ) : (
          <FlatList
            data={gastos}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm">
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text className="text-gray-900 text-base font-semibold mb-1">
                      {item.descripcion}
                    </Text>
                    <Text className="text-gray-500 text-sm">Pagado por {item.pagadoPor}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-gray-900 text-lg font-bold">${item.monto}</Text>
                    <Text className="text-gray-400 text-xs mt-1">{item.fecha}</Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center">
                  {/* Participantes */}
                  <View className="flex-row gap-1">
                    {item.participantes.map((p, idx) => (
                      <View
                        key={idx}
                        className="bg-blue-100 w-8 h-8 rounded-full items-center justify-center"
                      >
                        <Text className="text-blue-600 text-xs font-semibold">{p}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Estado del recibo */}
                  {item.fotoUri ? (
                    <View className="flex-row items-center">
                      <View className="bg-green-500 w-2 h-2 rounded-full mr-1" />
                      <Text className="text-green-600 text-xs font-medium">Recibo verificado</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>

      {/* Botón flotante */}
      <TouchableOpacity
        className="absolute bottom-20 right-6 bg-blue-600 w-16 h-16 rounded-full justify-center items-center shadow-xl"
        onPress={() => setModalVisible(true)}
        style={{
          shadowColor: '#2563eb',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Text className="text-white text-3xl font-light">+</Text>
      </TouchableOpacity>

      <NuevoGastoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleGuardarGasto}
      />
    </SafeAreaView>
  );
}
