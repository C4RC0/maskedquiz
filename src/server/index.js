import wapplrServer from "wapplr";
import wapplrMongo from "wapplr-mongo";
import wapplrPosttypes from "wapplr-posttypes";
import wapplrGraphql, {createMiddleware as createWapplrGraphqlMiddleware}  from "wapplr-graphql";
import wapplrReact from "wapplr-react";

import bodyParser from "body-parser";
import url from "url";
import nodeFetch from "node-fetch";

import setContents from "../common/setContents";
import {getConfig as getCommonConfig} from "../common/config";

import addHighScorePostType from "./addHighScorePostType";
import Head from "./components/Head";
import Html from "./components/Html";

import favicon from "./images/favicon.png";

export function getConfig(p = {}) {

    const {config = {}} = p;

    const serverConfig = config.server || {};
    const commonConfig = getCommonConfig(p).config;

    const common = {...commonConfig.common}

    const server = {
        icon: favicon,
        disableUseDefaultMiddlewares: true,
        database: {
            mongoConnectionString: "mongodb://localhost/masked",
        },
        ...serverConfig,
    }

    return {
        config: {
            ...config,
            common: common,
            server: server,
        },
    }
}

export default async function createServer(p = {}) {
    const {config} = getConfig(p);
    const wapp = p.wapp || wapplrServer({...p, config});

    wapp.requests.requestManager.fetch = async function (urlString, options) {
        const absoluteUrl = (!url.parse(urlString).hostname) ?
            wapp.request.protocol + "//" + wapp.request.hostname + urlString :
            urlString;

        return await nodeFetch(absoluteUrl, options);
    };

    wapplrMongo({wapp, ...p, config});
    wapplrPosttypes({wapp, ...p, config});
    wapplrReact({wapp, ...p, config});

    await addHighScorePostType({wapp, ...p});

    wapplrGraphql({wapp, ...p, config}).init();

    wapp.contents.addComponent({
        head: Head,
        html: Html
    })

    setContents({wapp, ...p, config});

    return wapp;
}

export async function createMiddleware(p = {}) {

    const {config} = getConfig(p);
    const wapp = p.wapp || await createServer({...p, config});
    return [
        createWapplrGraphqlMiddleware({wapp, ...p}),
    ]

}

const defaultConfig = {
    config: {
        globals: {
            DEV: (typeof DEV !== "undefined") ? DEV : undefined,
            WAPP: (typeof WAPP !== "undefined") ? WAPP : undefined,
            RUN: (typeof RUN !== "undefined") ? RUN : undefined,
            TYPE: (typeof TYPE !== "undefined") ? TYPE : undefined,
            ROOT: (typeof ROOT !== "undefined") ? ROOT : __dirname
        }
    }
}

export async function run(p = defaultConfig) {

    const {config} = getConfig(p);
    const wapp = await createServer({...p, config});
    const globals = wapp.globals;
    const {DEV} = globals;

    const app = wapp.server.app;

    if (!wapp.server.initializedBodyParser){
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
        Object.defineProperty(wapp.server, "initializedBodyParser", {
            enumerable: false,
            writable: false,
            configurable: false,
            value: true
        })
    }

    app.use([
        wapp.server.middlewares.wapp,
        wapp.server.middlewares.static,
    ]);

    app.use(await createMiddleware({wapp}));

    app.use([
        ...Object.keys(wapp.server.middlewares).map(function (key){
            return (key === "wapp" || key === "static") ? function next(req, res, next) { return next(); } : wapp.server.middlewares[key];
        })
    ]);

    wapp.server.listen();

    if (typeof DEV !== "undefined" && DEV && module.hot){
        app.hot = module.hot;
        module.hot.accept("./index");
    }

    return wapp;

}

if (typeof RUN !== "undefined" && RUN === "maskedquiz") {
    run();
}
