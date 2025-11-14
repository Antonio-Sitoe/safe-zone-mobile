import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface MapTabBarContainerProps {
  totalZones: number
  handleShowList: () => void
  onCreateSafeZone: () => void
  onCreateDangerZone: () => void
}

export function MapTabBarContainer({
  totalZones,
  handleShowList,
  onCreateSafeZone,
  onCreateDangerZone,
}: MapTabBarContainerProps) {
  return (
    <View className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl overflow-hidden">
      <View className="flex-row items-center px-5 py-3.5">
        <View className="flex-1 gap-1">
          <Text className="text-sm font-semibold text-black">
            Todas as Zonas (
            <Text className="text-xs text-black">
              {totalZones === 0
                ? 'Sem zonas registadas'
                : `${totalZones} zona${totalZones === 1 ? '' : 's'}`}
            </Text>
            )
          </Text>

          <Text className="text-[8px] text-gray-400">
            Clica continuamente no mapa para adicionar uma zona.
          </Text>
        </View>
        <Pressable
          onPress={handleShowList}
          className="items-center justify-center bg-app-primary mr-4 rounded-2xl px-5 py-3.5"
        >
          <Text className="text-sm font-semibold text-white">Ver</Text>
        </Pressable>
      </View>

      <View className="px-5 pb-10 gap-3">
        <Pressable
          onPress={onCreateSafeZone}
          className="flex-row items-center bg-green-50 border border-green-200 rounded-2xl px-4 py-3.5 active:opacity-80"
        >
          <View className="bg-green-500 rounded-full p-2 mr-3">
            <Ionicons name="add-circle" size={20} color="#FFFFFF" />
          </View>
          <Text className="text-base font-semibold text-green-700 flex-1">
            Criar zona segura
          </Text>
        </Pressable>

        <Pressable
          onPress={onCreateDangerZone}
          className="flex-row items-center bg-red-50 border border-red-200 rounded-2xl px-4 py-3.5 active:opacity-80"
        >
          <View className="bg-red-500 rounded-full p-2 mr-3">
            <Ionicons name="add-circle" size={20} color="#FFFFFF" />
          </View>
          <Text className="text-base font-semibold text-red-700 flex-1">
            Criar zona de perigo
          </Text>
        </Pressable>
      </View>
    </View>
  )
}
