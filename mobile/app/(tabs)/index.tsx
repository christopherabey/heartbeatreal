import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import FeedItem from '@/components/FeedItem';
import BerealLayout from '@/components/BerealLayout';

export default function ScrollableComponent() {
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

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.viewContainer}>
        <Text style={styles.headerText}>Today's Brainbeats</Text>
        <BerealLayout front={front} back={back} height={500} width={340} />
        {/* <FeedItem front={front} back={back} width={340} height={500} data={sample_data} /> */}
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
    paddingHorizontal: 16, // Optional padding
  },
  headerText: {
    color: 'white',
    textAlign: 'left',
    fontSize: 38,
    fontWeight: 'bold',
    marginTop: 60,
  },
});