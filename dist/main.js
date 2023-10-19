/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Bullet/Bullet.js":
/*!******************************!*\
  !*** ./src/Bullet/Bullet.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Bullet: () => (/* binding */ Bullet)\n/* harmony export */ });\n/* harmony import */ var _Entity_EntityHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Entity/EntityHelper */ \"./src/Entity/EntityHelper.js\");\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config */ \"./src/config.js\");\n\n\n\nclass Bullet\n{\n  constructor(context, player, i) {\n    this.vectorX = Math.cos(player.angle + 90 * Math.PI / 180 + i * 5 * Math.PI / 180);\n    this.vectorY = Math.sin(player.angle + 90 * Math.PI / 180 + i * 5 * Math.PI / 180);\n    this.x = player.x + this.vectorX * _config__WEBPACK_IMPORTED_MODULE_1__.config.radius * 1.5;\n    this.y = player.y + this.vectorY * _config__WEBPACK_IMPORTED_MODULE_1__.config.radius * 1.5;\n\n    this.radius = 5;\n    this.bounds = {\n      x: this.x - this.radius,\n      y: this.y - this.radius,\n      width: this.radius * 2,\n      height: this.radius * 2\n    };\n  \n    this.context = context\n    this.frames = 0;\n    this.markToDelete = false;\n  }\n\n  update (walls) {\n    this.x += this.vectorX * 25;\n    this.y += this.vectorY * 25;\n\n    this.bounds.x = this.x - this.radius;\n    this.bounds.y = this.y - this.radius;\n\n    this.frames++;\n\n    if (this.frames > 15) {\n      this.markToDelete = true;\n    }\n\n    for (let i = 0; i < walls.length; i++) {\n      const wall = walls[i];\n      if (_Entity_EntityHelper__WEBPACK_IMPORTED_MODULE_0__.EntityHelper.intersection(wall.bounds, this.bounds)) {\n        this.markToDelete = true;\n      }\n    }\n\n  };\n\n  render () {\n    this.context.beginPath();\n    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);\n    this.context.fillStyle = '#F8CA00';\n    this.context.fill();\n  };\n};\n\n//# sourceURL=webpack://squareshoot/./src/Bullet/Bullet.js?");

/***/ }),

/***/ "./src/Bullet/BulletFactory.js":
/*!*************************************!*\
  !*** ./src/Bullet/BulletFactory.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   BulletFactory: () => (/* binding */ BulletFactory)\n/* harmony export */ });\n/* harmony import */ var _Bullet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Bullet */ \"./src/Bullet/Bullet.js\");\n/* harmony import */ var _mappings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mappings */ \"./src/Bullet/mappings.js\");\n\n\n\nclass BulletFactory {\n  constructor() {\n    this.equippedWeapon = 0;\n    this.autofire = true;\n    this.frames = 0;\n    this.bullets = [];\n    this.indexesToDelete = [];\n  }\n\n  update (context, player, walls, mouse, weaponIndex = 0) {\n    const weapon = _mappings__WEBPACK_IMPORTED_MODULE_1__.mappings[weaponIndex];\n    console.log(weaponIndex, { weapon })\n\n    if (this.autofire && !player.dead) {\n      if (mouse.pressed) {\n        // TODO i min/max should depend on equipped weapon\n        //   e.g. shotgun has large spread, so min: -3, max: 3\n        //        pistol has no spread, so min: 0, max: 0\n        //        machine gun has some spread, so min: -1, max: 0\n        //        \n        for (let i = weapon.min; i <= weapon.max; i++) {\n          const bullet = new _Bullet__WEBPACK_IMPORTED_MODULE_0__.Bullet(context, player, i);\n          this.bullets.push(bullet);\n        }\n\n        // TODO set flag for continuous fire from autos\n        this.autofire = weapon.autofire;\n      }\n    } else {\n      this.frames++;\n      if (this.frames >= 60) {\n        this.frames = 0;\n        this.autofire = true;\n      }\n    }\n\n    this.indexesToDelete = [];\n    for (let i = 0; i < this.bullets.length; i++) {\n      this.bullets[i].update(walls);\n      if (this.bullets[i].markToDelete) {\n        this.indexesToDelete.push(i);\n      }\n    }\n\n    for (let i = 0; i < this.indexesToDelete.length; i++) {\n      this.bullets.splice(this.indexesToDelete[i], 1);\n    }\n  }\n\n  switchWeapon(weaponIndex = 0) {\n    console.log({ weaponIndex })\n    this.eqippedWeapon = weaponIndex;\n  }\n\n  render () {\n    for (let i = 0; i < this.bullets.length; i++) {\n      this.bullets[i].render();\n    }\n  }\n}\n\n//# sourceURL=webpack://squareshoot/./src/Bullet/BulletFactory.js?");

/***/ }),

/***/ "./src/Bullet/mappings.js":
/*!********************************!*\
  !*** ./src/Bullet/mappings.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   mappings: () => (/* binding */ mappings)\n/* harmony export */ });\n/**\n * Weapons mapping for the bullet factory.\n * \n * Weapons are mapped by array index to hotkey.\n * \n * name - Name of the weapon to display\n * min/max - The weapon's fire spread\n * dps - The weapon's damage per second\n * autofire - The weapon has automatic fire \n */\nconst mappings = [\n  {\n    name: 'pistol',\n    min: 0,\n    max: 0,\n    dps: 25,\n    autofire: false\n  },\n  {\n    name: 'shotgun',\n    min: -3,\n    max: 3,\n    dps: 30,\n    autofire: false\n  },\n  {\n    name: 'machine-gun',\n    min: 0,\n    max: 0,\n    dps: 20,\n    autofire: true\n  },\n  {\n    name: 'flamethrower',\n    min: -5,\n    max: 5,\n    dps: 10,\n    autofire: true\n  }\n];\n\n//# sourceURL=webpack://squareshoot/./src/Bullet/mappings.js?");

