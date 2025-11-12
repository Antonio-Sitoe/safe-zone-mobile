import { memo } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type GestureResponderEvent,
} from 'react-native'
import type { Coordinates } from '../store'
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from '@/components/ui/actionsheet'

type CreateZoneSheetProps = {
  isOpen: boolean
  onClose: () => void
  onSelect: (variant: 'safe' | 'danger', event?: GestureResponderEvent) => void
  coordinate: Coordinates | null
}

const CreateZoneSheetComponent = ({
  isOpen,
  onClose,
  onSelect,
  coordinate,
}: CreateZoneSheetProps) => {
  const latitude = coordinate ? coordinate[1].toFixed(5) : null
  const longitude = coordinate ? coordinate[0].toFixed(5) : null

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent style={styles.sheetContent}>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <View style={styles.header}>
          <Text style={styles.title}>Que tipo de zona queres criar?</Text>
          {latitude && longitude ? (
            <Text style={styles.subtitle}>
              {latitude}, {longitude}
            </Text>
          ) : null}
        </View>

        <View style={styles.options}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.optionCard, styles.safeOption]}
            onPress={onSelect.bind(null, 'safe')}
          >
            <Text style={[styles.optionTitle, styles.safeText]}>
              Criar zona segura
            </Text>
            <Text style={styles.optionDescription}>
              Assinala locais com boa iluminação, presença policial e outras
              características positivas.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.optionCard, styles.dangerOption]}
            onPress={onSelect.bind(null, 'danger')}
          >
            <Text style={[styles.optionTitle, styles.dangerText]}>
              Criar zona de perigo
            </Text>
            <Text style={styles.optionDescription}>
              Reporta incidentes recentes, más condições ou qualquer situação de
              risco identificada.
            </Text>
          </TouchableOpacity>
        </View>
      </ActionsheetContent>
    </Actionsheet>
  )
}

const styles = StyleSheet.create({
  sheetContent: {
    width: '100%',
    alignItems: 'stretch',
    paddingHorizontal: 0,
    backgroundColor: '#FFFFFF',
  },
  header: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  options: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
  },
  optionCard: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
    shadowColor: 'rgba(15, 23, 42, 0.08)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 2,
  },
  safeOption: {
    borderColor: 'rgba(16, 185, 129, 0.35)',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  dangerOption: {
    borderColor: 'rgba(239, 68, 68, 0.35)',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  optionDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: '#374151',
  },
  safeText: {
    color: '#047857',
  },
  dangerText: {
    color: '#B91C1C',
  },
})

export const CreateZoneSheet = memo(CreateZoneSheetComponent)
