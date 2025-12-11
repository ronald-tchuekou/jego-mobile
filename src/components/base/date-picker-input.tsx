import { formatDate } from '@/src/lib/utils'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { CalendarDaysIcon, ClockIcon } from 'lucide-react-native'
import { useState } from 'react'
import { Platform, Text, TouchableOpacity } from 'react-native'
import { cnBase } from 'tailwind-variants'
import { Heading } from '../ui/heading'
import { CloseIcon, Icon } from '../ui/icon'
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from '../ui/modal'

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
            'text-left text-lg text-jego-foreground font-normal',
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
            is24Hour={true}
          />
        ) : (
          <Modal
            isOpen={visible}
            onClose={() => {
              setVisible(false)
            }}
            size='md'
          >
            <ModalBackdrop />
            <ModalContent className='bg-jego-card' style={{ minWidth: 380 }}>
              <ModalHeader>
                <Heading size='lg'>{type === 'date' ? 'Choisir une date' : 'Choisir une heure'}</Heading>
                <ModalCloseButton>
                  <Icon as={CloseIcon} />
                </ModalCloseButton>
              </ModalHeader>
              <ModalBody>
                <DateTimePicker
                  locale='fr-FR'
                  testID='datePicker'
                  value={date ?? new Date()}
                  mode={type}
                  display={type === 'date' ? 'inline' : 'spinner'}
                  onChange={changeHandler}
                  className='w-full'
                  accentColor='#ff1800'
                  is24Hour={true}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        )
      ) : null}
    </>
  )
}
