let soundDir = QuintOS.dir + "/sounds";

let crashSound = loadSound(soundDir + "/crash.wav");
let shootSound = loadSound(soundDir + "/shoot.wav");
let hitSound = loadSound(soundDir + "/gotNumber.wav");
let wrongHitSound = loadSound(soundDir + "/wrongHit.wav");
let gameOverSound = loadSound(soundDir + "/gameOver.wav");
// let world = new World(0, 0);
// world.offsetX = 10;
// world.offsetY = 40;

let theme = "blue";
let themes = {};

themes.blue = {
	bg: loadImage(QuintOS.dir + "/img/blue-background/blue-back.png"),
	stars: loadImage(QuintOS.dir + "/img/blue-background/blue-stars.png"),
	planet: loadImage(QuintOS.dir + "/img/blue-background/prop-planet-big.png"),
};

themes.green = {
	bg: loadImage(QuintOS.dir + "/img/green-background/green-back.png"),
	stars: loadImage(QuintOS.dir + "/img/green-background/green-stars.png"),
	planet: loadImage(QuintOS.dir + "/img/green-background/green-planet.png"),
	ring: loadImage(QuintOS.dir + "/img/green-background/ring-planet.png"),
	planet1: loadImage(QuintOS.dir + "/img/green-background/blue-planet.png"),
};

themes.desert = {
	bg: loadImage(QuintOS.dir + "/img/desert-background/desert-background.png"),
	clouds: loadImage(QuintOS.dir + "/img/desert-background/clouds.png"),
	tpClouds: loadImage(
		QuintOS.dir + "/img/desert-background/clouds-transparent.png"
	),
};

themes.orange = {
	bg: loadImage(QuintOS.dir + "/img/orange-background/orange-back.png"),
	stars: loadImage(QuintOS.dir + "/img/orange-background/orange-stars.png"),
	planet1: loadImage(QuintOS.dir + "/img/orange-background/planet-1.png"),
	planet2: loadImage(QuintOS.dir + "/img/orange-background/planet-2.png"),
};

let bgProps = new Group();
bgProps.layer = 0;
bgProps.collider = "none";

let player = new Sprite(150, 300, 32);
player.layer = 1;
player.spriteSheet = loadImage(QuintOS.dir + "/img/player.png");
player.addAni("idle", { size: [29, 29], frames: 4, delay: 6 });
player.rotation = 90;
player.rotationLocked = true;
// player.setCollider("circle");

/* Spark shots */

let sparks = new Group();
sparks.spriteSheet = loadImage(QuintOS.dir + "/img/spark.png");
sparks.addAni("spark0", { line: 0, frames: 5, size: [64, 32] });
sparks.spriteSheet = loadImage(QuintOS.dir + "/img/spark2.png");
sparks.addAni("spark1", { line: 0, frames: 5, size: [64, 32] });
sparks.rotation = -90;
sparks.rotationLocked = true;

for (let i = 0; i < 10; i++) {
	new sparks.Sprite("spark0", 1000, 1000, 2, 2);
}

/* Asteroids */

let allAsteroids = new Group();
for (let i = 0; i < 5; i++) {
	allAsteroids.addImage(
		"atd" + i,
		loadImage(QuintOS.dir + "/img/asteroids/asteroid-" + i + ".png")
	);
}

let asteroids = new allAsteroids.Group();
asteroids.layer = 1;
for (let i = 0; i < 60; i++) {
	new asteroids.Sprite("atd" + (i % 5), i * 40, -20, 20);
}

let bgAsteroids = new allAsteroids.Group();
bgAsteroids.layer = 0;
bgAsteroids.collider = "none";
bgAsteroids.scale = 0.5;
for (let i = 0; i < 50; i++) {
	new bgAsteroids.Sprite("atd" + (i % 5), i * 40, -20, 20);
}

let frAsteroids = new allAsteroids.Group();
frAsteroids.layer = 2;
frAsteroids.collider = "none";
frAsteroids.scale = 2;
for (let i = 0; i < 5; i++) {
	new frAsteroids.Sprite("atd" + (i % 5), i * 40, -20, 20);
}

let explosions = new Group();
explosions.spriteSheet = loadImage(QuintOS.dir + "/img/explosion.png");
explosions.addAni("default", { line: 0, frames: 5, size: [32, 32] });
