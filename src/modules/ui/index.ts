import {Component, View} from 'angular2/core';

import {List as _List} from 'ui-components';

console.log('List', List, _List);

export const List = prepare(_List);

//import _Paragraph from './Paragraph.jsx';
//
//export const Paragraph = prepare(_Paragraph);
//
//import _List from './List.jsx';
//
//export const List = prepare(_List);
//
//import _Title from './Title.jsx';
//
//export const Title = prepare(_Title);

function prepare(ctor) {

    const obj = new ctor();

    obj.directives = {};

    const template = obj.render();

    const directives = Object.keys(obj.directives).map((key) => obj.directives[key]);

    console.log('selector', obj.resolveType(ctor), directives, obj.directives, template);

    var annotations = [
        new Component({
            selector: obj.resolveType(ctor)
        }),
        new View({
            template
            ,
            directives
        })
    ];

    Reflect.defineMetadata("annotations", annotations, ctor);

    return ctor;

}