import {event} from 'applugins';

export default class BaseComponent {

    render() {}

    createElement(type: string, props: any[], ...children: any[]) {

        const typeResolved = this.resolveType(type);

        children = (typeof children === 'string') ? children : (children || []).join('');

        const result = `<${typeResolved} ${(Object.keys(props || {})).map(p => this.resolveProp(p, props[p])).join(' ')}>${children}</${typeResolved}>`

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

        if (key.startsWith('on')) return `(${key.substring(2).toLowerCase()})="${value}()"`;

        if (key === 'ngFor') return `*${key}="${value}"`;

        return `[${key}]="${value}"`;

    }




    ngOnInit(...args) {

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