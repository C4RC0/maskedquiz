export function getConfig(p = {}) {

    const {config = {}} = p;

    const commonConfig = config.common || {};
    const globalsConfig = config.globals || {}

    const {WAPP, DEV} = globalsConfig;

    const common = {
        ...commonConfig,
        siteName: "Masked! - The Masked Quiz Game | maskedquiz.com",
        footerMenu: [
            {name: "GAME", href:"/"},
            {name: "ABOUT", href:"/about"},
            {name: "HIGH SCORES", href:"/highscores"},
        ],
        graphql: {
            route: (DEV) ? "/graphql" : "/g" + WAPP
        }
    }

    return {
        config: {
            ...config,
            common: common
        },
    }
}
