import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { ChevronLeft, Menu } from 'lucide-react-native'
import type { SafeZoneHeaderProps } from '@/@types/SafetyZone'

export function SecondaryHeader({
  onBackPress,
  onMenuPress,
  title,
}: SafeZoneHeaderProps) {
  return (
    <View className="flex-row items-center justify-between p-4 bg-white shadow-sm">
      <TouchableOpacity
        onPress={onBackPress}
        className="flex-row items-center"
        activeOpacity={0.7}
      >
        <ChevronLeft size={24} color="#1e293b" strokeWidth={2} />
        <Text className="text-secondary-800 font-medium text-base ml-1 font-body">
          Voltar
        </Text>
      </TouchableOpacity>

      <Text className="font-montserrat-bold text-lg">{title}</Text>
      {onMenuPress && (
        <TouchableOpacity
          onPress={onMenuPress}
          className="p-2"
          activeOpacity={0.7}
        >
          <Menu size={24} color="#1e293b" />
        </TouchableOpacity>
      )}
    </View>
  )
}
