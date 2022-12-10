import { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Utils from "../Utils";

const WIDTH = Dimensions.get('window').width;

export default function ANote(props)
{
    const note = props.note;
    const onOpenNote = props.onOpenNote;
    const tagList = props.tagList;

    return(
    <View style={{borderBottomWidth : 1}}>
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onOpenNote()}>
            <View style={styles.container_style}>
                <View style={{height: '100%', justifyContent : 'center', alignItems : 'flex-start', flex : 1}}>
                    <Image
                        style={{width : WIDTH / 2, height : 300, resizeMode : 'contain', position : 'absolute'}}
                        source={{uri : note.preview}}/>
                </View>
                <View style={{ justifyContent : 'space-around',flex : 1, height : '100%', marginLeft : 10}}>
                    <Text style={{fontSize : 18, color : 'black'}}>{note.title}</Text>
                    <Text style={{fontSize : 15, color : 'black'}}>{Utils.toReadableDate(note.date)}</Text>
                </View>
            </View>
        </TouchableOpacity>

        <ScrollView
            horizontal>
            <View style={{flexDirection : 'row'}}>
                {
                    tagList.map(item =>
                        {
                            return(<Text
                            style={styles.text_style}>
                                {item}
                            </Text>)
                        })
                }
            </View>
        </ScrollView>
    </View>
    )
}

const styles = StyleSheet.create({
    text_style: 
    {backgroundColor : 'lightgray', padding : 10, borderRadius : 16, fontSize : 13, margin : 10},
    container_style : 
    {width : '100%', flexDirection : 'row', justifyContent : 'space-around', alignItems : 'center', height : 255,
        marginVertical : 30}
})