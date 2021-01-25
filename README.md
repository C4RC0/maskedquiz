# Masked Quiz

The [maskedquiz.com](https://maskedquiz.com) is a game. An example for how to use [Wapplr](https://github.com/wapplr/wapplr), 
and a funny game, try it! I made it recently, it’s pretty current!

#### How to play

1. Enter a username, that if you have enough score, you can be there to the high scores. The system automatically generates a funny name if you don't feel like typing your own.
2. Start the game. Guess who is under the mask. You have a few seconds to answer, so you need to hurry.
3. If you add a wrong answer or time runs out, you will lose a life. After three wrong answers, the game is over.
4. Then you can see the high scores, and your results. Here can you restart the game.

#### Features

- PWA Progressive Web App
- Dark mode
- Game saveing to the local storage
- Time is pausing if the window is inactive
- High scores saving to the local storage and to the server
- Funny username generating
- 98-100% Google [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Fmaskedquiz.com%2F)

## Development

### System requirements

- It is necessary to run the mongodb service

### Start dev server

```sh
npm run "maskedquiz start"
```

- add new name in package.json
- add new description in package.json
- add new short_name in run/public/manifest.json
- add new name in run/public/manifest.json
- add new description in run/public/manifest.json 
- add new theme_color and background_color in run/public/manifest.json
- add this color to the src/common/components/App/root.css --secondary-color variable  
- add new siteName in src/common/config.js
- draw your own logo  
- rewrite icon_192x192.png in run/public/assets
- rewrite icon_512x512.png in run/public/assets
- rewrite favicon.ico in src/server/images
- rewrite ogImage.jpg in src/server/images
- change logo svg path in src/common/components/Logo/index.js  
- create your own data in src/common/data/quizdata.js, the first answer is the right answer
- create your own background and mask images in src/common/data/images and src/common/data/masks
- change about text in src/common/components/About/index.js

Enjoy your own quiz game :)

### Build and run

```sh
npm run "maskedquiz build"
node run/server.js
```

## License

The data in the src/common/demo folder and images in the /src/server/images 
and Masked logo and icon and ogImage cannot be used.

The source code is licensed under MIT.
