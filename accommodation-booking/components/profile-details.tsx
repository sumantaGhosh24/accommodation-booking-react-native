import {View, Text, ScrollView, Image} from "react-native";

import {useAuth} from "@/context/auth-context";

import Loader from "./loader";

const ProfileDetails = () => {
  const {authState, loading} = useAuth();

  return (
    <ScrollView className="mt-5" showsVerticalScrollIndicator={false}>
      {loading && <Loader isLoading={loading} />}
      {authState?.image?.url && (
        <Image
          source={{uri: authState?.image?.url as string}}
          alt={authState?.image?.public_id as string}
          className="w-full h-[250px] rounded"
        />
      )}
      <View className="flex flex-row my-3">
        <Text className="text-black dark:text-white">User ID: </Text>
        <Text className="capitalize font-bold text-black dark:text-white">
          {authState?._id}
        </Text>
      </View>
      <View className="flex flex-row">
        <Text className="text-black dark:text-white">Email Address: </Text>
        <Text className="font-bold text-black dark:text-white">
          {authState?.email}
        </Text>
      </View>
      <View className="flex flex-row my-3">
        <Text className="text-black dark:text-white">Mobile Number: </Text>
        <Text className="capitalize font-bold text-black dark:text-white">
          {authState?.mobileNumber}
        </Text>
      </View>
      {authState?.firstName && (
        <View>
          <View className="flex flex-row">
            <Text className="text-black dark:text-white">First Name: </Text>
            <Text className="capitalize font-bold text-black dark:text-white">
              {authState?.firstName}
            </Text>
          </View>
          <View className="flex flex-row my-3">
            <Text className="text-black dark:text-white">Last Name: </Text>
            <Text className="capitalize font-bold text-black dark:text-white">
              {authState?.lastName}
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-black dark:text-white">Username: </Text>
            <Text className="font-bold text-black dark:text-white">
              {authState?.username}
            </Text>
          </View>
          <View className="flex flex-row my-3">
            <Text className="text-black dark:text-white">DOB: </Text>
            <Text className="capitalize font-bold text-black dark:text-white">
              {new Date(authState?.dob as string).toLocaleDateString()}
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-black dark:text-white">Gender: </Text>
            <Text className="capitalize font-bold text-black dark:text-white">
              {authState?.gender}
            </Text>
          </View>
        </View>
      )}
      {authState?.city && (
        <View>
          <View className="flex flex-row my-3">
            <Text className="text-black dark:text-white">City: </Text>
            <Text className="capitalize font-bold text-black dark:text-white">
              {authState?.city}
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-black dark:text-white">State: </Text>
            <Text className="capitalize font-bold text-black dark:text-white">
              {authState?.state}
            </Text>
          </View>
          <View className="flex flex-row my-3">
            <Text className="text-black dark:text-white">Country: </Text>
            <Text className="capitalize font-bold text-black dark:text-white">
              {authState?.country}
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-black dark:text-white">Zip: </Text>
            <Text className="capitalize font-bold text-black dark:text-white">
              {authState?.zip}
            </Text>
          </View>
          <View className="flex flex-row my-3">
            <Text className="text-black dark:text-white">Addressline: </Text>
            <Text className="capitalize font-bold text-black dark:text-white">
              {authState?.addressline}
            </Text>
          </View>
        </View>
      )}
      <View className="flex flex-row">
        <Text className="text-black dark:text-white">Role: </Text>
        <Text className="capitalize font-bold text-black dark:text-white">
          {authState?.role}
        </Text>
      </View>
      <View className="flex flex-row my-3">
        <Text className="text-black dark:text-white">Created At: </Text>
        <Text className="capitalize font-bold text-black dark:text-white">
          {new Date(authState?.createdAt as string).toLocaleDateString()}
        </Text>
      </View>
      <View className="flex flex-row mb-10">
        <Text className="text-black dark:text-white">Updated At: </Text>
        <Text className="capitalize font-bold text-black dark:text-white">
          {new Date(authState?.updatedAt as string).toLocaleDateString()}
        </Text>
      </View>
    </ScrollView>
  );
};

export default ProfileDetails;
