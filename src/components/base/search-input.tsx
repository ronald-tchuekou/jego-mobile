import { SearchIcon, XIcon } from "lucide-react-native";
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";

type Props = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
};

export const SearchInput = ({ placeholder, value, onChangeText }: Props) => {
  return (
    <Input className="rounded-full border-jego-border">
      <InputSlot className="pl-3">
        <InputIcon as={SearchIcon} className="text-jego-muted-foreground" />
      </InputSlot>
      <InputField
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
      {!!value.trim() && (
        <InputSlot className="px-3" onPress={() => onChangeText("")}>
          <InputIcon as={XIcon} className="text-jego-muted-foreground" />
        </InputSlot>
      )}
    </Input>
  );
};
