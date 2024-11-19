import {useColorScheme} from "nativewind";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import IconButton from "./icon-button";

const ThemeSwitcher = () => {
  const {colorScheme, toggleColorScheme} = useColorScheme();

  return (
    <>
      <IconButton
        icon={
          <FontAwesome
            name={colorScheme === "dark" ? "moon-o" : "sun-o"}
            size={36}
            color="white"
          />
        }
        handlePress={() => toggleColorScheme()}
        containerStyles="bg-blue-700"
      />
    </>
  );
};

export default ThemeSwitcher;
