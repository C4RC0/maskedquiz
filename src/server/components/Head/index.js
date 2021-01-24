import React, {useContext} from "react";
import ogImage from "../../images/ogImage.jpg";

import {WappContext} from "wapplr-react/dist/common/Wapp";

function getTitle({title, wapp, req, res, siteName, statusCode}) {
    if (typeof title == "function") {title = title({wapp, req, res});}
    return `${(title) ? title : (statusCode === 404) ? "Not Found | " + siteName : "Untitled Page | " + siteName }`;

}

function getDesc({description, wapp, req, res, title}) {
    if (typeof description === "function") {description = description({wapp, req, res})}
    return (description) ? description : (title && title.split) ? title.split(" | ")[0] : title;
}

export default function Head() {

    const {wapp, req, res} = useContext(WappContext);

    const config = wapp.server.config;
    const {siteName = "Wapplr"} = config;
    const {content = {}, statusCode = 200} = res.wappResponse;

    const title = getTitle({title:content.title || "", wapp, req, res, siteName, statusCode});
    const description = getDesc( {description: content.description || "", wapp, req, res, title});

    return [
        <meta httpEquiv={"x-ua-compatible"} content={"ie=edge"}/>,
        <meta property={"og:locale"} content={"en_US"} />,
        <meta property={"og:type"} content={"website"} />,
        <meta property={"og:title"} content={title} />,
        <meta property={"og:description"} content={description} />,
        <meta property={"og:url"} content={""} />,
        <meta property={"og:site_name"} content={title} />,
        <meta property={"og:image"} content={ogImage} />,
        <meta property={"og:image:width"} content={820} />,
        <meta property={"og:image:height"} content={360} />,
        <meta name={"twitter:card"} content={"summary"} />,
        <meta name={"twitter:description"} content={description} />,
        <meta name={"twitter:title"} content={title} />,
        <meta name={"twitter:image"} content={ogImage} />
    ]
}
