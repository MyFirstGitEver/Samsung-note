import { useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { TextInput } from "react-native-gesture-handler"

export default function FolderDialog(props)
{
    const [folderName, setFolderName] = useState('');
    const onClose = props.onClose;
    const onCreate = props.onCreate;

    return(
        <View style={{justifyContent: 'center', flex : 1, marginBottom : 30}}>
            <View style={{backgroundColor : 'white', borderRadius : 16}}>
                <Text style={{fontWeight : 'bold', marginLeft : 30, marginBottom : 20}}>Tạo thư mục</Text>

                <TextInput
                    onChangeText={(text) => setFolderName(text)}
                    placeholder="Nhập tên thư mục"
                    style={{borderRadius : 16, borderWidth : 1, borderColor : 'lightgray', marginHorizontal : 16, color : 'black'}}/>
                
                <View style={{flexDirection : 'row', marginHorizontal : 16, justifyContent : 'space-between', marginVertical : 20}}>
                    <TouchableOpacity
                        onPress={() => onCreate(folderName)}>
                        <Text style={{fontSize : 18, color : 'black'}}>Tạo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => onClose()}>
                        <Text style={{fontSize : 18, color : 'red'}}>Hủy</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}