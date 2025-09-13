import {useState, useEffect} from "react";
import {
  View,
  Text,
  ToastAndroid,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import SelectDropdown from "react-native-select-dropdown";
import axios from "axios";
import {FontAwesome} from "@expo/vector-icons";

import {useAuth} from "@/context/auth-context";
import {BASE_URL} from "@/constants";
import FormField from "@/components/form-field";
import Loader from "@/components/loader";
import HotelCard from "@/components/hotel-card";

interface HotelProps {
  count: number;
  hotels: {
    _id: string;
    title: string;
    description: string;
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
  }[];
  success: boolean;
}

interface CategoriesProps {
  _id: string;
  name: string;
  image: {
    url: string;
    public_id: string;
  };
}

const Home = () => {
  const {authState} = useAuth();

  const [data, setData] = useState({
    page: 1,
    sort: "-createdAt",
    search: "",
    category: "",
  });
  const [categories, setCategories] = useState<CategoriesProps[]>([]);
  const [hotels, setHotels] = useState<HotelProps>();
  const [loading, setLoading] = useState(false);

  const getCategories = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${BASE_URL}/category`);

      setCategories([
        ...response.data.categories,
        {
          name: "All",
          _id: "",
          image: {
            url: "https://res-console.cloudinary.com/dzqgzsnoc/media_explorer_thumbnails/87324685f91e5b25e1c37b6de220c71d/detailed",
            public_id: "public_id",
          },
        },
      ]);
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

  const getHotels = async () => {
    try {
      setLoading(true);

      let str = "";
      if (data.search !== "") str += `&search=${data.search}`;
      if (data.category !== "") str += `&category=${data.category}`;

      const response = await axios.get(
        `${BASE_URL}/p-hotels?page=${data.page}&sort=${data.sort}${str}`
      );

      setHotels(response.data);
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
    getCategories();
  }, [authState?.accesstoken]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getHotels();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [data, authState?.accesstoken]);

  return (
    <SafeAreaView className="min-h-screen">
      <ScrollView>
        <View className="w-full min-h-screen px-4">
          <Text className="text-2xl font-bold mb-5 text-black dark:text-white">
            All Hotels
          </Text>
          <View className="bg-white dark:bg-black p-3 rounded">
            <FormField
              title="Search Hotels"
              placeholder="Search hotels..."
              handleChangeText={(text: any) => setData({...data, search: text})}
              value={data.search}
              otherStyles="mb-5"
              autoComplete="name"
              keyboardType="default"
            />
            <SelectDropdown
              data={categories}
              onSelect={(selectedItem) => {
                setData({...data, category: selectedItem._id});
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {(selectedItem && selectedItem.name) ||
                        "Select a category"}
                    </Text>
                    <FontAwesome
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      style={styles.dropdownButtonArrowStyle}
                    />
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View
                    style={{
                      ...styles.dropdownItemStyle,
                      ...(isSelected && {backgroundColor: "#D2D9DF"}),
                    }}
                  >
                    <Image
                      source={{uri: item.image.url}}
                      resizeMode="cover"
                      className="h-10 w-10 rounded-full mr-2"
                    />
                    <Text style={styles.dropdownItemTxtStyle}>{item.name}</Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={styles.dropdownMenuStyle}
            />
          </View>
          <Loader isLoading={loading} />
          <View className="flex gap-3 px-4 items-center mx-auto mt-10 min-w-[90%]">
            {hotels?.hotels?.map((hotel) => (
              <HotelCard
                key={hotel?._id}
                id={hotel?._id}
                img={hotel?.images[0]?.url}
                title={hotel?.title}
                description={hotel?.description}
                category={hotel?.category?.name}
                price={hotel?.price}
              />
            ))}
          </View>
          {hotels?.count && hotels?.count > 0 && (
            <View className="flex flex-row items-center gap-3 mb-48 flex-wrap">
              {[...Array(Math.ceil(hotels!.count / 10))].fill(0).map((c, i) => (
                <TouchableOpacity
                  key={i + 1}
                  onPress={() => setData({...data, page: i + 1})}
                  className={`p-3 rounded ${
                    i + 1 === data.page
                      ? "bg-blue-700"
                      : "bg-black dark:bg-white"
                  }`}
                >
                  <Text className="font-bold text-white dark:text-black">
                    {i + 1}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
    textTransform: "capitalize",
  },
  dropdownItemIconStyle: {
    fontSize: 24,
    marginRight: 8,
  },
});

export default Home;
