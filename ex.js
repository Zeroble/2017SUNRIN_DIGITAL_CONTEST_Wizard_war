function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomElement(array) {
    return array[getRandomInt(0, array.length - 1)];
}

class Rect {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

class GameObject {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.collisionRect = new Rect();
    }
}

class Sprite extends GameObject {
    constructor(game, sourceImageRect) {
        super();
        this.game = game;
        this.imageRect = sourceImageRect;
    }

    render() {
        let { x, y, width, height } = this.imageRect;

        this.game.context.drawImage(this.game.image,
            x, y, width, height,
            this.x, this.y, width, height
        );
    }

    update(deltaTime) {

    }

    get width() {
        return this.imageRect.width;
    }

    get height() {
        return this.imageRect.height;
    }
}

class Animation extends Sprite {
    constructor(game, sourceImageRect, totalFrame, fps) {
        super(game, sourceImageRect);

        this.frames = [];
        this.currentFrame = 0;
        this.totalFrame = totalFrame;
        this.fps = fps;

        // 스프라이트 시트 상에서 항상 옆으로 이어져 있으니 야매로
        for (let i = 0; i < this.totalFrame; ++i) {
            this.frames[i] = new Rect(
                sourceImageRect.x + i * sourceImageRect.width,
                sourceImageRect.y,
                sourceImageRect.width,
                sourceImageRect.height
            );
        }

        this.imageRect = this.frames[0];
    }

    update(deltaTime) {
        this.currentFrame += deltaTime * this.fps;

        let frameToRender = Math.floor(this.currentFrame);

        if (frameToRender >= this.totalFrame) {
            this.currentFrame = frameToRender = 0;
        }

        this.imageRect = this.frames[frameToRender];
    }
}

class Horizon {
    constructor(game) {
        this.game = game;
        this.clouds = [];
        this.obstacles = [];
        this.lastSpawnedObstacle = null;
        this.cloudSpawnTimer = 0;

        const { x, y, width, height } =
            TRexGame.spriteDefinition.HORIZON;

        this.sourceXPositions = [x, x + width];
        this.xPositions = [0, width];
        this.yPosition = this.game.canvas.height - height;

        this.addCloud();
        this.addObstacle();
    }

    render() {
        // 수평선
        let { x, y, width, height } = TRexGame.spriteDefinition.HORIZON;

        for (let i = 0; i < this.xPositions.length; ++i) {
            this.game.context.drawImage(this.game.image,
                this.sourceXPositions[i], y, width, height,
                this.xPositions[i], this.yPosition, width, height
            );
        }

        // 구름
        for (let c of this.clouds) {
            c.render();
        }
        
        // 장애물
        for (let o of this.obstacles) {
            o.render();
        }
    }

    update(deltaTime) {
        // 수평선
        for (let i = 0; i < this.xPositions.length; ++i) {
            this.xPositions[i] -= this.game.speed * deltaTime;
            if (this.xPositions[i] <= -this.game.canvas.width) {
                this.xPositions[i] += this.game.canvas.width * 2;
            }
        }

        // 구름
        this.cloudSpawnTimer += deltaTime;

        if (this.cloudSpawnTimer > TRexGame.config.CLOUD_SPAWN_DURATION) {
            this.cloudSpawnTimer = 0;
            this.addCloud();
        }

        for (let c of this.clouds) {
            c.update(deltaTime);
        }

        this.clouds = this.clouds.filter(function(c) {
            return c.x > -c.width;
        });

        // 장애물
        if (this.game.canvas.width
             - this.lastSpawnedObstacle.x
              > this.lastSpawnedObstacle.gap) {
            this.addObstacle();
        }

        for (let o of this.obstacles) {
            o.update(deltaTime);
        }
    }

    addCloud() {
        const c = new Cloud(this.game);
        this.clouds.push(c);

        c.x = 600;
        c.y = Math.random() * 30 + 30;
    }

