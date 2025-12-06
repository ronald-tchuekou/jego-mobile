import { formatDate } from '@/src/lib/utils'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { IconX } from '@tabler/icons-react-native'
import { CalendarDaysIcon, ClockIcon } from 'lucide-react-native'
import { useState } from 'react'
import { Modal, Platform, Text, TouchableOpacity, View } from 'react-native'
import { cnBase } from 'tailwind-variants'
import { Button, ButtonIcon } from '../ui/button'
import { Icon } from '../ui/icon'

type Props = {
  date?: Date
  onChange?: (date: Date) => void
  type?: 'date' | 'time'
  placeholder?: string
}

export const DatePickerInput = ({ date, onChange, type = 'date', placeholder }: Props) => {
  const [visible, setVisible] = useState(false)

  const changeHandler = (_e: DateTimePickerEvent, val?: Date) => {
    if (val) onChange?.(val)

    setVisible(false)
  }

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => setVisible(true)}
        className='px-3 border border-jego-border bg-jego-card flex-row rounded-lg h-12 justify-between items-center'
      >
        <Text
          className={cnBase(
            'text-left text-lg text-jego-foreground font-medium',
            !date ? 'text-jego-muted-foreground' : undefined,
          )}
        >
          {date ? formatDate(date, type) : placeholder || 'Choisir une date'}
        </Text>
        <Icon as={type === 'date' ? CalendarDaysIcon : ClockIcon} size='xl' className='text-jego-muted-foreground' />
      </TouchableOpacity>
      {visible ? (
        Platform.OS === 'android' ? (
          <DateTimePicker
            locale='fr-FR'
            testID='datePicker'
            display={'spinner'}
            value={date ?? new Date()}
            mode={type}
            onChange={changeHandler}
            accentColor='#ff1800'
          />
        ) : (
          <Modal
            transparent
            visible={visible}
            onDismiss={() => setVisible(false)}
            onRequestClose={() => setVisible(false)}
          >
            <View className='flex-1 justify-center items-center bg-black/30 p-4'>
              <View
                style={{
                  minHeight: 300,
                  maxWidth: 400,
                }}
                className='bg-jego-card rounded-xl p-2 w-full items-center relative'
              >
                <Button
                  size='sm'
                  variant='outline'
                  action='negative'
                  onPress={() => setVisible(false)}
                  style={{ height: 40, width: 40 }}
                  className='absolute top-1 right-1 z-10 rounded-full border-jego-border'
                >
                  <ButtonIcon as={IconX} size='lg' className='text-jego-foreground' />
                </Button>
                <Text className='text-jego-foreground text-xl font-bold p-2'>
                  {type === 'date' ? 'Choisir une date' : 'Choisir une heure'}
                </Text>
                <DateTimePicker
                  locale='fr-FR'
                  testID='datePicker'
                  value={date ?? new Date()}
                  mode={type}
                  display={type === 'date' ? 'inline' : 'spinner'}
                  onChange={changeHandler}
                  className='w-full'
                  accentColor='#ff1800'
                />
              </View>
            </View>
          </Modal>
        )
      ) : null}
    </>
  )
}
