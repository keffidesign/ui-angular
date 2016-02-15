import {Input} from 'angular2/core';
import BaseComponent from './BaseComponent.ts';

export default class DataDrivenComponent extends BaseComponent {

    @Input() props;
    @Input() dataFrom: String;
    @Input() dataDependsOn: String;

    constructor() {

        super();

        const {dataDependsOn} = this;

        console.log('dataFrom', this.dataFrom);
        console.log('dataDependsOn', dataDependsOn);

        if (dataDependsOn) {

            this.addEventListener(dataDependsOn, this.setData);

        }

        console.log('DataDrivenComponent:constructor', this);

    }

    ngOnInit() {

        super.ngOnInit();

        const {dataFrom} = this;

        if (dataFrom) {

            console.log(`DD: ${dataFrom}.`);

            this.event(dataFrom).action((err, result) => {

                console.log(`DD: result ${result}`);

                this.setData(result);

            });

        }

    }

    responseHandler(err, data) {

        if (err) return this.setError(err);

        if (!data) return this.setError(new Error('There is no data'));

        this.setData(data);

    }

    setError(err) {

        this.error = err;

    }

    setData(data) {

        console.log('setData', data);

        this.data = data;

    }

}