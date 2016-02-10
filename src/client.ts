import {create} from 'applugins';
import config from './client.config.ts';

create(config)
    .init()
    .then(() => console.log('App started'))
    .catch(() => console.error('App failed'));
