import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import colors from '../theme/colors';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

interface InfoCardProps {
  icon: IconName;
  title: string;
  children: React.ReactNode;
}

function InfoCard({ icon, title, children }: InfoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialIcons name={icon} size={24} color={colors.primary} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
}

export default function AboutScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 24 }]}
    >
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <MaterialIcons name="info" size={32} color={colors.textLight} />
        <Text style={styles.headerTitle}>Sobre o Projeto</Text>
        <Text style={styles.headerSubtitle}>
          Classificador de Salmão vs Robalo com IA
        </Text>
      </View>

      <InfoCard icon="dataset" title="O Dataset">
        <Text style={styles.text}>
          O modelo foi treinado com dados de luminosidade (lightness) e largura
          (width) de peixes. Cada amostra pertence a uma de duas espécies:
        </Text>
        <View style={styles.speciesRow}>
          <View style={[styles.badge, { backgroundColor: colors.salmon }]}>
            <Text style={styles.badgeText}>🐟 Salmão</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: colors.seabass }]}>
            <Text style={styles.badgeText}>🐠 Robalo</Text>
          </View>
        </View>
        <Text style={styles.text}>
          São 131 amostras ao total — 71 de salmão e 60 de robalo.
        </Text>
      </InfoCard>

      <InfoCard icon="psychology" title="O Algoritmo — Perceptron">
        <Text style={styles.text}>
          O Perceptron é o modelo mais simples de rede neural. Ele aprende uma
          fronteira de decisão linear separando as duas classes.
        </Text>
        <View style={styles.formulaBox}>
          <Text style={styles.formula}>saída = w₀ + w₁ × lightness + w₂ × width</Text>
        </View>
        <Text style={styles.text}>
          Se a saída {'>'} 0 → Robalo. Caso contrário → Salmão.
        </Text>
        <Text style={styles.text}>
          Taxa de aprendizado: 0.001 · Épocas: até 10.000
        </Text>
      </InfoCard>

      <InfoCard icon="phone_android" title="Como Funciona">
        <Text style={styles.text}>
          Nesta versão, o modelo treina diretamente no seu dispositivo ao
          abrir o app — sem necessidade de servidor externo.
        </Text>
        <Text style={styles.text}>
          Quando o backend Flask estiver rodando na nuvem, basta atualizar
          a URL em{' '}
          <Text style={styles.code}>src/config.ts</Text>
          {' '}e descomentar o bloco de fetch em{' '}
          <Text style={styles.code}>PredictScreen.tsx</Text>.
        </Text>
      </InfoCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingBottom: 28,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textLight,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#A8C0E8',
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  cardBody: {
    gap: 10,
  },
  text: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  speciesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: colors.textLight,
    fontWeight: '600',
    fontSize: 14,
  },
  formulaBox: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  formula: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: colors.textPrimary,
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: colors.primary,
    backgroundColor: '#E8EEF8',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
});
