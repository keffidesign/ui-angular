import {Plugin} from 'applugins';

import {bootstrap} from 'angular2/platform/browser';
import {provide, Injector, Inject, Injectable, DynamicComponentLoader} from 'angular2/core';
import {LocationStrategy, HashLocationStrategy, ROUTER_PROVIDERS} from 'angular2/router';
import {DynamicRouteConfigurator} from './DynamicRouteConfigurator.ts';

import {ViewportComponent} from './viewport.component.ts';

@Injectable()

export default class UiPlugin extends Plugin {

    constructor(private dynamicRouteConfigurator: DynamicRouteConfigurator) {

        super();

        this.dynamicRouteConfigurator = new DynamicRouteConfigurator();

        console.log('dynamicRouteConfigurator', dynamicRouteConfigurator);

    }

    init(...args) {

        this.event('ui://registerPages')
            .promise()
            .then(pages => {

                bootstrap(ViewportComponent, [
                    ROUTER_PROVIDERS,
                    provide(LocationStrategy, { useClass: HashLocationStrategy })
                    //,
                    //DynamicComponentLoader
                ]);

                console.log('Pages', pages, pages.map(p => ({path: `/${p.id}`, as: p.id, component: p.component})));

                console.log(pages.map(p => this.addRoute({path: `/${p.id}`, as: p.id, component: p.component})));


            })
            .catch((err) => console.error('Ui error:', err));

    }

    public addRoute(route): void {

        console.log('addRoute', route);

        //let route = { path: '/info', component: InfoComponent, as: 'Info' };
        this.dynamicRouteConfigurator.addRoute(ViewportComponent, route);

        //this.appRoutes = this.getAppRoutes();

    }

}
