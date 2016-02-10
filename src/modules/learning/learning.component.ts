import {Component, View} from 'angular2/core';
import {List} from '../ui';

@Component({
    selector: 'learning-component'
})

@View({
    template: `
        <h1>Learning Component</h1>
        <list [dataFrom]="'storage://list'"></list>
    `,
    directives: [List]
})

export class LearningComponent {}
