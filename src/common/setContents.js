import App from "./components/App";

export default function setContents(p = {}) {

    const {wapp} = p;

    wapp.contents.add({
        home: {
            render: App,
            description: "Mask is one of the most popular word in 2020 and 2021 ... so play with masks and famous people! Can you guess who hiding behind the mask?",
            renderType: "react",
            title: function ({wapp, req, res}) {
                const path = res.wappResponse.route.path;
                const config = wapp.getTargetObject().config;
                const {siteName = "Wapplr"} = config;
                const title =
                    (res.wappResponse.statusCode === 200) ?
                        (path === "/about") ?
                            "ABOUT" : (path === "/highscores") ?
                            "HIGH SCORES"
                            : "HOME"
                        : "NOT FOUND";
                return title + " | " + siteName;
            }
        }
    })

    wapp.router.replace([
        {path: "/", contentName: "home"}
    ])

    wapp.router.add([
        {path: "/about", contentName: "home"},
        {path: "/highscores", contentName: "home"},
    ])

}
