import {Plugin} from 'applugins';
import {LearningComponent} from './learning.component.ts';

export default class LearningPlugin extends Plugin {

    init() {}

    onPatients_list(ev, cb) {

        const patients = [
            {
                id: 'patientId1',
                name: 'Alibaba',
                gender: 'male'
            }
        ];

        setTimeout(() => {

            cb(null, patients);

        }, 2000);

    }

}