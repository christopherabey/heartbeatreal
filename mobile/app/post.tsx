import { useState } from 'react';
import axios from 'axios';

import { useRouter } from 'expo-router';
import { View, Text, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import BerealLayout from '@/components/BerealLayout';

export default function Post() {
    const router = useRouter();
    const { front, back } = useLocalSearchParams();
    const [frontImageURI] = useState(front);
    const [backImageURI] = useState(back);
    const [uploadStatus, setUploadStatus] = useState('');

    const MASV_UPLOAD_URL = 'https://api.massive.io/v1/transfers'
    const API_KEY = "v)8Y!jm71XD/U2q9B60nGbFQokraP4_=<OcM{lWp3R]fN~Veu:ZAzLH5thySxgJC"
    const TEAM_ID = "01J7S2K47R1DFSGKMPQWSCQEA1"

    const uploadFile = () => {
        let data = { "description":"Image for Upload", "name":"Image1", "recipients":["chris.abey587@gmail.com"], "team_id": TEAM_ID};

        let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.massive.app/v1/teams/$TEAM_ID/packages',
        headers: { 
            'X-API-KEY': API_KEY, 
            'Content-Type': 'application/json'
        },
        data : data
        };

        axios.request(config)
        .then((response) => {
            console.log("hello")
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
    }

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center', 
            alignItems: 'center', 
          }}>
            <BerealLayout front={front.toString()} back={back.toString()} width={375} height={500}></BerealLayout>
            <Button title="Upload Front Image" onPress={() => uploadFile()} />
            {/* <Text style={{color:"white"}}>Image: {front}</Text>
            <Text style={{color:"white"}}>Image: {back}</Text> */}
        </View>
    )
}