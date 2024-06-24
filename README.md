# ChessGPT

## Table of contents
* [Introduction](#introduction)
* [How to play](#how-to-run-this-project)
* [Iterating on this project](#iterating-on-this-project)
  * [Chess Logic](#chess-logic)
  * [Front End Architecture](#front-end-architecture)
  * [Back End Architecture](#back-end-architecture)
  * [Testing](#testing)

## Introduction
Welcome to ChessGPT, a unique and immersive chess game that brings the ancient game of strategy to life with real-time commentary. This isn't just any chess game—it's a battlefield where every move is narrated from the perspective of the enemy king. 

Commentary is provided by the OpenAI API. Play in single player mode to wage war against King GPT, if you're brave enough try. Or you can play normal chess against your friends by selecting two player mode. In single player mode, you can adjust the difficulty by changing the engine depth. 

The engine I wrote has a maximum depth of four moves, two moves per player (any more than that and the calculation time starts to get unreasonable), so for all you chess wizes out there, it won't be difficult to beat, but it also won't make simple two move blunders. 

## How to play
This project is not (yet) deployed, so if you want to play, you'll have to clone this repo to your local machine. 
```bash
git clone https://github.com/SincereTuitt/ChessGPT.git
```

Then, install the project dependencies.
```bash
npm i
```

To use the chatbot, you'll need your own OpenAI API key. If you don't have one, you can still play the game, as I've provided a few pre-written scripts for the king to use when the API call fails. But if you want dynamic dialogue that responds to the current state of the game, then follow these instructions. Otherwise, skip these steps

1. Navigate to [this url](https://platform.openai.com/docs/overview) and purchase an API key.
2. Create a .env file in the root directory of the project and add this line of code 
```
CHAT_GPT_SECRET_KEY=[YOUR KEY GOES HERE]
```
That's all there is to setting up the OpenAI API. Next, add these lines to your .env file
```
PORT="3000"
NODE_ENV="development"
```

Next, you'll want to create the build folder, so run this command in your terminal.
```bash
npm run build:dev
```

Finally, once the build process is completed, run this command the terminal.
```bash
npm start
```
Navigate to [http://localhost:8080](http://localhost:8080), and you should be able to play!


## Iterating on this project
If you want to add features to this project to customize it and make it your own, read this for a basic overview of how everything works. Start by forking this repo and then following all of the steps in the "how to play" section except for the last command. Instead of npm start, run the command
```bash
npm run dev
```
This will start the dev server using webpack which enables hot module reloaing. 

### Chess Logic
The core business logic of the chess game itself is handled on the client side, in the directory src/client/chessLogic. legalMoves.ts handles calculating the legal moves of a given position, and engine.ts handles calculating the best engine move. If you want to iterate on these files, I highly reccommend continuing to use typescript, as there are a lot of moving pieces, and its very easy to confuse what type of variable should be used where. 

### Front end architecture
This project was created using React to build the user interface and [Redux tookit](https://redux-toolkit.js.org/introduction/getting-started) for global state management. The component hierarchy looks like this:

App\
├──Title\
├──GameContainer\
├────King\
├────Board\
├──────Row\
├────────Square\
├────SettingsContainer\
├──────ThemeContainer\
├────────ThemeOption\
├──────PlayModeContainer\
├────────PlayModeOption\
├──────PlayerColorContainer\
├────────PlayerColorOption\
├──────DepthContainer

Global state is split into two categories, settings state and board state. Settings state refers to everything that can be toggled in settings, and its managed in src/client/reducers/settingsReducer. Board state refers to the everything that affects the current state of the game, such as board configuration and current player, and its managed in src/client/reducers/boardReducer.

Each stylesheet is found in src/client/styles, and imported directly into the component that handles it.

Images are found in src/client/assets, and images for each of the chess pieces were combined into a single spritesheet to minimize network requests.

### Back end architecture
The back end of this project is pretty simple. In src/server, there are two files, server.js and gptController.js. The latter holds a middleware function with the business logic for communicating with the OpenAI API, and the former is a simple express server. There is a global error handler set up for debugging middleware and a 404 route handler for unknown endpoints.

### Testing
Each of the functions in the chessLogic folder has an associated suite of unit tests, created using [jest](https://jestjs.io/). The tests are found in src/client/chessLogic/tests, and can be run using the command 

```bash
npm test
```
Like the files they are testing, the tests are also written in typescript. These files are excluding from transpilation, so if you would like to add tests in javascript, remove the excludes array from tsconfig.json. 

I plan to continue iterating on the engine, so I also added a file in the tests subdirectory called engeineSpeeds.ts, which does a performance test on engine functions and logs the results to the console.

### Important features to add
* Promotion - The pawns don't change when they reach the back rank. This is the next feature I'll implement since it's kind of a really important one, so expect to see this pretty soon.
* Draw by three fold repetition 
* Draw by 50 move rule 
* Draw by lack of material 
* Draw by agreement 
* Forfeit 