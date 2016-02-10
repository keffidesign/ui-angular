import {Plugin} from 'applugins';
import {InfoComponent} from './info.component.ts';

export default class InfoPlugin extends Plugin {

    onUi_registerPages() {

        return [
            {
                id: 'Info',
                component: InfoComponent
            }
        ]

    }

}