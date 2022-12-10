import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState } from 'react';
import MainActivity from './activities/MainActivity';
import NoteEditor from './activities/NoteEditor';
import * as RNFS from 'react-native-fs'
import Utils from './Utils';
import SQLite from 'react-native-sqlite-storage';

const Stack = createStackNavigator();
RNFS.mkdir(Utils.filesDir + '/html');
RNFS.mkdir(Utils.filesDir + '/canvas');
//SQLite.deleteDatabase({name : 'DB.sqlite'})
const db = SQLite.openDatabase({name : 'DB.sqlite', createFromLocation : 1}, () => console.log('Ok'), error => console.log(error.message));

export default function App()
{
  return(
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown : false}} initialRouteName='Main'>
        <Stack.Screen name='Main' component={MainActivity} initialParams={{database : db, folder : 
          {title : 'Thư mục chính', id : 0}}}/>
        <Stack.Screen name='Note' component={NoteEditor}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}