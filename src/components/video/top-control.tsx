import React, { FC, memo } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import styles from './styles'

type Props = {
  srcListId: number
  showRNVControls: boolean
  toggleControls: () => void
}

const srcList = [
  {
    description: '(mp4) big buck bunny',
    uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
  },
  {
    description: '(mp4|subtitles) demo with sintel Subtitles',
    uri: 'http://www.youtube.com/api/manifest/dash/id/bf5bb2419360daf1/source/youtube?as=fmp4_audio_clear,fmp4_sd_hd_clear&sparams=ip,ipbits,expire,source,id,as&ip=0.0.0.0&ipbits=0&expire=19000000000&signature=51AF5F39AB0CEC3E5497CD9C900EBFEAECCCB5C7.8506521BFC350652163895D4C26DEE124209AA9E&key=ik0',
    type: 'mpd',
  },
]

const _TopControl: FC<Props> = ({ toggleControls, showRNVControls, srcListId }) => {
  return (
    <View style={styles.topControlsContainer}>
      <Text style={styles.controlOption}>{(srcList[srcListId] as any)?.description || 'local file'}</Text>
      <View>
        <TouchableOpacity
          onPress={() => {
            toggleControls()
          }}
        >
          <Text style={styles.leftRightControlOption}>{showRNVControls ? 'Hide controls' : 'Show controls'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
export const TopControl = memo(_TopControl)
