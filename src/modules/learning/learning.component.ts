import {Component, View} from 'angular2/core';
import {List} from '../ui';
import {Button} from '../ui';

@Component({
    selector: 'learning-component'
})

@View({
    template: `
        <h1>Tasks</h1>
        <ui-list [dataFrom]="'learning://list'" [dataDependsOn]="'learning://changed'"></ui-list>
        <ui-button [props]="{caption: 'New', action: 'learning://create'}"></ui-button>
    `,
    directives: [List, Button]
})

export class LearningComponent {

}
