import React, {useState, useEffect} from 'react';
import { Dimensions, Text, View, ScrollView } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import BerealLayout from './BerealLayout';
import axios from 'axios';


export default function ImageCarousel() {
    const [images, setImages] = useState<{ front: string; back: string }[]>([]);

    const [avgBPM, setAvgBPM] = useState(100);
    const [brainWaveSpikes, setbrainWaveSpikes] = useState(0);

    let config = {
        method: 'post',
        url: 'https://heartbereal.onrender.com/get_entries?date=2024-09-14',
        headers: { }
      };

      
      useEffect(() => {
        axios.request(config)
        .then((response) => {
            const allPhotos = response.data.map((item: any) => {
                return {
                    front: item.front_camera,
                    back: item.back_camera
                }
              });
              setImages(allPhotos);
        })
        .catch((error) => {
          console.log(error);
        });
      }, [])

    const width = Dimensions.get('window').width;
    return (
      <View style={{ flex: 1, margin: 16 }}>
        <Text style={{ color: "white", fontSize: 42, fontWeight: "bold", marginTop: 60, marginLeft: 16 }}>
          R U Stressed? 🤨
        </Text>
        <Text style={{ color: "white", fontSize: 16, marginTop: 8, marginLeft: 20, marginBottom: 16, marginRight: 20 }}>
          Today your average BPM is {avgBPM}, you had a total of {brainWaveSpikes} brain wave spikes.
        </Text>
        
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Carousel
            loop
            width={340}
            height={500}
            autoPlay={false}
            data={images}
            scrollAnimationDuration={1000}
            renderItem={({ index }) => {
              return (
                <BerealLayout front={images[index].front} back={images[index].back} width={340} height={500} />
              )
            }}
          />
        </View>
      </View>
    );
}