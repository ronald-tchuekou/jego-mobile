import { Text, View } from "react-native"

export function AppointmentStatusLabel({ status }: { status: string }) {
  if (!status) return null
  const label =
    status === 'pending'
      ? 'En attente'
      : status === 'confirmed'
        ? 'Confirmé'
        : status === 'cancelled'
          ? 'Annulé'
          : status === 'completed'
            ? 'Terminé'
            : status

  const colorClasses =
    status === 'pending'
      ? 'bg-yellow-500/10 border-yellow-500/30'
      : status === 'confirmed'
        ? 'bg-green-500/10 border-green-500/30'
        : status === 'cancelled'
          ? 'bg-red-500/10 border-red-500/30'
          : 'bg-blue-500/10 border-blue-500/30'

  const textColor =
    status === 'pending'
      ? 'text-yellow-600'
      : status === 'confirmed'
        ? 'text-green-600'
        : status === 'cancelled'
          ? 'text-red-600'
          : 'text-blue-600'

  return (
    <View className={`self-start mt-4 px-2 py-1 rounded-full border ${colorClasses}`}>
      <Text className={`text-xs ${textColor}`}>{label}</Text>
    </View>
  )
}
