import BerealLayout from "./BerealLayout"
import { View } from "react-native"

type FeedItemData = {
    caption: string,
    bpm: number
    brain_freq: number,
    user: User
}

type User = {
    profile_pic: string,
    name: string
}

export default function FeedItem({front, back, width, height, data}: {front: number|string, back: number|string, width: number, height: number, data: FeedItemData}) {
    
    return (
        <View style={{ justifyContent: "center", alignItems: "center", flex: 1}}>
            <BerealLayout front={front} back={back} height={height} width={width} />
        </View>
    )
}