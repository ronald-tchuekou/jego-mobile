import { Transmit } from '@adonisjs/transmit-client'
import { useCallback, useEffect, useState } from 'react'
import { env } from '../lib/env'
import { useAuthStore } from '../stores/auth-store'

export const useTransmit = () => {
  const auth = useAuthStore(state => state.auth)
  const authToken = auth?.token

  const [transmit, setTransmit] = useState<Transmit | null>(null)
  const [isConnected, setConnected] = useState<boolean>(false)

  useEffect(() => {
    if (!transmit) {
      const transmitInstance = new Transmit({
        baseUrl: env.API_URL,
        ...(authToken && { authToken }),
      })

      transmitInstance.on('connected', () => {
        console.log('Connecté à Transmit')
        setConnected(true)
      })

      transmitInstance.on('disconnected', () => {
        console.log('Déconnecté de Transmit')
        setConnected(false)
      })

      setTransmit(transmitInstance)
    }
  }, [authToken, transmit])

  // Fonction pour s'abonner à un canal
  const subscribe = useCallback(
    (channel: string, callback: (data: any) => void) => {
      if (!transmit) {
        console.error('Transmit non initialisé')
      } else {
        try {
          const subscription = transmit.subscription(channel)
          subscription.create().then(() => subscription.onMessage(callback))

          return () => {
            subscription.delete().then()
          }
        } catch (error) {
          console.error(`Erreur lors de l'abonnement au canal ${channel}:`, error)
        }
      }
      return () => {}
    },
    [transmit],
  )

  return { transmit, isConnected, subscribe }
}
