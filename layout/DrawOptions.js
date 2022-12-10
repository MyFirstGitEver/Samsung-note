import { View, TouchableOpacity } from "react-native";

export default function DrawOptions(props)
{
    const setCurrentPicker = props.setCurrentPicker;
    const currentColor = props.currentColor;
    const currentErase = props.currentErase;

    return(
    <View style={{flexDirection : 'row', paddingTop : 10}}>
        <TouchableOpacity
            onPress={() => setCurrentPicker('color')}
            style={{width : 30, height : 30, backgroundColor : currentColor, marginBottom : 10, marginLeft : 10, borderRadius : 15}}/>
        <TouchableOpacity
            onPress={() => setCurrentPicker('erase')}
            style={{width : 30, height : 30, marginBottom : 10, marginLeft : 10, borderWidth : 1, 
              borderRadius : currentErase == 'rect' ? 0 : 15}}/>
    </View>
    )
}