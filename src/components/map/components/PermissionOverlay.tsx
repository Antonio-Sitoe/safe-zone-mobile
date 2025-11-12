import { memo } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

type PermissionOverlayProps = {
  isChecking: boolean
  hasPermission: boolean | null
}

const PermissionOverlayComponent = ({
  isChecking,
  hasPermission,
}: PermissionOverlayProps) => {
  if (isChecking) {
    return (
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#5CA439" />
        <Text style={styles.text}>A obter localização…</Text>
      </View>
    )
  }

  if (hasPermission === false) {
    return (
      <View style={styles.overlay}>
        <Text style={styles.title}>Permissão negada</Text>
        <Text style={styles.text}>
          Autoriza o acesso à localização nas definições do dispositivo para
          visualizar o mapa centrado na tua posição.
        </Text>
      </View>
    )
  }

  return null
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 32,
    left: 24,
    right: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
})

export const PermissionOverlay = memo(PermissionOverlayComponent)


