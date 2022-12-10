import { View, TouchableOpacity, Dimensions } from "react-native"

const WIDTH = Dimensions.get('window').width;

export default function ColorPicker(props)
{
    const onPickColor = props.onPickColor;
    return(
        <View style={{width : 200, borderRadius : 16, borderWidth : 1, backgroundColor : 'gray', padding : 10, marginBottom : 10, 
            position : 'absolute', bottom : 50, left : 10}}>
            <View style={{flexDirection : 'row', justifyContent : 'space-between'}}>
                <TouchableOpacity
                    onPress={() => onPickColor('red')}
                    style={{width : 60, height : 60, backgroundColor : 'red'}}/>
                <TouchableOpacity
                    onPress={() => onPickColor('blue')}
                    style={{width : 60, height : 60, backgroundColor : 'blue'}}/>
                <TouchableOpacity
                    onPress={() => onPickColor('yellow')}
                    style={{width : 60, height : 60, backgroundColor : 'yellow'}}/>
            </View>

            <View style={{flexDirection : 'row', justifyContent : 'space-between'}}>
                <TouchableOpacity
                    onPress={() => onPickColor('brown')}
                    style={{width : 60, height : 60, backgroundColor : 'brown'}}/>
                <TouchableOpacity
                    onPress={() => onPickColor('black')}
                    style={{width : 60, height : 60, backgroundColor : 'black'}}/>
                <TouchableOpacity
                    onPress={() => onPickColor('orange')}
                    style={{width : 60, height : 60, backgroundColor : 'orange'}}/>
            </View>

            <View style={{flexDirection : 'row', justifyContent : 'space-between'}}>
                <TouchableOpacity
                    onPress={() => onPickColor('white')}
                    style={{width : 60, height : 60, backgroundColor : 'white'}}/>
                <TouchableOpacity
                    onPress={() => onPickColor('lightgray')}
                    style={{width : 60, height : 60, backgroundColor : 'lightgray'}}/>
                <TouchableOpacity
                    onPress={() => onPickColor('violet')}
                    style={{width : 60, height : 60, backgroundColor : 'violet'}}/>
            </View>
        </View>
    )
}