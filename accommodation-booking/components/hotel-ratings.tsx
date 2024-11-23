import {useState, useEffect} from "react";
import {
  View,
  Text,
  ToastAndroid,
  ScrollView,
  RefreshControl,
  Image,
} from "react-native";
import axios from "axios";

import {useAuth} from "@/context/auth-context";
import {BASE_URL} from "@/constants";

interface RatingTypes {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    image: {
      url: string;
      public_id: string;
    };
  };
  comment: string;
  rating: number;
  createdAt: any;
  updatedAt: any;
}

interface HotelRatingsProps {
  id: string;
  fetch: boolean;
}

const HotelRatings = ({id, fetch}: HotelRatingsProps) => {
  const {authState} = useAuth();

  const [ratings, setRatings] = useState<RatingTypes[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const getRatings = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ratings/${id}`, {
        headers: {Authorization: `Bearer ${authState?.accesstoken}`},
      });

      setRatings(response.data.ratings);
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
    getRatings();
  }, [authState?.accesstoken, fetch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getRatings();
    setRefreshing(false);
  };

  return (
    <View className="px-3 border border-black dark:border-white m-4 rounded">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold my-5 text-black dark:text-white">
          Hotel Ratings
        </Text>
        <View className="flex gap-3 px-4 items-center mx-auto min-w-[90%]">
          {ratings.map((rating) => (
            <View
              className="bg-white dark:bg-black space-y-4 border-2 border-black dark:border-white rounded p-2 mb-2 min-w-full"
              key={rating._id}
            >
              <View className="flex gap-5 flex-row">
                <Image
                  source={{uri: rating.user?.image?.url}}
                  alt={rating.user?.image?.public_id}
                  className={`w-12 h-12 rounded-full z-50`}
                  resizeMode="cover"
                />
                <View>
                  <Text className="text-black dark:text-white">
                    {rating.user?.firstName} {rating.user?.lastName}
                  </Text>
                  <Text className="text-black dark:text-white">
                    {rating.user?.email}
                  </Text>
                </View>
              </View>
              <Text className="text-xl font-medium text-black dark:text-white">
                {rating.comment}
              </Text>
              <Text className="font-medium text-black dark:text-white">
                Star: {rating.rating}
              </Text>
              <Text className="font-light text-black dark:text-white">
                Created At: {new Date(rating.createdAt).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default HotelRatings;
