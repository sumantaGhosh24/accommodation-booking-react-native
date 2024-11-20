import {useState} from "react";
import {useWindowDimensions} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {TabView, SceneMap} from "react-native-tab-view";

import ProfileDetails from "@/components/profile-details";
import ProfileUserImage from "@/components/profile-user-image";
import ProfileUserData from "@/components/profile-user-data";
import ProfileUserAddress from "@/components/profile-user-address";
import ProfileResetPassword from "@/components/profile-reset-password";

const renderScene = SceneMap({
  details: ProfileDetails,
  image: ProfileUserImage,
  data: ProfileUserData,
  address: ProfileUserAddress,
  password: ProfileResetPassword,
});

const Profile = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: "details", title: "Details"},
    {key: "image", title: "Image"},
    {key: "data", title: "Data"},
    {key: "address", title: "Address"},
    {key: "password", title: "Password"},
  ]);

  return (
    <SafeAreaView className="h-full px-4 bg-white dark:bg-black">
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        style={{marginTop: 10}}
      />
    </SafeAreaView>
  );
};

export default Profile;
