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
import {router} from "expo-router";
import {FontAwesome} from "@expo/vector-icons";
import {Row, Table} from "react-native-table-component";
import CryptoJS from "crypto-js";

import {BASE_URL, CLOUDINARY_DESTROY_URL} from "@/constants";
import {CLOUD_API_KEY, CLOUD_API_SECRET} from "@/constants/config";
import {useAuth} from "@/context/auth-context";
import IconButton from "@/components/icon-button";
import CustomButton from "@/components/custom-button";

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

const ManageHotels = () => {
  const {authState} = useAuth();

  const [hotels, setHotels] = useState<HotelTypes[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const getHotels = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/hotels`);

      setHotels(response.data.hotels);
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
    getHotels();
  }, [authState?.accesstoken]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getHotels();
    setRefreshing(false);
  };

  const [data] = useState({
    tableHead: [
      "Id",
      "Title",
      "Description",
      "Image",
      "Category",
      "Owner",
      "Price",
      "Country",
      "State",
      "City",
      "Zip",
      "Address",
      "Latitude",
      "Longitude",
      "Created At",
      "Updated At",
      "Actions",
    ],
    widthArr: [
      200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
      200, 200,
    ],
  });

  const handleDelete = async (id: string, images: any[]) => {
    if (!id || !images) return;

    try {
      setLoading(true);

      const response = await axios.delete(`${BASE_URL}/hotel/${id}`, {
        headers: {Authorization: `Bearer ${authState?.accesstoken}`},
      });

      ToastAndroid.showWithGravityAndOffset(
        response.data.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      if (response.data.success === true) {
        const deleteImagePromise = images.map(async (img) => {
          const timestamp = Math.round(new Date().getTime() / 1000);
          const signatureString = `public_id=${img.public_id}&timestamp=${timestamp}${CLOUD_API_SECRET}`;
          const signature = CryptoJS.SHA1(signatureString).toString();
          const data = {
            public_id: img.public_id,
            api_key: CLOUD_API_KEY,
            timestamp,
            signature,
          };
          await axios.post(CLOUDINARY_DESTROY_URL, data);
        });
        await Promise.all(deleteImagePromise);

        getHotels();
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
    <View className="h-full">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        className="px-3"
      >
        <CustomButton
          containerStyles="bg-blue-700 my-5"
          title="Create Hotel"
          handlePress={() => router.push("/hotel/create")}
        />
        {hotels?.length === 0 ? (
          <Text className="text-center font-bold text-xl text-black dark:text-white mt-5">
            No hotels found.
          </Text>
        ) : (
          <View
            style={{
              flex: 1,
              padding: 16,
              paddingTop: 30,
              backgroundColor: "#fff",
              marginTop: 20,
              borderRadius: 7,
            }}
          >
            <Text className="mb-5 text-xl font-bold">All Hotels</Text>
            <ScrollView horizontal={true} className="mb-5">
              <View>
                <Table borderStyle={{borderWidth: 1, borderColor: "#1D4ED8"}}>
                  <Row
                    data={data.tableHead}
                    widthArr={data.widthArr}
                    style={{height: 40, backgroundColor: "#1D4ED8"}}
                    textStyle={{
                      fontSize: 20,
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "white",
                    }}
                  />
                </Table>
                <ScrollView>
                  <Table borderStyle={{borderWidth: 1, borderColor: "#1D4ED8"}}>
                    {hotels
                      ?.map((hotel) => [
                        hotel._id,
                        hotel.title,
                        hotel.description,
                        <Image
                          source={{uri: hotel.images[0].url!}}
                          alt={hotel.images[0].public_id!}
                          className="h-[60px] max-w-[100px] rounded ml-[50px]"
                          resizeMode="cover"
                        />,
                        <View className="flex flex-row items-center ml-3">
                          <Image
                            source={{uri: hotel.category.image.url}}
                            className="mr-3 h-[50px] w-[50px] rounded"
                            resizeMode="cover"
                          />
                          <Text className="capitalize font-bold">
                            {hotel.category.name}
                          </Text>
                        </View>,
                        <View className="flex flex-row items-center ml-3">
                          <Image
                            source={{uri: hotel.owner.image.url}}
                            className="mr-3 h-[50px] w-[50px] rounded"
                            resizeMode="cover"
                          />
                          <View>
                            <Text className="font-bold">
                              {hotel.owner.username}
                            </Text>
                            <Text className="font-bold">
                              {hotel.owner.email}
                            </Text>
                          </View>
                        </View>,
                        hotel.price,
                        hotel.country,
                        hotel.state,
                        hotel.city,
                        hotel.zip,
                        hotel.address,
                        hotel.latitude,
                        hotel.longitude,
                        new Date(hotel.createdAt).toLocaleDateString(),
                        new Date(hotel.updatedAt).toLocaleDateString(),
                        <View className="flex flex-row ml-[45px]">
                          <IconButton
                            icon={
                              <FontAwesome name="eye" size={24} color="white" />
                            }
                            isLoading={loading}
                            containerStyles="bg-[#1D4ED8] mr-3"
                            handlePress={() =>
                              router.push(`/hotel/details/${hotel._id}`)
                            }
                          />
                          <IconButton
                            icon={
                              <FontAwesome
                                name="pencil"
                                size={24}
                                color="white"
                              />
                            }
                            isLoading={loading}
                            containerStyles="bg-[#1ac50e] mr-3"
                            handlePress={() =>
                              router.push(`/hotel/update/${hotel._id}`)
                            }
                          />
                          <IconButton
                            icon={
                              <FontAwesome
                                name="trash"
                                size={24}
                                color="white"
                              />
                            }
                            isLoading={loading}
                            containerStyles="bg-[#e10a11]"
                            handlePress={() =>
                              handleDelete(hotel._id, hotel.images)
                            }
                          />
                        </View>,
                      ])
                      ?.map((rowData, index) => (
                        <Row
                          key={index}
                          data={rowData}
                          widthArr={data.widthArr}
                          style={{height: 100, backgroundColor: "#E7E6E1"}}
                          textStyle={{
                            margin: 6,
                            fontSize: 16,
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        />
                      ))}
                  </Table>
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ManageHotels;
