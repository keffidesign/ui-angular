import {Component, View} from 'angular2/core';
import {List, Button, Dropdown, Form, Input, NavBar, Table, Checkbox} from '../ui';

@Component({
    selector: 'learning-component'
})

@View({
    template: `
        <ui-navbar [dataFrom]="'navigation://list'"></ui-navbar>
        <ui-list [dataFrom]="'learning://list'" [dataDependsOn]="'learning://changed'"></ui-list>
        <ui-button [props]="{caption: 'New', action: 'learning://create'}"></ui-button>
        <ui-dropdown [dataFrom]="'learning://list'"></ui-dropdown>
        <ui-form [props]="{meta: FORM_META(), onDataChanged: formDataChanged.bind(__component__)}"></ui-form>
        <ui-table [dataFrom]="'learning://list'" [props]="{meta: TABLE_META()}"></ui-table>
    `,
    directives: [List, Button, NavBar, Table, Dropdown, Form, Input, Checkbox, Table]
})

export class LearningComponent {

    formDataChanged(...args) {

        console.log('formDataChanged', ...args, this);

    }

    TABLE_META() {

        return [
            {
                id: 'name',
                caption: 'name'
            }
        ]

    }

    FORM_META() {

        return [
            {
                id: 'name',
                caption: 'name',
                type: 'string'
            }
            ,
            {
                id: 'public',
                caption: 'Public',
                type: 'boolean'
            }
        ]

    }

}

console.log('Metadata:LearningComponent', Reflect.getMetadata('annotations', LearningComponent));