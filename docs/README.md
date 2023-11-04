# Undead Bytes Developer Documentation

Undead Bytes is built with HTML5 Canvas, CSS and pure JS, it has one single dependency - [stats.js]().

## Table of Contents

* [Application Structure](#application-structure)
* [Development Setup](#development-setup)
* [How it works](#how-it-works)
  * [Scene](./Scene/)
    * [Map](./Scene/map.md)
    * [Camera](./Scene/camera.md)
  * [Entities](./Entity/)
    * [Player](./Entity/player.md)
    * [Enemies](#commands)
    * [Pickup Items](#commands)
    * [Walls](#commands)
  * [Collision](./Collision/README.md)
  * [Rendering](#entity-rendering)
  * [Storage](#game-instancing)
  * [Events](#events)
  * [Game Instancing](#game-instancing)
    * [The Game Loop](#game-instancing)
      * [Update](#game-instancing)
      * [Render](#game-instancing)
    * [Starting/Stopping](#game-instancing)
    * [Starting/Stopping](#game-instancing)

## Application Structure

The application structure is as follows:

```sh
.
├── build                     # Electron app build resources
├── dist                      # Output folder for compiled game
├── docs                      # Reserved for Github
├── node_modules              # Reserved for NPM
├── releases                  # Output folder for compiled executables
├── src                       # Application source code
│   ├── app                   # Electron app and IPC code
│   ├── browser               # Game code
│   |   ├── css               # Styles
│   |   └── lib               # Game logic
│   |   |   ├── Audio         # Audio FX handling
│   |   |   ├── Ballistics    # Weapon and bullet handling
│   |   |   ├── Entity        # Game entities (player, enemies, walls, items etc.)
│   |   |   ├── Events        # Custom event dispatchers
│   |   |   ├── Levels        # Game levels
│   |   |   ├── Scene         # Canvas scene manager 
│   |   |   ├── Collision.js  # Entity collision logic
│   |   |   ├── Game.js       # Game instance and management logic
│   |   |   ├── Renderer.js   # Entity canvas rendering logic
│   |   |   └── Storage.js    # Storage handling for saved games and settings
│   |   ├── views             # Game view template
│   |   ├── config.js         # Game base configuration values
│   |   ├── index.js          # Game entry point
|   |   └── util.js           # Various utilities
│   ├── shared                # Shared resources
│   |   ├── assets            # Shared assets (images, audio etc.)
│   |   └── version.js        # Dynamically generated version file
│   ├── main.js               # Entry point for the electron app
│   └── preload.js            # Electron app preloader
├── LICENSE                   # The license file
├── package-lock.json         # Reserved for NPM
├── package.json              # NPM dependencies and project configuration
└── README.md                 # This file
└── webpack.config.js         # Build configuration
```

## Development Setup

To get started, follow these simple steps.

1. Clone the repository:
    ```sh
    git clone git@github.com:sentrychris/undeadbytes.git
    ```

2. Install the build dependencies:
    ```sh
    npm install
    ```

3. Build the game:
    ```sh
    npm run build:game
    ```

You should now have a working version of Undead Bytes output to your `dist/` folder.

If you have [http-server]() installed, you can run the game on a local web sever by running `npm run web` in your console.

If you want to test the electron-based desktop app, you can run `npm run windows` for Windows or `npm run linux` for Linux / MacOS.