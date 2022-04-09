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

player.loadAni("idle", { size: [29, 29], frames: 4, delay: 6 });
player.rotation = 90;

let asteroids = world.createGroup("asteroids");

let shots = world.createGroup("shots");
// shots.createSprite().addImage(loadImage(QuintOS.dir + "/img/shot-0.png"));
// shots.createSprite().addImage(loadImage(QuintOS.dir + "/img/shot-1.png"));

let spark = shots.createSprite();
spark.spriteSheet = loadImage(QuintOS.dir + "/img/spark.png");
spark.loadAni("spark", { line: 0, frames: 5, size: [64, 32] });
spark.rotation = -90;

for (let i = 0; i < 5; i++) {
	asteroids
		.createSprite(-2, -2)
		.addImage(loadImage(QuintOS.dir + "/img/asteroids/asteroid-" + i + ".png"));
	// asteroid.setCollider("circle", -asteroid.w, -asteroid.h, 20);
}

let numbers = world.createGroup("numbers");
numbers.spriteSheet = loadImage(QuintOS.dir + "/img/numbers.png");

for (let i = 0; i < 10; i++) {
	numbers.loadImg("number" + i, { pos: [0, i], size: [8, 16] });
}
