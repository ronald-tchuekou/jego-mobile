import { Transmit } from '@adonisjs/transmit-client'
import { createContext, ReactNode, useContext } from 'react'
import { useTransmit } from '../hooks/use-transmit'

interface TransmitContextType {
  transmit: Transmit | null
  isConnected: boolean
  subscribe: (channel: string, callback: (data: any) => void) => () => void
}

const TransmitContext = createContext<TransmitContextType | undefined>(undefined)

interface Props {
  children: ReactNode
}

export const TransmitProvider = ({ children }: Props) => {
  const transmitState = useTransmit()

  return <TransmitContext value={transmitState}>{children}</TransmitContext>
}

export const useTransmitContext = () => {
  const context = useContext(TransmitContext)
  if (context === undefined) {
    throw new Error('useTransmitContext doit être utilisé dans un TransmitProvider')
  }
  return context
}
