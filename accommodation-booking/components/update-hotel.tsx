import {useState, useEffect} from "react";
import {Text, ToastAndroid, View, StyleSheet, Image} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import {FontAwesome} from "@expo/vector-icons";
import axios from "axios";

import {useAuth} from "@/context/auth-context";
import {BASE_URL} from "@/constants";

import CustomButton from "./custom-button";
import FormField from "./form-field";

interface CategoryTypes {
  _id: string;
  name: string;
  image: {
    url: string;
    public_id: string;
  };
}

const UpdateHotel = ({id}: {id: string}) => {
  const {authState} = useAuth();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    price: "",
    country: "",
    city: "",
    state: "",
    zip: "",
    address: "",
    latitude: "",
    longitude: "",
  });
  const [defaultCategory, setDefaultCategory] = useState();

  const getCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/category`);

      setCategories(response.data.categories);
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

  const getHotel = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/hotel/${id}`);

      setForm({
        title: response.data.hotel.title,
        description: response.data.hotel.description,
        content: response.data.hotel.content,
        category: response.data.hotel.category._id,
        price: response.data.hotel.price,
        country: response.data.hotel.country,
        city: response.data.hotel.city,
        state: response.data.hotel.state,
        zip: response.data.hotel.zip,
        address: response.data.hotel.address,
        latitude: response.data.hotel.latitude,
        longitude: response.data.hotel.longitude,
      });
      setDefaultCategory(response.data.hotel.category);
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
    getCategories();
    getHotel();
  }, [authState?.accesstoken]);

  const handleSubmit = async () => {
    if (
      form.title === "" ||
      form.description === "" ||
      form.category === "" ||
      form.price === "" ||
      form.country === "" ||
      form.city === "" ||
      form.state === "" ||
      form.zip === "" ||
      form.address === "" ||
      form.latitude === "" ||
      form.longitude === "" ||
      form.content === ""
    ) {
      return ToastAndroid.showWithGravityAndOffset(
        "Fill all fields!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    try {
      setLoading(true);

      const response = await axios.put(
        `${BASE_URL}/hotel/${id}`,
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

      if (response.data.success === true) {
        getHotel();
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
    <View>
      <Text className="text-2xl font-bold my-5">Update Hotel</Text>
      <SelectDropdown
        data={categories}
        defaultValue={defaultCategory}
        onSelect={(selectedItem) => {
          setForm({...form, category: selectedItem._id});
        }}
        renderButton={(selectedItem, isOpened) => {
          return (
            <View style={styles.dropdownButtonStyle}>
              <Text style={styles.dropdownButtonTxtStyle}>
                {(selectedItem && selectedItem._id) || "Select a category"}
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
      <FormField
        title="Hotel Title"
        placeholder="Enter hotel title"
        value={form.title}
        handleChangeText={(text: any) => setForm({...form, title: text})}
        otherStyles="mb-3"
        autoComplete="name"
        keyboardType="default"
      />
      <FormField
        title="Hotel Description"
        placeholder="Enter hotel description"
        value={form.description}
        handleChangeText={(text: any) => setForm({...form, description: text})}
        otherStyles="mb-3"
        custom={true}
        autoComplete="name"
        keyboardType="default"
      />
      <FormField
        title="Hotel Content"
        placeholder="Enter hotel content"
        value={form.content}
        handleChangeText={(text: any) => setForm({...form, content: text})}
        otherStyles="mb-3"
        autoComplete="name"
        keyboardType="default"
        custom={true}
      />
      <FormField
        title="Hotel Price"
        placeholder="Enter hotel price"
        value={form.price}
        handleChangeText={(text: any) => setForm({...form, price: text})}
        otherStyles="mb-3"
        autoComplete="name"
        keyboardType="numeric"
      />
      <FormField
        title="Hotel Country"
        placeholder="Enter hotel country"
        value={form.country}
        handleChangeText={(text: any) => setForm({...form, country: text})}
        otherStyles="mb-3"
        autoComplete="country"
        keyboardType="default"
      />
      <FormField
        title="Hotel City"
        placeholder="Enter hotel city"
        value={form.city}
        handleChangeText={(text: any) => setForm({...form, city: text})}
        otherStyles="mb-3"
        autoComplete="country"
        keyboardType="default"
      />
      <FormField
        title="Hotel State"
        placeholder="Enter hotel state"
        value={form.state}
        handleChangeText={(text: any) => setForm({...form, state: text})}
        otherStyles="mb-3"
        autoComplete="country"
        keyboardType="default"
      />
      <FormField
        title="Hotel Zip"
        placeholder="Enter hotel zip"
        value={form.zip}
        handleChangeText={(text: any) => setForm({...form, zip: text})}
        otherStyles="mb-3"
        autoComplete="country"
        keyboardType="default"
      />
      <FormField
        title="Hotel Address"
        placeholder="Enter hotel address"
        value={form.address}
        handleChangeText={(text: any) => setForm({...form, address: text})}
        otherStyles="mb-3"
        autoComplete="address-line1"
        keyboardType="default"
      />
      <FormField
        title="Hotel Latitude"
        placeholder="Enter hotel latitude"
        value={form.latitude}
        handleChangeText={(text: any) => setForm({...form, latitude: text})}
        otherStyles="mb-3"
        autoComplete="address-line1"
        keyboardType="default"
      />
      <FormField
        title="Hotel Longitude"
        placeholder="Enter hotel longitude"
        value={form.longitude}
        handleChangeText={(text: any) => setForm({...form, longitude: text})}
        otherStyles="mb-3"
        autoComplete="address-line1"
        keyboardType="default"
      />
      <CustomButton
        title="Update Hotel"
        handlePress={handleSubmit}
        containerStyles="bg-blue-700 disabled:bg-blue-300 mb-5"
        isLoading={loading}
      />
    </View>
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
  },
  dropdownItemIconStyle: {
    fontSize: 24,
    marginRight: 8,
  },
});

export default UpdateHotel;