/***/ }),

/***/ "./src/Enemy.js":
/*!**********************!*\
  !*** ./src/Enemy.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Enemy: () => (/* binding */ Enemy)\n/* harmony export */ });\n/* harmony import */ var _Entity_EntityCollision__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Entity/EntityCollision */ \"./src/Entity/EntityCollision.js\");\n/* harmony import */ var _Entity_EntityHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Entity/EntityHelper */ \"./src/Entity/EntityHelper.js\");\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config */ \"./src/config.js\");\n\n\n\n\nclass Enemy\n{\n  constructor (spawn) {\n    this.type = 'enemy';\n    this.bounding = 'arc';\n    this.x = spawn.x * _config__WEBPACK_IMPORTED_MODULE_2__.config.size;\n    this.y = spawn.y * _config__WEBPACK_IMPORTED_MODULE_2__.config.size;\n    this.angle = 0;\n    this.position = 0;\n    this.incrementer = 0;\n    this.speed = 3;\n    \n    this.sleep = true;\n    \n    this.pushAlongVelocity = {\n      x: 0,\n      y: 0\n    };\n    this.pushBulletVelocity = {\n      x: 0,\n      y: 0\n    };\n    this.canBePushedByBullet = true;\n    this.lastVectorX = 0;\n    this.lastVectorY = 0;\n\n    this.health = 100;\n    this.dead = false;\n  }\n\n  pushAlong (vectorX, vectorY) {\n    this.pushAlongVelocity.x = vectorX * 10;\n    this.pushAlongVelocity.y = vectorY * 10;\n  }\n\n  pushByBullet (bullet) {\n    if (this.canBePushedByBullet) {\n      this.pushBulletVelocity.x = bullet.vectorX * 15;\n      this.pushBulletVelocity.y = bullet.vectorY * 15;\n      this.canBePushedByBullet = false;\n  \n      this.health -= 25;\n      this.health = this.health < 0 ? 0 : this.health;\n  \n      if (this.health == 0) {\n        // debug\n        this.dead = true;\n      }\n    }\n  }\n\n  update (context, player, enemies, walls, bulletManager, camera, keyboard, mouse) {\n    if (this.sleep || this.dead) {\n      return;\n    }\n\n    let vectorX = player.x - this.x;\n    let vectorY = player.y - this.y;\n\n    if (player.dead) {\n      vectorX = this.lastVectorX;\n      vectorY = this.lastVectorY;\n    } else {\n      this.lastVectorX = vectorX;\n      this.lastVectorY = vectorY;\n    }\n\n    let length = Math.sqrt(vectorX * vectorX + vectorY * vectorY);\n\n    if (length > 0) {\n      vectorX /= length;\n      vectorY /= length;\n\n      if (length < 800) {\n        this.angle = Math.atan2(vectorY, vectorX) - 90 * Math.PI / 180;\n        this.x += vectorX * this.speed;\n        this.y += vectorY * this.speed;\n\n        // collision\n        const collisionVector = _Entity_EntityCollision__WEBPACK_IMPORTED_MODULE_0__.EntityCollision.vector(this.x, this.y, walls);\n        this.x += collisionVector.x * this.speed;\n        this.y += collisionVector.y * this.speed;\n\n        this.incrementer += this.speed;\n        this.position = Math.sin(this.incrementer * Math.PI / 180);\n\n        if (length < 100) {\n          player.takeDamage(this);\n        }\n      }\n    }\n\n    // enemy collision\n    if (Math.random() <= 0.1) {\n      for (let i = 0; i < enemies.length; i++) {\n        const enemy = enemies[i];\n  \n        if (enemy != this) {\n          vectorX = enemy.x - this.x;\n          vectorY = enemy.y - this.y;\n  \n          length = Math.sqrt(vectorX * vectorX + vectorY * vectorY);\n\n          if (length != 0 && length < 100) {\n\n            vectorX /= length;\n            vectorY /= length;\n\n            enemy.pushAlong(vectorX, vectorY);\n          } \n        }\n      }\n    }\n\n    // push along velocity\n    this.pushAlongVelocity.x *= 0.9;\n    this.pushAlongVelocity.y *= 0.9;\n    \n    this.x += this.pushAlongVelocity.x;\n    this.y += this.pushAlongVelocity.y;\n\n    // bullet collision\n    const bounds = {\n      x: this.x - _config__WEBPACK_IMPORTED_MODULE_2__.config.radius,\n      y: this.y - _config__WEBPACK_IMPORTED_MODULE_2__.config.radius,\n      width: _config__WEBPACK_IMPORTED_MODULE_2__.config.radius * 2,\n      height: _config__WEBPACK_IMPORTED_MODULE_2__.config.radius * 2\n    };\n\n    for (let i = 0; i < bulletManager.bullets.length; i++) {\n      const bullet = bulletManager.bullets[i];\n\n      if (_Entity_EntityHelper__WEBPACK_IMPORTED_MODULE_1__.EntityHelper.intersection(bounds, bullet.bounds)) {\n        bullet.markToDelete = true;\n        this.pushByBullet(bullet);\n      }\n    }\n\n    // push bullet velocity\n    this.pushBulletVelocity.x *= 0.9;\n    this.pushBulletVelocity.y *= 0.9;\n    \n    this.x += this.pushBulletVelocity.x;\n    this.y += this.pushBulletVelocity.y;\n\n    if (Math.abs(this.pushBulletVelocity.x) < 0.5 && Math.abs(this.pushBulletVelocity.y) < 0.5) {\n      this.canBePushedByBullet = true;\n      this.pushBulletVelocity.x = 0;\n      this.pushBulletVelocity.y = 0;\n    }\n  }\n\n  render (context) {\n    if (this.sleep) {\n      return;\n    }\n\n    _Entity_EntityHelper__WEBPACK_IMPORTED_MODULE_1__.EntityHelper.render(context, this);\n  };\n};\n\n\n//# sourceURL=webpack://squareshoot/./src/Enemy.js?");

