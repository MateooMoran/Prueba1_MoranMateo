import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useGastos } from '@/contexts/GastosContext';

const PARTICIPANTES = ['Juan', 'Maria', 'Pedro'];

export default function Balance() {
  const { calcularDeudas, totalGastos } = useGastos();
  const deudas = calcularDeudas();

  // Calcular gastos por persona
  const { gastos } = useGastos();
  const gastosPorPersona: { [key: string]: number } = {};
  
  PARTICIPANTES.forEach(p => {
    gastosPorPersona[p] = gastos
      .filter(g => g.pagadoPor === p)
      .reduce((acc, g) => acc + g.monto, 0);
  });

  const promedioPorPersona = totalGastos / PARTICIPANTES.length;

  const marcarPagado = (deudor: string, acreedor: string) => {
    // Aquí podrías agregar lógica para marcar deudas como pagadas
    console.log(`${deudor} pagó a ${acreedor}`);
    alert(`Funcionalidad de marcar pagado: ${deudor} → ${acreedor}`);
  };

  const getInicial = (nombre: string) => nombre[0];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header púrpura */}
      <View className="bg-purple-600 pt-12 pb-8 px-6">
        <Text className="text-white text-3xl font-bold mb-2">
          Balance de Cuentas
        </Text>
        <Text className="text-purple-200 text-base">
          ¿Quién debe a quién?
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Resumen de Deudas */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <Text className="text-green-600 text-2xl font-bold mr-2">$</Text>
            <Text className="text-gray-800 text-xl font-bold">
              Resumen de Deudas
            </Text>
          </View>

          {deudas.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 items-center border border-gray-100">
              <Text className="text-gray-400 text-lg mb-2">
                ¡Todo está equilibrado!
              </Text>
              <Text className="text-gray-400 text-sm text-center">
                No hay deudas pendientes entre los participantes
              </Text>
            </View>
          ) : (
            deudas.map((deuda, index) => (
              <View
                key={index}
                className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    {/* Avatar con inicial */}
                    <View className="bg-red-100 w-12 h-12 rounded-full items-center justify-center mr-4">
                      <Text className="text-red-600 text-lg font-bold">
                        {getInicial(deuda.deudor)}
                      </Text>
                    </View>

                    {/* Info de la deuda */}
                    <View className="flex-1">
                      <Text className="text-gray-900 text-base font-semibold mb-1">
                        {deuda.deudor}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        debe a {deuda.acreedor}
                      </Text>
                    </View>
                  </View>

                  {/* Monto y botón */}
                  <View className="items-end">
                    <Text className="text-red-600 text-xl font-bold mb-2">
                      ${deuda.monto.toFixed(2)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => marcarPagado(deuda.deudor, deuda.acreedor)}
                      className="bg-blue-50 px-3 py-1 rounded-lg"
                    >
                      <Text className="text-blue-600 text-xs font-semibold">
                        Marcar pagado
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Algoritmo de División */}
        <View className="bg-green-50 rounded-2xl p-5 mb-6 border border-green-200">
          <Text className="text-green-800 text-lg font-bold mb-3">
            Algoritmo de División
          </Text>
          <Text className="text-green-700 text-sm mb-4">
            Método: Simplificación de deudas
          </Text>

          <View className="mb-4">
            {PARTICIPANTES.map((persona) => (
              <Text key={persona} className="text-gray-700 text-sm mb-1">
                {persona} gastó:{' '}
                <Text className="font-semibold">
                  ${gastosPorPersona[persona]?.toFixed(2) || '0.00'}
                </Text>
              </Text>
            ))}
          </View>

          <View className="border-t border-green-300 pt-3">
            <Text className="text-gray-700 text-sm">
              Promedio por persona:{' '}
              <Text className="font-bold text-gray-900">
                ${promedioPorPersona.toFixed(2)}
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}