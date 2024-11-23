import {useState, useEffect} from "react";
import {View, Text, ToastAndroid, ImageBackground} from "react-native";
import axios from "axios";
import CryptoJS from "crypto-js";
import {FontAwesome} from "@expo/vector-icons";

import {useAuth} from "@/context/auth-context";
import {CLOUD_API_KEY, CLOUD_API_SECRET} from "@/constants/config";
import {BASE_URL, CLOUDINARY_DESTROY_URL} from "@/constants";

const RemoveHotelImage = ({id}: {id: string}) => {
  const {authState} = useAuth();

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);

  const getHotel = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/hotel/${id}`);

      setImages(response.data.hotel.images);
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset(
        "Something went wrong, try again later!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  };

  useEffect(() => {
    getHotel();
  }, [authState?.accesstoken]);

  const handleDelete = async (public_id: string) => {
    if (!public_id) return;

    try {
      setLoading(true);

      const timestamp = Math.round(new Date().getTime() / 1000);
      const signatureString = `public_id=${public_id}&timestamp=${timestamp}${CLOUD_API_SECRET}`;
      const signature = CryptoJS.SHA1(signatureString).toString();
      const data = {
        public_id: public_id,
        api_key: CLOUD_API_KEY,
        timestamp,
        signature,
      };
      await axios.post(CLOUDINARY_DESTROY_URL, data);

      const response = await axios.patch(
        `${BASE_URL}/remove-image/${id}`,
        {public_id},
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
        getHotel();
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
      <Text className="text-2xl font-bold my-5">Remove Hotel Image</Text>
      <View className="flex flex-row items-center flex-wrap gap-3 mt-3">
        {images?.map((img, i) => (
          <ImageBackground
            source={{uri: img.url}}
            className="relative h-24 w-24 p-3"
            key={i}
          >
            <FontAwesome
              name="trash"
              size={24}
              color="#e10a11"
              onPress={() => handleDelete(img.public_id)}
              disabled={loading}
            />
          </ImageBackground>
        ))}
      </View>
    </View>
  );
};

export default RemoveHotelImage;
