import {Type, Injectable} from 'angular2/core';
import {RouteRegistry} from 'angular2/router';

@Injectable()

export class DynamicRouteConfigurator {

    constructor(private registry: RouteRegistry) {}

    /**
     * Add a new route to a component
     * @param component
     * @param route
     */
    addRoute(component: Type, route) {

        const routeConfig = this.getRoutes(component);

        /**
         * Warning: It does MUTATE component's annotations object
         * If use Object.assign then a.constructor.name === 'RouteConfig' doesn't work
         */
        routeConfig.configs.push(route);

        /**
         * Let Angular know about a new route match rule
         */
        this.registry.config(component, route);

    }

    /**
     * Get all routes from component's annotation
     * @param component
     * @returns {T}
     */
    getRoutes(component: Type) {

        //TODO get rid of a.constructor.name === 'RouteConfig' somehow
        return Reflect
            .getMetadata('annotations', component)
            .filter(a => a.constructor.name === 'RouteConfig')
            .pop();

    }

}