import { createContext, ReactNode, useContext } from 'react'
import { Pusher } from '@pusher/pusher-websocket-react-native'
import { env } from '@/src/lib/env'
import { useQuery } from '@tanstack/react-query'

const PusherContext = createContext<Pusher | null>(null)

export const PusherProvider = ({ children }: { children: ReactNode }) => {
  const { data: pusher } = useQuery({
    queryKey: ['pusher'],
    queryFn: async () => {
      const pusherConfig = Pusher.getInstance()

      await pusherConfig.init({
        apiKey: env.PUSHER_API_KEY,
        cluster: env.PUSHER_CLUSTER,
      })

      await pusherConfig.connect()

      return pusherConfig
    },
  })

  return <PusherContext value={pusher || null}>{children}</PusherContext>
}

export const usePusher = () => {
  return useContext(PusherContext)
}
