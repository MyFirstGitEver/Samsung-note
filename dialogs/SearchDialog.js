import { useState } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native"
import { ScrollView, TextInput } from "react-native-gesture-handler";
import Utils from "../Utils";
import ANote from "../layout/ANote";

export default function SearchDialog(props)
{
    const [searchList, setSearchList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const onOpenNote = props.onOpenNote;
    const onClose = props.onClose;
    const db = props.database;

    const checkDuplicates = (list, key) =>
    {
        for(let i=0;i<list.length;i++)
            if(list[i].id == key)
                return true;

        return false;
    }

    const onTyping = (text) =>
    {
        Utils.query(db, 'Select * from note n INNER JOIN folder f ON n.folderID = f.fID AND n.title LIKE ?;', ['%' + text + '%'], (datatable) =>
        {
            const list = [];

            for(let i=0;i<datatable.length;i++)
            {
                datatable.item(i).tagList = [];
                datatable.item(i).date = new Date(datatable.item(i).date);
                list.push(datatable.item(i));
            }

            console.log(list)

            Utils.query(db, 'Select * from(Select * from tag t INNER JOIN note n ON t.noteID = n.id AND t.name LIKE ?) m INNER JOIN ' +
            'folder f ON m.folderID = f.fID', ['%' + text + '%'], (datatable) =>
            {
                const m = new Map();
                const note_info = new Map();

                for(let i=0;i<datatable.length;i++)
                {
                    const row = datatable.item(i);

                    if(checkDuplicates(list, row.noteID))
                        continue;

                    if(m.get(row.noteID) == null)
                    {
                        note_info.set(row.noteID, {id : row.id, folderID : row.folderID, title : row.title, 
                            preview : row.preview, date : row.date, fName : row.fName})
                        m.set(row.noteID, [row.name]);
                    }
                    else
                        m.get(row.noteID).push(row.name);
                }

                const iterator = m.entries();

                console.log(m);

                while(true)
                {
                    const pair = iterator.next().value;

                    if(pair == null)
                        break;

                    const note = note_info.get(pair[0]); // set information
                    note.tagList = pair[1]; // set tagList
                    note.date = new Date(note.date);
                    list.push(note);
                }
                
                setSearchList(list);
            })
        })
    }

    return(
        <View style={{flex : 1}}>
            <View style={{borderRadius : 16, borderWidth : 1, alignItems : 'center', flexDirection : 'row'}}>
                <TouchableOpacity
                    onPress={() => onClose()}>
                    <Image
                        style={{width : 25 , height : 25}}
                        source={require('../drawable/back_2.png')}/>
                </TouchableOpacity>
                <TextInput
                    onChangeText={(text) => 
                    {
                        onTyping(text);
                        setSearchTerm(text);
                    }}
                    style={{flex : 1, color : 'black'}}/>
            </View>
            {
                searchTerm == '' &&
                (<View style={{alignItems : 'center', justifyContent : 'center', flex : 1}}>
                    <Text style={{color : 'black'}}>Nh???p t??? tr??n thanh c??ng c??? ????? t??m ki???m</Text>
                    <Image
                        style={{width : 60, height : 60, marginTop : 10}}
                        source={require('../drawable/search.png')}/>
                </View>)
            }

            {
                searchList.length == 0 && searchTerm != '' &&
                (<View style={{alignItems : 'center', justifyContent : 'center', flex : 1}}>
                    <Text style={{color : 'black'}}>{'Kh??ng t??m th???y ghi ch?? c?? li??n quan :('}</Text>
                    <Image
                        style={{width : 60, height : 60, marginTop : 10}}
                        source={require('../drawable/sad.png')}/>
                </View>)
            }

            {
                (searchList.length != 0) && searchTerm != '' &&
                (<ScrollView>
                    {
                        searchList.map((item, i) =>
                            {
                                return(
                                <View>
                                    <Text style={{color : 'black', marginLeft : 10}}>{'T??? th?? m???c \''  + item.fName + '\''}</Text>
                                    <ANote
                                    tagList={item.tagList}
                                    onOpenNote={() => 
                                    {
                                        onClose();
                                        onOpenNote(item, i);
                                    }}
                                    note={item}/>
                                </View>)
                            })
                    }
                </ScrollView>)
            }

        </View>
    )
}