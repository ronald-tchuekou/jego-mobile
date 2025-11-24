import { Image } from '@/src/components/ui/image'
import { getImageUri } from '@/src/lib/utils'
import { MediaModel } from '@/src/services/post-service'
import { memo, useCallback, useState } from 'react'
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native'

type Props = {
  medias: MediaModel[]
}

function PostImagesComponents({ medias }: Props) {
  const media = medias[0]

  const [page, setPage] = useState<number>(0)
  const [width, setWidth] = useState<number>(0)

  const imageUrl = getImageUri(media.url)

  const onMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x
      if (width > 0) setPage(Math.round(x / width))
    },
    [width],
  )

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({ length: width || 0, offset: (width || 0) * index, index }),
    [width],
  )

  const renderItem = useCallback(
    ({ item }: { item: MediaModel }) => {
      const imgUrl = getImageUri(item.url)
      return (
        <View style={{ width }}>
          <Image
            source={imgUrl}
            style={item.metadata?.aspectRatio ? { aspectRatio: item.metadata?.aspectRatio } : undefined}
            className={`w-full h-[400px] bg-black ${
              item.metadata?.aspectRatio ? `aspect-${item.metadata.aspectRatio}` : 'aspect-video'
            }`}
            resizeMode='contain'
            alt={item.name || 'Media'}
          />
        </View>
      )
    },
    [width],
  )

  if (medias.length === 1)
    return (
      <Image
        source={imageUrl}
        style={media.metadata?.aspectRatio ? { aspectRatio: media.metadata?.aspectRatio } : undefined}
        className={`w-full h-[400px] bg-black mb-4 ${
          media.metadata?.aspectRatio ? `aspect-${media.metadata.aspectRatio}` : 'aspect-video'
        }`}
        resizeMode='contain'
        alt={media.name || 'Media'}
      />
    )

  return (
    <View className='relative mb-4' style={{ height: 400 }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <FlatList
        data={medias}
        keyExtractor={(m) => String(m.id)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        snapToInterval={width || undefined}
        decelerationRate='fast'
        disableIntervalMomentum
        removeClippedSubviews
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        style={{ height: 400 }}
      />

      <View className='absolute bottom-2 left-0 right-0 items-center'>
        <View className='flex-row gap-1 px-2 py-1 rounded-full bg-black/40'>
          {medias.map((_, idx) => (
            <View key={idx} className={`h-2 w-2 rounded-full ${idx === page ? 'bg-white' : 'bg-white/40'}`} />
          ))}
        </View>
      </View>
    </View>
  )
}

export const PostImages = memo(PostImagesComponents)
