import { useState } from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native'
import Utils from '../Utils';

var db; 

export default function TreeView(props)
{
    const onDecide = props.onDecide;
    db = props.database;

    return(
    <View>
        {
            props.list.map(folder =>
                {
                    return(<Container
                        onDecide={onDecide}
                        folder={{title : folder.fName, id : folder.fID}}
                        layerLevel={0}/>)
                })
        }
    </View>
    )
}

function Container(props)
{
    const [showSub, setShowSub] = useState(false);
    const [list, setList] = useState([]);

    const layerLevel = props.layerLevel;
    const f = props.folder;

    return(
        <View style={{marginLeft : layerLevel * 10}}>
            <Item
                folder={f}
                onDecide={props.onDecide}
                onShow={() => 
                {
                    setShowSub(!showSub);

                    if(!showSub)
                    {
                        Utils.query(db, 'Select * from folder Where parentID = ?', [f.id], (datatable) =>
                        {
                            const folderList = []
                            for(let i=0;i<datatable.length;i++)
                            {
                                const row = datatable.item(i);
                                folderList.push({title : row.fName, id : row.fID});
                            }

                            setList(folderList);
                        })
                    }
                    else
                        setList([])
                }} 
                name={f.title}/>
            { showSub &&
                list.map(item =>
                    {
                        return (
                        <Container 
                            layerLevel={layerLevel + 1} 
                            folder={item}
                            onDecide={props.onDecide}/>)
                    })
            }
        </View>
    )
}

function Item(props)
{
    const name = props.name;
    const showSub = props.onShow;
    const onDecide = props.onDecide;
    const folder = props.folder;

    return(
    <TouchableOpacity
        onLongPress={() => onDecide(folder)}
        onPress={() => showSub()}
        activeOpacity={0.8}>
        <View style={{flexDirection : 'row', alignItems : 'center', paddingLeft : 10}}>
            <Image
                style={{width : 10, height : 10, marginRight : 10, transform: [{ rotate: '270deg'}]}}
                source={require('../drawable/triangle.png')}/>

            <Image
                style={{width : 50, height : 50, marginRight : 10}}
                source={require('../drawable/folder_icon.png')}/>
            <Text style={{color : 'black'}}>{name}</Text>
        </View>
    </TouchableOpacity>
    )
}