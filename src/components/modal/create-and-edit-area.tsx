import React, { useEffect, useState } from 'react'

import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from '@/components/ui/actionsheet'

import {
  ZoneFormData,
  createZoneSchema,
  CharacteristicKey,
} from '@/utils/schemas/create-zone'

import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { zodResolver } from '@hookform/resolvers/zod'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useForm, Controller } from 'react-hook-form'
import { Calendar, Clock, Flag } from 'lucide-react-native'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import slugify from 'slugify'

import {
  formatDateToISO,
  formatDateForDisplay,
  SAFE_CHARACTERISTICS,
  DANGER_CHARACTERISTICS,
} from '@/utils/general'
import type { SafeZoneData } from '@/@types/area'

interface CreateAndEditAreaProps {
  variant: 'safe' | 'danger'
  visible: boolean
  onClose: () => void
  onSave: (data: ZoneFormData) => void
  location: { name: string }
}

export const CreateAndEditArea = ({
  variant = 'safe',
  visible,
  onClose,
  onSave,
  location,
}: CreateAndEditAreaProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  const today = new Date()
  const defaultValues: ZoneFormData = {
    location: location?.name || '',
    date: formatDateToISO(today),
    time: today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    description: '',
    characteristics: {},
  }

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ZoneFormData>({
    resolver: zodResolver(createZoneSchema),
    defaultValues,
  })

  const watchedCharacteristics = watch('characteristics')
  const characteristics =
    watchedCharacteristics ?? ({} as ZoneFormData['characteristics'])
  const currentDate = watch('date')
  const currentTime = watch('time')

  const characteristicsList =
    variant === 'safe' ? SAFE_CHARACTERISTICS : DANGER_CHARACTERISTICS

  const toggleCharacteristic = (key: CharacteristicKey) => {
    const currentValue = characteristics[key] ?? false
    setValue('characteristics', {
      ...characteristics,
      [key]: !currentValue,
    })
  }

  const onSubmit = (data: ZoneFormData) => {
    const slug =
      slugify(data.description || location?.name || 'zona', {
        lower: true,
        strict: true,
        trim: true,
        locale: 'pt',
      }) || `zona-${Date.now()}`

    const formattedData: SafeZoneData = {
      slug,
      location: data.location,
      date: data.date,
      time: data.time,
      description: data.description,
      characteristics: {
        goodLighting: data.characteristics.goodLighting ?? false,
        policePresence: data.characteristics.policePresence ?? false,
        publicTransport: data.characteristics.publicTransport ?? false,
      },
      media: [],
    }

    onSave(formattedData)
    onClose()
    reset()
  }

  const handleClose = () => {
    onClose()
    reset()
  }

  useEffect(() => {
    if (!visible) {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  return (
    <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={100}>
      <Actionsheet isOpen={visible} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent className="bg-white">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>

          <View className="flex-row items-center justify-center py-4 px-4 border-b border-gray-200">
            <View className="flex-row items-center">
              <Flag
                size={20}
                color={variant === 'safe' ? '#10b981' : '#ef4444'}
                fill={variant === 'safe' ? '#10b981' : '#ef4444'}
                strokeWidth={2}
              />
              <Text className="text-secondary-800 font-montserrat font-bold text-lg ml-2">
                {variant === 'safe'
                  ? 'Criar zona segura'
                  : 'Criar zona de perigo'}
              </Text>
            </View>
          </View>
          <View className="mb-6 w-full">
            <Text className="font-semibold text-base mb-3">Localização</Text>
            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    className="px-4 py-3 text-base border-b-2 border-secondary-900/15"
                    placeholder="Digite a localização"
                  />
                  {errors.location && (
                    <Text className="text-red-500 text-sm mt-1">
                      {errors.location.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>
          <View className="flex-row gap-2 mb-6">
            <View className="flex-1">
              <Text className="font-semibold text-base mb-3">Data</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="bg-white border border-secondary-900/15 rounded-lg px-4 py-3 flex-row items-center"
                activeOpacity={0.7}
              >
                <Calendar size={20} color="#64748b" strokeWidth={1.5} />
                <Text className="text-base ml-3">
                  {formatDateForDisplay(currentDate)}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false)
                    if (selectedDate) {
                      setValue('date', formatDateToISO(selectedDate))
                    }
                  }}
                />
              )}
            </View>

            <View className="flex-1">
              <Text className="font-semibold text-base mb-3">Hora</Text>
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                className="bg-white border border-secondary-900/15 rounded-lg px-4 py-3 flex-row items-center"
                activeOpacity={0.7}
              >
                <Clock size={20} color="#64748b" strokeWidth={1.5} />
                <Text className="text-base ml-3">{currentTime}</Text>
              </TouchableOpacity>

              {showTimePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowTimePicker(false)
                    if (selectedDate) {
                      setValue(
                        'time',
                        selectedDate.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      )
                    }
                  }}
                />
              )}
            </View>
          </View>
          <View className="mb-6 w-full">
            <Text className="font-semibold text-base mb-3">
              Descrição do Incidente
            </Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Introduza a descrição do incidente"
                    multiline
                    numberOfLines={4}
                    className="bg-white border-b border-secondary-900/15 px-0 py-2 text-secondary-600 text-base"
                    style={{ textAlignVertical: 'top' }}
                  />
                  {errors.description && (
                    <Text className="text-red-500 text-sm mt-1">
                      {errors.description.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>

          <View className="mb-6 w-full">
            <Text className="font-semibold text-base mb-4">
              Características da área
            </Text>
            <View className="space-y-3">
              {characteristicsList.map((item) => {
                const isSelected = characteristics[item.key] ?? false

                return (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => toggleCharacteristic(item.key)}
                    className="flex-row items-center mb-3"
                    activeOpacity={0.7}
                  >
                    <View
                      className={`w-5 h-5 border-2 rounded mr-2 items-center justify-center ${
                        isSelected
                          ? 'bg-app-primary border-app-primary'
                          : 'border-secondary-900/15'
                      }`}
                    >
                      {isSelected && (
                        <Text className="text-white text-xs font-bold">✓</Text>
                      )}
                    </View>
                    <Text className="font-light text-base">{item.label}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>

          <View className="flex-row px-4 pb-6 pt-4 space-x-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              className="flex-1 bg-app-primary mx-2 py-4 rounded-lg items-center"
              activeOpacity={0.8}
            >
              <Text className="text-white text-base font-semibold">
                Guardar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleClose}
              className="flex-1 bg-gray-200 mx-2 py-4 rounded-lg items-center"
              activeOpacity={0.8}
            >
              <Text className="text-secondary-800 text-base font-semibold">
                Fechar
              </Text>
            </TouchableOpacity>
          </View>
        </ActionsheetContent>
      </Actionsheet>
    </KeyboardAvoidingView>
  )
}
