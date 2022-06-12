let world = new World(0, 0);
// world.offsetX = 10;
// world.offsetY = 40;

let bg = loadImage(QuintOS.dir + "/img/blue-background/blue-back.png");

let player = new Sprite(150, 300, 32);
player.layer = 1;
player.spriteSheet = loadImage(QuintOS.dir + "/img/player.png");
player.addAni("idle", { size: [29, 29], frames: 4, delay: 6 });
player.rotation = 90;
// player.setCollider("circle");

/* Spark shots */

let sparks = new Group();
sparks.spriteSheet = loadImage(QuintOS.dir + "/img/spark.png");
sparks.addAni("spark0", { line: 0, frames: 5, size: [64, 32] });
sparks.spriteSheet = loadImage(QuintOS.dir + "/img/spark2.png");
sparks.addAni("spark1", { line: 0, frames: 5, size: [64, 32] });

for (let i = 0; i < 10; i++) {
	let spark = sparks.sprite("spark0", 1000, 1000, 2, 2);
	spark.rotation = -90;
}

/* Asteroids */

let asteroids = new Group();

for (let i = 0; i < 60; i++) {
	let asteroid = asteroids.sprite(i * 40, -2, 20);
	asteroid.addImage(
		loadImage(QuintOS.dir + "/img/asteroids/asteroid-" + (i % 5) + ".png")
	);
}

let explosions = new Group();
explosions.spriteSheet = loadImage(QuintOS.dir + "/img/explosion.png");
explosions.addAni("default", { line: 0, frames: 5, size: [32, 32] });
