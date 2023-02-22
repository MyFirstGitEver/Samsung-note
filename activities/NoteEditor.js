import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Dimensions, Image, PanResponder, Text, Modal, ScrollView, StyleSheet } from "react-native";
import Canvas from "react-native-canvas";
import ColorPicker from "../layout/ColorPicker";
import EraseChooser from "../layout/EraseChooser";
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor'
import DrawOptions from "../layout/DrawOptions";
import NoteHeader from "../layout/NoteHeader";
import ViewShot from "react-native-view-shot";
import Utils from "../Utils";
import * as RNFS from 'react-native-fs';
import { Image as CanvasImage } from "react-native-canvas";
import { FlatList, TextInput } from "react-native-gesture-handler";

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const htmlDir = Utils.filesDir + '/html';
const canvasDir = Utils.filesDir + '/canvas';

let newTags = [];

let lastCord = {x : null, y : null};

export default function NoteEditor(props)
{
  const note = props.route.params.note;
  const db = props.route.params.database;

  const [currentColor, setCurrentColor] = useState('white');
  const [currentPicker, setCurrentPicker] = useState('null')
  const [currentErase, setCurrentErase] = useState('rect');
  const [currentTool, setCurrentTool] = useState('erase');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [html, setHtml] = useState('');
  const [title, setTittle] = useState(note.title);
  const [full, setFull] = useState(false);
  const [tag, setTag] = useState('');
  const [tagList, setTagList] = useState([]);
  const [tagModal, setTagModal] = useState(false);

  const painterRef = useRef(null);
  const textInputRef = useRef(null);

  const pansHolder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderMove: (evt, gestureState) => onTouchListener(evt),
    onPanResponderRelease: (evt, gestureState) => {
      if(currentTool == 'erase')
      {
        const painter = painterRef.current.getContext('2d');
        painter.clearRect(lastCord.x - 20, lastCord.y - 20, 40, 40);
      }
      lastCord = {x : null, y : null};
    },
  });

  useEffect(() =>
  {
    if(painterRef.current)
    {
      painterRef.current.width = WIDTH;
      painterRef.current.height = HEIGHT;

      const img = new CanvasImage(painterRef.current);

      RNFS.readFile(canvasDir + '/' + note.id, 'base64')
      .then(base64 =>
        {
          img.addEventListener('load', () => 
          {
            const painter = painterRef.current.getContext('2d');
            painter.drawImage(img, 0, 0, img.width, img.height, 0, 0, WIDTH, HEIGHT);
          });

          img.src = 'data:image/jpeg;base64,' + base64;
        }).catch(error => console.log(error))
    }

    textInputRef.current.registerToolbar((active) =>
    {
      setIsBold(active.includes(actions.setBold));
      setIsItalic(active.includes(actions.setItalic));
    })
  }, [painterRef])

  useEffect(() =>
  {
    newTags = [];

    RNFS.readFile(htmlDir + '/' + note.id, 'utf8').then(html => 
      {
        setHtml(html)
      })
    Utils.query(db, 'Select name from tag Where noteID = ?', [note.id], (datatable) =>
    {
      const initial = [];
      for(let i=0;i<datatable.length;i++)
        initial.push(datatable.item(i).name);

      setTagList(initial);
    })

    Dimensions.addEventListener('change', () =>
    {
      console.log('resized!!');
      RNFS.readFile(canvasDir + '/' + note.id, 'base64')
      .then(base64 =>
        {
          img.addEventListener('load', () => 
          {
            const img = new CanvasImage(painterRef.current);
            const dim = Dimensions.get('window');
            const painter = painterRef.current.getContext('2d');
            painter.drawImage(img, 0, 0, img.width, img.height, 0, 0, dim.width, dim.height);
          });

          img.src = 'data:image/jpeg;base64,' + base64;

          console.log(base64)
        }).catch(error => console.log(error))
    })
  }, [])

  const onTouchListener = (event) =>
  {
    if(currentTool == 'write')
      return;
      
    const painter = painterRef.current.getContext('2d');

    const cord = {x : event.nativeEvent.pageX, y : event.nativeEvent.pageY }

    if(currentTool == 'pencil')
     draw(painter, cord);
    else
      erase(painter, cord);
  }

  const erase = (painter, cord) =>
  {
    if(lastCord != null)
    {
      painter.clearRect(lastCord.x - 20, lastCord.y - 20, 40, 40);
    }

    painter.strokeStyle = 'white'; 

    painter.beginPath();
    if(currentErase != 'rect')
    {
      painter.arc(cord.x, cord.y, 15, 0, Math.PI * 2);
      painter.stroke();
    }
    else
    {
      painter.rect(cord.x, cord.y, 15, 15)
      painter.stroke();
    }
    painter.closePath();

    lastCord = cord;
  }

  const draw = (painter, cord) =>
  {
    painter.fillStyle = currentColor;
    painter.strokeStyle = currentColor;

    if(lastCord.x == null)
    {
      lastCord = cord;
      return;
    }

    painter.beginPath();
    painter.moveTo(lastCord.x, lastCord.y);
    painter.lineTo(cord.x , cord.y);
    painter.stroke();
    painter.closePath();

    lastCord = cord;
  }

  const taker = useRef(null);
  const tagRef = useRef(null);
  const onActivityResult = props.route.params.onActivityResult;
  
  return(
    <View
      style={{flex : 1 , backgroundColor : 'black'}}>
        <Modal
          transparent
          visible={tagModal}>
            <View style={{flex : 1, justifyContent : 'center'}}>
              <View style={{backgroundColor : 'lightgray', padding : 30, alignItems : 'center'}}>
                <View style={{flexDirection : 'row', justifyContent : 'space-between', width : '100%'}}>
                  <Text style={{fontWeight : 'bold', marginLeft : 30, marginBottom : 20}}>Tất cả tag</Text>
                  <TouchableOpacity
                    onPress={() => setTagModal(false)}>
                    <Text>Lưu</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  style={{height : 150, marginBottom : 10, width : '100%'}}
                  data={tagList}
                  renderItem={({item}) =>
                  {
                    return(
                      <View style={{alignItems : 'flex-start'}}>
                        <Text style={styles.text_style}>{'#' + item}</Text>
                      </View>
                    )
                  }}
                  keyExtractor={(item, index) => index.toString()}>
                </FlatList>

                <View 
                    style={{padding : 5, borderRadius : 16, borderWidth : 1, flexDirection : 'row', alignItems : 'center'}}>
                  <TextInput
                    ref={tagRef}
                    style={{flex : 1}}
                    onChangeText={(text) => setTag(text)}/>
                  <TouchableOpacity
                    onPress={() =>
                    {
                      if(tagList.includes(tag))
                        return;

                      tagList.push(tag);
                      newTags.push(tag);
                      setTagList([...tagList]);

                      tagRef.current.clear();
                    }}
                    style={{ backgroundColor : 'white', padding : 10, borderRadius : 16}}>
                    <Image
                      style={{width : 15, height : 15}}
                      source={require('../drawable/add.png')}/>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
        </Modal>

        <NoteHeader
            title={note.title}
            onCreateTag={() => setTagModal(true)}
            onRemove={() =>
            {
              onActivityResult(null, null);
              props.navigation.goBack();
            }}
            onTitleChange={(text) => setTittle(text)}
            onSave={() => 
            {
                textInputRef.current.blurContentEditor();

                setTimeout(() =>
                {
                    taker.current.capture()
                    .then(uri =>
                      {
                        painterRef.current.toDataURL("image/jpeg").then((base64) =>
                        {
                          const _base64 = base64.split(';base64,')[1];
                          const emptyTitle = 'Ghi chú ' + note.id;

                          RNFS.writeFile(canvasDir + '/' + note.id, _base64, 'base64');
                          RNFS.writeFile(htmlDir + '/' + note.id, html, 'utf8');
                          onActivityResult(
                            {id : note.id, title : title == '' ? emptyTitle : title, preview : uri, date : new Date(), tagList : tagList},
                             note.preview, newTags);
                          props.navigation.goBack();
                        })
                      }).catch(error => console.log(error))
                }, 200)
            }}/>
        <ViewShot
          style={{flex : 1}}
          ref={taker}
          options={{ fileName: "test", format: "jpg", quality: 0.9 }}>
          <View
            {...pansHolder.panHandlers}
            style={{flex : 1, backgroundColor : 'white'}}>
                <Canvas
                  ref={painterRef}
                  style={{position : 'absolute', backgroundColor : 'black', width : '100%', height : '100%'}}/>

                <RichEditor
                  style={{flex : 1}}
                  onHeightChange={(height) =>
                  {
                    if(height == HEIGHT)
                    {
                        setFull(true)
                    }
                  }}
                  onChange={(text) => 
                  {
                    if(!full)
                      setHtml(text);
                  }}
                  ref={textInputRef}
                  editorStyle={{color : 'white', backgroundColor : 'transparent'}}
                  initialContentHTML={html}/>
          </View>
        </ViewShot>

        <View style={{flexDirection : 'row', backgroundColor : '#B5B5B5', justifyContent : 'space-between'}}>
          {currentPicker == 'color' && <ColorPicker
            onPickColor={(color) => setCurrentColor(color)}/>}

          {currentPicker == 'erase' && <EraseChooser
            onPickErase={(type) => setCurrentErase(type)}/>}
          
          {currentTool != 'write' && <DrawOptions
            currentColor={currentColor}
            currentErase={currentErase}
            setCurrentPicker={(picker) => 
            {
              if(currentPicker == picker)
                setCurrentPicker('null');
              else
                setCurrentPicker(picker);
            }}
            currentPicker={currentPicker}/>}

          {currentTool == 'write' && <RichToolbar
            style={{backgroundColor : 'transparent'}}
            editor={textInputRef}
            actions={[actions.setBold, actions.setItalic, actions.insertBulletsList, actions.insertOrderedList]}
            iconMap={{
              [actions.setBold] : ({tintColor}) => (
                <View style={{padding : 5, backgroundColor : isBold ? 'white' : '#B5B5B5', borderRadius : 10}}>
                  <Image style={{width : 25, height : 25, borderRadius : 16, }} 
                    source={require('../drawable/B.png')}/>
                </View>),
              [actions.setItalic] : ({tintColor}) => (
                <View style={{padding : 5, backgroundColor : isItalic ? 'white' : '#B5B5B5', borderRadius : 10}}>
                  <Image  style={{width : 20, height : 20}} 
                    source={require('../drawable/I.png')}/>
                </View>)
            }}/>}

          <View style={{alignItems : 'center', marginRight : 10, flexDirection : 'row'}}>
            <TouchableOpacity 
            onPress={() => 
            {
              setCurrentTool('write');
            }}
            style={{padding : 10, 
              backgroundColor : currentTool == 'write' ? 'white' : 'transparent', borderRadius : 30, marginRight : 25}}>
              <Image
                style={{width : 25, height : 25, padding : 10}}
                source={require('../drawable/write.png')}/>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={() =>
            {
              setCurrentTool('pencil');
              textInputRef.current.blurContentEditor();
            }}
            style={{padding : 10,
              backgroundColor : currentTool == 'pencil' ? 'white' : 'transparent', borderRadius : 30, marginRight : 25}}>
              <Image
                style={{width : 25, height : 25}}
                source={require('../drawable/pencil.png')}/>
            </TouchableOpacity>

            <TouchableOpacity 
            onPress={() => 
            {
              setCurrentTool('erase');
              textInputRef.current.blurContentEditor();
            }}
            style={{padding : 10, 
              backgroundColor : currentTool == 'erase' ? 'white' : 'transparent', borderRadius : 30}}>
              <Image
                style={{width : 25, height : 25, padding : 10}}
                source={require('../drawable/erase.png')}/>
            </TouchableOpacity>
          </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  text_style:
  {backgroundColor : 'white', padding : 10, borderRadius : 16, fontSize : 13, margin : 10, color : 'black'}
})