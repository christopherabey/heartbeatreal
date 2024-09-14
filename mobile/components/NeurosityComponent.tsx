import { Neurosity } from "@neurosity/sdk";
import { View, Text, StyleSheet } from 'react-native';
import React, { useState, useEffect } from "react";


const neurosity = new Neurosity({
  deviceId: "76dcd666ce9ddeaed072838d28b9c5ac"
});

neurosity.login({
    email: "sarinajin.li@gmail.com",
    password: "123456"
}).then(() => {
    console.log("Logged in successfully");
}).catch((error) => {
    console.error("Login failed", error);
});


export function NeurosityComponent() {
  const [calm, setCalm] = useState(0);

  useEffect(() => {
    if (!neurosity) {
      return;
    }

    const subscription = neurosity.calm().subscribe((calm) => {
      setCalm(Number(calm.probability.toFixed(2)));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [neurosity]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.calmScore}>
        <Text style={styles.calmText}>
          {calm * 100}% <Text style={styles.calmWord}>Calm</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    calmScore: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 10,
      color: "white"
    },
    calmText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: "white"
    },
    calmWord: {
      fontSize: 18,
      color: 'white',
    },
  });