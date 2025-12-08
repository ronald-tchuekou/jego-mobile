import React from 'react'
import { Bubble, BubbleProps, IMessage } from 'react-native-gifted-chat'

export const ChatBubble = (props: BubbleProps<IMessage>) => {
  return <Bubble {...props} wrapperStyle={{ right: { backgroundColor: 'red' } }} />
}
