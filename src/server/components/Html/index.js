import React from "react";
import WapplrHtml from "wapplr-react/dist/server/Html";

import style from "../../../common/components/App/app.css";

export default function Html(props) {
    return <WapplrHtml {...props} appStyle={style} />
}

