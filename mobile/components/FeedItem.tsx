import BerealLayout from "./BerealLayout"
import { View, Text, Image } from "react-native"
import axios from 'axios';
import { useEffect } from "react";

type FeedItemData = {
    caption: string,
    bpm: number
    brain_freq: number,
    user: User,
    date: string
}

type User = {
    profile_pic: string,
    name: string
}

export default function FeedItem({front, back, width, height, data}: {front: number|string, back: number|string, width: number, height: number, data: FeedItemData}) {
    return (
        <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 20}}>
            <View style={{
                width: 375,
                justifyContent: "space-between",
                flexDirection: "row",
                paddingLeft: 20,
                marginBottom: 16,
                paddingRight: 20,
                
            }}>
                <View style={{
                    
                    flexDirection: 'row', 
                    justifyContent: "flex-start",  // Ensure content aligns to the left
                    alignItems: "center",          // Vertically center the image and text
                    overflow: 'hidden',
                }}>
                    <Image
                        source={{ uri: data.user.profile_pic }}
                        style={{
                            width: 40, 
                            height: 40, 
                            borderRadius: 20, 
                            borderWidth: 2, 
                            borderColor: '#fff',
                        }}
                    />
                    <Text style={{
                        marginLeft: 10, 
                        fontSize: 16,
                        color: 'white',
                    }}>
                        {data.user.name}
                    </Text>
                </View>
                <View style={{justifyContent: "center"}}>
                    <Text style={{color: "white"}}>{data.bpm} BPM</Text>
                    <Text style={{color: "white"}}>{data.brain_freq} Hz</Text>
                </View>
                
            </View>
            <BerealLayout front={front} back={back} height={height} width={width} />
            <View style={{justifyContent: "flex-start", alignItems: "flex-start", width: 375, paddingLeft: 20, paddingTop: 20}}>
                <Text style={{color: "#7a7a7a"}}>{data.date}</Text>
                <Text style={{color: "white"}}>{data.caption}</Text>
            </View>
        </View>
    )
}