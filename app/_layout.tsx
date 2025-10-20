import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import BottomTabs from '@/components/Tabs';
import "../global.css";
import { GastosProvider } from '@/contexts/GastosContext';

type ScreenKey = 'inicio' | 'balance' | 'recibos' | 'reportes';

export default function Layout() {
    const router = useRouter();
    const [activeScreen, setActiveScreen] = React.useState<ScreenKey>('inicio');

    const handleTabPress = (key: ScreenKey) => {
        setActiveScreen(key);
        router.push(`/${key}`);
    };

    return (
        <GastosProvider>
            <View style={{ flex: 1 }}>
                <Stack screenOptions={{ headerShown: false }} />
                <BottomTabs onTabPress={handleTabPress} />
            </View>
        </GastosProvider>
    );
}