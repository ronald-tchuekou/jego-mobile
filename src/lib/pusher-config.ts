import { Pusher } from '@pusher/pusher-websocket-react-native'
import { env } from '@/src/lib/env'

const pusherConfig = Pusher.getInstance()

await pusherConfig.init({
  apiKey: env.PUSHER_API_KEY,
  cluster: env.PUSHER_CLUSTER,
})

await pusherConfig.connect()
