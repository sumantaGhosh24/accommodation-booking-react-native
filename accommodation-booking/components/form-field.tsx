import {useState} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import {Entypo} from "@expo/vector-icons";
import {useColorScheme} from "nativewind";

interface FormFieldProps {
  title: string;
  value: any;
  placeholder: string;
  handleChangeText: any;
  otherStyles?: any;
  type?: "password";
  custom?: any;
}

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  custom,
  type,
  ...props
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const {colorScheme} = useColorScheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={`space-y-2 ${otherStyles || ""}`}>
          <Text className="text-base font-bold text-black dark:text-white">
            {title}
          </Text>
          <View
            className={`w-full px-4 bg-white dark:bg-slate-500 rounded-2xl border-2 border-black-200 flex flex-row items-center ${
              custom ? "h-32" : "h-16"
            }`}
          >
            <TextInput
              className="flex-1 font-semibold text-base text-black dark:text-white"
              value={value}
              placeholder={placeholder}
              placeholderTextColor="#000"
              onChangeText={handleChangeText}
              secureTextEntry={type === "password" && !showPassword}
              style={{verticalAlign: "top"}}
              multiline={custom && true}
              numberOfLines={custom && 10}
              {...props}
            />
            {type === "password" && (
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Entypo
                  name="eye"
                  size={24}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default FormField;
