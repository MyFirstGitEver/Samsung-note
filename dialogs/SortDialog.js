import { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

export default function SortDialog(props)
{
    const [criteria, setCriteria] = useState('date');
    const [isIncreasing, setIsIncreasing] = useState(true);

    const onSort = props.onSort;

    return(
        <View style={{justifyContent: 'center', flex : 1, marginBottom : 30, marginHorizontal : 30}}>
            <View style={{backgroundColor : 'white', borderRadius : 16, height : 300, justifyContent : 'space-evenly'}}>
                <View style={{alignItems : 'center'}}>
                    <Text style={{fontWeight : 'bold', marginLeft : 30, marginBottom : 20}}>Sắp xếp theo</Text>
                </View>

                <View style={{flexDirection : 'row', justifyContent : 'space-around'}}>
                    <TouchableOpacity
                        onPress={() => setCriteria('date')}
                        style={[styles.btn_style, {backgroundColor : criteria == 'date' ? 'lightgray' : 'white'}]}>
                        <Text>Theo ngày</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => setCriteria('title')}
                        style={[styles.btn_style, {backgroundColor : criteria == 'title' ? 'lightgray' : 'white'}]}>
                        <Text>Theo tiêu đề</Text>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection : 'row', justifyContent : 'space-around'}}>
                    <TouchableOpacity 
                        onPress={() => setIsIncreasing(true)}
                        style={[styles.btn_style, {backgroundColor : isIncreasing ? 'lightgray' : 'white'}]}>
                        <Text style={{color : '#3399FF'}}>Tăng dần</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => setIsIncreasing(false)}
                        style={[styles.btn_style, {backgroundColor : !isIncreasing ? 'lightgray' : 'white'}]}>
                        <Text style={{color : '#3399FF'}}>Giảm dần</Text>
                    </TouchableOpacity>
                </View>

                <View style={{alignItems : 'center'}}>
                    <TouchableOpacity
                        onPress={() => onSort({criteria : criteria, isIncreasing : isIncreasing})}
                        style={[styles.btn_style, {backgroundColor : 'lightgray', paddingHorizontal : 25}]}>
                        <Text>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    btn_style:
    {
        padding : 10,
        borderRadius : 16
    }
})