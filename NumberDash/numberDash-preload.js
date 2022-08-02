async function setup() {
	let soundDir = QuintOS.dir + '/sounds';

	crashSound = loadSound(soundDir + '/crash.wav');
	shootSound = loadSound(soundDir + '/shoot.wav');
	hitSound = loadSound(soundDir + '/gotNumber.wav');
	wrongHitSound = loadSound(soundDir + '/wrongHit.wav');
	gameOverSound = loadSound(soundDir + '/gameOver.wav');
	// world = new World(0, 0);
	// world.offsetX = 10;
	// world.offsetY = 40;

	theme = 'blue';
	themes = {};

	themes.blue = {
		bg: await loadImage(QuintOS.dir + '/img/blue-background/blue-back.png'),
		stars: await loadImage(QuintOS.dir + '/img/blue-background/blue-stars.png'),
		planet: await loadImage(QuintOS.dir + '/img/blue-background/prop-planet-big.png')
	};

	themes.green = {
		bg: await loadImage(QuintOS.dir + '/img/green-background/green-back.png'),
		stars: await loadImage(QuintOS.dir + '/img/green-background/green-stars.png'),
		planet: await loadImage(QuintOS.dir + '/img/green-background/green-planet.png'),
		ring: await loadImage(QuintOS.dir + '/img/green-background/ring-planet.png'),
		planet1: await loadImage(QuintOS.dir + '/img/green-background/blue-planet.png')
	};

	themes.desert = {
		bg: await loadImage(QuintOS.dir + '/img/desert-background/desert-background.png'),
		clouds: await loadImage(QuintOS.dir + '/img/desert-background/clouds.png'),
		tpClouds: await loadImage(QuintOS.dir + '/img/desert-background/clouds-transparent.png')
	};

	themes.orange = {
		bg: await loadImage(QuintOS.dir + '/img/orange-background/orange-back.png'),
		stars: await loadImage(QuintOS.dir + '/img/orange-background/orange-stars.png'),
		planet1: await loadImage(QuintOS.dir + '/img/orange-background/planet-1.png'),
		planet2: await loadImage(QuintOS.dir + '/img/orange-background/planet-2.png')
	};

	bgProps = new Group();
	bgProps.layer = 0;
	bgProps.collider = 'none';

	player = new Sprite(150, 300, 32);
	player.layer = 1;
	player.spriteSheet = await loadImage(QuintOS.dir + '/img/player.png');
	player.addAni('idle', { size: [29, 29], frames: 4, delay: 6 });
	player.rotation = 90;
	player.rotationLocked = true;
	// player.setCollider("circle");

	/* Spark shots */

	sparks = new Group();
	sparks.spriteSheet = await loadImage(QuintOS.dir + '/img/spark.png');
	sparks.addAni('spark0', { line: 0, frames: 5, size: [64, 32] });
	sparks.spriteSheet = await loadImage(QuintOS.dir + '/img/spark2.png');
	sparks.addAni('spark1', { line: 0, frames: 5, size: [64, 32] });
	sparks.rotation = -90;
	sparks.rotationLocked = true;

	for (let i = 0; i < 10; i++) {
		new sparks.Sprite('spark0', 1000, 1000, 2, 2);
	}

	/* Asteroids */

	allAsteroids = new Group();
	for (let i = 0; i < 5; i++) {
		let img = await loadImage(QuintOS.dir + '/img/asteroids/asteroid-' + i + '.png');
		allAsteroids.addAni('atd' + i, img);
	}

	asteroids = new allAsteroids.Group();
	asteroids.layer = 1;
	for (let i = 0; i < 60; i++) {
		new asteroids.Sprite('atd' + (i % 5), i * 40, -20, 20);
	}

	bgAsteroids = new allAsteroids.Group();
	bgAsteroids.layer = 0;
	bgAsteroids.collider = 'none';
	bgAsteroids.scale = 0.5;
	for (let i = 0; i < 50; i++) {
		new bgAsteroids.Sprite('atd' + (i % 5), i * 40, -20, 20);
	}

	frAsteroids = new allAsteroids.Group();
	frAsteroids.layer = 2;
	frAsteroids.collider = 'none';
	frAsteroids.scale = 2;
	for (let i = 0; i < 5; i++) {
		new frAsteroids.Sprite('atd' + (i % 5), i * 40, -20, 20);
	}

	explosions = new Group();
	explosions.spriteSheet = await loadImage(QuintOS.dir + '/img/explosion.png');
	explosions.addAni({ line: 0, frames: 5, size: [32, 32] });
}
