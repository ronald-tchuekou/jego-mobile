import { useEffect } from 'react'
import { usePusher } from '@/src/providers/pusher-provider'
import { useAuthStore } from '@/src/stores/auth-store'

export default function usePusherSubscribe(eventType: string, callback: (event: any) => void) {
  const pusher = usePusher()
  const auth = useAuthStore((state) => state.auth)
  const userId = auth?.user.id

  useEffect(() => {
    if (userId && pusher)
      pusher
        .subscribe({
          channelName: userId,
          onSubscriptionSucceeded() {
            console.log('Subscribed')
          },
          onEvent(event) {
            if (event.eventName === eventType) callback(event)
            console.log('Pusher event: ', event)
          },
        })
        .then()

    return () => {
      if (userId && pusher) pusher.unsubscribe({ channelName: userId }).then()
    }
  }, [userId, callback, eventType, pusher])
}
