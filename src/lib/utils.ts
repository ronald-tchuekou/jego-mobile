import * as Clipboard from 'expo-clipboard'
import { Platform } from 'react-native'
import Toast from 'react-native-toast-message'
import { BufferConfig, SelectedTrackType } from 'react-native-video'
import { env } from './env'
import { IMAGES } from './images'

export function objectToQueryString(obj: Record<string, any>) {
  return Object.keys(obj)
    .map((key) => `${key}=${obj[key] || ''}`)
    .join('&')
}

export function compactNumber(num: number) {
  return new Intl.NumberFormat('fr-FR', {
    notation: 'compact',
  }).format(num)
}

// Helper function to format date
export function formatDate(date: string | Date | null, type: 'date' | 'time' = 'date') {
  if (!date) return 'Jamais'

  const dateFormater =
    type === 'date'
      ? Intl.DateTimeFormat('fr-FR', {
          year: 'numeric',
          day: 'numeric',
          month: 'short',
        })
      : Intl.DateTimeFormat('fr-FR', {
          hour: 'numeric',
          minute: 'numeric',
      })
  
  return dateFormater.format(new Date(date))
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
  }).format(price)
}

export function getColorScheme(theme: 'light' | 'dark' | undefined) {
  return {
    backgroundColor: theme === 'dark' ? '#231f1f' : '#ffffff',
    foregroundColor: theme === 'dark' ? '#ffe5e5' : '#413030',
    primaryColor: theme === 'dark' ? '#e7000b' : '#e7000b',
    primaryForegroundColor: theme === 'dark' ? '#f9fafb' : '#fef2f2',
    borderColor: theme === 'dark' ? '#3a2727' : '#ebebeb',
    cardColor: theme === 'dark' ? '#221b1b' : '#fafafa',
  }
}

export const textTracksSelectionBy = SelectedTrackType.INDEX
export const audioTracksSelectionBy = SelectedTrackType.INDEX

export const isIos = Platform.OS === 'ios'

export const isAndroid = Platform.OS === 'android'

export const bufferConfig: BufferConfig = {
  minBufferMs: 15000,
  maxBufferMs: 50000,
  bufferForPlaybackMs: 2500,
  bufferForPlaybackAfterRebufferMs: 5000,
  live: {
    targetOffsetMs: 500,
  },
}

export function getImageLink(path: string) {
  return path.startsWith('http') ? path : `${env.API_URL}/v1/${path}`
}

/**
 * Truncate a text at the last word boundary before the max length
 * @param text - The text to truncate
 * @param maxLength - The maximum length of the text
 * @returns The truncated text
 */
export function truncateAtWordBoundary(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text

  // Find the last space before the max length
  let truncateIndex = maxLength
  while (truncateIndex > 0 && text[truncateIndex] !== ' ') {
    truncateIndex--
  }

  // If no space found, truncate at max length
  if (truncateIndex === 0) {
    truncateIndex = maxLength
  }

  return text.substring(0, truncateIndex)
}

/**
 * Pluralize a word
 * @param word - The word to pluralize
 * @param count - The count of the word
 * @returns The pluralized word
 */
export function pluralize(word: string, count: number) {
  return count > 1 ? `${word}s` : word
}

/**
 * Get the URI of a company logo
 * @param logo - The logo of the company
 * @returns The URI of the company logo
 */
export function getCompanyLogoUri(logo?: string | null) {
  return logo ? { uri: getImageLink(logo) } : IMAGES.default_company_logo
}

/**
 * Get the URI of a user profile image
 * @param profileImage - The profile image of the user
 * @returns The URI of the user profile image
 */
export function getUserProfileImageUri(profileImage?: string | null) {
  return profileImage ? { uri: getImageLink(profileImage) } : IMAGES.default_user_avatar
}

/**
 * Get the URI of an image
 * @param path - The path of the image
 * @returns The URI of the image
 */
export function getImageUri(path: string) {
  return { uri: getImageLink(path) }
}

/**
 * Get the URI of a video
 * @param path - The path of the video
 * @returns The URI of the video
 */
export function getVideoUri(path: string) {
  return getImageLink(path).replace('storage', 'stream-v2')
}

/**
 * Copy text to clipboard
 * @param text - The text to copy
 */
export function copyToClipboard(text: string) {
  if (!text) return

  Clipboard.setStringAsync(text)
    .then(() => {
      Toast.show({
        type: 'success',
        text1: 'Texte copié avec succès',
      })
    })
    .catch((error) => {
      Toast.show({
        type: 'error',
        text1: 'Erreur lors de la copie',
      })
    })
}

/**
 * Check if the error message is related to user not having access
 * @param errorMessage - The error message
 * @returns True if the error message is related to user not having access, false otherwise
 */
export function checkUserNowAccess(errorMessage: string) {
  return errorMessage.toLocaleLowerCase().includes('unauthorized access')
}

export function getFileTypeName(type: string) {
  switch (type) {
    case 'application/pdf':
    case 'application':
      return 'PDF'
    case 'application/msword':
      return 'DOC'
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'DOCX'
    default:
      return type
  }
}