/***/ }),

/***/ "./src/Entity/EntityCollision.js":
/*!***************************************!*\
  !*** ./src/Entity/EntityCollision.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   EntityCollision: () => (/* binding */ EntityCollision),\n/* harmony export */   _EntityCollision: () => (/* binding */ _EntityCollision)\n/* harmony export */ });\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ \"./src/config.js\");\n\n\nclass _EntityCollision\n{\n  /**\n   * Caclulate collision beween entity (arc) and wall (box)\n   * \n   * @param {*} param0 \n   * @returns \n   */\n  arcWallVector({ arcX, arcY, radius, wallX, wallY, size }) {\n    const distX = Math.abs(arcX - wallX - size / 2);\n    const distY = Math.abs(arcY - wallY - size / 2);\n  \n    if (distX > (size / 2 + radius)) {\n      return false;\n    }\n\n    if (distY > (size / 2 + radius)) {\n      return false;\n    }\n  \n    if (distX <= (size / 2)) {\n      return true;\n    }\n\n    if (distY <= (size / 2)) {\n      return true;\n    }\n  \n    const dX = distX - size / 2;\n    const dY = distY - size / 2;\n  \n    return (dX * dX + dY * dY <= (radius * radius));\n  }\n\n  /**\n   * Calculate collision vectors\n   * \n   * @param {*} x \n   * @param {*} y \n   * @param {*} walls \n   * @returns \n   */\n  vector(x, y, walls) {\n    const result = {\n      x: 0,\n      y: 0\n    };\n\n    for (let i = 0; i < walls.length; i++) {\n      const wall = walls[i];\n  \n      if (this.arcWallVector({\n        arcX: x,\n        arcY: y,\n        radius: 60,\n        wallX: wall.x,\n        wallY: wall.y,\n        size: _config__WEBPACK_IMPORTED_MODULE_0__.config.size\n      })) {\n        const wallCenterX = wall.x + _config__WEBPACK_IMPORTED_MODULE_0__.config.size / 2;\n        const wallCenterY = wall.y + _config__WEBPACK_IMPORTED_MODULE_0__.config.size / 2;\n  \n        let vectorX = x - wallCenterX;\n        let vectorY = y - wallCenterY;\n  \n        const length = Math.sqrt(vectorX * vectorX + vectorY * vectorY);\n  \n        if (length > 0) {\n          vectorX /= length;\n          vectorY /= length;\n  \n          result.x += vectorX;\n          result.y += vectorY;\n        }\n      }\n    }\n  \n    return result;\n  }\n}\n\nconst EntityCollision = new _EntityCollision();\n\n//# sourceURL=webpack://squareshoot/./src/Entity/EntityCollision.js?");

/***/ }),

