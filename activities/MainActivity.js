import { useEffect, useRef, useState } from "react";
import { View, Text, Image, Dimensions, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from "react-native"
import ANote from "../layout/ANote";
import Utils from "../Utils";
import * as RNFS from 'react-native-fs';
import FolderDialog from "../dialogs/FolderDialog";
import LocateDialog from "../dialogs/LocateDialog";
import { StackActions } from "@react-navigation/native";
import SortDialog from "../dialogs/SortDialog";
import SearchDialog from "../dialogs/SearchDialog";

let lastArrayID, lastNote;

export default function MainActivity(props)
{
    const [list, setList] = useState([]);
    const [noteCounter, setNoteCounter] = useState(0);
    const [folderCounter, setFolderCounter] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [option, setOption] = useState('null');
 
    const db = props.route.params.database;
    const folder = props.route.params.folder;
    const currentFolder = folder.id;

    useEffect(() =>
    {
        Utils.query(db, 'Select * from folder Where parentID = ?', [currentFolder], (datatable) =>
        {
            setFolderCounter(datatable.length);
        })

        Utils.query(db, 'Select * from note where folderID = ?', [currentFolder], (datatable) =>
        {
            const noteList = []

            for(let i=0;i<datatable.length;i++)
            {
                datatable.item(i).date = new Date(datatable.item(i).date); // parse the date
                datatable.item(i).tagList = [];
                noteList.push(datatable.item(i));
            }
            
            setNoteCounter(datatable.length);

            for(let i=0;i<datatable.length;i++)
                onFetchTags(noteList, i, datatable.item(i).id);
        })
    }, [])

    const onFetchTags = (noteList, i, id) =>
    {
        Utils.query(db,'Select name from tag Where noteID = ?', [id], (datatable) =>
        {
            const tagList = [];

            for(let i=0;i<datatable.length;i++)
                tagList.push(datatable.item(i).name);

            noteList[i].tagList = tagList;
            setList([...noteList]); // rerender list!
        })
    }

    const onOpenNote = (item, i) =>
    {
        props.navigation.navigate('Note', {onActivityResult : onActivityResult, note : item, database : db});
        lastNote = item;
        lastArrayID = i; 
    }

    const onActivityResult = (result, oldPreview, tags) => 
    {
        setSearchOpen(searchOpen);

        if(result == null)
        {
            if(lastArrayID == -1)
                return;

            //remove last-id item from list
            Utils.query(db, 'Delete from note Where id = ?', [lastNote.id], (datatable) => {});
            list.splice(lastArrayID, 1);
            setList([...list]);
            setNoteCounter(noteCounter - 1)

            return;
        }

        if(oldPreview != null)
        {
            RNFS.unlink(oldPreview).then((() => console.log('deleted!!')))
        }

        if(lastArrayID != -1)
        {   
            Utils.query(db, 'INSERT OR REPLACE INTO note VALUES(?, ?, ? , ?, ?)',
            [lastNote.id, currentFolder, result.title, result.preview, result.date], (datatable) => {});

            list[lastArrayID] = result;

            setList([...list]);

            for(let i=0;i<tags.length;i++)
                Utils.query(db, 'INSERT INTO tag(name, noteID) VALUES(?, ?)', [tags[i], lastNote.id], (datatable) => {});
        }
        else
        {   
            Utils.query(db, 'INSERT INTO note(folderID, title, preview, date) VALUES(?, ? , ?, ?);',
            [currentFolder, result.title, result.preview, result.date], (datatable) => 
            {
                Utils.query(db, 'Select seq from sqlite_sequence where name=?',['note'], (datatable) =>
                {
                    const noteID = datatable.item(0)['seq'];

                    if(tags.length == 0)
                    {
                        setList([...list, result]);
                        return;
                    }

                    for(let i=0;i<tags.length;i++)
                        Utils.query(db, 'INSERT INTO tag(name, noteID) VALUES(?, ?)', [tags[i], noteID], datatable =>
                        {
                            setList([...list, result]);
                        })
                })
            });
        }
    }

    return(
        <View style={{flex : 1}}>
            <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between', padding : 10}}>
                <TouchableOpacity
                onPress={() => setSearchOpen(true)}
                style={{padding : 10, backgroundColor : 'lightgray', borderRadius : 30, marginRight : 25}}>
                  <Image
                    style={{width : 20, height : 20}}
                    source={require('../drawable/search.png')}/>
                </TouchableOpacity>

                <View>
                    <Text
                        style={{fontWeight : 'bold', fontSize : 18}}>{folder.title}</Text>
                    <Text>{'Có ' + noteCounter + ' ghi chú, ' + folderCounter + ' thư mục'}</Text>
                </View>

                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.8}
                    style={{width : 30, height : 30 }}>
                    <Image
                        style={{width : 30, height : 30}}
                        source={require('../drawable/black_3_dots.png')}/>
                </TouchableOpacity>

                <Modal
                    transparent
                    visible={option == 'folder'}>
                    <FolderDialog
                        onClose={() => setOption('null')}
                        onCreate={(folderName) =>
                        {
                            setOption('null');
                            Utils.query(db, 'Select * from folder Where name = ? AND parentID = ?', 
                            [folderName, currentFolder], (datatable) =>
                            {
                                if(datatable.length != 0)
                                    Alert.alert('This folder name already exists');
                                else
                                    Utils.query(db, 'INSERT INTO folder(parentID, name) VALUES(?, ?)',
                                    [currentFolder, folderName], (datatable) => {})
                            })
                        }}/>
                </Modal>

                <Modal
                    transparent
                    visible={option == 'locate'}>
                    <LocateDialog
                        onClose={() => setOption('null')}
                        onMoveToMainFolder={() =>
                        {
                            props.navigation.dispatch(
                                {
                                    ...StackActions.replace('Main', {database : db, folder : {title : 'Thư mục chính', id : 0}})
                                })
                        }}
                        onDecide=
                        {(folder) =>
                            {
                                props.navigation.dispatch(
                                    {
                                        ...StackActions.replace('Main', {database : db, folder : folder})
                                    })
                            }
                        }
                        database={db}/>
                </Modal>

                <Modal
                    visible={searchOpen}>
                    <SearchDialog
                        onClose={() => setSearchOpen(false)}
                        onOpenNote={onOpenNote}
                        database={db}/>
                </Modal>

                <Modal
                    transparent
                    visible={option == 'sort'}>
                    <SortDialog
                        onSort={(sortRequest) =>
                        {
                            setOption('null');

                            const sorted = [...list.sort((n1, n2) =>
                                { 
                                    if(sortRequest.criteria == 'date')
                                    {
                                        if(sortRequest.isIncreasing)
                                            return Utils.compareDate(n1.date, n2.date)
                                        else
                                            return -Utils.compareDate(n1.date, n2.date);
                                    }
                                    else
                                    {
                                        if(sortRequest.isIncreasing)
                                            return n1.title.localeCompare(n2.title);
                                        else
                                            return -n1.title.localeCompare(n2.title);
                                    }
                                })];

                            setList(sorted);
                        }}/>
                </Modal>

                <Modal
                    transparent
                    visible={modalVisible}>
                    <TouchableOpacity
                        style={{flex : 1}}
                        onPress={() => setModalVisible(false)}>
                        <View style={{position : 'absolute', right : 0, top : 60, right : 10, backgroundColor : 'gray', 
                        width : 200, borderRadius : 16, padding : 10}}>
                            <TouchableOpacity
                                onPress={() => 
                                {
                                    setOption('folder');
                                    setModalVisible(false);
                                }}>
                                <Text style={styles.text_style}>Tạo thư mục</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => 
                                    {
                                        setOption('locate');
                                        setModalVisible(false);
                                    }}>
                                <Text style={styles.text_style}>Đi tới</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => 
                                    {
                                        setOption('sort');
                                        setModalVisible(false);
                                    }}>
                                <Text style={styles.text_style}>Sắp xếp</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
            
            { list.length != 0 &&
                <ScrollView>
                        {list.map((item, i) =>
                            {
                                return(<ANote
                                    tagList={item.tagList}
                                    onOpenNote={() => onOpenNote(item, i)}
                                    note={item}/>)
                            })}
                </ScrollView>
            }

            {
                list.length == 0 &&
                <View style={{alignItems : 'center', justifyContent : 'center', flex : 1}}>
                    <Text style={{marginBottom : 30}}>{'Chưa có ghi chú nào cả :('}</Text>
                    <Image
                        style={{width : 60, height : 60}}
                        source={require('../drawable/sad.png')}/>
                </View>
            }

            <View style={{ position : 'absolute', bottom : 10, right : 10, padding : 10, borderRadius : 20, backgroundColor : 'lightgray'}}>
                <TouchableOpacity
                    onPress={() => 
                    {
                        Utils.query(db, 'SELECT SEQ from sqlite_sequence WHERE name=?', ['note'],
                        (datatable) =>
                        {
                            props.navigation.navigate('Note', {onActivityResult : onActivityResult, note : 
                                {id : datatable.item(0)['seq'] + 1, title : ''}, database : db});
                            lastArrayID = -1;  
                        })
                    }}>
                    <Image
                        style={{width : 25, height : 25}}
                        source={require('../drawable/add.png')}/>
                </TouchableOpacity>
            </View>
        </View>)
}

const styles = StyleSheet.create(
    {
        text_style:
        {
            fontSize : 18,
            color : 'white'
        }
    }
)