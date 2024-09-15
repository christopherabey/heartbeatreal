import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FeedItem from '@/components/FeedItem';
import { sendPushNotification, registerForPushNotificationsAsync } from '../notifications';
import { useRouter } from 'expo-router';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function ScrollableComponent() {
  const router = useRouter();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      router.push('/camera')
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  const front = require('../../assets/images/beats/front/1_front.jpg')
  const back = require('../../assets/images/beats/back/1_back.jpg')
  const pfp = require("../../assets/images/profile/shaun.jpeg")
  const sample_user = {
    profile_pic: pfp,
    name: "Sarina Li"
  }
  const sample_data = {
    caption: "what if i drank blue bull instead",
    bpm: 100,
    brain_freq: 120,
    user: sample_user
  }

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://heartbereal.onrender.com/get_entries?date=2024-09-14',
    headers: { }
  };
  
  useEffect(() => {
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
  }, [])
  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.viewContainer}>
        <Text style={styles.headerText}>Today's Brainbeats</Text>
        <TouchableOpacity
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      ><Text>asdf</Text></TouchableOpacity>
        <View style={{width:375, flex: 1, justifyContent: "center", alignContent: "center"}}>
          <FeedItem front={front} back={back} width={340} height={500} data={sample_data}></FeedItem>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Ensures the content inside ScrollView takes up the full space
    justifyContent: 'center', // Center the content vertically if the content is small
    alignItems: 'center', // Center the content horizontally
  },
  viewContainer: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  headerText: {
    color: 'white',
    textAlign: 'left',
    fontSize: 38,
    fontWeight: 'bold',
    marginTop: 60,
  },
});