/***/ "./src/Entity/EntityDrawer.js":
/*!************************************!*\
  !*** ./src/Entity/EntityDrawer.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   EntityDrawer: () => (/* binding */ EntityDrawer),\n/* harmony export */   _EntityDrawer: () => (/* binding */ _EntityDrawer)\n/* harmony export */ });\nclass _EntityDrawer\n{\n  /**\n   * Draw player\n   * \n   * @param {*} context \n   * @param {*} position \n   */\n  player (context, position) {\n    // left foot\n    context.beginPath();\n    context.rect(20, -20 + (position * 35), 25, 40);\n    context.fillStyle = '#D95B43';\n    context.fill();\n\n    // right foot\n    context.beginPath();\n    context.rect(-40, -20 + (position * -35), 25, 40);\n    context.fillStyle = '#D95B43';\n    context.fill();\n\n    // left hand\n    context.rotate(30 * Math.PI / 180);\n    context.beginPath();\n    context.rect(40, -10, 20, 80);\n    context.fillStyle = '#C02942';\n    context.fill();\n    context.rotate(-30 * Math.PI / 180);\n\n    // right hand\n    context.rotate(-50 * Math.PI / 180);\n    context.beginPath();\n    context.rect(-55, -20, 20, 45);\n    context.fillStyle = '#C02942';\n    context.fill();\n    context.rotate(50 * Math.PI / 180);\n\n    // torso\n    context.beginPath();\n    context.rect(-60, - 30, 120, 60);\n    context.fillStyle = '#53777A';\n    context.fill();\n\n    // gun\n    context.beginPath();\n    context.rect(-12.5, 30, 25, 70);\n    context.fillStyle = 'gray';\n    context.fill();\n\n    // head\n    context.beginPath();\n    context.arc(0, 0, 40, 0, 2 * Math.PI);\n    context.fillStyle = '#F1D4AF';\n    context.fill();\n\n    // hair\n    context.rotate(-180 * Math.PI / 180);\n    context.beginPath();\n    context.arc(0, 0, 37, 0, 180 * Math.PI / 180);\n    context.fillStyle = '#4d2600';\n    context.fill();\n    context.rotate(180 * Math.PI / 180);\n  }\n\n  /**\n   * Draw dead player\n   * \n   * @param {*} context \n   */\n  deadPlayer (context) {\n    // left foot\n    context.beginPath();\n    context.rect(30, 20, 25, 40);\n    context.fillStyle = '#D95B43';\n    context.fill();\n\n    // right foot\n    context.beginPath();\n    context.rect(-25, -30 -35, 25, 40);\n    context.fillStyle = '#D95B43';\n    context.fill();\n\n    // left hand\n    context.rotate(25 * Math.PI / 180);\n    context.beginPath();\n    context.rect(40, -5, 20, 80);\n    context.fillStyle = '#C02942';\n    context.fill();\n    context.rotate(-25 * Math.PI / 180);\n\n    // right hand\n    context.rotate(-60 * Math.PI / 180);\n    context.beginPath();\n    context.rect(-40, 20, 20, 45);\n    context.fillStyle = '#C02942';\n    context.fill();\n    context.rotate(60 * Math.PI / 180);\n\n    // torso\n    context.beginPath();\n    context.rect(-60, - 30, 120, 60);\n    context.fillStyle = '#53777A';\n    context.fill();\n\n    // gun\n    // context.beginPath();\n    // context.rect(-12.5, 40, 25, 70);\n    // context.fillStyle = 'gray';\n    // context.fill();\n\n    // head\n    context.beginPath();\n    context.arc(20, 10, 35, 0, 2 * Math.PI);\n    context.fillStyle = '#F1D4AF';\n    context.fill();\n\n    // hair\n    context.rotate(-170 * Math.PI / 180);\n    context.beginPath();\n    context.arc(0, 0, 32, 0, 180 * Math.PI / 180);\n    context.fillStyle = '#4d2600';\n    context.fill();\n    context.rotate(170 * Math.PI / 180);\n  }\n\n  /**\n   * Draw enemy\n   * \n   * @param {*} context \n   * @param {*} position \n   */\n  enemy (context, position) {\n    // left foot\n    context.beginPath();\n    context.rect(20, -20 + (position * 35), 25, 40);\n    context.fillStyle = '#79BD9A';\n    context.fill();\n\n    // right foot\n    context.beginPath();\n    context.rect(-40, -20 + (position * -35), 25, 40);\n    context.fillStyle = '#79BD9A';\n    context.fill();\n\n    // left hand\n    context.beginPath();\n    context.rect(-50, -10, 20, 90);\n    context.fillStyle = '#3B8686';\n    context.fill();\n\n    // right hand\n    context.beginPath();\n    context.rect(30, -10, 20, 85);\n    context.fillStyle = '#3B8686';\n    context.fill();\n\n    // torso\n    context.beginPath();\n    context.rect(-60, - 30, 120, 60);\n    context.fillStyle = '#0B486B';\n    context.fill();\n\n    // head\n    context.beginPath();\n    context.arc(0, 0, 40, 0, 2 * Math.PI);\n    context.fillStyle = '#CFF09E';\n    context.fill();\n\n    // hair\n    context.rotate(-180 * Math.PI / 180);\n    context.beginPath();\n    context.arc(0, 0, 37, 0, 180 * Math.PI / 180);\n    context.fillStyle = '#4d2600';\n    context.fill();\n    context.rotate(180 * Math.PI / 180);\n  }\n\n  /**\n   * Draw dead enemy\n   * \n   * @param {*} context \n   */\n  deadEnemy (context) {\n    // left foot\n    context.beginPath();\n    context.rect(52, -30, 25, 40);\n    context.fillStyle = '#79BD9A';\n    context.fill();\n\n    // right foot\n    context.beginPath();\n    context.rect(26, -40, 25, 40);\n    context.fillStyle = '#79BD9A';\n    context.fill();\n\n    // left hand\n    context.beginPath();\n    context.rect(-25, 35, 20, 90);\n    context.fillStyle = '#3B8686';\n    context.fill();\n\n    // right hand\n    context.beginPath();\n    context.rect(35, -40, 20, 85);\n    context.fillStyle = '#3B8686';\n    context.fill();\n\n    // torso\n    context.beginPath();\n    context.rect(-42, -20, 120, 60);\n    context.fillStyle = '#0B486B';\n    context.fill();\n\n    // head\n    context.beginPath();\n    context.arc(10, 5, 35, 0, 2 * Math.PI);\n    context.fillStyle = '#CFF09E';\n    context.fill();\n\n    // hair\n    context.rotate(-170 * Math.PI / 180);\n    context.beginPath();\n    context.arc(0, 0, 25, 0, 180 * Math.PI / 180);\n    context.fillStyle = '#4d2600';\n    context.fill();\n    context.rotate(170 * Math.PI / 180);\n  }\n\n  /**\n   * Draw health\n   * \n   * @param {*} context \n   * @param {*} health \n   * @param {*} centerX \n   * @param {*} centerY \n   */\n  health(context, health, centerX, centerY) {\n    context.beginPath();\n    context.rect(centerX - 50, centerY + 60, 100, 5);\n    context.strokeStyle = 'black';\n    context.stroke();\n\n    let color; \n    if (health <= 35) {\n      color = 'red';\n    } else if (health <= 75) {\n      color = 'orange';\n    } else {\n      color = 'lime';\n    }\n\n    context.beginPath();\n    context.rect(centerX - 50, centerY + 60, health, 5);\n    context.fillStyle = color;\n    context.fill();\n  }\n}\n\nconst EntityDrawer = new _EntityDrawer();\n\n\n//# sourceURL=webpack://squareshoot/./src/Entity/EntityDrawer.js?");

/***/ }),

