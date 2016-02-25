import {Component, View, Input} from 'angular2/core';

import {BaseComponent as _BaseComponent} from 'ui-components';

import {default as AngularPrototype} from './AngularPrototype';

const resolveSelector = ({name}) => {

    return name
        .replace(/Component$/, '')
        .match(/[A-Z][a-z0-9]+/g)
        .join('-')
        .toLowerCase();

};

export const BaseComponent = _BaseComponent;

import {Button as _Button} from 'ui-components';

export const Button = prepare(_Button);

import {List as _List} from 'ui-components';

export const List = prepare(_List);

import {Dropdown as _Dropdown} from 'ui-components';

export const Dropdown = prepare(_Dropdown);

import {Form as _Form} from 'ui-components';

export const Form = prepare(_Form);

import {Fieldset as _Fieldset} from 'ui-components';

export const Fieldset = prepare(_Fieldset);

import {Input as _Input} from 'ui-components';

export const Input = prepare(_Input);

import {Checkbox as _Checkbox} from 'ui-components';

export const Checkbox = prepare(_Checkbox);

import {NavBar as _NavBar} from 'ui-components';

export const NavBar = prepare(_NavBar);

import {Table as _Table} from 'ui-components';

export const Table = prepare(_Table);

function prepare(ctor) {

    Object.assign(ctor.prototype, AngularPrototype);

    //@Component({
    //    selector: resolveSelector(ctor),
    //    inputs: ['props', 'dataFrom', 'dataDependsOn']
    //})
    //
    //@View({
    //    template: ctor.prototype.render(),
    //    directives: Object.keys(ctor.prototype.directives).map(key => ctor.prototype.directives[key])
    //})
    //
    //class NgComponent extends ctor {}
    //
    //return NgComponent;

    const annotations = [
        new Component({
            selector: resolveSelector(ctor)
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