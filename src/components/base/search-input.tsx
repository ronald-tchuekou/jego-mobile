import debounce from 'lodash.debounce'
import { SearchIcon, XIcon } from 'lucide-react-native'
import { useState } from 'react'
import { cnBase } from 'tailwind-variants'
import { Input, InputField, InputIcon, InputSlot } from '../ui/input'

type Props = {
  placeholder: string
  onChangeText: (text: string) => void
  className?: string
}

export const SearchInput = ({ placeholder, onChangeText, className }: Props) => {
  const [value, setValue] = useState('')

  const onQuery = debounce((query: string) => {
    onChangeText(query)
  }, 500)

  const handleChangeText = (text: string) => {
    onQuery(text)
    setValue(text)
  }

  return (
    <Input className={cnBase('rounded-full border-border', className)}>
      <InputSlot className='pl-3'>
        <InputIcon as={SearchIcon} className='text-muted-foreground' />
      </InputSlot>
      <InputField placeholder={placeholder} value={value} onChangeText={handleChangeText} />
      {!!value.trim() && (
        <InputSlot className='px-3' onPress={() => handleChangeText('')}>
          <InputIcon as={XIcon} className='text-muted-foreground' />
        </InputSlot>
      )}
    </Input>
  )
}