/***/ "./src/Entity/EntityHelper.js":
/*!************************************!*\
  !*** ./src/Entity/EntityHelper.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   EntityHelper: () => (/* binding */ EntityHelper),\n/* harmony export */   _EntityHelper: () => (/* binding */ _EntityHelper)\n/* harmony export */ });\n/* harmony import */ var _EntityDrawer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EntityDrawer */ \"./src/Entity/EntityDrawer.js\");\n\n\nclass _EntityHelper\n{\n  /**\n   * Determine intersection between entities\n   * \n   * @param {*} r1 \n   * @param {*} r2 \n   * @returns \n   */\n  intersection (r1, r2) {\n    return ! (r1.x + r1.width < r2.x\n      || r1.y + r1.height < r2.y\n      || r1.x > r2.x + r2.width\n      || r1.y > r2.y + r2.height\n    );\n  }\n\n  /**\n   * Begin rotating entity to given angle at position\n   * \n   * @param {*} context \n   * @param {*} x \n   * @param {*} y \n   * @param {*} angle \n   */\n  beginRotationOffset(context, x, y, angle) {\n    context.translate(-(-x + context.canvas.width / 2), -(-y + context.canvas.height / 2));\n    context.translate(context.canvas.width / 2, context.canvas.height / 2);\n\n    context.rotate(angle);\n  }\n\n  /**\n   * Stop rotating entity to given angle at position\n   * \n   * @param {*} context \n   * @param {*} x \n   * @param {*} y \n   * @param {*} angle \n   */\n  endRotationOffset(context, x, y, angle) {\n    context.rotate(-angle);\n\n    context.translate(-context.canvas.width / 2, -context.canvas.height / 2);\n    context.translate(+(-x + context.canvas.width / 2), +(-y + context.canvas.height / 2));\n  }\n\n  /**\n   * Render the entity\n   * \n   * @param {*} context \n   * @param {*} entity \n   */\n  render (context, entity) {\n    this.beginRotationOffset(context, entity.x, entity.y, entity.angle);\n\n    if (! entity.dead) {\n      entity.type === 'enemy'\n        ? _EntityDrawer__WEBPACK_IMPORTED_MODULE_0__.EntityDrawer.enemy(context, entity.position)\n        : _EntityDrawer__WEBPACK_IMPORTED_MODULE_0__.EntityDrawer.player(context, entity.position);\n    } else {\n      entity.type === 'enemy'\n        ? _EntityDrawer__WEBPACK_IMPORTED_MODULE_0__.EntityDrawer.deadEnemy(context)\n        : _EntityDrawer__WEBPACK_IMPORTED_MODULE_0__.EntityDrawer.deadPlayer(context);\n    }\n    \n    this.endRotationOffset(context, entity.x, entity.y, entity.angle);\n    _EntityDrawer__WEBPACK_IMPORTED_MODULE_0__.EntityDrawer.health(context, entity.health, entity.x, entity.y);\n  }\n}\n\nconst EntityHelper = new _EntityHelper();\n\n\n//# sourceURL=webpack://squareshoot/./src/Entity/EntityHelper.js?");

/***/ }),

/***/ "./src/Player.js":
/*!***********************!*\
  !*** ./src/Player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Player: () => (/* binding */ Player)\n/* harmony export */ });\n/* harmony import */ var _Entity_EntityCollision__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Entity/EntityCollision */ \"./src/Entity/EntityCollision.js\");\n/* harmony import */ var _Entity_EntityHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Entity/EntityHelper */ \"./src/Entity/EntityHelper.js\");\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config */ \"./src/config.js\");\n\n\n\n\n\nclass Player\n{\n  constructor (spawn, gameover) {\n    this.type = 'player';\n    this.bounding = 'arc';\n    this.x = spawn.x * _config__WEBPACK_IMPORTED_MODULE_2__.config.size;\n    this.y = spawn.y * _config__WEBPACK_IMPORTED_MODULE_2__.config.size;\n    this.angle = 0;\n    this.position = 0;\n    this.incrementer = 0;\n    this.speed = 5;\n    \n    this.sleep = true;\n    \n    this.invincible = false;\n    this.health = 100;\n    \n    this.damage = {\n      x: 0,\n      y: 0\n    };\n    this.dead = false;\n    this.gameover = gameover;\n  }\n\n  takeDamage (enemy) {\n    if (! this.invincible) {\n      const vectorX = this.x - enemy.x;\n      const vectorY = this.y - enemy.y;\n      const length = Math.sqrt(vectorX * vectorX + vectorY * vectorY);\n\n      if (length > 0) {\n        this.damage.x = vectorX / length * 20;\n        this.damage.y = vectorY / length * 20;\n        this.invincible = true;\n        \n        this.health -= 25; // TODO difficulty setting and power-ups\n        this.health = this.health < 0 ? 0 : this.health;\n\n        if (this.health == 0) {\n          this.dead = true;\n\n          setTimeout(() => {\n            this.gameover.style.display = 'block';\n          }, 1000);\n        }\n      }\n    }\n  }\n\n  update (context, player, enemies, walls, bulletManager, camera, keyboard, mouse) {\n    if (this.sleep || this.dead) {\n      return;\n    }\n\n    let count = 0;\n    count += keyboard.up ? 1 : 0;\n    count += keyboard.down ? 1 : 0;\n    count += keyboard.left ? 1 : 0;\n    count += keyboard.right ? 1 : 0;\n\n    let currentSpeed = this.speed;\n\n    if (count > 1) {\n      currentSpeed /= Math.sqrt(2);\n    }\n\n    // keyboard\n    if (Math.abs(this.damage.x) != 0 < Math.abs(this.damage.y) != 0) {\n      this.damage.x *= 0.9;\n      this.damage.y *= 0.9;\n\n      this.x += this.damage.x;\n      this.y += this.damage.y;\n\n      if (Math.abs(this.damage.x) < 0.5 && Math.abs(this.damage.y) < 0.5) {\n        this.damage = {\n          x: 0,\n          y: 0\n        };\n\n        this.invincible = false;\n      }\n    } else {\n      if (keyboard.up) this.y -= currentSpeed;\n      if (keyboard.down) this.y += currentSpeed;\n      if (keyboard.left) this.x -= currentSpeed;\n      if (keyboard.right) this.x += currentSpeed;\n    }\n\n    // collision\n    const collisionVector = _Entity_EntityCollision__WEBPACK_IMPORTED_MODULE_0__.EntityCollision.vector(this.x, this.y, walls);\n    this.x += collisionVector.x * currentSpeed;\n    this.y += collisionVector.y * currentSpeed;\n\n    // mouse\n    let vectorX = camera.offsetX + context.canvas.width / 2 - mouse.x;\n    let vectorY = camera.offsetY + context.canvas.height / 2 - mouse.y;\n\n    const length = Math.sqrt(vectorX * vectorX + vectorY * vectorY);\n\n    if (length > 0) {\n      vectorX /= length;\n      vectorY /= length;\n\n      this.angle = Math.atan2(vectorY, vectorX) + 90 * Math.PI / 180;\n    }\n\n    // foot\n    if (keyboard.up || keyboard.down || keyboard.left || keyboard.right) {\n      this.incrementer += this.speed;\n    }\n\n    this.position = Math.sin(this.incrementer * Math.PI / 180);\n  };\n\n  render (context) {\n    if (this.sleep) {\n      return;\n    }\n\n    _Entity_EntityHelper__WEBPACK_IMPORTED_MODULE_1__.EntityHelper.render(context, this);\n  };\n};\n\n\n//# sourceURL=webpack://squareshoot/./src/Player.js?");

