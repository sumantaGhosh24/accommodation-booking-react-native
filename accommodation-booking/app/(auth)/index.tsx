import {Text, View, ImageBackground} from "react-native";
import {router} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import AppIntroSlider from "react-native-app-intro-slider";

import {onboardingSwiperData} from "@/constants";

interface OnboardingDataType {
  id: number;
  title: string;
  description: string;
  sortDescription: string;
  image: any;
}

const Onboarding = () => {
  const renderItem = ({item}: {item: OnboardingDataType}) => (
    <SafeAreaView>
      <ImageBackground
        source={item.image}
        className="h-screen flex items-center justify-center"
      >
        <View className="flex gap-4 w-[80%] mx-auto bg-black/70 p-5">
          <Text className="text-center text-3xl font-bold capitalize text-white">
            {item.title}
          </Text>
          <Text className="text-center text-lg font-medium capitalize text-white">
            {item.description}
          </Text>
          <Text className="text-center text-base font-medium capitalize text-white">
            {item.sortDescription}
          </Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );

  return (
    <AppIntroSlider
      renderItem={renderItem}
      data={onboardingSwiperData}
      onDone={() => router.push("/login")}
      onSkip={() => router.push("/login")}
      renderNextButton={() => (
        <View className="bg-blue-700 rounded-xl py-2.5 px-4 flex flex-row justify-center items-center">
          <Text className="text-white font-semibold text-lg">Next</Text>
        </View>
      )}
      renderDoneButton={() => (
        <View className="bg-blue-700 rounded-xl py-2.5 px-4 flex flex-row justify-center items-center">
          <Text className="text-white font-semibold text-lg">Done</Text>
        </View>
      )}
      showSkipButton={false}
      dotStyle={{backgroundColor: "gray"}}
      bottomButton={true}
      activeDotStyle={{backgroundColor: "#1D4ED8"}}
    />
  );
};

export default Onboarding;
