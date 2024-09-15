type User = {
    profile_pic: string,
    name: string
  }

type Data = {
    caption: string;
    bpm: number;
    brain_freq: number;
    user: User
}

export class FeedData {
    date: string;
    data: Data
    brain_freq: number;
    front: string;
    back: string;

    constructor(
        back: string = "https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_14_2x.png",
        caption: string = "surfing on them brain waves but that hard beats heart",
        date: string = "2024-09-14",
        front: string = "https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_14_2x.png",
        bpm: number = 100,
        brain_freq: number = 99,
        user: User
    ) {
        this.date = date;
        this.brain_freq = brain_freq;
        this.data = {
            caption: caption,
            bpm: bpm,
            brain_freq: brain_freq,
            user: user
        }
        this.front = front;
        this.back = back;
    }
  }