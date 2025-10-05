import { useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LocationItem } from '@/components/locationItem'
import { FloatingActionButton } from '@/components/floating-action-button'
import { CreateArea } from '@/components/modal/area-form'
import { BottomNavigation } from '@/components/menu'
import { SecondaryHeader } from '@/components/secondary-header'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { DangerousLocation } from '@/@types/DangerousZone'

export default function DangerousZone() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const [modalVisible, setModalVisible] = useState(
    params.modalIsOpen === 'true' || false
  )
  const [dangerousLocations, setDangerousLocations] = useState<
    DangerousLocation[]
  >([
    { name: 'Bairro Malhampsene', dangerLevel: 70 },
    { name: 'Bairro Liberdade', dangerLevel: 50 },
    { name: 'Bairro C700', dangerLevel: 60 },
    { name: 'Bairro Fomento', dangerLevel: 70 },
  ])

  const handleMenuPress = () => {
    console.log('Menu pressed')
  }

  const handleLocationPress = (locationName: string) => {
    console.log(`Location pressed: ${locationName}`)
  }

  const handleAddPress = () => {
    setModalVisible(true)
  }

  const handleSaveLocation = (data: any) => {
    console.log('Saving location data:', data)
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        <SecondaryHeader
          title="Zona Perigosa"
          onBackPress={() => router.back()}
          onMenuPress={handleMenuPress}
        />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="pt-6 pb-4">
            <Text className="text-gray-900 font-bold text-xl px-4 mb-4">
              Localização
            </Text>

            {dangerousLocations.map((location, index) => (
              <LocationItem
                key={index}
                variant="danger"
                name={location.name}
                level={location.dangerLevel}
                onPress={() => handleLocationPress(location.name)}
              />
            ))}
          </View>
        </ScrollView>

        <FloatingActionButton
          onPress={() =>
            router.navigate({ pathname: '/map', params: { variant: 'danger' } })
          }
        />

        <CreateArea
          visible={modalVisible}
          location={params}
          variant="danger"
          onClose={() => setModalVisible(false)}
          onSave={handleSaveLocation}
        />

        <BottomNavigation />
      </View>
    </SafeAreaView>
  )
}
