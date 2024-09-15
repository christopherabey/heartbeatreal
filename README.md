# HeartBeatReal

Hack the North 2024

## Inspiration

Have you ever thought that BeReal's are too fake? An app built to challenge the unrealistic beauty standards set by typical social media turned into one of the giants it aimed to destroy. With HeartBeatReal we capture the real "you". Our state of the art social media platform prompts you to take a picture only when your heart rate and brain waves are elevated - because you're only real when your body tells you that you are.

We also auto-generate your captions to show what your mind and heart really think without an opportunity for filtering.

## What it does

Our application monitors your heart rate and brain waves measured by EEG to capture exciting moments in your life to share a more real you. When your heart rate is high and brainwave activity signals more vivid emotions the app will prompt you to take a picture through your front and back camera to share this interesting moment in your life. We have an LLM perform sentiment analysis on your pictures to generate a nonsensical caption in a New Yorker-esque style. These moments are aggregated and analyzed to generate daily insights for the users. 

## How we built it

![Uploading Screenshot 2024-09-15 at 4.59.25 AM.png…]()

Our application interacts with three physical devices, an Apple watch for heart rate monitoring, the Neurosity crown for brainwave monitoring, and the user facing application on the user’s mobile device. At a certain threshold the Apple watch will send a request to the backend to start the brainbeat recording process, this notification is relayed to the user’s phone which checks and collects the user’s current brainwaves to confirm an interesting event has occurred which triggers the start of taking a brainbeat.

To record a “brainbeat”, the heart rate, brain wave and front/back camera image data is passed into our backend server. The backend server will (1) generate an interesting caption for the images and (2) store and process the data into the database.

(1) The caption generation is powered by the LLaVA (Large Language and Vision Assistant) V1.5 7B and LLaMA 3.1 8B models through the **Groq**. The LLaVA model analyzes the images to provide a description for the front and back camera photos. The descriptions are then fed into the LLaMA model which is prompted to generate a funny nonsensical caption for the brainbeat. 

(2) The brainbeat data (caption, photo urls, heart rate etc.) is stored into a **Databricks** managed table to take advantage of Databricks’ extensive infrastructure. This table is queried in a scheduled job to aggregate the day’s brainbeat data which is stored in a separate table for analytics and insights. The job is run everyday at 12am for the previous day’s data. This process allows for more optimized retrievals of the aggregated insights on user request. There is also an opportunity for future extension in collecting streaming data of the user’s brain waves / heart rate information for more intensive processing using Databricks’ pipelines.

**Technologies used:**
React Native mobile application
FastAPI with Python backend
Databricks tables / jobs
Groq
Swift for mobile app
Render for hosting

## Challenges we ran into

We worked with a lot of new technologies and three different devices to create our vision of this app. Some challenges included:
**Hardware Integration**: We did a lot of planning based on the possibilities of hardware availability and how we could allow the devices to communicate with each other. In the end a lot of the hardware we originally wanted was unavailable, so we had to choose a backup plan with more difficult implementation.
**Working with new technology**: We had the opportunity to try out a lot of new technology that we haven’t had experience using before. For example, no one on the team has used Swift, Groq or Databricks before, but they ended up being essential parts to our project's success.

## Accomplishments that we're proud of

We’re proud to have completed an end to end project with a couple of different applications and integrations. There were many hiccups along the way where we could have thrown in the towel but we chose to stay up and work hard to complete our project.

## What we learned

Throughout the course of 32 hours, tireless effort was put into making a product that met our expectations. We learned that perseverance can get you a long way and how much of an itch a good project can scratch. Technically, we were able to learn more about integrations, databases, data analytics, mobile applications, watch applications and EEG analysis.
