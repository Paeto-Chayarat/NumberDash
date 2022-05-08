let world = createTiles(32, 10, 40);

let bg = world.createSprite(0, 0);
bg.addImage(
	"blue",
	loadImage(QuintOS.dir + "/img/blue-background/blue-back.png")
);
bg.x = 0;
bg.y = 0;

let player = world.createSprite(0, 0, 1);
player.spriteSheet = loadImage(QuintOS.dir + "/img/player.png");
player.addAni("idle", { size: [29, 29], frames: 4, delay: 6 });
player.rotation = 90;
// player.setCollider("circle");

/* Spark shots */

let sparks = world.createGroup();
sparks.spriteSheet = loadImage(QuintOS.dir + "/img/spark.png");
sparks.addAni("spark0", { line: 0, frames: 5, size: [64, 32] });
sparks.spriteSheet = loadImage(QuintOS.dir + "/img/spark2.png");
sparks.addAni("spark1", { line: 0, frames: 5, size: [64, 32] });

for (let i = 0; i < 10; i++) {
	let spark = sparks.createSprite("spark");
	spark.rotation = -90;
	spark.x = 1000;
	spark.y = 1000;
}

/* Asteroids */

let asteroids = world.createGroup();

for (let i = 0; i < 30; i++) {
	let asteroid = asteroids.createSprite(-2, -2);
	asteroid.addImage(
		loadImage(QuintOS.dir + "/img/asteroids/asteroid-" + (i % 5) + ".png")
	);
	// asteroid.setCollider("circle");
}
