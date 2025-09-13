import {useState} from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {FontAwesome5} from "@expo/vector-icons";
import axios from "axios";
import CryptoJS from "crypto-js";

import {useAuth} from "@/context/auth-context";
import {CLOUDINARY_DESTROY_URL, CLOUDINARY_URL} from "@/constants";
import {
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
  UPLOAD_PRESET,
} from "@/constants/config";

import CustomButton from "./custom-button";

const ProfileUserImage = () => {
  const {authState, addUserImage} = useAuth();

  const [upload, setUpload] = useState(false);
  const [avatar, setAvatar] = useState<any>();

  const openPicker = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (pickerResult.canceled === true) {
      return;
    }

    setAvatar({
      uri: pickerResult.assets[0].uri,
      type: pickerResult.assets[0].mimeType,
      name: pickerResult.assets[0].fileName,
    });
  };

  const handleSubmit = async () => {
    if (!avatar) {
      return ToastAndroid.showWithGravityAndOffset(
        "First select an image!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    const data = new FormData();
    data.append("file", avatar);
    data.append("upload_preset", UPLOAD_PRESET);

    try {
      setUpload(true);

      const response = await axios.post(CLOUDINARY_URL, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (authState?.image?.public_id) {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signatureString = `public_id=${authState?.image?.public_id}&timestamp=${timestamp}${CLOUD_API_SECRET}`;
        const signature = CryptoJS.SHA1(signatureString).toString();
        const data = {
          public_id: authState?.image?.public_id,
          api_key: CLOUD_API_KEY,
          timestamp,
          signature,
        };

        await axios.post(CLOUDINARY_DESTROY_URL, data);
      }

      addUserImage!(
        {url: response.data.secure_url, public_id: response.data.public_id},
        authState?.accesstoken!
      );
    } catch {
      ToastAndroid.showWithGravityAndOffset(
        "Something went wrong, try again later!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setUpload(false);
    }
  };

  return (
    <ScrollView className="mt-5 h-full" showsVerticalScrollIndicator={false}>
      <Text className="text-2xl font-bold my-5 text-black dark:text-white">
        Profile Update User Image
      </Text>
      {authState?.image?.url && (
        <Image
          source={{uri: authState?.image?.url as string}}
          alt="avatar"
          className="h-48 w-full rounded"
        />
      )}
      <View className="my-5 space-y-2">
        <Text className="text-base font-bold text-black dark:text-white">
          User Image
        </Text>
        <TouchableOpacity onPress={() => openPicker()}>
          {avatar ? (
            <Image
              source={{uri: avatar.uri}}
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
      <CustomButton
        title="Update Image"
        handlePress={handleSubmit}
        containerStyles="bg-blue-700 disabled:bg-blue-300 mb-5"
        isLoading={upload}
      />
    </ScrollView>
  );
};

export default ProfileUserImage;
