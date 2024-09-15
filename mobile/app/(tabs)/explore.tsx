
import { NeurosityComponent } from '@/components/NeurosityComponent';
import { useEffect, useState } from 'react';
import ImageCarousel from '@/components/ImageCarousel';
import { View, Text, ScrollView, Image } from 'react-native';
import axios from 'axios';

export default function TabTwoScreen() {
  const [maxHeartRate, setMaxHeartRate] = useState(102)
  const [total_entries, setTotalEntries] = useState(1)
  const calm = require("../../assets/images/graphs/calm.jpg")
  const focus = require("../../assets/images/graphs/focus.jpg")

  let analytics_config = {
    method: 'post',
    url: 'https://heartbereal.onrender.com/get_insights?date=2024-09-14',
    headers: { }
  };

  useEffect(() => {

    axios.request(analytics_config)
    .then((response) => {
        const analytics: {max_heart_rate: number, total_entries: number} = JSON.parse(response.data);
        setMaxHeartRate(analytics.max_heart_rate);
        setTotalEntries(analytics.total_entries);
    })
    .catch((error) => {
        console.log(error);
    });
  }, [])
  
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1}}>
      <View style={{
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center', 
      }}>
        <ImageCarousel></ImageCarousel>
        <View style={{width: 375, paddingLeft: 20}}>
        <Text style={{fontSize: 24, color:"white", fontWeight: "bold", marginBottom: 16}}>Some Short Analytics...</Text>
        </View>
        <View style={{width: 375, display: "flex", flexDirection: "row", paddingLeft: 16,
    paddingRight: 16}}>
        <View style={{
    flex: 1, 
    height: 150, 
    backgroundColor: "#121212",
    borderRadius: 20, 
    marginRight: 8, 
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <Text style={{ color: "white", fontWeight: "bold", fontSize: 30, textAlign: "center" }}>{maxHeartRate} BPM Max</Text>
      </View>
        <View style={{
          flex: 1, // Take up half the available width
          height: 150, // Adjust the height as needed
          backgroundColor: "#121212",
          borderRadius: 20, // Rounded corners
          marginLeft: 8, // Space between the two squares
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 30, textAlign: "center" }}>{total_entries} Entries Total</Text>
        </View>
        </View>
      </View>
      <View style={{width: 375, justifyContent: 'center',
          alignItems: 'center', marginTop: 16, marginBottom: 16}}>
        {/* Displaying the calm image */}
        
        <Image source={calm} style={{ width: 350, height: 150 }} />

        {/* Displaying the focus image */}
        <Image source={focus} style={{ width: 350, height: 150 }} />
    </View>
    </ScrollView>
  );
}
