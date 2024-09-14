import { Camera, CameraType, CameraPictureOptions } from 'expo-camera/legacy';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function PhotoTaker() {
    const [type, setType] = useState(CameraType.front);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [backPhoto, setBackPhoto] = useState<string | null>(null);
    const [frontPhoto, setFrontPhoto] = useState<string | null>(null);
    const cameraRef = useRef<Camera | null>(null);
  
    if (!permission) {
      return <View />;
    }
  
    if (!permission.granted) {
      return (
        <View style={styles.container}>
          <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
      );
    }
  
    function toggleCameraType() {
      setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    const takePhoto = async (type: CameraType) => {
        if (cameraRef.current) {
            const options: CameraPictureOptions = {
                isImageMirror: true
            }
            const photoData = await cameraRef.current.takePictureAsync(options);
            if (type === CameraType.back) {
                setBackPhoto(photoData.uri)
                setType(CameraType.front)
            } else {
                setFrontPhoto(photoData.uri)
                setType(CameraType.back)
            }
        }
    };
  
    return (
        <View style={styles.body}>
            <View style={styles.container}>
                {!backPhoto || !frontPhoto ? (
                        <Camera style={styles.camera} type={type} ref={cameraRef}>
                            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: 375}}>
                                <View>
                                    <TouchableOpacity style={styles.alternate_view}>
                                        {frontPhoto ? <View><Image source={{uri:frontPhoto}} style={styles.alternate_view}></Image></View> : <View/>}
                                    </TouchableOpacity>
                                </View>
                                <View style={{marginTop: 20, marginRight: 20}}>
                                    <TouchableOpacity onPress={toggleCameraType}>
                                        <TabBarIcon name={'camera-reverse'} color={"#fff"} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Camera>
                ) : (
                    <View style={{
                        width: 375,
                        justifyContent: 'center',
                        position: 'relative', // Allows absolute positioning of child elements
                      }}>
                        <Image source={{ uri: backPhoto! }} style={{
                          borderRadius: 20,
                          width: 375,
                          height: 500,
                        }} />
                      
                        <View style={{
                          position: 'absolute',
                          top: 0, 
                          left: 0, 
                        }}>
                          <View><Image source={{uri:frontPhoto}} style={styles.alternate_view}></Image></View>
                        </View>
                      
                        <View style={{
                          position: 'absolute',
                          bottom: 20, 
                          right: 20, 
                        }}>
                            <TouchableOpacity onPress={toggleCameraType}>
                                <TabBarIcon name={'checkmark-done'} color={"#fff"} />
                            </TouchableOpacity>
                        </View>

                        <View style={{
                          position: 'absolute',
                          bottom: 20, 
                          left: 20, 
                        }}>
                            <TouchableOpacity onPress={toggleCameraType}>
                                <TabBarIcon name={'chevron-back'} color={"#fff"} onPress={() => {
                                    setFrontPhoto(null);
                                    setBackPhoto(null);
                                }}/>
                            </TouchableOpacity>
                        </View>
                      </View>
                )}
                </View>
                {!backPhoto || !frontPhoto ? (
                    <TouchableOpacity onPress={() => {
                        takePhoto(type)
                    }} style={styles.buttonContainer}/>
                ) : <View/>}
        </View>
      );
  }

  const styles = StyleSheet.create({
    body: {
      flex: 1,
      justifyContent: 'center', 
      alignItems: 'center', 
    },
    alternate_view: {
        width: 100, 
        height: 150, 
        backgroundColor: 'black', 
        borderWidth: 2, 
        borderColor: 'white', 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 20
    },
    container: {
      justifyContent: 'center',
      alignItems: 'center', // Center content inside container
      borderRadius: 20, // Rounded corners
      width: 375,
      height: 500,
      overflow: 'hidden', // Ensures camera respects rounded corners
    },
    message: {
      textAlign: 'center',
      paddingBottom: 10,
    },
    camera: {
      flex: 1,
      width: '100%',
    },
    buttonContainer: {
        width: 60, 
        height: 60, 
        borderRadius: 50, 
        borderWidth: 4, 
        borderColor: 'white', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'transparent', 
        padding: 16,
        color:"white",
        marginTop: 16
    },
    button: {
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 5,
      margin: 10,
    },
    text: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'black',
    },
    preview: {
      width: 300,
      height: 400,
      resizeMode: 'contain',
    },
  });
