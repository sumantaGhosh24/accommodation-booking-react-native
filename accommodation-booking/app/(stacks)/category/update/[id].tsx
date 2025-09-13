import {useEffect, useState} from "react";
import {Text, ToastAndroid, View} from "react-native";
import axios from "axios";
import {useLocalSearchParams} from "expo-router";

import FormField from "@/components/form-field";
import CustomButton from "@/components/custom-button";
import {BASE_URL} from "@/constants";
import {useAuth} from "@/context/auth-context";

const UpdateCategory = () => {
  const {id} = useLocalSearchParams();
  const {authState} = useAuth();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const getCategory = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${BASE_URL}/category/${id}`);

      if (response.data.success === true) {
        setName(response.data.category.name);
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

  useEffect(() => {
    getCategory();
  }, [authState?.accesstoken]);

  const handleSubmit = async () => {
    if (name === "")
      return ToastAndroid.showWithGravityAndOffset(
        "Fill all fields!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

    try {
      setLoading(true);

      const response = await axios.put(
        `${BASE_URL}/category/${id}`,
        {name},
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
        getCategory();
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
        Update Category
      </Text>
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
        title="Update Category"
        handlePress={handleSubmit}
        containerStyles="bg-blue-700 disabled:bg-blue-300 mb-5"
        isLoading={loading}
      />
    </View>
  );
};

export default UpdateCategory;
