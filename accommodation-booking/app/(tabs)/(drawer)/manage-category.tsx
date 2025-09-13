import {useEffect, useState} from "react";
import {
  View,
  Text,
  ToastAndroid,
  ScrollView,
  RefreshControl,
  Image,
} from "react-native";
import axios from "axios";
import {Table, Row} from "react-native-table-component";
import {router} from "expo-router";
import {FontAwesome} from "@expo/vector-icons";
import CryptoJS from "crypto-js";

import {BASE_URL, CLOUDINARY_DESTROY_URL} from "@/constants";
import {CLOUD_API_KEY, CLOUD_API_SECRET} from "@/constants/config";
import {useAuth} from "@/context/auth-context";
import IconButton from "@/components/icon-button";
import CustomButton from "@/components/custom-button";

interface CategoryTypes {
  _id: string;
  name: string;
  image: {
    url: string;
    public_id: string;
  };
  createdAt: any;
  updatedAt: any;
}

const ManageCategory = () => {
  const {authState} = useAuth();

  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    getCategories();
  }, [authState?.accesstoken]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getCategories();
    setRefreshing(false);
  };

  const [data] = useState({
    tableHead: ["Id", "Name", "Image", "Created At", "Updated At", "Actions"],
    widthArr: [200, 200, 200, 200, 200, 200],
  });

  const handleDelete = async (id: string, imageId: string) => {
    if (!id || !imageId) return;

    try {
      setLoading(true);

      const response = await axios.delete(`${BASE_URL}/category/${id}`, {
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
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signatureString = `public_id=${imageId}&timestamp=${timestamp}${CLOUD_API_SECRET}`;
        const signature = CryptoJS.SHA1(signatureString).toString();
        const data = {
          public_id: imageId,
          api_key: CLOUD_API_KEY,
          timestamp,
          signature,
        };

        await axios.post(CLOUDINARY_DESTROY_URL, data);

        getCategories();
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
          title="Create Category"
          handlePress={() => router.push("/category/create")}
        />
        {categories?.length === 0 ? (
          <Text className="text-center font-bold text-xl text-black dark:text-white mt-5">
            No categories found.
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
            <Text className="mb-5 text-xl font-bold">All Categories</Text>
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
                    {categories
                      .map((category) => [
                        category._id,
                        category.name,
                        <Image
                          source={{uri: category.image.url!}}
                          alt={category.image.public_id!}
                          className="h-[60px] max-w-[100px] rounded ml-[50px]"
                          resizeMode="cover"
                          key={category._id}
                        />,
                        new Date(category.createdAt).toLocaleDateString(),
                        new Date(category.updatedAt).toLocaleDateString(),
                        <View
                          key={category._id}
                          className="flex flex-row ml-[45px]"
                        >
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
                              router.push(`/category/update/${category._id}`)
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
                              handleDelete(
                                category._id,
                                category.image.public_id
                              )
                            }
                          />
                        </View>,
                      ])
                      .map((rowData, index) => (
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

export default ManageCategory;
