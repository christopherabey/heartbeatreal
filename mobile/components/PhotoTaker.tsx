import { Camera, CameraType, CameraPictureOptions } from "expo-camera/legacy";
import { useState, useRef } from "react";
import { Buffer } from "buffer"; // Import the Buffer polyfill
import "react-native-get-random-values";
import { Platform } from "react-native";
import RNFetchBlob from 'react-native-blob-util';

import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useRouter } from "expo-router";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export default function PhotoTaker() {
  const [type, setType] = useState(CameraType.front);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [backPhoto, setBackPhoto] = useState<string | null>(null);
  const [frontPhoto, setFrontPhoto] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const cameraRef = useRef<Camera | null>(null);
  const router = useRouter();

  const s3 = new S3Client({
    region: "us-west-2",
    credentials: {
      accessKeyId: "",
      secretAccessKey: "",
    },
  });

  const uploadImageToS3 = async (
    imageUriFront: string,
    imageUriBack: string
  ) => {
    try {
      const [responseFront, responseBack] = await Promise.all([
        RNFetchBlob.fetch('GET', imageUriFront),
        RNFetchBlob.fetch('GET', imageUriBack),
      ]);
  
      const [blobFront, blobBack] = await Promise.all([
        responseFront.blob(), // Convert response to blob for S3 upload
        responseBack.blob(),
      ]);
  
      const paramsFront = {
        Bucket: "heartbeatreal",
        Key: `pictures/front-${Date.now()}.jpg`,
        Body: blobFront,
        ContentType: "image/jpeg",
      };
  
      const paramsBack = {
        Bucket: "heartbeatreal",
        Key: `pictures/back-${Date.now()}.jpg`,
        Body: blobBack,
        ContentType: "image/jpeg",
      };
  
      await Promise.all([
        s3.send(new PutObjectCommand(paramsFront)),
        s3.send(new PutObjectCommand(paramsBack)),
      ]);
  
      console.log("Both images uploaded successfully!");
  
      const s3UrlFront = `https://${paramsFront.Bucket}.s3.us-west-2.amazonaws.com/${paramsFront.Key}`;
      const s3UrlBack = `https://${paramsBack.Bucket}.s3.us-west-2.amazonaws.com/${paramsBack.Key}`;
  
      const postResponse = await fetch(
        "https://heartbereal.onrender.com/record_heartbeat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              date: new Date().toISOString(),
              front_camera: s3UrlFront,
              back_camera: s3UrlBack,
            },
          }),
        }
      );
  
      if (!postResponse.ok) {
        throw new Error("Failed to send POST request");
      }
  
      postResponse.json().then((data) => {
        setCaption(data.caption);
      });
  
      console.log("URLs posted successfully!");
    } catch (error) {
      console.log("Error uploading images:", error);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  const takePhoto = async (type: CameraType) => {
    if (cameraRef.current) {
      const options: CameraPictureOptions = {
        isImageMirror: true,
      };
      const photoData = await cameraRef.current.takePictureAsync(options);
      if (type === CameraType.back) {
        setBackPhoto(photoData.uri);
        setType(CameraType.front);
        // Wait to capture front photo after capturing back photo
      } else {
        setFrontPhoto(photoData.uri);
        setType(CameraType.back)
        // Only upload once both photos are captured
      }
    }
  };

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        {!backPhoto || !frontPhoto ? (
          <View>
          <Camera style={styles.camera} type={type} ref={cameraRef}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: 375,
              }}
            >
              <View>
                <TouchableOpacity style={styles.alternate_view}>
                  {frontPhoto ? (
                    <View>
                      <Image
                        source={{ uri: frontPhoto }}
                        style={styles.alternate_view}
                      ></Image>
                    </View>
                  ) : (
                    <View />
                  )}
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 20, marginRight: 20 }}>
                <TouchableOpacity onPress={toggleCameraType}>
                  <TabBarIcon name={"camera-reverse"} color={"#fff"} />
                </TouchableOpacity>
              </View>
            </View>
          </Camera>
          <Text>{caption}</Text>
          {caption ? (
            <TouchableOpacity
              onPress={() => {
                // go back to home screen
              }}
              style={styles.button}
            >
              <Text style={styles.text}>View Recordings</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
          </View>
        ) : (
          <View
            style={{
              width: 375,
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Image
              source={{ uri: backPhoto! }}
              style={{
                borderRadius: 20,
                width: 375,
                height: 500,
              }}
            />

            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <View>
                <Image
                  source={{ uri: frontPhoto }}
                  style={styles.alternate_view}
                ></Image>
              </View>
            </View>

            <View
              style={{
                position: "absolute",
                bottom: 20,
                right: 20,
              }}
            >
              <TouchableOpacity onPress={toggleCameraType}>
                <TabBarIcon name={"checkmark-done"} color={"#fff"} onPress={async () => {
                  if (frontPhoto && backPhoto) {
                    console.log("halsdjflaksjdflakjsdflk")
                    await uploadImageToS3(frontPhoto, backPhoto);
                  }
                }}/>
              </TouchableOpacity>
            </View>

            <View
              style={{
                position: "absolute",
                bottom: 20,
                left: 20,
              }}
            >
              <TouchableOpacity onPress={toggleCameraType}>
                <TabBarIcon
                  name={"chevron-back"}
                  color={"#fff"}
                  onPress={() => {
                    setFrontPhoto(null);
                    setBackPhoto(null);
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      {!backPhoto || !frontPhoto ? (
        <TouchableOpacity
          onPress={() => {
            takePhoto(type);
          }}
          style={styles.buttonContainer}
        />
      ) : (
        <View />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  alternate_view: {
    width: 100,
    height: 150,
    backgroundColor: "black",
    borderWidth: 2,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    width: 375,
    height: 500,
    overflow: "hidden",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  buttonContainer: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 16,
    color: "white",
    marginTop: 16,
  },
  button: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  preview: {
    width: 300,
    height: 400,
    resizeMode: "contain",
  },
});
