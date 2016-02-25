import {BaseComponent} from 'ui-components';

const EXCEPTIONAL_NOUNS = {
    data: 'datum'
};

String.capitalize = function(string) {

    return string.charAt(0).toUpperCase() + string.slice(1);

};

const isComponent = (type) => {

    return type && type.prototype instanceof BaseComponent;

};

const resolveType = (type: any, directives) => {

    if (!isComponent(type)) return type;

    const name = type.name.replace(/Component$/, '').match(/[A-Z][a-z0-9]+/g).join('-').toLowerCase();

    directives[name] = type;

    return name;

};

const resolveChildren = function (children) {

    return children.map(c => resolveChild.call(this, c)).join('');

};

const resolveChild = function(child) {

    return (typeof child === 'string') ? resolvePlaceholders.call(this, child) : (child || []).join('');

};

const resolveProps = function(props, isComponent) {

    if (!isComponent) return Object.keys(props || {}).map(p => resolveProp.call(this, p, props[p]));

    return resolveComponentProps.call(this, props);

};

const resolveProp = function(key: string, value: any) {

    if (key.startsWith('on')) return `(${key.substring(2).toLowerCase()})="${value}($event)"`;

    //if (key.startsWith('on')) return `(${key.substring(2).toLowerCase()})="actionHandler($event, ${value})"`;

    if (key === 'each') return resolveEachDirective.call(this, value);

    if (key === 'if') return `*ngIf="${value}()"`;

    if (key === 'className') return `class="${value}"`;

    //return {key: key, value: resolvePath(value)};

    const resolvedPath = resolvePath.call(this, value);

    if (/[\(\)\.]/.test(resolvedPath)) return `${key}="{{${resolvedPath}}}"`

    return `${key}="${resolvePath.call(this, value)}"`;

};

const resolveComponentProps = function(props) {

    //console.log('resolveComponentProps', props, Object.keys(props || {}));

    let propsObj = {};

    const newProps1 = [];

    const newProps = Object.keys(props || {}).reduce((r, p) => {

        const key = p,
            value = props[p];

        if (key.startsWith('on')) {

            propsObj[key] = `${value}.bind(__component__)`;

        } else if (key === 'each') {

            r.push(resolveEachDirective.call(this, value));

        } else if (key === 'if') {

            r.push(`*ngIf="${value}()"`);

        } else if (key === 'className') {

            r.push(`class="${value}"`);

        } else {

            propsObj[key] = resolvePath.call(this, value);

        }

        return r;

    }, []);

    const result = Object.keys(propsObj || {}).map(p => `${p}: ${propsObj[p]}`);

    newProps.push(`[props]='{${result.join(', ')}}'`);

    return newProps;

};

const resolvePlaceholders = function(str) {

    /**
     * Select with #[<...>] placeholder
     */
    const selector = /#\[(\w|[\[\]\(\)\,\s\.])+\]/g;

    return str.replace(selector, p => `{{${resolvePath.call(this, p.slice(2, -1))}}}`);

};

const resolvePath = function(path: string) {

    const tokens = [];

    path
        .split('.')
        .reduce((s, p) => {

            if (s == undefined || !s[`get${String.capitalize(p)}`]) {

                tokens.push(p);

                return s && s[p];

            }

            tokens.push(`get${String.capitalize(p)}()`);


        }, this);

    //console.log('resolvePath', tokens.join('.'), path);

    return tokens.join('.') || path;

};

const resolveEachDirective = function(value) {

    const [scopeId, operator = 'of', dataId = scopeId] = value.split(' ');

    if (scopeId === dataId) {

        scopeId = EXCEPTIONAL_NOUNS[dataId] || dataId.slice(0, -1);

        scopeId = scopeId.split('.').pop();

    }

    dataId = resolvePath.call(this, dataId);

    return `*ngFor="#${[scopeId, operator, dataId].join(' ')}"`;

};

const stringifyComponent = function({type, props, children}) {

    if (~['input'].indexOf(type)) return `<${type} ${props.join(' ')}>`;

    return `<${type} ${props.join(' ')}>${children}</${type}>`;

};

export default {

    props: undefined,
    dataFrom: undefined,
    dataDependsOn: undefined,

    directives: {},

    createElement: function (type: string, props: any, ...children: any[]) {

        const typeResolved = resolveType(type, this.directives);

        const childrenResolved = resolveChildren.call(this, children);

        const propsResolved = resolveProps.call(this, props, isComponent(type));

        const result = stringifyComponent({type: typeResolved, props: propsResolved, children: childrenResolved});

        return result;

    }
    ,
    /**
     * Lifecycle hooks binding
     */
    ngOnInit: function() {

        /**
         * Super.init()
         */
        this.init();

        const {dataFrom, dataDependsOn} = this;

        if (dataDependsOn) this.addEventListener(dataDependsOn, this.setData);

        if (dataFrom) this.event(dataFrom).action((err, result) => this.responseHandler(err, result));

    }
    ,
    ngOnChanges: function() {

        /**
         * Super.update()
         */
        this.update();

    }
    ,
    ngOnDestroy: function() {

        /**
         * Super.done()
         */
        this.done();

    }
    ,
    responseHandler: function(err, data) {

        if (err) return this.setError(err);

        if (!data) return this.setError(new Error('There is no data'));

        this.setData(data);

    }
    ,
    setError: function(err) {

        this.error = err;

    }
    ,
    setData: function(data) {

        this.data = data;

    }

}