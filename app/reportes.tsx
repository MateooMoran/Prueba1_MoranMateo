import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Download, Share2, Calendar } from 'lucide-react-native';
import { useGastos } from '@/contexts/GastosContext';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { generarHTMLPDF } from '@/components/PDF';

type Categoria = {
  nombre: string;
  monto: number;
  color: string;
  porcentaje: number;
};

export default function Reporte() {
  const { totalGastos, promedioPorDia, gastosPorCategoria, gastos, calcularDeudas } = useGastos();

  // Estados de fechas como Date
  const [fechaInicio, setFechaInicio] = useState(new Date(2025, 9, 1)); // Octubre es 9 (mes 0-indexed)
  const [fechaFin, setFechaFin] = useState(new Date(2025, 9, 17));
  const [showDatePicker, setShowDatePicker] = useState<null | 'inicio' | 'fin'>(null);
  const [generandoPDF, setGenerandoPDF] = useState(false);

  const PARTICIPANTES = ['Juan', 'Maria', 'Pedro'];
  const categoriasData = gastosPorCategoria();

  const colores = ['bg-blue-600', 'bg-purple-600', 'bg-orange-600', 'bg-green-600', 'bg-pink-600'];
  const categorias: Categoria[] = categoriasData.map((cat, index) => ({
    ...cat,
    color: colores[index % colores.length],
    porcentaje: totalGastos > 0 ? (cat.monto / totalGastos) * 100 : 0,
  }));

  const gastosPorPersona: { [key: string]: number } = {};
  PARTICIPANTES.forEach(p => {
    gastosPorPersona[p] = gastos
      .filter(g => g.pagadoPor === p)
      .reduce((acc, g) => acc + g.monto, 0);
  });

  const deudas = calcularDeudas();

  // Formatear fecha a DD/MM/YYYY
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onChangeFecha = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      if (showDatePicker === 'inicio') {
        setFechaInicio(selectedDate);
      } else if (showDatePicker === 'fin') {
        setFechaFin(selectedDate);
      }
    }
    if (Platform.OS === 'android') {
      setShowDatePicker(null);
    }
  };

  const generarPDF = async () => {
    try {
      setGenerandoPDF(true);
      const html = generarHTMLPDF({
        fechaInicio: formatDate(fechaInicio),
        fechaFin: formatDate(fechaFin),
        totalGastos,
        promedioPorDia,
        gastos,
        participantes: PARTICIPANTES,
        categorias,
        gastosPorPersona,
        deudas,
      });

      const { uri } = await Print.printToFileAsync({ html, base64: false });

      Alert.alert(
        'PDF Generado',
        '¿Qué deseas hacer?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Compartir',
            onPress: async () => {
              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
              } else {
                Alert.alert('Error', 'La función de compartir no está disponible');
              }
            },
          },
          {
            text: 'Vista Previa',
            onPress: () => Print.printAsync({ uri }),
          },
        ]
      );
    } catch (error) {
      console.error('Error al generar PDF:', error);
      Alert.alert('Error', 'No se pudo generar el PDF');
    } finally {
      setGenerandoPDF(false);
    }
  };

  const compartirReporte = async () => {
    Alert.alert(
      'Compartir Reporte',
      'Genera un PDF primero para compartir el reporte completo',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Generar y Compartir',
          onPress: generarPDF,
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-indigo-600 pt-12 pb-8 px-6">
        <Text className="text-white text-3xl font-bold mb-2">
          Reporte Mensual
        </Text>
        <Text className="text-indigo-100 text-base">Octubre 2025</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6 pb-20">
        <View className="flex-row justify-between mb-8">
          <View className="flex-1 mr-3">
            <Text className="text-gray-600 text-sm mb-2 font-medium">
              Total Gastos
            </Text>
            <Text className="text-gray-900 text-3xl font-bold">
              ${totalGastos.toFixed(2)}
            </Text>
          </View>

          <View className="flex-1 ml-3">
            <Text className="text-gray-600 text-sm mb-2 font-medium">
              Promedio/día
            </Text>
            <Text className="text-gray-900 text-3xl font-bold">
              ${promedioPorDia.toFixed(2)}
            </Text>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-gray-800 text-xl font-bold mb-4">
            Gastos por Categoría
          </Text>

          {categorias.length === 0 ? (
            <View className="bg-gray-50 rounded-2xl p-8 items-center">
              <Text className="text-gray-400 text-base">
                No hay gastos registrados
              </Text>
            </View>
          ) : (
            categorias.map((categoria, index) => (
              <View key={index} className="mb-5">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-700 text-base font-medium">
                    {categoria.nombre}
                  </Text>
                  <Text className="text-gray-900 text-base font-bold">
                    ${categoria.monto.toFixed(2)}
                  </Text>
                </View>
                <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
                  <View
                    className={`${categoria.color} h-full rounded-full`}
                    style={{ width: `${categoria.porcentaje}%` }}
                  />
                </View>
              </View>
            ))
          )}
        </View>

        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <Calendar size={20} color="#4b5563" style={{ marginRight: 8 }} />
            <Text className="text-gray-800 text-base font-semibold">
              Período del Reporte
            </Text>
          </View>

          <View className="flex-row justify-between">
            <View className="flex-1 mr-2">
              <TouchableOpacity
                onPress={() => setShowDatePicker('inicio')}
                activeOpacity={0.7}
              >
                <View className="bg-white border border-gray-300 rounded-xl px-4 py-3 flex-row items-center justify-between">
                  <Text className="text-gray-700 flex-1 text-base">
                    {formatDate(fechaInicio)}
                  </Text>
                  <Calendar size={18} color="#9ca3af" style={{ marginLeft: 8 }} />
                </View>
              </TouchableOpacity>
            </View>

            <View className="flex-1 ml-2">
              <TouchableOpacity
                onPress={() => setShowDatePicker('fin')}
                activeOpacity={0.7}
              >
                <View className="bg-white border border-gray-300 rounded-xl px-4 py-3 flex-row items-center justify-between">
                  <Text className="text-gray-700 flex-1 text-base">
                    {formatDate(fechaFin)}
                  </Text>
                  <Calendar size={18} color="#9ca3af" style={{ marginLeft: 8 }} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={showDatePicker === 'inicio' ? fechaInicio : fechaFin}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeFecha}
              maximumDate={new Date(2100, 11, 31)}
              minimumDate={new Date(2000, 0, 1)}
            />
          )}
        </View>

        <View className="mb-6 space-y-3">
          <TouchableOpacity
            onPress={generarPDF}
            disabled={generandoPDF}
            className={`rounded-xl py-4 flex-row items-center justify-center shadow-lg ${
              generandoPDF ? 'bg-indigo-400' : 'bg-indigo-600'
            }`}
          >
            <Download size={20} color="#ffffff" style={{ marginRight: 8 }} />
            <Text className="text-white text-base font-semibold">
              {generandoPDF ? 'Generando PDF...' : 'Generar PDF'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={compartirReporte}
            className="bg-white border-2 border-indigo-600 rounded-xl py-4 mt-4 flex-row items-center justify-center"
          >
            <Share2 size={20} color="#4f46e5" style={{ marginRight: 8 }} />
            <Text className="text-indigo-600 text-base font-semibold">
              Compartir Reporte
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}