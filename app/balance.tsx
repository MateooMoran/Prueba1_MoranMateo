import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useGastos } from '@/contexts/GastosContext';

const PARTICIPANTES = ['Juan', 'Maria', 'Pedro'];

export default function Balance() {
  const { gastos, totalGastos } = useGastos();

  // Calcular cuánto pagó cada persona
  const gastosPagadosPorPersona: { [key: string]: number } = {};
  PARTICIPANTES.forEach(p => {
    gastosPagadosPorPersona[p] = gastos
      .filter(g => g.pagadoPor === p)
      .reduce((acc, g) => acc + g.monto, 0);
  });

  // Calcular cuánto debe pagar cada persona según su participación
  const gastosAsignadosPorPersona: { [key: string]: number } = {};
  PARTICIPANTES.forEach(p => {
    gastosAsignadosPorPersona[p] = 0;
  });

  gastos.forEach(gasto => {
    const numParticipantes = gasto.participantes.length;
    const montoPorParticipante = gasto.monto / numParticipantes;

    gasto.participantes.forEach(participanteInicial => {
      // Obtener nombre completo del participante a partir de la inicial
      const participanteNombre = PARTICIPANTES.find(p => p[0] === participanteInicial);
      if (participanteNombre) {
        gastosAsignadosPorPersona[participanteNombre] += montoPorParticipante;
      }
    });
  });

  // Función para calcular las deudas simplificadas (quién debe a quién y cuánto)
  const calcularDeudas = () => {
    // Balance: pagado - asignado
    const balancePorPersona: { [key: string]: number } = {};
    PARTICIPANTES.forEach(p => {
      const pagado = gastosPagadosPorPersona[p] || 0;
      const asignado = gastosAsignadosPorPersona[p] || 0;
      balancePorPersona[p] = pagado - asignado;
    });

    // Separar deudores y acreedores
    const deudores = Object.entries(balancePorPersona)
      .filter(([_, balance]) => balance < 0)
      .map(([persona, balance]) => ({ persona, deuda: -balance }));

    const acreedores = Object.entries(balancePorPersona)
      .filter(([_, balance]) => balance > 0)
      .map(([persona, balance]) => ({ persona, credito: balance }));

    const deudas: { deudor: string; acreedor: string; monto: number }[] = [];

    let i = 0; // índice de deudores
    let j = 0; // índice de acreedores

    while (i < deudores.length && j < acreedores.length) {
      const deudor = deudores[i];
      const acreedor = acreedores[j];

      const monto = Math.min(deudor.deuda, acreedor.credito);

      deudas.push({
        deudor: deudor.persona,
        acreedor: acreedor.persona,
        monto,
      });

      deudor.deuda -= monto;
      acreedor.credito -= monto;

      if (deudor.deuda === 0) i++;
      if (acreedor.credito === 0) j++;
    }

    return deudas;
  };

  const deudas = calcularDeudas();

  const getInicial = (nombre: string) => nombre[0];

  const promedioPorPersona = totalGastos / PARTICIPANTES.length;

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
              {deudas.length === 0
                ? '¡Todo está equilibrado!'
                : 'Resumen de Deudas: Quién debe a quién'}
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

                  {/* Monto */}
                  <View className="items-end">
                    <Text className="text-red-600 text-xl font-bold mb-2">
                      ${deuda.monto.toFixed(2)}
                    </Text>
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
                  ${gastosPagadosPorPersona[persona]?.toFixed(2) || '0.00'}
                </Text>{' '}
                y debe pagar:{' '}
                <Text className="font-semibold">
                  ${gastosAsignadosPorPersona[persona]?.toFixed(2) || '0.00'}
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
