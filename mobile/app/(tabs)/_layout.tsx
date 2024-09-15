import { Tabs } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const profile_style = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  profileImage: {
    width: 25,  // Adjust size as needed
    height: 25, // Adjust size as needed
    borderRadius: 50, // Half of the width/height to make it a perfect circle
  },
});

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Brainbeats',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'heart' : 'heart-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Lifeline',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'pulse' : 'pulse-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Sarina Li',
          tabBarIcon: () => (
            <View style={profile_style.container}>
              <Image
                source={ {uri: "https://variety.com/wp-content/uploads/2019/09/shaun-sheep-2.jpg"}}
                style={profile_style.profileImage}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
