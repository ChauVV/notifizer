/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Alert} from 'react-native';

import firebase from 'react-native-firebase';
import PushNotification from 'react-native-push-notification'
import FlashMessage, { showMessage, hideMessage }  from "react-native-flash-message";

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  async componentDidMount() {

      this.checkPermission();
      const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
      if (notificationOpen) {
          const action = notificationOpen.action;
          const notification: Notification = notificationOpen.notification;
          var seen = [];
          if (notification && notification.data) {
            Alert.alert(
              'notification.data.title', JSON.stringify(notification.data.Message),
              [
                  { text: 'OK', onPress: () => console.log('OK Pressed') },
              ],
              { cancelable: false },
            );
          }
      } 
      firebase.notifications().onNotificationDisplayed((notification: Notification) => {

        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    });
    firebase.notifications().onNotification((notification: Notification) => {
        if (notification && notification.data) {
          if (Platform.OS === 'ios') {
            PushNotification.localNotification({
              title: 'notification.data.title',
              message: JSON.stringify(notification.data.Message),
              smallIcon: 'ic_launcher',
              playSound: true,
              soundName: 'default'
            })
          } else {
            showMessage({
              message: "notification.data.title",
              description: JSON.stringify(notification.data.Message),
              type: "info",
              duration: 4000
              onPress: () => {
                Alert.alert(
                  'you press on noti android', 'Message here',
                  [
                      { text: 'OK', onPress: () => console.log('OK Pressed') },
                  ],
                  { cancelable: false },
                );
              },
            });
          }
        }
    });
    firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification: Notification = notificationOpen.notification;
        var seen = [];
        if (notification && notification.data) {
          Alert.alert(
            'notification.data.title', JSON.stringify(notification.data.Message),
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
          );
        }
        firebase.notifications().removeDeliveredNotification(notification.notificationId);
        
    });
  }


async checkPermission() {
  const enabled = await firebase.messaging().hasPermission();
  if (enabled) {
      this.getToken();
  } else {
      this.requestPermission();
  }
}

  //3
async getToken() {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
          // user has a device token
          await AsyncStorage.setItem('fcmToken', fcmToken);
      }
  }
  Alert.alert(
    'fcmtoken', JSON.stringify(fcmToken),
    [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
    ],
    { cancelable: false },
  );
}

  //2
async requestPermission() {
  try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
  } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
  }
}

  render() {
    return (
      <View style={styles.container}>
       <FlashMessage position="top" />
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