    addObstacle() {
        const typeObject = getRandomElement(TRexGame.obstacleTypes);

        if (this.lastSpawnedObstacle != null
            && typeObject.type === this.lastSpawnedObstacle.typeObject.type) {
            this.addObstacle();
        } else {
            if (this.lastSpawnedObstacle != null) {
                this.lastSpawnedObstacle.nextObstacleCreated = true;
            }

            const o = new Obstacle(this.game, typeObject);

            this.obstacles.push(o);
            this.lastSpawnedObstacle = o;
        }
    }
}

class Obstacle extends GameObject {
    constructor(game, typeObject) {
        super();
        this.game = game;
        this.typeObject = typeObject;
        this.nextObstacleCreated = false;

        console.log(this.typeObject.type);

        const imageRect
         = TRexGame.spriteDefinition[this.typeObject.type];

        if (this.typeObject.totalFrame !== undefined
            && this.typeObject.fps !== undefined) {
            this.sprite = new Animation(
                game,
                imageRect,
                this.typeObject.totalFrame,
                this.typeObject.fps
            );
        } else {
            this.size = getRandomInt(
                this.typeObject.sizeRange.min,
                this.typeObject.sizeRange.max);

            let xOffset = 0;
            for (let i = 1; i < this.size; ++i) {
                xOffset += i;
            }

            this.sprite = new Sprite(game, new Rect(
                imageRect.x + xOffset * imageRect.width,
                imageRect.y,
                imageRect.width * this.size,
                imageRect.height
            ));
        }

        if (this.typeObject.variousSpawnY !== undefined) {
            this.y = getRandomElement(this.typeObject.variousSpawnY);
        } else {
            this.y = this.game.canvas.height - this.sprite.height;
        }

        this.x = this.game.canvas.width;
        this.gap = this.getGap();
    }

    render() {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.render();
    }

    update(deltaTime) {
        this.sprite.update(deltaTime);
        this.x -= this.game.speed * deltaTime
         * (this.typeObject.speedMultiplier || 1);
    }

    getGap() {
        const min = this.sprite.width * (this.game.speed / 60)
         + this.typeObject.minGap * TRexGame.config.GAP_MULTIPLIER;
        const max = min * TRexGame.config.MAX_GAP_MULTIPLIER;
        return getRandomInt(min, max);
    }
}

class Cloud extends Sprite {
    constructor(game) {
        super(game, TRexGame.spriteDefinition.CLOUD);
    }

    update(deltaTime) {
        this.x -= this.game.speed * deltaTime
         * TRexGame.config.CLOUD_SPEED_MULTIPLIER;
    }
}

class Player extends GameObject {
    constructor(game) {
        super();
        this.game = game;
        this.normal = new Animation(game,
            TRexGame.spriteDefinition.TREX, 2, 12);
        this.duck = new Animation(game,
            TRexGame.spriteDefinition.TREX_DUCK, 2, 12);
        this.animation = this.normal;

        this.groundY = this.game.canvas.height
             - this.animation.imageRect.height;
        this.velocity = 0;
        this.jumping = false;
        this.ducking = false;
    }

    render() {
        this.animation.x = this.x;
        this.animation.y = this.y;
        this.animation.render();
    }

    update(deltaTime) {
        this.animation.update(deltaTime);

        if (this.game.isKeyDown('Space') && !this.ducking) {
            this.jump();
        }

        if (this.game.isKeyDown('ArrowDown')) {
            if (this.jumping) {
                // 빨리 내려가기
            } else {
                this.startDuck();
            }
        } else if (this.ducking) {
            this.endDuck();
        }

        this.velocity += TRexGame.config.GRAVITY;
        this.y += this.velocity;

        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.jumping = false;
            this.velocity = 0;
        }
    }

    jump() {
        if(!this.jumping) {
            this.jumping = true;
            this.velocity = TRexGame.config.JUMP_VELOCITY;
        }
    }

    startDuck() {
        this.ducking = true;
        this.animation = this.duck;
    }

    endDuck() {
        this.ducking = false;
        this.animation = this.normal;
    }
}

