import TreeView from "../layout/TreeView";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import Utils from "../Utils";

export default function LocateDialog(props)
{
    const db = props.database;
    const onDecide = props.onDecide;
    const onClose = props.onClose;
    const onMoveToMainFolder = props.onMoveToMainFolder;
    const [list, setList] = useState([]);

    useEffect(() =>
    {
        Utils.query(db, 'Select * from folder Where parentID = ?', [0], (datatable) =>
        {
            const folderList = [];

            for(let i=0;i<datatable.length;i++)
                folderList.push(datatable.item(i));

            setList(folderList);
        })
    }, [])

    return(
        <View style={{justifyContent: 'center', flex : 1, marginBottom : 30, marginHorizontal : 30}}>
            <View style={{backgroundColor : 'white', borderRadius : 16, height : 300}}>
                <Text style={{fontWeight : 'bold', marginLeft : 30, marginBottom : 20}}>Đi tới</Text>
                <ScrollView>
                    <TreeView
                        list={list}
                        database={db}
                        onDecide={onDecide}/>
                </ScrollView>

                <View style={{flexDirection : 'row', justifyContent : 'space-around', marginBottom : 10}}>
                    <TouchableOpacity onPress={() => onMoveToMainFolder()}><Text>Về thư mục chính</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => onClose()}><Text style={{color : 'red'}}>Hủy</Text></TouchableOpacity>
                </View>
            </View>
        </View>
    )
}