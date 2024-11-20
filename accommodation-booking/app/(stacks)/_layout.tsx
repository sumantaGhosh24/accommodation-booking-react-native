import {Stack} from "expo-router";

import {Role, useAuth} from "@/context/auth-context";

const StackLayout = () => {
  const {authState} = useAuth();

  return (
    <>
      <Stack>
        <Stack.Screen
          name="category/create"
          options={{headerShown: false}}
          redirect={authState?.role !== Role.ADMIN}
        />
        <Stack.Screen
          name="category/update/[id]"
          options={{headerShown: false}}
          redirect={authState?.role !== Role.ADMIN}
        />

        <Stack.Screen
          name="hotel/create"
          options={{headerShown: false}}
          redirect={authState?.role !== Role.ADMIN}
        />
        <Stack.Screen
          name="hotel/update/[id]"
          options={{headerShown: false}}
          redirect={authState?.role !== Role.ADMIN}
        />
        <Stack.Screen
          name="hotel/details/[id]"
          options={{headerShown: false}}
          redirect={authState?.accesstoken === null}
        />

        <Stack.Screen
          name="booking/hotel/[id]"
          options={{headerShown: false}}
          redirect={authState?.role !== Role.ADMIN}
        />
        <Stack.Screen
          name="booking/update/[id]"
          options={{headerShown: false}}
          redirect={authState?.role !== Role.ADMIN}
        />
      </Stack>
    </>
  );
};

export default StackLayout;
