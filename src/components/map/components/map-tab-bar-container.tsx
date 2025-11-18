import { Pressable, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { cn } from '@/lib/utils'

interface MapTabBarContainerProps {
  totalZones: number
  handleShowList: () => void
  onCreateSafeZone: () => void
  onCreateDangerZone: () => void
  onCenterUser: () => void
}

export function MapTabBarContainer({
  totalZones,
  handleShowList,
  onCreateSafeZone,
  onCreateDangerZone,
  onCenterUser,
}: MapTabBarContainerProps) {
  return (
    <View className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl overflow-hidden shadow-lg">
      {/* Header Section */}
      <View className="flex-row items-center justify-between">
        <View className="px-5 pt-5 pb-4 border-b border-gray-100">
          <Text className="text-xl font-bold text-gray-900 mb-1">
            Zonas no Mapa
          </Text>
          <Text className="text-sm text-gray-500 leading-5">
            {totalZones === 0
              ? 'Ainda não há zonas registadas. Adicione uma zona para começar.'
              : `Existem ${totalZones} zona${
                  totalZones === 1 ? '' : 's'
                } registadas no mapa.`}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onCenterUser}
          className={cn(
            'rounded-full bg-slate-800/90 p-3 mr-4',
            'border border-slate-600/40 shadow-lg shadow-black/40'
          )}
          activeOpacity={0.85}
        >
          <Ionicons name="locate" size={24} color="#10B981" />
        </TouchableOpacity>
      </View>

      <View className="flex-row px-4 py-3 gap-3">
        {/* Card: Criar Zona Segura */}
        <Pressable
          onPress={onCreateSafeZone}
          className="flex-1 bg-green-50 border border-green-200 rounded-2xl p-4 min-h-[130px] active:opacity-85 shadow-sm"
        >
          <View className="flex-1 items-center justify-center">
            <View className="w-10 h-10 rounded-full bg-green-500 items-center justify-center mb-3">
              <Ionicons name="shield-checkmark" size={24} color="#FFFFFF" />
            </View>
            <Text className="text-xs font-bold text-green-700 text-center mb-1">
              Zona Segura
            </Text>
            <Text className="text-[10px] text-green-600 text-center leading-4">
              Adicionar local seguro
            </Text>
          </View>
        </Pressable>

        {/* Card: Criar Zona de Perigo */}
        <Pressable
          onPress={onCreateDangerZone}
          className="flex-1 bg-red-50 border border-red-200 rounded-2xl p-4 min-h-[130px] active:opacity-85 shadow-sm"
        >
          <View className="flex-1 items-center justify-center">
            <View className="w-10 h-10 rounded-full bg-red-500 items-center justify-center mb-3">
              <Ionicons name="warning" size={24} color="#FFFFFF" />
            </View>
            <Text className="text-xs font-bold text-red-700 text-center mb-1">
              Zona Perigo
            </Text>
            <Text className="text-[10px] text-red-600 text-center leading-4">
              Reportar área de risco
            </Text>
          </View>
        </Pressable>

        {/* Card: Ver Zonas */}
        <Pressable
          onPress={handleShowList}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl p-4 min-h-[130px] active:opacity-85 shadow-sm"
        >
          <View className="flex-1 items-center justify-center">
            <View className="w-10 h-10 rounded-full bg-app-primary items-center justify-center mb-3">
              <Ionicons name="list" size={24} color="#FFFFFF" />
            </View>
            <Text className="text-xs font-bold text-app-primary text-center mb-1">
              Ver Zonas
            </Text>
            <Text className="text-[10px] text-gray-600 text-center leading-4">
              Lista de todas as zonas
            </Text>
          </View>
        </Pressable>
      </View>

      <View className="h-5" />
    </View>
  )
}