/***/ }),

/***/ "./src/Scene/Camera.js":
/*!*****************************!*\
  !*** ./src/Scene/Camera.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Camera: () => (/* binding */ Camera)\n/* harmony export */ });\n/* harmony import */ var _Entity_EntityHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Entity/EntityHelper */ \"./src/Entity/EntityHelper.js\");\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config */ \"./src/config.js\");\n\n\n\nclass Camera\n{\n  constructor(context, frames = 0) {\n    this.x = 0;\n    this.y = 0;\n    this.offsetX = 0;\n    this.offsetY = 0;\n\n    this.context = context\n    this.frames = frames;\n  }\n\n  update (player, entities) {\n    this.frames++;\n    if (this.frames >= 15) {\n      this.frames = 0;\n\n      const screen = {\n        x: player.x - this.offsetX - this.context.canvas.width / 2 - this.size,\n        y: player.y - this.offsetY - this.context.canvas.height / 2 - this.size,\n        width: this.context.canvas.width + this.size * 2,\n        height: this.context.canvas.height + this.size * 2\n      };\n\n      for (let i = 0; i < entities.length; i++) {\n        const entity = entities[i];\n        const bounds = {};\n\n        if (entity.bounding === 'arc') {\n          bounds.x = entity.x - _config__WEBPACK_IMPORTED_MODULE_1__.config.radius;\n          bounds.y = entity.y - _config__WEBPACK_IMPORTED_MODULE_1__.config.radius;\n          bounds.width = _config__WEBPACK_IMPORTED_MODULE_1__.config.radius * 2;\n          bounds.height = _config__WEBPACK_IMPORTED_MODULE_1__.config.radius * 2;\n        } else if (entity.bounding === 'box') {\n          bounds.x = entity.x;\n          bounds.y = entity.y;\n          bounds.width = _config__WEBPACK_IMPORTED_MODULE_1__.config.size;\n          bounds.height = _config__WEBPACK_IMPORTED_MODULE_1__.config.size;\n        }\n        entity.sleep = ! _Entity_EntityHelper__WEBPACK_IMPORTED_MODULE_0__.EntityHelper.intersection(bounds, screen);\n      }\n    }\n  }\n\n  resize() {}\n\n  preRender (player) {\n    const targetX = -player.x + this.context.canvas.width / 2;\n    const targetY = -player.y + this.context.canvas.height / 2;\n\n    const vectorX = targetX - this.x;\n    const vectorY = targetY - this.y;\n\n    this.offsetX = this.x - targetX;\n    this.offsetY = this.y - targetY;\n\n    this.x += vectorX / 10;\n    this.y += vectorY / 10;\n\n    this.context.save();\n    this.context.translate(this.x, this.y);\n  }\n\n  postRender () {\n    this.context.restore();\n  }\n};\n\n//# sourceURL=webpack://squareshoot/./src/Scene/Camera.js?");

/***/ }),

/***/ "./src/Scene/Levels/LevelOne.js":
/*!**************************************!*\
  !*** ./src/Scene/Levels/LevelOne.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   LevelOne: () => (/* binding */ LevelOne)\n/* harmony export */ });\nconst LevelOne = [\n  'W W W W W W W W W W W W W W W W W W W W',\n  'W       W                             W',\n  'W   E   W           E           E     W',\n  'W   E   W                             W',\n  'W       W           E     W W W W W W W',\n  'W     W W                             W',\n  'W                   E                 W',\n  'W         E E                   E     W',\n  'W                                     W',\n  'W W W W W W W W W W W W W W           W',\n  'W                         W           W',\n  'W     E     E             W     E     W',\n  'W                   E     W           W',\n  'W W W W W W W             W           W',\n  'W                         W     E     W',\n  'W               W W W W W W           W',\n  'W   P                     W           W',\n  'W                   E                 W',\n  'W         W W W                   E   W',\n  'W           W       E                 W',\n  'W W W W W W W W W W W W W W W W W W W W'\n];\n\n//# sourceURL=webpack://squareshoot/./src/Scene/Levels/LevelOne.js?");

