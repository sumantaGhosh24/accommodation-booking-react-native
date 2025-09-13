import {useState, useEffect} from "react";
import {View, Text, ToastAndroid, Image, ScrollView} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import axios from "axios";

import {useAuth} from "@/context/auth-context";
import {BASE_URL} from "@/constants";
import CustomButton from "@/components/custom-button";
import AddHotelRating from "@/components/add-hotel-rating";
import HotelRatings from "@/components/hotel-ratings";
import HotelBookingForm from "@/components/hotel-booking-form";

interface HotelTypes {
  _id: string;
  owner: {
    _id: string;
    username: string;
    email: string;
    mobileNumber: string;
    image: {
      url: string;
      public_id: string;
    };
  };
  title: string;
  description: string;
  content: string;
  images: {
    url: string;
    public_id: string;
  }[];
  category: {
    _id: string;
    name: string;
    image: {
      url: string;
      public_id: string;
    };
  };
  price: number;
  country: string;
  state: string;
  city: string;
  zip: string;
  address: string;
  latitude: string;
  longitude: string;
  createdAt: any;
  updatedAt: any;
}

const HotelDetails = () => {
  const {id} = useLocalSearchParams();
  const {authState} = useAuth();

  const [hotel, setHotel] = useState<HotelTypes>();
  const [fetch, setFetch] = useState(false);

  const getHotel = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/hotel/${id}`);

      if (response.data.success === true) {
        setHotel(response.data.hotel);
      }
    } catch {
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

  return (
    <SafeAreaView className="h-screen">
      <ScrollView>
        <View className="w-full px-4">
          <View className="flex flex-row items-center my-5">
            <Text className="text-2xl font-bold mr-5 text-black dark:text-white">
              Hotel Details
            </Text>
            {authState?.role === "admin" ? (
              <CustomButton
                title="Hotels"
                containerStyles="bg-blue-700"
                handlePress={() => router.push("/manage-hotels")}
              />
            ) : (
              <CustomButton
                title="Home"
                containerStyles="bg-blue-700"
                handlePress={() => router.push("/home")}
              />
            )}
          </View>
          <View className="flex flex-row items-center flex-wrap gap-3">
            {hotel?.images.map((image, i) => (
              <Image
                key={`${image.public_id}-${i}`}
                source={{uri: image.url}}
                alt={image.public_id}
                resizeMode="cover"
                className="h-24 w-24 rounded"
              />
            ))}
          </View>
          <Text className="text-xl font-bold capitalize text-black dark:text-white my-3">
            {hotel?.title}
          </Text>
          <Text className="text-lg font-medium capitalize text-black dark:text-white">
            {hotel?.description}
          </Text>
          <View className="bg-white px-2 rounded my-3">
            <Text>{hotel?.content}</Text>
          </View>
          <View className="flex flex-row items-center gap-2">
            <Text className="text-black dark:text-white text-sm font-bold">
              Hotel Id:
            </Text>
            <Text className="text-black dark:text-white text-sm">
              {hotel?._id}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-2 my-3">
            <Text className="text-black dark:text-white text-sm font-bold">
              Hotel Price:
            </Text>
            <Text className="text-black dark:text-white text-sm">
              {hotel?.price}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-2">
            <Text className="text-black dark:text-white text-sm font-bold">
              Hotel Country:
            </Text>
            <Text className="text-black dark:text-white text-sm">
              {hotel?.country}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-2 my-3">
            <Text className="text-black dark:text-white text-sm font-bold">
              Hotel State:
            </Text>
            <Text className="text-black dark:text-white text-sm">
              {hotel?.state}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-2">
            <Text className="text-black dark:text-white text-sm font-bold">
              Hotel City:
            </Text>
            <Text className="text-black dark:text-white text-sm">
              {hotel?.city}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-2 my-3">
            <Text className="text-black dark:text-white text-sm font-bold">
              Hotel Zip:
            </Text>
            <Text className="text-black dark:text-white text-sm">
              {hotel?.zip}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-2">
            <Text className="text-black dark:text-white text-sm font-bold">
              Hotel Address:
            </Text>
            <Text className="text-black dark:text-white text-sm">
              {hotel?.address}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-2 my-3">
            <Text className="text-black dark:text-white text-sm font-bold">
              Hotel Latitude:
            </Text>
            <Text className="text-black dark:text-white text-sm">
              {hotel?.latitude}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-2">
            <Text className="text-black dark:text-white text-sm font-bold">
              Hotel Longitude:
            </Text>
            <Text className="text-black dark:text-white text-sm">
              {hotel?.longitude}
            </Text>
          </View>
          <View className="my-3">
            <Text className="text-sm font-bold text-black dark:text-white mb-3">
              Owner:{" "}
            </Text>
            <View className="flex flex-row items-center gap-3">
              <Image
                source={{uri: hotel?.owner.image.url}}
                resizeMode="cover"
                className="h-16 w-16 rounded mr-3"
              />
              <View>
                <Text className="font-bold text-black dark:text-white">
                  {hotel?.owner.email}
                </Text>
                <Text className="font-bold text-black dark:text-white">
                  {hotel?.owner.username}
                </Text>
              </View>
            </View>
          </View>
          <View>
            <Text className="text-sm font-bold text-black dark:text-white mb-3">
              Category:{" "}
            </Text>
            <View className="flex flex-row items-center gap-3">
              <Image
                source={{uri: hotel?.category.image.url}}
                resizeMode="cover"
                className="h-16 w-16 rounded mr-3"
              />
              <Text className="text-capitalize font-bold text-black dark:text-white">
                {hotel?.category.name}
              </Text>
            </View>
          </View>
          <View className="flex flex-row gap-2 items-center my-3">
            <Text className="text-base text-black dark:text-white font-bold">
              Created At
            </Text>
            <Text className="text-base text-black dark:text-white">
              {new Date(hotel?.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View className="flex flex-row gap-2 items-center mb-5">
            <Text className="text-base text-black dark:text-white font-bold">
              Updated At
            </Text>
            <Text className="text-base text-black dark:text-white">
              {new Date(hotel?.updatedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        {hotel?._id && hotel?.price && (
          <HotelBookingForm id={hotel!._id} price={hotel!.price} />
        )}
        {hotel?._id && <AddHotelRating id={hotel!._id} setFetch={setFetch} />}
        {hotel?._id && <HotelRatings id={hotel!._id} fetch={fetch} />}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HotelDetails;
