import { SearchIcon, XIcon } from 'lucide-react-native'
import { cnBase } from 'tailwind-variants'
import { Input, InputField, InputIcon, InputSlot } from '../ui/input'

type Props = {
  placeholder: string
  value: string
  onChangeText: (text: string) => void
  className?: string
}

export const SearchInput = ({ placeholder, value, onChangeText, className }: Props) => {
  return (
    <Input className={cnBase('rounded-full border-jego-border', className)}>
      <InputSlot className='pl-3'>
        <InputIcon as={SearchIcon} className='text-jego-muted-foreground' />
      </InputSlot>
      <InputField placeholder={placeholder} value={value} onChangeText={onChangeText} />
      {!!value.trim() && (
        <InputSlot className='px-3' onPress={() => onChangeText('')}>
          <InputIcon as={XIcon} className='text-jego-muted-foreground' />
        </InputSlot>
      )}
    </Input>
  )
}
