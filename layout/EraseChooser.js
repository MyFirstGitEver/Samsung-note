import { View, TouchableOpacity, Dimensions } from "react-native"

const WIDTH = Dimensions.get('window').width;

export default function EraseChooser(props)
{
    const onPickErase = props.onPickErase;
    return(
        <View style={{width : 180, borderRadius : 16, borderWidth : 1, backgroundColor : 'gray', padding : 10, marginBottom : 10, 
            position : 'absolute', bottom : 50, left : 10, flexDirection : 'row', justifyContent : 'space-between'}}>
            <TouchableOpacity
                onPress={() => props.onPickErase('rect')}
                style={{width : 70, height : 70, borderWidth : 1}}/>

            <TouchableOpacity
                onPress={() => props.onPickErase('circle')}
                style={{width : 70, height : 70, borderWidth : 1, borderRadius : 35}}/>
        </View>
    )
}