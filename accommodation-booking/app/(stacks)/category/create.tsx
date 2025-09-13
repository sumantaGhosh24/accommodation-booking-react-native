import {useState} from "react";
import {View, Text, ToastAndroid, Image, TouchableOpacity} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {FontAwesome5} from "@expo/vector-icons";
import axios from "axios";
import {router} from "expo-router";

import FormField from "@/components/form-field";
import CustomButton from "@/components/custom-button";
import {BASE_URL, CLOUDINARY_URL} from "@/constants";
import {UPLOAD_PRESET} from "@/constants/config";
import {useAuth} from "@/context/auth-context";

const CreateCategory = () => {
  const {authState} = useAuth();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState<any>();

  const openPicker = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access media is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (pickerResult.canceled === true) {
      return;
    }

    setImage({
      uri: pickerResult.assets[0].uri,
      type: pickerResult.assets[0].mimeType,
      name: pickerResult.assets[0].fileName,
    });
  };

  const handleSubmit = async () => {
    if (name === "" || !image)
      return ToastAndroid.showWithGravityAndOffset(
        "Fill all fields!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

    try {
      setLoading(true);

      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", UPLOAD_PRESET);

      const imageResponse = await axios.post(CLOUDINARY_URL, data, {
        headers: {"Content-Type": "multipart/form-data"},
      });

      const response = await axios.post(
        `${BASE_URL}/category`,
        {
          name,
          image: {
            url: imageResponse.data.secure_url,
            public_id: imageResponse.data.public_id,
          },
        },
        {
          headers: {Authorization: `Bearer ${authState?.accesstoken}`},
        }
      );

      ToastAndroid.showWithGravityAndOffset(
        response.data.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      if (response.data.success === true) {
        router.push("/manage-category");
      }
    } catch {
      ToastAndroid.showWithGravityAndOffset(
        "Something went wrong, try again later!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="h-full bg-white dark:bg-black p-3">
      <Text className="text-2xl font-bold my-10 text-black dark:text-white">
        Create Category
      </Text>
      <View className="my-5 space-y-2">
        <Text className="text-base font-bold text-black dark:text-white">
          Category Image
        </Text>
        <TouchableOpacity onPress={() => openPicker()}>
          {image?.uri ? (
            <Image
              source={{uri: image?.uri}}
              resizeMode="cover"
              className="w-full h-64 rounded-2xl"
            />
          ) : (
            <View className="w-full h-16 px-4 rounded-2xl border-2 bg-gray-700 flex justify-center items-center flex-row space-x-2">
              <FontAwesome5 name="cloud-upload-alt" size={24} color="white" />
              <Text className="text-sm font-bold text-white">
                Choose a file
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <FormField
        title="Category Name"
        placeholder="Enter category name"
        value={name}
        handleChangeText={(text: any) => setName(text)}
        otherStyles="mb-3"
        autoComplete="name"
        keyboardType="default"
      />
      <CustomButton
        title="Create Category"
        handlePress={handleSubmit}
        containerStyles="bg-blue-700 disabled:bg-blue-300 mb-5"
        isLoading={loading}
      />
    </View>
  );
};

export default CreateCategory;
