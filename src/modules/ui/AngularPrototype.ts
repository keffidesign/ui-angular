import {BaseComponent} from 'ui-components';

const EXCEPTIONAL_NOUNS = {
    data: 'datum'
};

<div>
{
    data.map(d => <Button/>);
}
</div>

const resolveType = (type: any, directives) => {

    if (!type || !(type.prototype instanceof BaseComponent)) return type;

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

const resolvePlaceholders = function(str) {

    /**
     * Select with #[<...>] placeholder
     */
    const selector = /#\[(\w|[\(\)\,\s\.])+\]/g;

    return str.replace(selector, p => {

        let path = p.slice(2, -1);

        path = (resolvePathType.call(this, path) === 'function') ? `${path}()` : path;

        return `{{${path}}}`

    });

};

const resolvePathType = function(path: string) {

    return typeof path
        .split('.')
        .reduce((s, p) => s[p] || {}, this);

};

const resolveProp = function(key: string, value: any) {

    console.log('resolveProp123', this);

    if (key.startsWith('on')) return `(${key.substring(2).toLowerCase()})="actionHandler(${value.slice(2, -1)})"`;

    if (key === 'each') return resolveEachDirective.call(this, value);

    if (key === 'if') return `*ngIf="${value}()"`;

    return `[${key}]="${value}"`;

};

const resolveEachDirective = function(value) {

    const [scopeId, operator = 'of', dataId = scopeId] = value.split(' ');

    if (scopeId === dataId) {

        scopeId = EXCEPTIONAL_NOUNS[dataId] || dataId.slice(0, -1);

        scopeId = scopeId.split('.').pop();

    }

    console.log('resolve each directive', dataId, this);

    if (resolvePathType.call(this, dataId) === 'function') dataId = `${dataId}()`;

    return `*ngFor="#${[scopeId, operator, dataId].join(' ')}"`;

};

export default {

    props: undefined,
    dataFrom: undefined,
    dataDependsOn: undefined,

    directives: {},

    createElement: function (type: string, props: any, ...children: any[]) {

        const typeResolved = resolveType(type, this.directives);

        const childrenResolved = resolveChildren.call(this, children);

        const propsResolved = Object.keys(props || {}).map(p => resolveProp.call(this, p, props[p]));

        const result = `<${typeResolved} ${propsResolved.join(' ')}>${childrenResolved}</${typeResolved}>`;

        console.log('createElement', result);

        return result;

    }
    ,
    ngOnInit: function() {

        const {dataFrom, dataDependsOn} = this;

        if (dataDependsOn) {

            this.addEventListener(dataDependsOn, this.setData);

        }

        if (dataFrom) {

            console.log(`DD: ${dataFrom}.`);

            this.event(dataFrom).action((err, result) => {

                console.log(`DD: result ${result}`);

                this.setData(result);

            });

        }

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

        console.log('setData', data);

        this.data = data;

    }
    ,
    ngAfterContentInit: function(...args) {

        console.log('BaseComponent:ngAfterContentInit', ...args);

    }
    ,
    ngAfterViewInit: function(...args) {

        console.log('BaseComponent:ngAfterViewInit', ...args);

        console.log('ngAfterViewInit', this, this.loader);

    }

}