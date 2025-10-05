import { useState } from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native'
import { X, Flag, Calendar, Clock, Camera, Play } from 'lucide-react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as DocumentPicker from 'expo-document-picker'
import { CreateModalProps, SafeZoneData } from '@/@types/area'

export function CreateArea({
  visible,
  onClose,
  onSave,
  variant,
  location,
}: CreateModalProps) {
  const today = new Date()
  const [formData, setFormData] = useState<SafeZoneData>({
    location: location?.name || '',
    date: today.toLocaleDateString(),
    time: today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    description: '',
    characteristics: {
      goodLighting: false,
      policePresence: false,
      publicTransport: false,
    },
    media: [],
  })
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [loadingMedia, setLoadingMedia] = useState(false)

  const data =
    variant === 'safe'
      ? [
          { key: 'goodLighting', label: 'Boa Iluminação' },
          { key: 'policePresence', label: 'Presença policial' },
          {
            key: 'publicTransport',
            label: 'Transporte público acessível',
          },
        ]
      : [
          { key: 'poorLighting', label: 'Iluminação Insuficiente' },
          { key: 'noPolicePresence', label: 'Falta de Policiamento' },
          {
            key: 'houses',
            label: 'Casas Abandonadas',
          },
        ]
  const handleSave = () => {
    if (!formData.description.trim()) {
      Alert.alert('Erro', 'Por favor, adicione uma descrição do incidente.')
      return
    }
    onSave(formData)
    onClose()
  }

  const toggleCharacteristic = (key: keyof typeof formData.characteristics) => {
    setFormData((prev) => ({
      ...prev,
      characteristics: {
        ...prev.characteristics,
        [key]: !prev.characteristics[key],
      },
    }))
  }

  const handlePickMedia = async () => {
    try {
      setLoadingMedia(true)
      const result: any = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'video/*'],
        multiple: true,
        copyToCacheDirectory: true,
      })

      if (result.canceled === false) {
        const newMedia = Array.isArray(result.assets)
          ? result.assets.map((item: any) => ({
              uri: item.uri,
              name: item.name,
              type: item.mimeType || '',
            }))
          : [
              {
                uri: result.assets[0].uri,
                name: result.assets[0].name,
                type: result.assets[0].mimeType || '',
              },
            ]
        setFormData((prev) => ({
          ...prev,
          media: [...prev.media, ...newMedia],
        }))
      }
    } finally {
      setLoadingMedia(false)
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      backdropColor={'rgba(0, 0, 0, 0.2)'}
    >
      <View className="h-[70%] bg-white rounded-t-2xl mt-auto">
        <View className="flex-row items-center justify-center py-4 px-4  border-gray-200 relative">
          <TouchableOpacity
            onPress={onClose}
            className="absolute left-4 p-2"
            activeOpacity={0.7}
          >
            <X size={24} color="#1e293b" strokeWidth={2} />
          </TouchableOpacity>
          <View className="flex-row items-center">
            <Flag
              size={20}
              color={`${variant === 'safe' ? '#10b981' : '#ef4444'}`}
              fill={`${variant === 'safe' ? '#10b981' : '#ef4444'}`}
              strokeWidth={2}
            />
            <Text className="text-secondary-800 font-bold text-lg ml-2">
              {variant === 'safe'
                ? 'Criar zona segura'
                : 'Criar zona de perigo'}
            </Text>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-4 py-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-6">
            <Text className=" font-semibold text-base mb-3">Localização</Text>
            <TextInput
              value={formData.location}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, location: text }))
              }
              selection={{ start: 0, end: 0 }} // força o cursor para o início
              className="px-4 py-3 text-base border-b-2 border-secondary-900/15"
              placeholder="Digite a localização"
            />
          </View>

          <View className="flex-row gap-2 ">
            <View className="flex-1">
              <Text className=" font-semibold text-base mb-3">Data</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="bg-white border border-secondary-900/15 rounded-lg px-4 py-3 flex-row items-center"
                activeOpacity={0.7}
              >
                <Calendar size={20} color="#64748b" strokeWidth={1.5} />
                <Text className=" text-base ml-3">{formData.date}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false)
                    if (selectedDate) {
                      setFormData((prev) => ({
                        ...prev,
                        date: selectedDate.toLocaleDateString(),
                      }))
                    }
                  }}
                />
              )}
            </View>

            <View className="flex-1">
              <Text className=" font-semibold text-base mb-3">Hora</Text>
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                className="bg-white border border-secondary-900/15 rounded-lg px-4 py-3 flex-row items-center"
                activeOpacity={0.7}
              >
                <Clock size={20} color="#64748b" strokeWidth={1.5} />
                <Text className=" text-base ml-3">{formData.time}</Text>
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowTimePicker(false)
                    if (selectedDate) {
                      setFormData((prev) => ({
                        ...prev,
                        time: selectedDate.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        }),
                      }))
                    }
                  }}
                />
              )}
            </View>
          </View>

          <View className="mb-6 mt-4">
            <Text className=" font-semibold text-base mb-3">
              Descrição do Incidente :
            </Text>
            <TextInput
              value={formData.description}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, description: text }))
              }
              placeholder="Indroduza a descrição do Incidente"
              multiline
              numberOfLines={4}
              className="bg-white border-b border-secondary-900/15 px-0 py-2 text-secondary-600 text-base"
              style={{ textAlignVertical: 'top' }}
            />
          </View>

          <View className="mb-6">
            <Text className=" font-semibold text-base mb-4">
              Características da área
            </Text>
            <View className="space-y-3">
              {data.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  onPress={() =>
                    toggleCharacteristic(
                      item.key as keyof typeof formData.characteristics
                    )
                  }
                  className="flex-row items-center"
                  activeOpacity={0.7}
                >
                  <View
                    className={`w-5 h-5 border-2 mb-1 rounded mr-2 items-center justify-center ${
                      formData.characteristics[
                        item.key as keyof typeof formData.characteristics
                      ]
                        ? 'bg-app-primary border-secondary-900/15'
                        : 'border-secondary-900/15'
                    }`}
                  >
                    {formData.characteristics[
                      item.key as keyof typeof formData.characteristics
                    ] && (
                      <Text className="text-white text-xs font-bold">✓</Text>
                    )}
                  </View>
                  <Text className="font-light -mt-1 text-base">
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            onPress={handlePickMedia}
            className="flex-row items-center mb-4"
            activeOpacity={0.7}
          >
            <Text className=" text-base mr-2">Fotos ou vídeos</Text>
            <Camera size={18} color="#64748b" strokeWidth={1.5} />
          </TouchableOpacity>
          {loadingMedia && (
            <ActivityIndicator size="small" color="#10b981" className="mb-4" />
          )}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="max-h-32 mb-8"
          >
            {formData.media.map((file, index) => (
              <View key={index} className="w-24 h-24 mr-3 relative">
                {['image', 'jpeg', 'jpg', 'png', 'webp'].some((type) =>
                  file.type.includes(type)
                ) ? (
                  <Image
                    source={{ uri: file.uri }}
                    className="w-full h-full rounded-lg"
                  />
                ) : (
                  <>
                    <Image
                      source={{ uri: file.uri }}
                      className="w-full h-full rounded-lg"
                      resizeMode="cover"
                    />
                    <View className="absolute inset-0 items-center justify-center flex">
                      <View className="bg-black/50 rounded-full w-10 h-10 items-center justify-center">
                        <Play color={'white'} size={16} />
                      </View>
                    </View>
                  </>
                )}
              </View>
            ))}
          </ScrollView>
        </ScrollView>

        <View className="flex-row px-4 pb-6 pt-4 space-x-4 border-t border-gray-200">
          <TouchableOpacity
            onPress={handleSave}
            className="flex-1 bg-app-primary mx-2 py-4 rounded-lg items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white  text-base">Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onClose}
            className="flex-1 bg-app-primary mx-2 py-4 rounded-lg items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white  text-base">Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
