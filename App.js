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

const htmlDir = Utils.filesDir + '/html';
const canvasDir = Utils.filesDir + '/canvas';

Utils.query(db, 'Select * from note where title = \'Note 2\';', [], (datatable) =>
        {
          const row = datatable.item(0);
          console.log('queried!!');
                RNFS.readFile(htmlDir + '/' + row.id, 'utf8').then(html => 
                  {
                    console.log("From App.js: " + html);
                  })
                  RNFS.readFile(canvasDir + '/' + row.id, 'base64').then(base64 => 
                    {
                      console.log("From App.js: " + base64);
                    })
        })