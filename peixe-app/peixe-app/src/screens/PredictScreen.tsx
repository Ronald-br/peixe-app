import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import colors from '../theme/colors';
import { classificar } from '../ml/perceptron';

export default function PredictScreen() {
  const insets = useSafeAreaInsets();

  const [lightness, setLightness] = useState('');
  const [width, setWidth]         = useState('');
  const [resultado, setResultado] = useState<'Salmão' | 'Robalo' | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro]           = useState<string | null>(null);

  const classificarPeixe = () => {
    setErro(null);
    setResultado(null);

    if (!lightness.trim() || !width.trim()) {
      setErro('Por favor, preencha os dois campos.');
      return;
    }

    const lightnessNum = parseFloat(lightness);
    const widthNum     = parseFloat(width);

    if (isNaN(lightnessNum) || isNaN(widthNum)) {
      setErro('Os valores devem ser números (ex: 5.2).');
      return;
    }

    setCarregando(true);

    setTimeout(() => {
      const label = classificar(lightnessNum, widthNum);
      setResultado(label);
      setCarregando(false);
    }, 300);
  };

  const corResultado =
    resultado === 'Salmão' ? colors.salmon  :
    resultado === 'Robalo' ? colors.seabass :
    colors.primary;

  const iconeResultado: React.ComponentProps<typeof MaterialIcons>['name'] =
    resultado === 'Salmão' ? 'set-meal' :
    resultado === 'Robalo' ? 'water'    :
    'help-outline';

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
          <MaterialIcons name="biotech" size={32} color={colors.textLight} />
          <Text style={styles.headerTitle}>Classificador de Peixes</Text>
          <Text style={styles.headerSubtitle}>
            Insira os dados abaixo para identificar a espécie
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Luminosidade (Lightness)</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="wb-sunny"
              size={20}
              color={colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Ex: 5.74"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
              value={lightness}
              onChangeText={setLightness}
            />
          </View>

          <Text style={styles.label}>Largura (Width)</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="straighten"
              size={20}
              color={colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Ex: 17.55"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
              value={width}
              onChangeText={setWidth}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, carregando && styles.buttonDisabled]}
            onPress={classificarPeixe}
            disabled={carregando}
            activeOpacity={0.8}
          >
            {carregando ? (
              <ActivityIndicator color={colors.textLight} />
            ) : (
              <>
                <MaterialIcons name="search" size={20} color={colors.textLight} />
                <Text style={styles.buttonText}>Classificar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {erro !== null && (
          <View style={styles.errorCard}>
            <MaterialIcons name="error-outline" size={20} color={colors.error} />
            <Text style={styles.errorText}>{erro}</Text>
          </View>
        )}

        {resultado !== null && (
          <View style={[styles.resultCard, { borderLeftColor: corResultado }]}>
            <MaterialIcons name={iconeResultado} size={40} color={corResultado} />
            <Text style={styles.resultLabel}>Espécie identificada:</Text>
            <Text style={[styles.resultValue, { color: corResultado }]}>
              {resultado}
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    paddingBottom: 32,
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
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: colors.textPrimary,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    height: 50,
    marginTop: 24,
    gap: 8,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 14,
    gap: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  errorText: {
    flex: 1,
    color: colors.error,
    fontSize: 14,
    lineHeight: 20,
  },
  resultCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderLeftWidth: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  resultValue: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 1,
  },
});
