import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BottomNavigation } from '@/components/menu'
import { Header } from '@/components/header'
import { CardsGrid } from './cards/grid'

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white ">
      <Header />
      <View className="flex-1 ">
        <CardsGrid />
      </View>
      <BottomNavigation />
    </SafeAreaView>
  )
}
