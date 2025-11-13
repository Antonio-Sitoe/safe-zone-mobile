import { useCallback, useMemo, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native'
import { X, Flag, Calendar, Clock } from 'lucide-react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet'
import type { CreateModalProps } from '@/@types/area'

// Schemas de validação Zod
const createZoneSchema = z.object({
  location: z.string().min(3, 'Localização deve ter pelo menos 3 caracteres'),
  date: z.string(),
  time: z.string(),
  description: z
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  characteristics: z.object({
    goodLighting: z.boolean().optional(),
    policePresence: z.boolean().optional(),
    publicTransport: z.boolean().optional(),
    poorLighting: z.boolean().optional(),
    noPolicePresence: z.boolean().optional(),
    houses: z.boolean().optional(),
  }),
})

type ZoneFormData = z.infer<typeof createZoneSchema>

// Helpers para formatação de data
const formatDateToISO = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDateForDisplay = (isoDate: string): string => {
  try {
    const [year, month, day] = isoDate.split('-')
    return `${day}/${month}/${year}`
  } catch {
    return isoDate
  }
}

// Constantes para características
const SAFE_CHARACTERISTICS = [
  { key: 'goodLighting', label: 'Boa Iluminação' },
  { key: 'policePresence', label: 'Presença policial' },
  { key: 'publicTransport', label: 'Transporte público acessível' },
] as const

const DANGER_CHARACTERISTICS = [
  { key: 'poorLighting', label: 'Iluminação Insuficiente' },
  { key: 'noPolicePresence', label: 'Falta de Policiamento' },
  { key: 'houses', label: 'Casas Abandonadas' },
] as const

export function CreateArea({
  visible,
  onClose,
  onSave,
  variant,
  location,
}: CreateModalProps) {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['80%'], [])
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
    formState: { errors },
  } = useForm<ZoneFormData>({
    resolver: zodResolver(createZoneSchema),
    defaultValues,
  })

  const characteristics = watch('characteristics')
  const currentDate = watch('date')
  const currentTime = watch('time')

  const characteristicsList =
    variant === 'safe' ? SAFE_CHARACTERISTICS : DANGER_CHARACTERISTICS

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  )

  const toggleCharacteristic = (key: string) => {
    const currentValue = characteristics[key as keyof typeof characteristics]
    setValue('characteristics', {
      ...characteristics,
      [key]: !currentValue,
    })
  }

  const onSubmit = (data: ZoneFormData) => {
    const formattedData = {
      slug: '',
      location: data.location,
      date: data.date,
      time: data.time,
      description: data.description,
      characteristics: data.characteristics as any,
      media: [],
    }

    onSave(formattedData)
    onClose()
  }

  const handleClose = () => {
    bottomSheetRef.current?.close()
    onClose()
  }

  if (!visible) return null

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-center py-4 px-4 border-b border-gray-200">
          <TouchableOpacity
            onPress={handleClose}
            className="absolute left-4 p-2"
            activeOpacity={0.7}
          >
            <X size={24} color="#1e293b" strokeWidth={2} />
          </TouchableOpacity>

          <View className="flex-row items-center">
            <Flag
              size={20}
              color={variant === 'safe' ? '#10b981' : '#ef4444'}
              fill={variant === 'safe' ? '#10b981' : '#ef4444'}
              strokeWidth={2}
            />
            <Text className="text-secondary-800 font-bold text-lg ml-2">
              {variant === 'safe'
                ? 'Criar zona segura'
                : 'Criar zona de perigo'}
            </Text>
          </View>
        </View>

        <BottomSheetScrollView
          className="flex-1 px-4 py-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Localização */}
          <View className="mb-6">
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

          {/* Data e Hora */}
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

          {/* Descrição */}
          <View className="mb-6">
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

          {/* Características */}
          <View className="mb-6">
            <Text className="font-semibold text-base mb-4">
              Características da área
            </Text>
            <View className="space-y-3">
              {characteristicsList.map((item) => {
                const isSelected =
                  characteristics[item.key as keyof typeof characteristics]

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
        </BottomSheetScrollView>

        {/* Footer Actions */}
        <View className="flex-row px-4 pb-6 pt-4 space-x-4 border-t border-gray-200">
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            className="flex-1 bg-app-primary mx-2 py-4 rounded-lg items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white text-base font-semibold">Guardar</Text>
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
      </View>
    </BottomSheet>
  )
}
