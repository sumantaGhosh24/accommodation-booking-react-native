import {useState, useEffect} from "react";
import {
  View,
  Text,
  ToastAndroid,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import {router} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {FontAwesome, FontAwesome5} from "@expo/vector-icons";
import axios from "axios";
import SelectDropdown from "react-native-select-dropdown";
import {
  MarkdownTextInput,
  MarkdownStyle,
} from "@expensify/react-native-live-markdown";

import FormField from "@/components/form-field";
import CustomButton from "@/components/custom-button";
import {BASE_URL, CLOUDINARY_URL} from "@/constants";
import {UPLOAD_PRESET} from "@/constants/config";
import {useAuth} from "@/context/auth-context";

interface CategoryTypes {
  _id: string;
  name: string;
  image: {
    url: string;
    public_id: string;
  };
}

const FONT_FAMILY_MONOSPACE = Platform.select({
  ios: "Courier",
  default: "monospace",
});

const markdownStyle: MarkdownStyle = {
  syntax: {
    color: "gray",
  },
  link: {
    color: "blue",
  },
  h1: {
    fontSize: 25,
  },
  emoji: {
    fontSize: 20,
  },
  blockquote: {
    borderColor: "gray",
    borderWidth: 6,
    marginLeft: 6,
    paddingLeft: 6,
  },
  code: {
    fontFamily: FONT_FAMILY_MONOSPACE,
    fontSize: 20,
    color: "black",
    backgroundColor: "lightgray",
  },
  pre: {
    fontFamily: FONT_FAMILY_MONOSPACE,
    fontSize: 20,
    color: "black",
    backgroundColor: "lightgray",
  },
  mentionHere: {
    color: "green",
    backgroundColor: "lime",
  },
  mentionUser: {
    color: "blue",
    backgroundColor: "cyan",
  },
};

const CreateHotel = () => {
  const {authState} = useAuth();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
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
  const [images, setImages] = useState<any[]>([]);
  const [content, setContent] = useState("Hello, *world*!");

  const getCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/category`);

      setCategories(response.data.categories);
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
    getCategories();
  }, [authState?.accesstoken]);

  const openPicker = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access media is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      aspect: [4, 3],
      allowsMultipleSelection: true,
    });

    if (pickerResult.canceled === true) {
      return;
    }

    setImages(
      pickerResult.assets.map((asset) => ({
        uri: asset.uri,
        type: asset.mimeType,
        name: asset.fileName,
      }))
    );
  };

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
      content === "" ||
      !images
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

      const uploadImagePromise = images.map(async (image) => {
        let formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", UPLOAD_PRESET);

        const imageResponse = await axios.post(CLOUDINARY_URL, formData, {
          headers: {"Content-Type": "multipart/form-data"},
        });

        return imageResponse.data;
      });

      const uploadImageData = await Promise.all(uploadImagePromise);
      const filteredImageData = uploadImageData.map((i) => ({
        url: i.secure_url,
        public_id: i.public_id,
      }));

      const response = await axios.post(
        `${BASE_URL}/hotel`,
        {...form, content, images: filteredImageData},
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
        router.push("/manage-hotels");
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
    <SafeAreaView>
      <ScrollView>
        <View className="w-full flex justify-center px-4">
          <Text className="text-2xl font-bold my-10 text-black dark:text-white">
            Create Hotel
          </Text>
          <View className="my-5 space-y-2">
            <Text className="text-base font-bold text-black dark:text-white">
              Hotel Images
            </Text>
            <TouchableOpacity onPress={() => openPicker()}>
              {images.length > 0 ? (
                <View className="flex flex-row items-center flex-wrap gap-3 mt-3">
                  {images?.map((img, i) => (
                    <Image
                      source={{uri: img?.uri}}
                      resizeMode="cover"
                      className="h-16 w-16 rounded-2xl"
                      key={i}
                    />
                  ))}
                </View>
              ) : (
                <View className="w-full h-16 px-4 rounded-2xl border-2 bg-gray-700 flex justify-center items-center flex-row space-x-2">
                  <FontAwesome5
                    name="cloud-upload-alt"
                    size={24}
                    color="white"
                  />
                  <Text className="text-sm font-bold text-white">
                    Choose a file
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <SelectDropdown
            data={categories}
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
          <Text className="font-bold mb-3">Hotel Content</Text>
          <MarkdownTextInput
            value={content}
            onChangeText={setContent}
            markdownStyle={markdownStyle}
            style={{
              borderWidth: 2,
              borderColor: "black",
              height: 250,
              verticalAlign: "top",
              borderRadius: 10,
              marginBottom: 3,
              padding: 10,
            }}
            multiline={true}
            numberOfLines={20}
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
            handleChangeText={(text: any) =>
              setForm({...form, description: text})
            }
            otherStyles="mb-3"
            custom={true}
            autoComplete="name"
            keyboardType="default"
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
            handleChangeText={(text: any) =>
              setForm({...form, longitude: text})
            }
            otherStyles="mb-3"
            autoComplete="address-line1"
            keyboardType="default"
          />
          <CustomButton
            title="Create Hotel"
            handlePress={handleSubmit}
            containerStyles="bg-blue-700 disabled:bg-blue-300 mb-5"
            isLoading={loading}
          />
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

export default CreateHotel;
