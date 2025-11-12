import { useMemo, useState } from 'react'
import {
  Pressable,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import type { Coordinates, Zone } from '../types'
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetScrollView,
} from '@/components/ui/actionsheet'

import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { getAllZones, getZonesByType } from '@/actions/zone'
import { RefreshCwIcon } from 'lucide-react-native'

type ZonesSheetProps = {
  isOpen: boolean
  onClose: () => void
  onLocate: (coordinate: Coordinates) => void
  onEdit: (zone: Zone) => void
  onDelete: (zone: Zone) => void
  currentUserId?: string | null
}

type FilterKey = 'all' | 'safe' | 'danger'

const TAB_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'safe', label: 'Seguras' },
  { key: 'danger', label: 'Perigosas' },
]

const getZoneTypeMeta = (type: Zone['type']) => {
  switch (type) {
    case 'SAFE':
      return {
        label: 'Zona segura',
        indicatorClass: 'bg-emerald-500',
        labelClass: 'text-emerald-600',
      }
    case 'CRITICAL':
      return {
        label: 'Zona crítica',
        indicatorClass: 'bg-rose-600',
        labelClass: 'text-rose-600',
      }
    default:
      return {
        label: 'Zona de perigo',
        indicatorClass: 'bg-amber-500',
        labelClass: 'text-amber-600',
      }
  }
}

export const ZonesSheet = ({
  isOpen,
  onClose,
  onLocate,
  onEdit,
  onDelete,
  currentUserId,
}: ZonesSheetProps) => {
  const [activeTab, setActiveTab] = useState<FilterKey>('all')
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['zones', activeTab],
    queryFn: async () => {
      if (activeTab === 'safe') return await getZonesByType('SAFE')
      if (activeTab === 'danger') return await getZonesByType('DANGER')
      return getAllZones()
    },
  })
  const dataSource = useMemo(() => (data?.data as Zone[]) ?? [], [data])
  const total = useMemo(() => dataSource.length || 0, [dataSource])

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent
        className="w-full items-stretch px-0 bg-white"
        style={{ maxHeight: '80%' }}
      >
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <View className="w-full px-6 py-3 gap-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">
              Zonas monitorizadas
            </Text>
            <TouchableOpacity onPress={() => refetch()} className="p-2">
              <RefreshCwIcon className="h-4 w-4 text-gray-500" />
            </TouchableOpacity>
          </View>

          <Text className="text-xs text-gray-500">
            {total} Zonas registadas
          </Text>
        </View>

        <View className="flex-row px-6 py-1 gap-2">
          {TAB_OPTIONS.map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                className={cn(
                  'rounded-full bg-gray-100 px-4 py-2.5',
                  isActive && 'bg-blue-600'
                )}
              >
                <Text
                  className={cn(
                    'text-xs font-semibold text-gray-600',
                    isActive && 'text-white'
                  )}
                >
                  {tab.label}
                </Text>
              </Pressable>
            )
          })}
        </View>

        <ActionsheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pt-3 px-6 pb-6 gap-4"
        >
          <>
            {isLoading ? (
              <View className="flex-1 items-center justify-center px-6 py-8">
                <ActivityIndicator size="small" color="#000" />
              </View>
            ) : error ? (
              <View className="flex-1 items-center justify-center px-6 py-8">
                <Text className="text-center text-sm text-red-600">
                  Não foi possível carregar as zonas. Tenta novamente mais
                  tarde.
                </Text>
              </View>
            ) : dataSource.length === 0 ? (
              <View className="items-center gap-3 px-6 py-8">
                <Text className="text-center text-sm leading-5 text-gray-500">
                  Ainda não existem zonas registadas para esta categoria.
                </Text>
              </View>
            ) : (
              <>
                {dataSource.map((zone, index) => {
                  const zoneCoordinate: Coordinates = [
                    zone.geom?.x ?? zone.coordinates.longitude,
                    zone.geom?.y ?? zone.coordinates.latitude,
                  ]
                  const { label, indicatorClass, labelClass } = getZoneTypeMeta(
                    zone.type
                  )

                  const canManage =
                    zone.createdBy && zone.createdBy === currentUserId

                  return (
                    <View
                      key={index + zone.slug + zone.id}
                      className="gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-md"
                    >
                      <View className="flex-row items-center gap-3">
                        <View className="flex-1 gap-1">
                          <View className="flex-row items-center gap-2">
                            <View
                              className={cn(
                                'h-2.5 w-2.5 rounded-full',
                                indicatorClass
                              )}
                            />
                            <Text className="text-base font-bold text-gray-900">
                              {zone.slug || 'Zona perigosa'}
                            </Text>
                          </View>
                          <Text
                            className={cn('text-xs font-medium', labelClass)}
                          >
                            {label}
                          </Text>
                          {zone.date && zone.hour ? (
                            <Text className="text-xs text-gray-500">
                              {zone.date} às {zone.hour}
                            </Text>
                          ) : null}
                        </View>
                      </View>

                      {zone.description ? (
                        <Text className="text-sm leading-5 text-gray-700">
                          {zone.description}
                        </Text>
                      ) : null}

                      <View className="flex-row flex-wrap items-center justify-between gap-2">
                        <Pressable
                          onPress={() => {
                            onClose()
                            onLocate(zoneCoordinate)
                          }}
                          className="rounded-xl bg-blue-600 px-4 py-2.5"
                        >
                          <Text className="text-xs font-semibold text-white">
                            Ver no mapa
                          </Text>
                        </Pressable>

                        {canManage ? (
                          <View className="flex-row gap-2">
                            <Pressable
                              onPress={() => onEdit(zone)}
                              className="rounded-xl bg-gray-100 px-4 py-2.5"
                            >
                              <Text className="text-xs font-semibold text-gray-800">
                                Editar
                              </Text>
                            </Pressable>
                            <Pressable
                              onPress={() => onDelete(zone)}
                              className="rounded-xl bg-red-100 px-4 py-2.5"
                            >
                              <Text className="text-xs font-semibold text-red-600">
                                Eliminar
                              </Text>
                            </Pressable>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  )
                })}
              </>
            )}
          </>
        </ActionsheetScrollView>
      </ActionsheetContent>
    </Actionsheet>
  )
}
