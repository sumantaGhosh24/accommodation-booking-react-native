import {useState} from "react";
import {View, Text, Image, TouchableOpacity, ToastAndroid} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {FontAwesome5} from "@expo/vector-icons";
import axios from "axios";

import {useAuth} from "@/context/auth-context";
import {UPLOAD_PRESET} from "@/constants/config";
import {BASE_URL, CLOUDINARY_URL} from "@/constants";

import CustomButton from "./custom-button";

const AddHotelImage = ({id}: {id: string}) => {
  const {authState} = useAuth();

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);

  const openPicker = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access media is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      aspect: [4, 3],
      allowsMultipleSelection: true,
    });

    if (pickerResult.canceled === true) {
      return;
    }

    setImages(
      pickerResult.assets.map((asset) => ({
        uri: asset.uri,
        type: asset.mimeType,
        name: asset.fileName,
      }))
    );
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      return ToastAndroid.showWithGravityAndOffset(
        "Select a image first!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    try {
      setLoading(true);

      const uploadImagePromise = images.map(async (image) => {
        let formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", UPLOAD_PRESET);

        const imageResponse = await axios.post(CLOUDINARY_URL, formData, {
          headers: {"Content-Type": "multipart/form-data"},
        });

        return imageResponse.data;
      });

      const uploadImageData = await Promise.all(uploadImagePromise);
      const filteredImageData = uploadImageData.map((i) => ({
        url: i.secure_url,
        public_id: i.public_id,
      }));

      const response = await axios.patch(
        `${BASE_URL}/add-image/${id}`,
        {images: filteredImageData},
        {headers: {Authorization: `Bearer ${authState?.accesstoken}`}}
      );

      ToastAndroid.showWithGravityAndOffset(
        response.data.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      if (response.data.success === true) {
        setImages([]);
      }
    } catch (error) {
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
    <View>
      <Text className="text-2xl font-bold my-5">Add Hotel Image</Text>
      <View className="my-5 space-y-2">
        <Text className="text-base font-bold">Hotel Image</Text>
        <TouchableOpacity onPress={() => openPicker()}>
          {images.length > 0 ? (
            <View className="flex flex-row items-center flex-wrap gap-3 mt-3">
              {images?.map((img, i) => (
                <Image
                  source={{uri: img?.uri}}
                  resizeMode="cover"
                  className="h-16 w-16 rounded-2xl"
                  key={i}
                />
              ))}
            </View>
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
        title="Add Image"
        handlePress={handleSubmit}
        containerStyles="bg-blue-700 disabled:bg-blue-300 mb-5"
        isLoading={loading}
      />
    </View>
  );
};

export default AddHotelImage;
