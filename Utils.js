import AsyncStorage from "@react-native-async-storage/async-storage";
import * as RNFS from 'react-native-fs';

export default class Utils
{
    static filesDir  = RNFS.DocumentDirectoryPath;

    static query = (db, str, params, onProcess) =>
    {
        db.transaction(cmdLine =>
            {
                cmdLine.executeSql(str, params, (transaction, resultSet) => onProcess(resultSet.rows))
            })
    }

    static toReadableDate = (date) =>
    {
        return date.getDate() + ', Th. ' + (date.getMonth() + 1) + ', ' + date.getFullYear();
    }

    static compareDate(d1, d2)
    {
        if(d1 < d2)
            return -1;
        else if(d1 == d2)
            return 0;
        else
            return 1;
    }
}