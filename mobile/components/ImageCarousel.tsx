import React, {useState, useEffect} from 'react';
import { Dimensions, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import BerealLayout from './BerealLayout';
import * as FileSystem from 'expo-file-system';


export default function ImageCarousel() {
    const [images, setImages] = useState([
        {front: require('../assets/images/beats/front/1_front.jpg'), back: require('../assets/images/beats/back/1_back.jpg')},
        {front: require('../assets/images/beats/front/2_front.jpg'), back: require('../assets/images/beats/back/2_back.jpg')},
        {front: require('../assets/images/beats/front/3_front.jpg'), back: require('../assets/images/beats/back/3_back.jpg')}
      ]);

    const [avgBPM, setAvgBPM] = useState(100);
    const [brainWaveSpikes, setbrainWaveSpikes] = useState(0);

    useEffect(() => {
        // Loop over each image and convert to base64
        images.forEach(async (image, index) => {
            // Convert the front image to base64
            const frontBase64 = await FileSystem.readAsStringAsync(FileSystem.bundleDirectory + 'assets/images/beats/front/' + index + '_front.jpg', {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Convert the back image to base64
            const backBase64 = await FileSystem.readAsStringAsync(FileSystem.bundleDirectory + 'assets/images/beats/back/' + index + '_back.jpg', {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Print base64 strings
            console.log(`Front Image ${index} Base64:`, frontBase64);
            console.log(`Back Image ${index} Base64:`, backBase64);
        });
    }, [images]);

    const width = Dimensions.get('window').width;
    return (
        <View style={{ flex: 1, margin: 16 }}>
            <Text style={{ color: "white", fontSize: 42, fontWeight: "bold", marginTop: 60, marginLeft: 16 }}>R U Stressed? 🤨</Text>
            <Text style={{ color: "white", fontSize: 16, marginTop: 8, marginLeft: 16, marginBottom: 16, marginRight: 16 }}>
                Today your average BPM is {avgBPM}, you had a total of {brainWaveSpikes} brain wave spikes.
            </Text>
            
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Carousel
                    loop
                    width={330}
                    height={500}
                    autoPlay={false}
                    data={images}
                    scrollAnimationDuration={1000}
                    renderItem={({ index }) => {
                        
                        return (
                            <BerealLayout front={images[index].front} back={images[index].back} width={330} height={500}/>
                        )
                    }}
                />
            </View>
        </View>
    );
}