import {Plugin} from 'applugins';
import {LearningComponent} from './learning.component.ts';

export default class LearningPlugin extends Plugin {

    //onUi_registerPages() {
    //
    //    return [
    //        {
    //            id: 'learning',
    //            component: LearningComponent
    //        }
    //    ]
    //
    //}

    onLearning_list() {

        return this.event(`storage://list`).promiseAction();

    }

    onLearning_create({data}, cb) {

        data = {
            id: '3',
            name: 'Task #3'
        };

        this
            .event(`storage://add`)
            .withData(data)
            .action(err => err ? cb(err) : this.event('learning://changed').action());

    }

}