/***/ }),

/***/ "./src/Scene/Levels/LevelThree.js":
/*!****************************************!*\
  !*** ./src/Scene/Levels/LevelThree.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   LevelThree: () => (/* binding */ LevelThree)\n/* harmony export */ });\n\nconst LevelThree = [\n  'W W W W W W W W W W W W W W W W W W W W',\n  'W         W                           W',\n  'W   E     W              E  E  E      W',\n  'W         W    E                      W',\n  'W                     W         W     W',\n  'W                     W      E  W     W',\n  'W      E   W W W   W W W        W     W',\n  'W                     W         W     W',\n  'W                     W         W     W',\n  'W W W W W W     W W W W W W     W     W',\n  'W                         W           W',\n  'W     E     E             W     E     W',\n  'W                   E     W           W',\n  'W W W W W W W             W           W',\n  'W       W                 W     E     W',\n  'W       W   E     W W W W W W         W',\n  'W   P   W                             W',\n  'W                   E                 W',\n  'W         W W W                   E   W',\n  'W           W       E                 W',\n  'W W W W W W W W W W W W W W W W W W W W'\n];\n\n//# sourceURL=webpack://squareshoot/./src/Scene/Levels/LevelThree.js?");

/***/ }),

/***/ "./src/Scene/Levels/LevelTwo.js":
/*!**************************************!*\
  !*** ./src/Scene/Levels/LevelTwo.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   LevelTwo: () => (/* binding */ LevelTwo)\n/* harmony export */ });\nconst LevelTwo = [\n  'W W W W W W W W W W W W W W W W W W W W',\n  'W       W                       W     W',\n  'W   E   W           E           E     W',\n  'W       W  E                          W',\n  'W       W          E          W W W W W',\n  'W               W         W           W',\n  'W               W   E                 W',\n  'W         E E   W               E     W',\n  'W               W                     W',\n  'W W W W     W W W W W W W W     W   E W',\n  'W                         W           W',\n  'W     E     E             W     E     W',\n  'W                   E     W           W',\n  'W W W W W W W             W           W',\n  'W       W                 W           W',\n  'W       W  E          W W W W     W W W',\n  'W   P   W                 W           W',\n  'W                   E                 W',\n  'W         W W W                   E   W',\n  'W           W       E                 W',\n  'W W W W W W W W W W W W W W W W W W W W'\n];\n\n//# sourceURL=webpack://squareshoot/./src/Scene/Levels/LevelTwo.js?");

/***/ }),

/***/ "./src/Scene/Map.js":
/*!**************************!*\
  !*** ./src/Scene/Map.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Map: () => (/* binding */ Map)\n/* harmony export */ });\n/* harmony import */ var _Levels_LevelOne__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Levels/LevelOne */ \"./src/Scene/Levels/LevelOne.js\");\n/* harmony import */ var _Levels_LevelTwo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Levels/LevelTwo */ \"./src/Scene/Levels/LevelTwo.js\");\n/* harmony import */ var _Levels_LevelThree__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Levels/LevelThree */ \"./src/Scene/Levels/LevelThree.js\");\n\n\n\n\nconst levels = [_Levels_LevelOne__WEBPACK_IMPORTED_MODULE_0__.LevelOne, _Levels_LevelTwo__WEBPACK_IMPORTED_MODULE_1__.LevelTwo, _Levels_LevelThree__WEBPACK_IMPORTED_MODULE_2__.LevelThree];\n\nclass Map\n{\n  constructor() {\n    this.playerPosition = {\n      x: 0,\n      y: 0\n    };\n    this.enemyPositions = [];\n    this.wallPositions = [];\n  }\n\n  generate (levelIndex = 1) {\n    const level = levels[levelIndex];\n    for (let y = 0; y < level.length; y++) {\n      const row = level[y];\n\n      for (let x = 0; x < row.length; x += 2) {\n        const char = row[x];\n        const realX = x / 2;\n\n        switch (char) {\n          case 'W': this.wallPositions.push({ x: realX, y: y }); break;\n          case 'E': this.enemyPositions.push({ x: realX, y: y }); break;\n          case 'P': this.playerPosition = { x: realX, y: y }; break;\n        }\n      }\n    }\n  }\n\n  getPlayerPosition () {\n    return this.playerPosition;\n  }\n\n  getEnemyPositions () {\n    return this.enemyPositions;\n  }\n\n  getWallPositions () {\n    return this.wallPositions;\n  }\n}\n\n//# sourceURL=webpack://squareshoot/./src/Scene/Map.js?");

/***/ }),

