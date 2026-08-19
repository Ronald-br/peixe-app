import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import PredictScreen from '../screens/PredictScreen';
import AboutScreen  from '../screens/AboutScreen';
import colors from '../theme/colors';

const Tab = createBottomTabNavigator();

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, IconName> = {
            Classificar: 'biotech',
            Sobre: 'info',
          };
          const name = icons[route.name] ?? 'circle';
          return <MaterialIcons name={name} size={size} color={color} />;
        },
        tabBarActiveTintColor:   colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
      })}
    >
      <Tab.Screen name="Classificar" component={PredictScreen} />
      <Tab.Screen name="Sobre"       component={AboutScreen}   />
    </Tab.Navigator>
  );
}
