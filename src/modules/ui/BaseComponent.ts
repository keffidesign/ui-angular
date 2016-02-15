import {Input} from 'angular2/core';
import {event} from 'applugins';

const EXCEPTIONAL_NOUNS = {
    data: 'datum'
};

export default class BaseComponent {

    data = [
        {
            id: '1',
            name: 'task #1'
        }
    ]

    render() {}

    createElement(type: string, props: any, ...children: any[]) {

        const typeResolved = this.resolveType(type);

        const childrenResolved = this.resolveChildren(children);

        const propsResolved = Object.keys(props || {}).map(p => this.resolveProp(p, props[p]));

        const result = `<${typeResolved} ${propsResolved.join(' ')}>${childrenResolved}</${typeResolved}>`;

        console.log('createElement', result);

        return result;

    }

    resolveType(type: any) {

        if (type && (type.prototype instanceof BaseComponent)) {

            const name = type.name.replace(/Component$/, '').match(/[A-Z][a-z0-9]+/g).join('-').toLowerCase();

            this.directives[name] = type;

            return name;

        }

        return type;

    }

    resolveProp(key: string, value: any) {

        if (key.startsWith('on')) return `(${key.substring(2).toLowerCase()})="actionHandler(${value.slice(2, -1)})"`;

        if (key === 'each') return this.resolveEachDirective(value);

        if (key === 'if') return `*ngIf="${value}()"`;

        return `[${key}]="${value}"`;

    }

    resolveChildren(children) {

        return children.map(c => this.resolveChild(c)).join('');

    }

    resolveChild(child) {

        return (typeof child !== 'string')? (child || []).join('') : this.resolvePlaceholders(child);

    }

    resolvePlaceholders(str) {

        /**
         * Select with #[<...>] placeholder
         */
        const selector = /#\[(\w|[\(\)\,\s\.])+\]/g;

        return str.replace(selector, p => {

            let path = p.slice(2, -1);

            path = (this.resolvePathType(path) === 'function') ? `${path}()` : path;

            return `{{${path}}}`

        });

    }

    resolvePathType(path: string) {

        return typeof path
            .split('.')
            .reduce((s, p) => s[p] || {}, this);

    }

    actionHandler(value) {

        console.log('actionHandler', value);

        this.event(value).emit();

    }

    resolveEachDirective(value) {

        const [scopeId, operator = 'of', dataId = scopeId] = value.split(' ');

        if (scopeId === dataId) {

            scopeId = EXCEPTIONAL_NOUNS[dataId] || dataId.slice(0, -1);

            scopeId = scopeId.split('.').pop();

        }

        console.log('resolve each directive', dataId, this.resolvePathType(dataId));

        if (this.resolvePathType(dataId) === 'function') dataId = `${dataId}()`;

        return `*ngFor="#${[scopeId, operator, dataId].join(' ')}"`;

    }

    ngOnInit(...args) {

        console.log('BaseComponent:ngOnInit', this);

    }

    ngAfterContentInit(...args) {

        console.log('BaseComponent:ngAfterContentInit', ...args);

    }

    ngAfterViewInit(...args) {

        console.log('BaseComponent:ngAfterViewInit', ...args);

        console.log('ngAfterViewInit', this, this.loader);

    }

    /**
     * Adds event handlers with this ownership.
     *
     * @param ev
     */
    addEventListener(key, handler) {

        event.on(`${key}#${this.id}`, handler);

    }

    log(message, ...data) {

        return event(`log://info`,{value: `${this.id}: ${message}`, data}).action();

    }

    event(...sources) {

        return event(...sources);

    }

    emit(key, params, cb) {

        event(key, {data: params}).action(cb);

    }

    promit(key, params) {

        return event(key, {data: params}).promise();

    }

}