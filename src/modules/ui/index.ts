import {Component, View, Input} from 'angular2/core';

import {BaseComponent as _BaseComponent} from 'ui-components';

import {default as AngularPrototype} from './AngularPrototype';

const resolveType = (type: any, directives) => {

    if (type && (type.prototype instanceof BaseComponent)) {

        const name = type.name.replace(/Component$/, '').match(/[A-Z][a-z0-9]+/g).join('-').toLowerCase();

        directives[name] = type;

        return name;

    }

    return type;

};

export const BaseComponent = _BaseComponent;

import {Button as _Button} from 'ui-components';

export const Button = prepare(_Button);

import {List as _List} from 'ui-components';

export const List = prepare(_List);

function prepare(ctor) {

    Object.assign(_BaseComponent.prototype, AngularPrototype);

    const annotations = [
        new Component({
            selector: resolveType(ctor, ctor.prototype.directives)
            ,
            inputs: ['props', 'dataFrom', 'dataDependsOn']
        }),
        new View({
            template: ctor.prototype.render()
            ,
            directives: Object.keys(ctor.prototype.directives).map(key => ctor.prototype.directives[key])
        })
    ];

    Reflect.defineMetadata("annotations", annotations, ctor);

    return ctor;

}

