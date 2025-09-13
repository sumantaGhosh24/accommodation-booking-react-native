import {useState} from "react";
import {View, Text, ToastAndroid} from "react-native";
import axios from "axios";
import RazorpayCheckout from "react-native-razorpay";
import CalendarPicker from "react-native-calendar-picker";

import {useAuth} from "@/context/auth-context";
import {RAZORPAY_KEY_ID} from "@/constants/config";
import {BASE_URL} from "@/constants";
import FormField from "@/components/form-field";
import CustomButton from "@/components/custom-button";

interface HotelBookingFormProps {
  id: string;
  price: number;
}

const HotelBookingForm = ({id, price}: HotelBookingFormProps) => {
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [checkInDate, setCheckInDate] = useState<any>(null);
  const [checkOutDate, setCheckOutDate] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const minDate = new Date();
  const maxDate = new Date(2026, 2, 1);

  const handleChange = (...arg: any[]) => {
    if (arg[1] === "END_DATE") {
      setCheckOutDate(arg[0]);
    } else {
      setCheckInDate(arg[0]);
      setCheckOutDate(null);
    }
  };

  const {authState} = useAuth();

  const handleSubmit = async () => {
    if (price === 0 || id === "") {
      return ToastAndroid.showWithGravityAndOffset(
        "Something went wrong, try again later!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    if (!checkInDate || !checkOutDate) {
      return ToastAndroid.showWithGravityAndOffset(
        "Select your start and end date!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    if (adults < 0) {
      return ToastAndroid.showWithGravityAndOffset(
        "At least one adult is required!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    const differenceInTime =
      new Date(checkOutDate).getTime() - new Date(checkInDate).getTime();
    const numberOfDays = Math.round(differenceInTime / (1000 * 3600 * 24)) + 1;

    try {
      setLoading(true);

      const response = await axios.post(
        `${BASE_URL}/razorpay`,
        {price: price * numberOfDays},
        {
          headers: {
            Authorization: `Bearer ${authState?.accesstoken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success === false) {
        return ToastAndroid.showWithGravityAndOffset(
          "Something went wrong, try again later!",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }

      const options = {
        description: "Credits towards consultation",
        image: "https://i.imgur.com/3g7nmJC.png",
        currency: response.data.order.currency,
        key: RAZORPAY_KEY_ID,
        amount: response.data.order.amount,
        order_id: response.data.order.id,
        theme: {color: "#1D4ED8"},
        name: authState?.username!,
      };

      RazorpayCheckout.open(options)
        .then(async (data) => {
          const res = await axios.post(
            `${BASE_URL}/verification`,
            {
              orderCreationId: response.data.order.id,
              razorpayPaymentId: data.razorpay_payment_id,
              razorpayOrderId: data.razorpay_order_id,
              razorpaySignature: data.razorpay_signature,
              hotel: id,
              price: response.data.order.amount / 100,
              checkInDate,
              checkOutDate,
              numberOfDays,
              adults,
              children,
            },
            {
              headers: {
                Authorization: `Bearer ${authState?.accesstoken}`,
                "Content-Type": "application/json",
              },
            }
          );

          setAdults(0);
          setChildren(0);
          setCheckInDate(null);
          setCheckOutDate(null);

          if (res.data.success === true)
            ToastAndroid.showWithGravityAndOffset(
              "Payment Success!",
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            );
        })
        .catch((error) => {
          ToastAndroid.showWithGravityAndOffset(
            `${error.code} | ${error.description}`,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        });
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
    <View className="p-3 border border-black dark:border-white m-4 rounded">
      <Text className="text-2xl font-bold text-black dark:text-white mb-5">
        Book Hotel
      </Text>
      <FormField
        title="Adults"
        placeholder="Enter number of adults"
        value={adults}
        handleChangeText={(text: any) => setAdults(text)}
        otherStyles="mb-3"
        autoComplete="tel"
        keyboardType="number-pad"
      />
      <FormField
        title="Children"
        placeholder="Enter number of children"
        value={children}
        handleChangeText={(text: any) => setChildren(text)}
        otherStyles="mb-3"
        autoComplete="tel"
        keyboardType="number-pad"
      />
      <CalendarPicker
        startFromMonday={true}
        allowRangeSelection={true}
        minDate={minDate}
        maxDate={maxDate}
        todayBackgroundColor="#f2e6ff"
        selectedDayColor="#7300e6"
        selectedDayTextColor="#FFFFFF"
        onDateChange={handleChange}
      />
      <Text>
        Check in date: {checkInDate ? checkInDate.toDateString() : ""}
      </Text>
      <Text>
        Check out date: {checkOutDate ? checkOutDate.toDateString() : ""}
      </Text>
      <CustomButton
        title="Book Hotel"
        handlePress={handleSubmit}
        containerStyles="bg-blue-700 my-5"
        isLoading={loading}
      />
    </View>
  );
};

export default HotelBookingForm;
