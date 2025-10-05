import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'

export default function MapComponent({
  variant,
}: {
  variant: 'safe' | 'danger'
}) {
  const webviewRef = useRef<WebView>(null)
  const params = useLocalSearchParams()
  const router = useRouter()
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const leafletHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <style>
          #map { height: 100vh; width: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
          var map = L.map('map').setView([-25.9653, 32.5892], 13);
          var userMarker;
          var clickMarker;

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          function sendLocation(lat, lng, name) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              lat: lat,
              lng: lng,
              name: name,
              loading: false 
            }));
          }

          function setLoadingState(loading) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              loading: loading
            }));
          }

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;

              userMarker = L.marker([lat, lng]).addTo(map)
                .bindPopup("Você está aqui")
                .openPopup();

              map.setView([lat, lng], 15);

              fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat + '&lon=' + lng)
                .then(response => response.json())
                .then(data => {
                  const locationName = data.display_name || "Local Desconhecido";
                  userMarker.bindPopup(locationName).openPopup();
                  sendLocation(lat, lng, locationName);
                });
            });
          }

          map.on('click', function(e) {
            setLoadingState(true); // ativa loader

            if (clickMarker) {
              map.removeLayer(clickMarker);
            }
            clickMarker = L.marker(e.latlng).addTo(map);

            fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + e.latlng.lat + '&lon=' + e.latlng.lng)
              .then(response => response.json())
              .then(data => {
                const locationName = data.display_name || "Local Desconhecido";
                clickMarker.bindPopup(locationName).openPopup();
                sendLocation(e.latlng.lat, e.latlng.lng, locationName);
              });
          });
        </script>
      </body>
    </html>
  `

  const handleMessage = (event: any) => {
    const data = JSON.parse(event.nativeEvent.data)

    // Atualiza estado de loading
    if (data.loading !== undefined) {
      setIsLoading(data.loading)
    }

    // Atualiza localização apenas quando vierem todos os dados necessários
    if (
      data.lat !== undefined &&
      data.lng !== undefined &&
      data.name !== undefined
    ) {
      setSelectedLocation({
        lat: data.lat,
        lng: data.lng,
        name: data.name,
      })
    }
  }

  const handleCancel = () => {
    setSelectedLocation(null)
    webviewRef.current?.injectJavaScript(`
      if (typeof clickMarker !== 'undefined') { map.removeLayer(clickMarker); }
    `)
    router.back()
  }

  const handleMark = () => {
    if (!selectedLocation) return
    router.navigate({
      pathname: variant === 'safe' ? '/safeZone' : '/dangerousZone',
      params: {
        modalIsOpen: 'true',
        lat: selectedLocation?.lat,
        lng: selectedLocation?.lng,
        name: selectedLocation?.name,
      },
    })
  }

  return (
    <View className="flex-1">
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: leafletHTML }}
        javaScriptEnabled
        domStorageEnabled
        style={{ flex: 1 }}
        onMessage={handleMessage}
      />

      <View className="flex-row justify-between p-3 mb-3 bg-white">
        <TouchableOpacity
          className="flex-1 bg-app-primary mx-2 py-4 rounded-lg items-center"
          onPress={handleCancel}
        >
          <Text className="text-white font-bold">Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 mx-2 py-4 rounded-lg items-center flex-row justify-center"
          style={[
            {
              backgroundColor: selectedLocation ? '#4CAF50' : 'gray',
            },
          ]}
          onPress={handleMark}
          disabled={!selectedLocation}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-bold">Marcar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}
