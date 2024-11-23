import {useEffect, useState} from "react";
import {
  View,
  Text,
  ToastAndroid,
  ScrollView,
  RefreshControl,
} from "react-native";
import axios from "axios";
import {Table, Row} from "react-native-table-component";

import {BASE_URL} from "@/constants";
import {useAuth} from "@/context/auth-context";

interface RatingTypes {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  comment: string;
  rating: number;
  createdAt: any;
  updatedAt: any;
}

const MyRatings = () => {
  const {authState} = useAuth();

  const [ratings, setRatings] = useState<RatingTypes[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const getRatings = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ratings`, {
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
  }, [authState?.accesstoken]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getRatings();
    setRefreshing(false);
  };

  const [data] = useState({
    tableHead: ["Id", "Comment", "Rating", "User", "Created At", "Updated At"],
    widthArr: [200, 200, 200, 200, 200, 200],
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
        {ratings.length === 0 ? (
          <Text className="text-center font-bold text-xl text-black dark:text-white mt-5">
            No ratings found.
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
            <Text className="mb-5 text-xl font-bold">My Ratings</Text>
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
                    {ratings
                      .map((rating) => [
                        rating._id,
                        rating.comment,
                        rating.rating,
                        <View>
                          <Text>
                            {rating.user.firstName} {rating.user.lastName}
                          </Text>
                          <Text>{rating.user.email}</Text>
                        </View>,
                        new Date(rating.createdAt).toLocaleDateString(),
                        new Date(rating.updatedAt).toLocaleDateString(),
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

export default MyRatings;
