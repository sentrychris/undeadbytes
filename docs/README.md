# Undead Bytes Developer Documentation

Undead Bytes is built with HTML5 Canvas, CSS and pure JS, it has one single dependency - [stats.js]().

Play the game [here](https://sentrychris.github.io/undeadbytes/play/).

## Table of Contents

* [Application Structure](#application-structure)
* [Development Setup](#development-setup)
* [How it Works](./full/README.md)
  * [Scene](./full/scene/README.md)
    * [Map](./full/scene/map.md)
    * [Camera](./full/scene/camera.md)
  * [Collision](./full/collision/README.md)
    * [Arc-box collision](./full/collision/arc-box-collision.md)
    * [Entity-to-player](./full/collision/entity-to-player.md)
    * [Entity-to-walls](./full/collision/entity-to-walls.md)
* [API Reference](./reference/index.html)

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
    npm run game:build
    ```

You should now have a working version of Undead Bytes output to your `dist/` folder.

### Serving through the browser

If you have [http-server]() installed, you can run the game on a local web sever by running `npm run game:serve:web` in your console.

### Testing the desktop app

If you want to test the electron-based desktop app, you can run `npm run game:serve:windows` for Windows or `npm run game:serve:linux` for Linux / MacOS.

### Building a standalone desktop app

If you want to build a standalone electron-based desktop app executable, you can run `npm run game:build:standalone`, this will output a standalone executable to `releases/${platform}/${arch}`.


### Building an installer
If you want to build an exe/pkg/deb installer for the electron-based desktop app, you can run `npm run game:build:installer`, this will output an installer to `releases/${platform}/${arch}`.