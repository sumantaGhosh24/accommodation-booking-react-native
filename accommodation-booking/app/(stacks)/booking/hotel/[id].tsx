import {useState, useEffect} from "react";
import {
  View,
  Text,
  ToastAndroid,
  ScrollView,
  RefreshControl,
} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import axios from "axios";
import {FontAwesome} from "@expo/vector-icons";
import {Row, Table} from "react-native-table-component";

import {BASE_URL} from "@/constants";
import {useAuth} from "@/context/auth-context";
import IconButton from "@/components/icon-button";

interface BookingProps {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  hotel: {
    _id: string;
    title: string;
  };
  paymentResult: {
    id: string;
    status: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  };
  price: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfDays: string;
  adults: string;
  children: string;
  status: string;
  createdAt: any;
  updatedAt: any;
}

const HotelBooking = () => {
  const {id} = useLocalSearchParams();

  const {authState} = useAuth();

  const [bookings, setBookings] = useState<BookingProps[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const getBookings = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/hotel-booking/${id}`, {
        headers: {Authorization: `Bearer ${authState?.accesstoken}`},
      });

      setBookings(response.data.bookings);
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
    getBookings();
  }, [authState?.accesstoken]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getBookings();
    setRefreshing(false);
  };

  const [data] = useState({
    tableHead: [
      "Id",
      "User",
      "Price",
      "Check In Date",
      "Check Out Date",
      "Number Of Days",
      "Adults",
      "Children",
      "Status",
      "Created At",
      "Updated At",
      "Actions",
    ],
    widthArr: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
  });

  return (
    <View className="h-full">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        className="px-3"
      >
        {bookings?.length === 0 ? (
          <Text className="text-center font-bold text-xl text-black dark:text-white mt-5">
            No bookings found.
          </Text>
        ) : (
          <View
            style={{
              flex: 1,
              padding: 16,
              paddingTop: 30,
              backgroundColor: "#fff",
              marginTop: 100,
              borderRadius: 7,
            }}
          >
            <Text className="mb-5 text-xl font-bold">Hotel Bookings</Text>
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
                    {bookings
                      ?.map((booking) => [
                        booking._id,
                        <View key={booking._id}>
                          <Text>{booking.user.username}</Text>
                          <Text>{booking.user.email}</Text>
                        </View>,
                        booking.price,
                        booking.checkInDate,
                        booking.checkOutDate,
                        booking.numberOfDays,
                        booking.adults,
                        booking.children,
                        booking.status,
                        new Date(booking.createdAt).toLocaleDateString(),
                        new Date(booking.updatedAt).toLocaleDateString(),
                        <View key={booking._id}>
                          <IconButton
                            icon={
                              <FontAwesome
                                name="pencil"
                                size={24}
                                color="white"
                              />
                            }
                            containerStyles="bg-[#1ac50e] mr-3 max-w-[32px] ml-10"
                            handlePress={() =>
                              router.push(`/booking/update/${booking._id}`)
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

export default HotelBooking;