class TRexGame {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.context = canvasElement.getContext('2d');

        this.canvas.width = 600;
        this.canvas.height = 150;
        this.speed = TRexGame.config.SPEED;

        this.image = new Image();
        this.image.src = 'resource/100-offline-sprite.png';
        this.player = new Player(this);
        this.player.x = 50;
        this.horizon = new Horizon(this);
        this.obstacles = [];
        this.downKeys = {};

        this.paused = false;
        this.updatePending = false;

        window.addEventListener('blur', this.onVisibilityChange.bind(this));
        window.addEventListener('focus', this.onVisibilityChange.bind(this));
        document.addEventListener('visibilitychange', this.onVisibilityChange.bind(this));
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    pause() {
        this.paused = true;
        //cancelAnimationFrame(this.raqId);
    }

    play() {
        this.paused = false;
        this.time = performance.now();
        this.scheduleNextUpdate();
    }

    run() {
        this.updatePending = false;

        const now = performance.now();
        const deltaTime = (now - this.time) / 1000;
        this.time = now;

        this.clearCanvas();
        this.update(deltaTime);
        this.render();

        this.scheduleNextUpdate();
    }

    render() {
        this.horizon.render();
        this.player.render();
    }

    update(deltaTime) {
        this.horizon.update(deltaTime);
        this.player.update(deltaTime);
    }

    scheduleNextUpdate() {
        if (!this.updatePending && !this.paused) {
            this.updatePending = true;
            this.raqId = requestAnimationFrame(this.run.bind(this));
        }
    }

    clearCanvas() {
        this.context.clearRect(
            0, 0, this.canvas.width, this.canvas.height);
    }

    onVisibilityChange(event) {
        if (document.hidden
            || event.type === 'blur'
            || document.visibilityState !== 'visible') {
            this.pause();
        } else {
            this.play();
        }
    }

    onKeyDown(event) {
        this.downKeys[event.code] = true;
    }

    onKeyUp(event) {
        this.downKeys[event.code] = false;
    }

    isKeyDown(code) {
        return this.downKeys[code];
    }
}

TRexGame.spriteDefinition = {
    CACTUS_LARGE: new Rect(332, 2, 25, 50),
    CACTUS_SMALL: new Rect(228, 2, 17, 35),
    CLOUD: new Rect(86, 2, 46, 14),
    HORIZON: new Rect(2, 54, 600, 16),
    MOON: { x: 484, y: 2 },
    BIRD: { x: 134, y: 2 },
    RESTART: { x: 2, y: 2 },
    TEXT_SPRITE: { x: 655, y: 2 },
    TREX: new Rect(936, 2, 44, 47),
    TREX_DUCK: new Rect(1112, 2, 59, 47),
    STAR: { x: 645, y: 2 }
}

TRexGame.config = {
    SPEED: 6 * 60,
    GRAVITY: 0.6,
    JUMP_VELOCITY: -10,
    GAP_MULTIPLIER: 0.6,
    MAX_GAP_MULTIPLIER: 1.5,
    CLOUD_SPAWN_DURATION: 5,
    CLOUD_SPEED_MULTIPLIER: 0.2
}

TRexGame.obstacleTypes = [
    {
        type: 'CACTUS_SMALL',
        minGap: 120,
        sizeRange: {min: 1, max: 3}
    },
    {
        type: 'CACTUS_LARGE',
        minGap: 120,
        sizeRange: {min: 1, max: 3}
    },
    {
        type: 'BIRD',
        minGap: 150,
        speedMultiplier: 0.8,
        totalFrame: 2,
        fps: 6,
        variousSpawnY: [ 100, 75, 50 ],
        sizeRange: {min: 1, max: 3}
    }
]

let gameCanvas = document.getElementById('game');
let game = new TRexGame(gameCanvas);
game.play();
