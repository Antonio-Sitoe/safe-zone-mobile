import storage from '@react-native-firebase/storage'

export const uploadMedia = async (
  uri: string,
  path: string
): Promise<string> => {
  try {
    const response = await fetch(uri)
    const blob = await response.blob()
    const ref = storage().ref(path)
    await ref.put(blob)
    const url = await ref.getDownloadURL()
    return url
  } catch (error) {
    console.error('Error uploading media:', error)
    throw error
  }
}

export const deleteMedia = async (url: string) => {
  try {
    const ref = storage().refFromURL(url)
    await ref.delete()
  } catch (error) {
    console.error('Error deleting media:', error)
    throw error
  }
}
