import {Plugin} from 'applugins';

export default class StoragePlugin extends Plugin {

    onStorage_list(ev, cb) {

        const list = [
            {
                id: '1'
            }
            ,
            {
                id: '2'
            }
        ];

        setTimeout(() => cb(undefined, list), 1000);

    }

}