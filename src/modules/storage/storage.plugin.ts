import {Plugin} from 'applugins';

const LIST = [
    {
        id: '1',
        name: 'Task #1',
        tags: [
            {
                id: 'tag_family',
                name: 'Family'
            },
            {
                id: 'tag_work',
                name: 'Work'
            }
        ]
    }
    ,
    {
        id: '2',
        name: 'Task #2',
        tags: [
            {
                id: 'tag_plans',
                name: 'Plans'
            },
            {
                id: 'tag_future',
                name: 'Future'
            }
        ]
    }
];



export default class StoragePlugin extends Plugin {

    init() {}

    onStorage_list(ev, cb) {

        setTimeout(() => cb(undefined, LIST), 1000);

    }

    onStorage_add(ev, cb) {

        console.log('onStarage_add');

        setTimeout(() => cb(undefined, LIST.push(ev.data)), 1000);

    }

}