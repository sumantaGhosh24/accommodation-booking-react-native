import {useState} from "react";
import {View, Text, ToastAndroid} from "react-native";
import axios from "axios";

import {useAuth} from "@/context/auth-context";
import {BASE_URL} from "@/constants";

import FormField from "./form-field";
import CustomButton from "./custom-button";

interface AddHotelRatingProps {
  id: string;
  setFetch: any;
}

const AddHotelRating = ({id, setFetch}: AddHotelRatingProps) => {
  const {authState} = useAuth();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    comment: "",
    rating: 0,
  });

  const handleSubmit = async () => {
    if (form.comment === "") {
      return ToastAndroid.showWithGravityAndOffset(
        "Fill all fields!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    if (form.rating < 1 || form.rating > 5) {
      return ToastAndroid.showWithGravityAndOffset(
        "Rating must be within 1 to 5",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${BASE_URL}/rating/${id}`,
        {...form},
        {headers: {Authorization: `Bearer ${authState?.accesstoken}`}}
      );

      ToastAndroid.showWithGravityAndOffset(
        response.data.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      setFetch((prev: boolean) => !prev);
      setForm({
        comment: "",
        rating: 0,
      });
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
    <View className="px-3 border border-black dark:border-white m-4 rounded">
      <Text className="text-2xl font-bold my-5 text-black dark:text-white">
        Add Hotel Rating
      </Text>
      <FormField
        title="Rating Comment"
        placeholder="Enter rating comment"
        value={form.comment}
        handleChangeText={(text: any) => setForm({...form, comment: text})}
        otherStyles="mb-3"
        autoComplete="name"
        keyboardType="default"
      />
      <FormField
        title="Rating Star"
        placeholder="Enter rating star"
        value={form.rating}
        handleChangeText={(text: any) => setForm({...form, rating: text})}
        otherStyles="mb-3"
        autoComplete="tel"
        keyboardType="numeric"
      />
      <CustomButton
        title="Create Rating"
        handlePress={handleSubmit}
        containerStyles="bg-blue-700 disabled:bg-blue-300 mb-5"
        isLoading={loading}
      />
    </View>
  );
};

export default AddHotelRating;
