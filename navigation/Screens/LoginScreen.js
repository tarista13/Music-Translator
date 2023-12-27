import { StyleSheet, Text, View, SafeAreaView, Pressable } from "react-native";
import { Entypo } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import * as AppAuth from "expo-app-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";

const LoginScreen = () => {
  const navigation = useNavigation();
  useEffect(() => {
    const checkTokenValidity = async() => {
      const accessToken = await AsyncStorage.getItem("token");
      const expirationDate = await AsyncStorage.getItem("expirationDate");
      console.log("accessToken:", accessToken);
      console.log("expirationDate:", expirationDate);

      if(accessToken && expirationDate){
        const currentTime = Date.now();
        if(currentTime < parseInt(expirationDate)){
          navigation.replace("Main")
        } else {
          AsyncStorage.removeItem("token");
          AsyncStorage.removeItem("expirationDate");
        }
      }
    }
    checkTokenValidity();
  },[])
  async function authenticate () {
    const config = {
      issuer:"https://accounts.spotify.com",
      clientId:"eb64fd7b14bb4b68992e0cf779a78070",
      scope: [
        "user-read-email",
        "user-library-read",
        "user-read-recently-played",
        "user-top-read",
        "playlist-read-private",
        "playlist-read-collaborative",
        "playlist-modify-public"
      ],
      redirectUrl:"exp://localhost:19006/--/spotify-auth-callback"
    }
    const result = await AppAuth.authAsync(config);
    console.log(result);
    if(result.accessToken){
      const expirationDate = new Date(result.accessTokenExpirationDate).getTime();
      AsyncStorage.setItem("token", result.accessToken);
      AsyncStorage.setItem("expirationDate", expirationDate.toString());
      navigation.navigate("Main")
    }
  }
  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={{alignItems:"center"}}>
          <Pressable
          onPress={authenticate}
            style={{
              backgroundColor: "#1DB954",
              padding:10,
              width: 300,
              height:50,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 25,
              marginTop:325,
              marginLeft:"auto",
              marginRight:"auto"
            }}
          >
            <Text>Sign in with Spotify</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
