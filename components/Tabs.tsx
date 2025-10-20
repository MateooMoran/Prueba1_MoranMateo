import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import {
  Home,
  Wallet,
  Receipt,
  BarChart2,
  LucideIcon
} from 'lucide-react-native';

type TabKey = 'inicio' | 'balance' | 'recibo' | 'reportes';

type TabItem = {
  key: TabKey;
  label: string;
  icon: LucideIcon;
};

type Props = {
  onTabPress?: (key: TabKey) => void;
};

const TABS: TabItem[] = [
  { key: 'inicio', label: 'Inicio', icon: Home },
  { key: 'balance', label: 'Balance', icon: Wallet },
  { key: 'recibo', label: 'Recibos', icon: Receipt },
  { key: 'reportes', label: 'Reporte', icon: BarChart2 },
];

export default function BottomTabs({ onTabPress }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('inicio');

  const handlePress = (key: TabKey) => {
    setActiveTab(key);
    onTabPress?.(key);
  };

  return (
    <View 
      className="border-t border-gray-200 bg-white"
      style={{
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
      }}
    >
      <View className="flex-row h-16">
        {TABS.map(({ key, label, icon: Icon }) => {
          const isActive = key === activeTab;
          return (
            <TouchableOpacity
              key={key}
              className="flex-1 items-center justify-center"
              onPress={() => handlePress(key)}
              activeOpacity={0.7}
            >
              <Icon color={isActive ? '#2563eb' : '#9ca3af'} size={24} />
              <Text 
                className={`text-xs mt-1 ${
                  isActive ? 'text-blue-600 font-semibold' : 'text-gray-400'
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}