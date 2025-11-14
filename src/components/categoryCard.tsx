import { View, Text, Pressable } from 'react-native'
import { Users, Edit2 } from 'lucide-react-native'
import type { CategoryCardProps } from '@/@types/Category'

interface EnhancedCategoryCardProps extends CategoryCardProps {
  onEdit?: () => void
}

export const CategoryCard = ({
  name,
  count,
  onPress,
  onEdit,
}: EnhancedCategoryCardProps) => {
  return (
    <View className="flex-row  px-4 py-4 justify-center rounded-xl shadow-sm active:opacity-70 border border-gray-100 min-h-[80px] gap-2 items-center bg-white">
      <Pressable onPress={onPress} className="flex-1">
        <View className="flex-row items-center">
          <View className="w-14 h-14 rounded-full bg-blue-50 items-center justify-center mr-4">
            <Users size={26} color="#2B4170" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900 mb-1 font-body">
              {name}
            </Text>
            <Text className="text-sm text-gray-500 font-body">
              {count} {count === 1 ? 'Contato' : 'Contatos'}
            </Text>
          </View>
        </View>
      </Pressable>
      {onEdit && (
        <Pressable
          onPress={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          className="w-10 h-10 bg-blue-100 rounded-xl border border-gray-100 items-center justify-center active:opacity-70"
        >
          <Edit2 size={18} color={'#1F346C'} />
        </Pressable>
      )}
    </View>
  )
}
