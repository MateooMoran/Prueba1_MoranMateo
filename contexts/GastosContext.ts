import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos
export type Gasto = {
  id: string;
  descripcion: string;
  monto: number;
  pagadoPor: string;
  fecha: string;
  timestamp: number;
  participantes: string[];
  fotoUri: string;
  categoria?: string;
};

export type Deuda = {
  deudor: string;
  acreedor: string;
  monto: number;
};

type GastosContextType = {
  gastos: Gasto[];
  agregarGasto: (gasto: Omit<Gasto, 'id' | 'timestamp' | 'fecha'>) => Promise<void>;
  eliminarGasto: (id: string) => Promise<void>;
  totalGastos: number;
  promedioPorDia: number;
  calcularDeudas: () => Deuda[];
  gastosPorCategoria: () => { nombre: string; monto: number }[];
  cargando: boolean;
};

// Context
const GastosContext = createContext<GastosContextType | undefined>(undefined);

// Clave para AsyncStorage
const STORAGE_KEY = '@gastos_compartidos';

// Participantes de la app
const PARTICIPANTES = ['Juan', 'Maria', 'Pedro'];

// Provider
export function GastosProvider({ children }: { children: ReactNode }) {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [cargando, setCargando] = useState(true);

  // CARGAR gastos desde AsyncStorage al iniciar
  useEffect(() => {
    cargarGastos();
  }, []);

  // Función para CARGAR gastos
  const cargarGastos = async () => {
    try {
      const gastosGuardados = await AsyncStorage.getItem(STORAGE_KEY);
      if (gastosGuardados) {
        setGastos(JSON.parse(gastosGuardados));
      }
    } catch (error) {
      console.error('Error al cargar gastos:', error);
    } finally {
      setCargando(false);
    }
  };

  // Función para GUARDAR gastos en AsyncStorage
  const guardarGastos = async (nuevosGastos: Gasto[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nuevosGastos));
    } catch (error) {
      console.error('Error al guardar gastos:', error);
    }
  };

  // AGREGAR nuevo gasto
  const agregarGasto = async (nuevoGasto: Omit<Gasto, 'id' | 'timestamp' | 'fecha'>) => {
    const ahora = new Date();
    const gasto: Gasto = {
      ...nuevoGasto,
      id: Date.now().toString(),
      timestamp: Date.now(),
      fecha: `${ahora.getDate()} ${ahora.toLocaleString('es', { month: 'short' })}`,
      participantes: nuevoGasto.participantes || PARTICIPANTES.map(p => p[0]), // ['J', 'M', 'P']
    };

    const nuevosGastos = [gasto, ...gastos];
    setGastos(nuevosGastos);
    await guardarGastos(nuevosGastos);
  };

  // ELIMINAR gasto
  const eliminarGasto = async (id: string) => {
    const nuevosGastos = gastos.filter(g => g.id !== id);
    setGastos(nuevosGastos);
    await guardarGastos(nuevosGastos);
  };

  // Calcular TOTAL de gastos
  const totalGastos = gastos.reduce((acc, g) => acc + g.monto, 0);

  // Calcular PROMEDIO por día
  const promedioPorDia = (() => {
    if (gastos.length === 0) return 0;
    const fechas = gastos.map(g => new Date(g.timestamp).toDateString());
    const diasUnicos = new Set(fechas).size;
    return diasUnicos > 0 ? totalGastos / diasUnicos : totalGastos;
  })();

  // Calcular DEUDAS (algoritmo de simplificación)
  const calcularDeudas = (): Deuda[] => {
    if (gastos.length === 0) return [];

    // Calcular cuánto gastó cada persona
    const gastosPorPersona: { [key: string]: number } = {};
    PARTICIPANTES.forEach(p => {
      gastosPorPersona[p] = 0;
    });

    gastos.forEach(gasto => {
      gastosPorPersona[gasto.pagadoPor] += gasto.monto;
    });

    // Calcular el promedio que debería pagar cada uno
    const promedio = totalGastos / PARTICIPANTES.length;

    // Calcular balance de cada persona 
    const balances: { [key: string]: number } = {};
    PARTICIPANTES.forEach(p => {
      balances[p] = gastosPorPersona[p] - promedio;
    });

    // Crear lista de deudas
    const deudas: Deuda[] = [];
    const deudores = PARTICIPANTES.filter(p => balances[p] < 0);
    const acreedores = PARTICIPANTES.filter(p => balances[p] > 0);

    // Algoritmo de simplificación
    deudores.forEach(deudor => {
      let deuda = Math.abs(balances[deudor]);
      
      acreedores.forEach(acreedor => {
        if (deuda > 0 && balances[acreedor] > 0) {
          const monto = Math.min(deuda, balances[acreedor]);
          
          deudas.push({
            deudor,
            acreedor,
            monto: Math.round(monto * 100) / 100, 
          });

          deuda -= monto;
          balances[acreedor] -= monto;
        }
      });
    });

    return deudas;
  };

  // Calcular gastos por CATEGORÍA
  const gastosPorCategoria = () => {
    const categorias: { [key: string]: number } = {};

    gastos.forEach(gasto => {
      const cat = gasto.categoria || 'Sin categoría';
      categorias[cat] = (categorias[cat] || 0) + gasto.monto;
    });

    return Object.entries(categorias).map(([nombre, monto]) => ({
      nombre,
      monto,
    }));
  };

  return (
    <GastosContext.Provider
      value={{
        gastos,
        agregarGasto,
        eliminarGasto,
        totalGastos,
        promedioPorDia,
        calcularDeudas,
        gastosPorCategoria,
        cargando,
      }}
    >
      {children}
    </GastosContext.Provider>
  );
}


export function useGastos() {
  const context = useContext(GastosContext);
  if (context === undefined) {
    throw new Error('useGastos debe usarse dentro de un GastosProvider');
  }
  return context;
}