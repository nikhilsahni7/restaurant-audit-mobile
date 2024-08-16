import React from "react";
import { Header } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const CustomHeader = ({ scene, previous, navigation }: any) => {
  const { options } = scene.descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.name;

  return (
    <Header
      leftComponent={
        previous ? (
          <Icon
            name="arrow-left"
            size={24}
            color="#fff"
            onPress={navigation.goBack}
          />
        ) : undefined
      }
      centerComponent={{ text: title, style: { color: "#fff", fontSize: 18 } }}
      rightComponent={
        <Icon
          name="logout"
          size={24}
          color="#fff"
          onPress={() => navigation.navigate("Auth")}
        />
      }
    />
  );
};

export default CustomHeader;
