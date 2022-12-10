import { View, Image, TextInput, TouchableOpacity, Text, StyleSheet, Modal} from 'react-native';
import { useState } from 'react';

export default function NoteHeader(props)
{
    const [modalVisible, setModalVisible] = useState(false);
    const onTitleChange = props.onTitleChange;
    const onRemove = props.onRemove;
    const onCreateTag = props.onCreateTag;
    const title = props.title;

    return(
    <View style={{flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}>
        <View style={{flexDirection : 'row', alignItems : 'center'}}>
          <TouchableOpacity
            onPress={() => props.onSave()}
            style={{padding : 3, backgroundColor : 'lightgray', borderRadius : 20, marginLeft : 5}}>
            <Image
              style={{width : 30, height : 30}}
              source={require('../drawable/simple_back.png')}/>
          </TouchableOpacity>

          <TextInput
            defaultValue={title}
            onChangeText={(text) => onTitleChange(text)}
            style={{color : 'white'}}
            placeholderTextColor='white'
            placeholder="Tiêu đề"/>
        </View>

        <View>
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
                style={{width : 30, height : 30}}>
                <Image
                    style={{width : 30, height : 30}}
                    source={require('../drawable/3_dots.png')}/>
            </TouchableOpacity>

            <Modal
                transparent visible={modalVisible}>
                <TouchableOpacity
                    activeOpacity={1.0}
                    style={{flex : 1}}
                    onPress={() => setModalVisible(false)}>
                    <View style={{position : 'absolute', right : 0, top : 45, right : 10, backgroundColor : 'gray', width : 200, borderRadius : 16, padding : 10}}>
                        <TouchableOpacity>
                            <Text style={styles.text_style}>Chia sẻ</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => 
                            {
                                onCreateTag();
                                setModalVisible(false)
                            }}>
                            <Text style={styles.text_style}>Tạo tag</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => onRemove()}>
                            <Text style={styles.text_style}>Xóa</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    </View>
    )
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