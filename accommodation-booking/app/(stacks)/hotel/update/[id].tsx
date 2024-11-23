import {View, ScrollView, Text} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router, useLocalSearchParams} from "expo-router";

import CustomButton from "@/components/custom-button";
import AccordionItem from "@/components/accordion";
import UpdateHotel from "@/components/update-hotel";
import AddHotelImage from "@/components/add-hotel-image";
import RemoveHotelImage from "@/components/remove-hotel-image";

const UpdateHotelScreen = () => {
  const {id} = useLocalSearchParams();

  return (
    <SafeAreaView className="min-h-screen">
      <ScrollView>
        <View className="w-full min-h-screen px-4">
          <View className="flex flex-row items-center my-10">
            <Text className="text-2xl font-bold mr-5 text-black dark:text-white">
              Product Update
            </Text>
            <CustomButton
              title="Manage"
              containerStyles="bg-blue-700"
              handlePress={() => router.push("/manage-hotels")}
            />
          </View>
          <AccordionItem title="Update Hotel">
            <UpdateHotel id={id as string} />
          </AccordionItem>
          <AccordionItem title="Add Hotel Image">
            <AddHotelImage id={id as string} />
          </AccordionItem>
          <AccordionItem title="Remove Hotel Image">
            <RemoveHotelImage id={id as string} />
          </AccordionItem>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateHotelScreen;