/***/ "./src/Wall.js":
/*!*********************!*\
  !*** ./src/Wall.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Wall: () => (/* binding */ Wall)\n/* harmony export */ });\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ \"./src/config.js\");\n\n\nclass Wall\n{\n  constructor (x, y) {\n    this.bounding = 'box';\n    this.x = x * _config__WEBPACK_IMPORTED_MODULE_0__.config.size;\n    this.y = y * _config__WEBPACK_IMPORTED_MODULE_0__.config.size;\n    this.sleep = true;\n\n    this.bounds = {\n      x: this.x,\n      y: this.y,\n      width: _config__WEBPACK_IMPORTED_MODULE_0__.config.size,\n      height: _config__WEBPACK_IMPORTED_MODULE_0__.config.size\n    };\n  }\n\n  render (context) {\n    if (this.sleep) {\n      return;\n    }\n\n    context.beginPath();\n    context.rect(this.x, this.y, _config__WEBPACK_IMPORTED_MODULE_0__.config.size, _config__WEBPACK_IMPORTED_MODULE_0__.config.size);\n    context.fillStyle = '#8fce00';\n    context.fill();\n  };\n};\n\n//# sourceURL=webpack://squareshoot/./src/Wall.js?");

/***/ }),

/***/ "./src/config.js":
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config)\n/* harmony export */ });\nconst config = {\n  radius: 60,\n  size: 150\n};\n\n//# sourceURL=webpack://squareshoot/./src/config.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Scene_Map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Scene/Map */ \"./src/Scene/Map.js\");\n/* harmony import */ var _Scene_Camera__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Scene/Camera */ \"./src/Scene/Camera.js\");\n/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Player */ \"./src/Player.js\");\n/* harmony import */ var _Enemy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Enemy */ \"./src/Enemy.js\");\n/* harmony import */ var _Wall__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Wall */ \"./src/Wall.js\");\n/* harmony import */ var _Bullet_BulletFactory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Bullet/BulletFactory */ \"./src/Bullet/BulletFactory.js\");\n\n\n\n\n\n\n\nconst canvas = document.querySelector('canvas#main');\nconst context = canvas.getContext('2d');\nconst camera = new _Scene_Camera__WEBPACK_IMPORTED_MODULE_1__.Camera(context);\n\nconst keyboard = {\n  up: false,\n  down: false,\n  left: false,\n  right: false\n};\n\nconst mouse = {\n  x: 0,\n  y: 0,\n  pressed: false\n};\n\nconst map = new _Scene_Map__WEBPACK_IMPORTED_MODULE_0__.Map();\nmap.generate();\n\nconst entities = [];\nconst walls = [];\nconst enemies = [];\nconst bulletFactory = new _Bullet_BulletFactory__WEBPACK_IMPORTED_MODULE_5__.BulletFactory();\n\nconst player = new _Player__WEBPACK_IMPORTED_MODULE_2__.Player(\n  map.getPlayerPosition(),\n  document.querySelector('div.gameover')\n);\nentities.push(player);\n\nlet weapon = 0;\n\nfor (let i = 0; i < map.getEnemyPositions().length; i++) {\n  const enemy = new _Enemy__WEBPACK_IMPORTED_MODULE_3__.Enemy(map.getEnemyPositions()[i]);\n  entities.push(enemy);\n  enemies.push(enemy);\n}\n\nfor (let i = 0; i < map.getWallPositions().length; i++) {\n  const wallPosition = map.getWallPositions()[i];\n  const wall = new _Wall__WEBPACK_IMPORTED_MODULE_4__.Wall(wallPosition.x, wallPosition.y);\n  entities.push(wall);\n  walls.push(wall);\n}\n\nconst onResize = (width, height) => {\n  context.canvas.width = width;\n  context.canvas.height = height;\n  camera.resize();\n};\n\nconst onUpdate = () => {\n  camera.update(player, entities);\n  bulletFactory.update(context, player, walls, mouse, weapon);\n  for (let i = 0; i < entities.length; i++) {\n    if (typeof entities[i] !== undefined && typeof entities[i].update === 'function') {\n      entities[i].update(\n        context,\n        player,\n        enemies,\n        walls,\n        bulletFactory,\n        camera,\n        keyboard,\n        mouse\n      );\n    }\n  }\n};\n\nconst onRender = () => {\n  context.clearRect(0, 0, context.canvas.width, context.canvas.height);\n  camera.preRender(player);\n  bulletFactory.render();\n  for (let i = 0; i < entities.length; i++) {\n    entities[i].render(context);\n  }\n  camera.postRender();\n}\n\nconst resizeCallback = () => {\n  onResize(window.innerWidth, window.innerHeight);\n};\nwindow.addEventListener('resize', resizeCallback);\nresizeCallback();\n\nconst tickCallback = () => {\n  onUpdate();\n  onRender();\n  requestAnimationFrame(tickCallback);\n};\nrequestAnimationFrame(tickCallback);\n\ndocument.addEventListener('keydown', (event) => {\n  console.log({ event })\n  switch (event.key) {\n    case 'w': keyboard.up = true; break;\n    case 's': keyboard.down = true; break;\n    case 'a': keyboard.left = true; break;\n    case 'd': keyboard.right = true; break;\n    case '1': weapon = 0; break;\n    case '2': weapon = 1; break;\n    case '3': weapon = 2; break;\n    case '4': weapon = 3; break;\n  }\n});\n\ndocument.addEventListener('keyup', (event) => {\n  switch (event.key) {\n    case 'w': keyboard.up = false; break;\n    case 's': keyboard.down = false; break;\n    case 'a': keyboard.left = false; break;\n    case 'd': keyboard.right = false; break;\n  }\n});\n\ndocument.addEventListener('mousemove', (event) => {\n  mouse.x = event.clientX;\n  mouse.y = event.clientY;\n});\n\ndocument.addEventListener('mousedown', (event) => {\n  mouse.pressed = true;\n});\n\ndocument.addEventListener('mouseup', (event) => {\n  mouse.pressed = false;\n});\n\n//# sourceURL=webpack://squareshoot/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;