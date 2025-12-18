import { Text, View } from 'react-native'

export function JobApplicationStatusLabel({ status }: { status: string }) {
  if (!status) return null
  const label =
    status === 'pending' ? 'En attente' : status === 'accepted' ? 'Accepté' : status === 'rejected' ? 'Rejeté' : status

  const colorClasses =
    status === 'pending'
      ? 'bg-yellow-500/10 border-yellow-500/30'
      : status === 'accepted'
        ? 'bg-green-500/10 border-green-500/30'
        : status === 'rejected'
          ? 'bg-red-500/10 border-red-500/30'
          : 'bg-gray-500/10 border-gray-500/30'

  const textColor =
    status === 'pending'
      ? 'text-yellow-600'
      : status === 'accepted'
        ? 'text-green-600'
        : status === 'rejected'
          ? 'text-red-600'
          : 'text-gray-600'

  return (
    <View className={`self-start mt-2 px-2 py-1 rounded-full border ${colorClasses}`}>
      <Text className={`text-xs ${textColor}`}>{label}</Text>
    </View>
  )
}
