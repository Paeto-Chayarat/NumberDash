function preload() {
	crashSound = loadSound("sounds/crash.wav");
	shootSound = loadSound("sounds/shoot.wav");
	hitSound = loadSound("sounds/gotNumber.wav");
	wrongHitSound = loadSound("sounds/wrongHit.wav");
	gameOverSound = loadSound("sounds/gameOver.wav");

	theme = "blue";
	themes = {};

	themes.blue = {
		bg: loadImage("img/blue-background/blue-back.png"),
		stars: loadImage("img/blue-background/blue-stars.png"),
		planet: loadImage("img/blue-background/prop-planet-big.png"),
	};

	themes.green = {
		bg: loadImage("img/green-background/green-back.png"),
		stars: loadImage("img/green-background/green-stars.png"),
		planet: loadImage("img/green-background/green-planet.png"),
		ring: loadImage("img/green-background/ring-planet.png"),
		planet1: loadImage("img/green-background/blue-planet.png"),
	};

	themes.desert = {
		bg: loadImage("img/desert-background/desert-background.png"),
		clouds: loadImage("img/desert-background/clouds.png"),
		tpClouds: loadImage("img/desert-background/clouds-transparent.png"),
	};

	themes.orange = {
		bg: loadImage("img/orange-background/orange-back.png"),
		stars: loadImage("img/orange-background/orange-stars.png"),
		planet1: loadImage("img/orange-background/planet-1.png"),
		planet2: loadImage("img/orange-background/planet-2.png"),
	};

	bgProps = new Group();
	bgProps.layer = 0;
	bgProps.collider = "none";

	player = new Sprite(150, 300, 32);
	player.layer = 1;
	player.spriteSheet = loadImage("img/player.png");
	player.addAni("idle", { size: [29, 29], frames: 4, delay: 6 });
	player.rotation = 90;
	player.rotationLock = true;
	// player.setCollider("circle");

	/* Spark shots */

	sparks = new Group();
	sparks.spriteSheet = loadImage("img/spark.png");
	sparks.addAni("spark0", { line: 0, frames: 5, size: [64, 32] });
	sparks.spriteSheet = loadImage("img/spark2.png");
	sparks.addAni("spark1", { line: 0, frames: 5, size: [64, 32] });
	sparks.rotation = -90;
	sparks.rotationLock = true;

	/* Asteroids */

	allAsteroids = new Group();

	asteroids = new allAsteroids.Group();
	asteroids.layer = 1;
	for (let i = 0; i < 5; i++) {
		let img = loadImage("img/asteroids/asteroid-" + i + ".png");
		asteroids.addAni("atd" + i, img);
	}

	for (let i = 0; i < 30; i++) {
		new asteroids.Sprite("atd" + (i % 5), i * 40, -20, 20);
	}

	// background asteroids
	bgAsteroids = new allAsteroids.Group();
	bgAsteroids.layer = 0;
	bgAsteroids.collider = "none";
	bgAsteroids.scale = 0.5;
	for (let i = 0; i < 5; i++) {
		let img = loadImage("img/dark_asteroids/asteroid-" + i + ".png");
		bgAsteroids.addAni("d_atd" + i, img);
	}
	for (let i = 0; i < 100; i++) {
		new bgAsteroids.Sprite("d_atd" + (i % 5), i * 40, -20, 20);
	}

	// foreground asteroids
	frAsteroids = new allAsteroids.Group();
	frAsteroids.layer = 2;
	frAsteroids.collider = "none";
	frAsteroids.scale = 2;
	for (let i = 0; i < 5; i++) {
		let img = loadImage("img/bright_asteroids/asteroid-" + i + ".png");
		frAsteroids.addAni("b_atd" + i, img);
	}
	for (let i = 0; i < 5; i++) {
		new frAsteroids.Sprite("b_atd" + (i % 5), i * 40, -20, 20);
	}

	explosions = new Group();
	explosions.spriteSheet = loadImage("img/explosion.png");
	explosions.addAni({ line: 0, frames: 5, size: [32, 32] });
}

// init variables
let sparkCount = 0;
let objective = 10;
let equation = [];
let shouldShootNumber = true;
let mathSymbols;
let time = 60;
let health = 312;
let isInGame = false;
let isPaused = false;
let mode;
let symbOrNum;
let moreBg = true;
let numMode = "num";
let starsOpacity = 255;
let starsShine = false;
let progress = 5;
let goal;
let healthY = 360;
let placedAsteroids = 0;

let levels = {
	tutorial: 0,
	add: 1,
	subtract: 2,
	"add & subtract": 3,
	fraction: 4,
};

function setup() {
	noStroke();
	progress = getItem("progress");
	if (progress === null) {
		progress = 0;
	}

	// set the initial animation and position for the player ship
	player.ani = "idle";
	player.overlap(sparks);
	player.overlap(explosions);
	explosions.overlap(asteroids);
	asteroids.overlap(asteroids);

	player.ghostTime = 0;

	player.overlapping(asteroids, async (player, asteroid) => {
		if (player.ghostTime == 0) {
			placeAsteroid(asteroid);
			play(crashSound);
			let explosion = new explosions.Sprite("default", player.x, player.y);
			explosion.life = 20;
			health -= 42;
			player.ghostTime = 180;
			if (mode == "tutorial") {
				isPaused = true;
				await alert(
					"Your health will decrease if you hit an asteriod, check your health bar at the bottom (red line)"
				);
				await delay(1000);
				isPaused = false;
			}
			if (health < 0) {
				gameOver("You got hit too many times, your ship was destroyed.");
			}
		}
	});

	for (let i = 0; i < 10; i++) {
		new sparks.Sprite("spark0", 1000, 1000, 2, 2);
	}

	sparks.collide(asteroids, explosion);
	mainMenu();
}

// position asteroids
function placeAsteroids() {
	// for (let i = 0; i < allAsteroids.length; i++) {
	// 	placeAsteroid(allAsteroids[i]);
	// }

	for (let i = 0; i < bgAsteroids.length; i++) {
		placeAsteroid(bgAsteroids[i]);
	}
	for (let i = 0; i < frAsteroids.length; i++) {
		placeAsteroid(frAsteroids[i]);
	}
	for (let i = 0; i < asteroids.length; i++) {
		placeAsteroid(asteroids[i]);
	}
}

async function timer() {
	text(time.toString().padStart(3, " "), 32, 24);
	await delay(1000);
	time--;
	if (!isInGame) return;
	if (time == 0) {
		gameOver("You ran out of time!");
		return;
	}
	timer();
}

async function gameOver(msg) {
	play(gameOverSound);
	isInGame = false;
	time = 1;
	await alert(msg + " Game Over. Try Again?");
	startGame();
}

async function gameWon() {
	isInGame = false;
	time = 1;
	if (progress < 5) {
		progress = levels[mode] + 1;
		if (mode == "subtract") {
			progress = 5;
		}
	}
	storeItem("progress", progress);
	await alert("You Won! Try doing the next level!");
	mainMenu();
}

function nextNumber() {
	shouldShootNumber = false;
	equation = [objective];

	displayEquation();

	for (let asteroid of asteroids) {
		if (asteroid.y < -10) {
			changeAsteroidData(asteroid);
		}
	}

	setObjective();
	displayObjective();
	time += 30;
	health += 21;
}

function changeAsteroidData(asteroid) {
	if (mode == "add & subtract" && numMode == "fraction") {
		if (Math.random() < symbOrNum) {
			let chance = Math.random();
			if (chance < 0.5) {
				//make denominater near goal
				asteroid.data =
					Math.floor(Math.random() * 7) + "\n" + Math.ceil(Math.random() * 5);
			} else if (equation.length && chance < 0.75) {
				asteroid.data = Math.floor(Math.random() * 7) + "\n" + equation[0][2];
			} else {
				asteroid.data = Math.floor(Math.random() * 7) + "\n" + objective[2];
			}
		} else {
			asteroid.data =
				mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
		}
	} else {
		if (Math.random() < symbOrNum) {
			asteroid.data = Math.floor(Math.random() * 10);
		} else {
			asteroid.data =
				mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
		}
	}
}

function placeAsteroid(asteroid) {
	let asteroidFieldSize = 640;
	if (mode == "add") {
		asteroidFieldSize = 1000;
	}

	asteroid.y = Math.floor(Math.random() * -asteroidFieldSize);

	asteroid.rotation = random(0, 360);
	asteroid.rotationSpeed = random(-1, 1);

	if (asteroids.includes(asteroid)) {
		changeAsteroidData(asteroid);
		asteroid.speed = random(0.8, 0.9);
		placedAsteroids++;
		log(placedAsteroids);
	} else if (bgAsteroids.includes(asteroid)) {
		asteroid.speed = random(0.3, 0.5);
	} else if (frAsteroids.includes(asteroid)) {
		asteroid.speed = random(1.1, 1.3);
	}

	// if (placedAsteroids < 60) {
	// normal
	asteroid.x = Math.floor(random(0, 320));
	asteroid.moveTo(random(asteroid.x - 80, asteroid.x + 80), 461);
	// } else if (placedAsteroids < 120) {
	// asteroids come from the left
	// asteroid.x = random(320, 640);
	// asteroid.moveTo(random(-100, 200), 461);
	// }
	// asteroids come from the right
	// asteroid.x = random(-320, 0);
	// asteroid.moveTo(random(100, 500), 461);
}

function setObjective() {
	let prevObjective = objective;
	while (objective == prevObjective) {
		if (mode == "add & subtract" && numMode == "num") {
			objective += Math.floor(Math.random() * 40 - 20);
		} else if (mode == "tutorial") {
			objective = 10;
		} else if (mode == "add & subtract" && numMode == "fraction") {
			objective =
				Math.floor(Math.random() * 7) + "/" + Math.ceil(Math.random() * 5);
		} else if (mode == "add") {
			objective += Math.floor(Math.random() * 20);
		} else if (mode == "subtract") {
			objective -= Math.floor(Math.random() * 20);
		} else {
			objective = Math.floor(Math.random() * 100);
		}
		if (objective > 50 && mode == "add") {
			objective = 50;
		}
		if (objective < 0 && mode == "subtract") {
			objective = 0;
		}
	}
}

function displayObjective() {
	if (numMode != "fraction") {
		textRect(31, 0, 3, 17);
		textRect(31, 17, 3, 6);
		textRect(31, 23, 3, 5);
		text(("=" + objective).padEnd(4, " "), 32, 18);
	} else {
		textRect(30, 0, 5, 17);
		textRect(30, 17, 5, 6);
		textRect(30, 23, 5, 5);
		text("=", 32, 18);
		text(objective.replace("/", "\n-\n").padEnd(4, " "), 31, 19);
	}
}

function makeTheme() {
	if (mode == "add") {
		let planet = new bgProps.Sprite(themes.blue.planet, 50, 20);
		planet.vel.y = 0.01;
		planet.scale = 2;
	}
	if (mode == "subtract") {
		theme = "green";

		let planet = new bgProps.Sprite(themes.green.planet, 50, 20);
		planet.vel.x = 0.02;
		planet.vel.y = 0.005;

		let planet1 = new bgProps.Sprite(themes.green.planet1, 100, 300);
		planet1.scale = 1.5;
		planet1.vel.x = 0.01;
		planet1.vel.y = 0.01;

		let ring = new bgProps.Sprite(themes.green.ring, 200, 150);
		ring.scale = 2;
		ring.vel.y = 0.005;
	}
	if (mode == "add & subtract") {
		theme = "desert";

		for (let i = 0; i < 40; i++) {
			let prevY = 100;
			if (bgProps[i - 1]) prevY = bgProps[i - 1].y;

			let tpClouds = new bgProps.Sprite(
				themes.desert.tpClouds,
				170,
				prevY - random(40, 70) * i
			);
			if (i % 3) tpClouds.y -= 300;
			tpClouds.scale = 1.5;
			tpClouds.vel.x = random(-0.005, 0.005);
			tpClouds.vel.y = random(0.15, 0.25);
			tpClouds.mirrorX = Math.random() > 0.5;
			tpClouds.mirrorY = Math.random() > 0.5;
			log(tpClouds.y);

			let clouds = new bgProps.Sprite(
				themes.desert.clouds,
				170,
				prevY - random(40, 70) * i
			);
			if (i % 3) clouds.y -= 300;
			clouds.scale = 1.5;
			clouds.vel.x = random(-0.005, 0.005);
			clouds.vel.y = random(0.15, 0.25);
			clouds.mirrorX = Math.random() > 0.5;
			clouds.mirrorY = Math.random() > 0.5;
			log(clouds.y);
		}
	}
	if (mode == "all") {
		theme = "orange";

		let planet1 = new bgProps.Sprite(themes.orange.planet1, 100, 200);
		planet1.vel.x = 0.02;
		planet1.vel.y = 0.005;
		planet1.scale = 2;

		let planet2 = new bgProps.Sprite(themes.orange.planet2, 300, 100);
		planet2.scale = 1.5;
		planet2.vel.y = 0.01;
	}
}

async function startGame() {
	text(" ".repeat(15), 31, 1);
	text(" ".repeat(15), 32, 1);
	text(" ".repeat(15), 33, 1);
	equation = [];
	shouldShootNumber = true;
	placedAsteroids = 0;

	if (mode == "subtract") {
		equation = [50];
		objective = 50;
		goal = objective;
		shouldShootNumber = false;
		displayEquation();
	} else {
		objective = 0;
	}
	if (mode != "tutorial") setObjective();
	else {
		objective = Math.floor(Math.random() * 8 + 1);
	}

	displayObjective();
	placeAsteroids();
	if (moreBg) {
		makeTheme();
	}
	moreBg = false;
	time = 60;
	if (mode == "add") {
		time = 120;
	}
	health = 288;

	await delay(1000);
	isInGame = true;
	timer();
}

function mainMenu() {
	text("Select Game Mode!", 5, 5);

	button("Level 0: Tutorial", 9, 5, async () => {
		mode = "tutorial";
		mathSymbols = ["+"];
		symbOrNum = 0.7;
		erase();
		isPaused = true;
		await alert(
			`Move your mouse cursor to move the ship.\n\nClick your mouse to shoot.\n\nUse the "a" and "d" keys to turn the ship.\n\nTry shooting an asteroid with a number on it!`,
			4
		);
		await delay(1000);
		isPaused = false;
		startGame();
	});
	if (progress >= 1) {
		button("Level 1: Addition", 11, 5, () => {
			mode = "add";
			mathSymbols = ["+"];
			symbOrNum = 0.7;

			erase();
			startGame();
		});
	} else {
		button("Level 1: Addition", 11, 5, () => {
			alert("Locked! Play previous levels to unlock this one.", 25, 4);
		});
	}
	if (progress >= 2) {
		button("Level 2: Subtract", 13, 5, () => {
			mode = "subtract";
			mathSymbols = ["-"];
			symbOrNum = 0.7;
			erase();
			startGame();
		});
	} else {
		button("Level 2: Subtract", 13, 5, () => {
			alert("Locked! Reach an objective of 100 in Level 1 to unlock", 25, 4);
		});
	}
	if (progress >= 3) {
		button("Level 3: Add and Subtract", 15, 5, () => {
			mode = "add & subtract";
			mathSymbols = ["+", "-"];
			symbOrNum = 0.5;
			erase();
			startGame();
		});
	} else {
		button("Level 3: Add and Subtract", 15, 5, () => {
			alert("Locked! Play previous levels to unlock this one.", 25, 4);
		});
	}
	if (progress >= 4) {
		button("Level 4: Add, Subtract, Multiply, and Divide", 18, 5, () => {
			mode = "all";
			mathSymbols = ["+", "-", "x", "÷"];
			symbOrNum = 0.5;
			erase();
			startGame();
		});
	} else {
		button("Level 4: Add, Subtract, Multiply, and Divide", 18, 5, () => {
			alert("Locked! Play previous levels to unlock this one.", 25, 4);
		});
	}
	if (progress >= 5) {
		button("Level 5: fractions", 22, 5, () => {
			mode = "add & subtract";
			numMode = "fraction";
			mathSymbols = ["+", "-"];
			symbOrNum = 0.5;
			erase();
			startGame();
		});
	} else {
		button("Level 5: fractions", 22, 5, () => {
			alert("Locked! Play previous levels to unlock this one.", 25, 4);
		});
	}
}

function draw() {
	if (isPaused) {
		tint(128);
	} else {
		noTint();
	}
	if (player.ghostTime > 0) {
		player.ghostTime--;
	}
	image(themes[theme].bg, 0, 0, 320, 544);
	if (
		mode == "tutorial" ||
		mode == "add" ||
		mode == "subtract" ||
		mode == "all"
	) {
		push();
		tint(255, starsOpacity);
		if (starsOpacity <= 140) {
			starsShine = true;
		}
		if (starsOpacity >= 255) {
			starsShine = false;
		}
		if (starsShine) {
			starsOpacity += 3;
		} else {
			starsOpacity -= 2;
		}
		image(themes[theme].stars, 0, 0, 320, 544);

		pop();
	}
	if (isInGame) {
		if (health <= 0 || time <= 0) return;

		bgProps.draw();
		bgAsteroids.draw();

		fill(255, 80, 70);

		if (numMode == "fraction") {
			healthY = 347;
		} else {
			healthY = 360;
		}

		rect(4, healthY, health, 3);

		player.moveTowards(mouse, 0.1);

		for (let explosion of explosions) {
			explosion.moveTowards(player, 1);
		}

		if (kb.presses(" ")) {
			isPaused = !isPaused;
			if (isPaused) {
				tint(128, 32);

				button("restart", 20, 4, restartGame);
			} else {
				noTint();
				eraseRect(0, 0, 26, 28);
			}
		}
		if (kb.pressing("a")) {
			player.rotation -= 5;
		}
		if (kb.pressing("d")) {
			player.rotation += 5;
		}
		player.angularVelocity = 0;

		if (!isPaused) updateSprites();

		if (mouse.presses() && !isPaused) {
			let spark = sparks[sparkCount];
			play(shootSound);
			spark.x = player.x - 4;
			spark.y = player.y;

			spark.rotation = player.rotation + 180;
			spark.direction = spark.rotation;
			spark.speed = 5;

			// ternary condition, used to write if + else  on one line
			spark.ani = "spark" + (shouldShootNumber ? 0 : 1);
			if (spark) sparkCount++;
			if (sparkCount == 10) {
				sparkCount = 0;
			}
		}

		asteroids.draw();
		sparks.draw();

		push();
		if (player.ghostTime > 0 && frameCount % 30 < 15) {
			tint(255, 128);
		}

		player.draw();
		explosions.draw();
		pop();

		fill(255);
		// draw asteroid data
		for (let i = 0; i < asteroids.length; i++) {
			let asteroid = asteroids[i];
			// recycle asteroids that get placed off screen
			if (asteroid.y > 460) {
				placeAsteroid(asteroid);
			}
			if (!isPaused) {
				if (asteroid.data.toString().length == 1) {
					textSize(20);
					drawText(asteroid.data, asteroid.x - 6, asteroid.y + 4);
				} else {
					textSize(12);
					drawText(asteroid.data, asteroid.x - 6, asteroid.y - 4);
					drawText("_", asteroid.x - 6, asteroid.y - 2);
				}
			}
		}
		for (let asteroid of bgAsteroids) {
			if (asteroid.y > 460) {
				placeAsteroid(asteroid);
			}
		}
		for (let asteroid of frAsteroids) {
			if (asteroid.y > 460) {
				placeAsteroid(asteroid);
			}
		}
		frAsteroids.draw();

		sparks.cull(100, (spark) => {
			spark.speed = 0;
		});
	}
}

function restartGame() {
	isPaused = false;
	noTint();
	startGame();
	eraseRect(0, 0, 26, 28);
}

async function explosion(spark, asteroid) {
	spark.x = 1000;
	spark.y = 1000;
	spark.velocity.x = 0;
	spark.velocity.y = 0;

	asteroid.velocity.x = 0;
	asteroid.velocity.y = 0.2;

	log(asteroid);
	let data = asteroid.data;

	if (data == "") {
		placeAsteroid(asteroid);
		return;
	}

	if (mathSymbols.includes(data) && shouldShootNumber) {
		play(wrongHitSound);
		if (mode == "tutorial") {
			isPaused = true;
			await alert(
				"You can't shoot math symbols with blue lasers, only numbers!"
			);
			await delay(1000);
			isPaused = false;
		}
		return;
	}
	if (!mathSymbols.includes(data) && !shouldShootNumber) {
		play(wrongHitSound);
		if (mode == "tutorial") {
			isPaused = true;
			await alert(
				"You can't shoot numbers with red lasers, only math symbols!"
			);
			await delay(1000);
			isPaused = false;
		}
		return;
	}
	play(hitSound);
	shouldShootNumber = !shouldShootNumber;
	if (numMode == "fraction" && !mathSymbols.includes(data)) {
		data = data.replace("\n", "/");
	}
	equation.push(data);

	displayEquation();

	let result = evaluateEquation();

	if (result == goal) {
		if (
			(mode == "tutorial" && objective >= 10) ||
			(mode == "add" && objective == 50) ||
			(mode == "subtract" && objective == 0)
		) {
			gameWon();
			return;
		}
		nextNumber();
	} else if (equation.length > 14) {
		// if there is too many numers on eq box
		gameOver("Your equation is too long.");
	}

	if ((mode == "add" || mode == "tutorial") && result > goal) {
		gameOver("The result of your equation is higher than the objective.");
		return;
	}
	if (mode == "subtract" && result < goal) {
		gameOver("The result of your equation is lower than the objective.");
		return;
	}

	placeAsteroid(asteroid);

	if (mode == "tutorial") {
		isPaused = true;

		if (!shouldShootNumber) {
			await alert(
				"Nice hit!\n\nNow you can only shoot math symbols.\n\nTry shooting an addition (plus) sign!"
			);
		} else {
			await alert(
				"Great shot!\n\nNow you can only shoot numbers.\n\nThe goal of the game is to create an equation that results in the objective number in the box below."
			);
		}
		await delay(1000);
		isPaused = false;
	}
}

function displayEquation() {
	if (numMode != "fraction") {
		text(" ".repeat(15), 32, 1); // erase
		text(equation.join(""), 32, 1);
	} else {
		text(" ".repeat(15), 31, 1); // erase
		text(" ".repeat(15), 32, 1);
		text(" ".repeat(15), 33, 1);

		// equation -> ['3/4', '+', '1/2']
		// 3 1
		// -+-
		// 4 2

		let top = "";
		let mid = "";
		let low = "";

		for (let item of equation) {
			if (item.length > 1) {
				top += item[0];
				mid += "-";
				low += item[2];
			} else {
				top += " ";
				mid += item;
				low += " ";
			}
		}
		text(top, 31, 1);
		text(mid, 32, 1);
		text(low, 33, 1);
	}
}

// examples:
// objective: 7/6

// 1/2 + 2/4
// 3/6 + 3/6
// not objective: 6/6

// 1/2 + 2/3
// 3/6 + 4/6
// equals objective: 7/6

// 1/9 + 1/9 + 1/9 + 1/3
// 2/3

// source: https://learnersbucket.com/examples/algorithms/find-the-lcm-of-two-numbers-in-javascript/
function findLCM(n1, n2) {
	//Find the smallest and biggest number from both the numbers
	let lar = Math.max(n1, n2);
	let small = Math.min(n1, n2);

	//Loop till you find a number by adding the largest number which is divisble by the smallest number
	let i = lar;
	while (i % small !== 0) {
		i += lar;
	}

	//return the number
	return i;
}

function evaluateEquation() {
	// check if equation does not end with math symbol
	if (!mathSymbols.includes(equation[equation.length - 1])) {
		let lcm = 1;
		// create new array with contents of the equation array
		// so that we can edit it without changing the equation array
		let jsEq = [...equation];

		if (numMode == "fraction") {
			let denoms = [];
			for (let i = 0; i < equation.length; i += 2) {
				denoms.push(Number(equation[i][2]));
			}
			for (let i = 0; i < equation.length; i += 2) {
				lcm = findLCM(Number(equation[i][2]), lcm);
			}
			lcm = findLCM(lcm, objective[2]);
			log(lcm);
			for (let i = 0; i < equation.length; i += 2) {
				let multiple = lcm / equation[i][2];
				jsEq[i] = jsEq[i][0] * multiple;
			}
		}

		// example
		// lcm: 9
		// equation: ['1/3', '+', '1/9']
		// objective: 4/9
		// 4 = eval(3+1)

		for (let i = 1; i < jsEq.length; i += 2) {
			if (jsEq[i] == "÷") {
				let result = Math.round(jsEq[i - 1] / jsEq[i + 1]);
				jsEq.splice(i - 1, 3, result);
				i -= 2;
			} else if (jsEq[i] == "x") {
				jsEq[i] = "*";
			}
		}

		goal = objective;
		if (numMode == "fraction") {
			let multiple = lcm / goal[2];
			goal = goal[0] * multiple;
		}

		let result = eval(jsEq.join(""));
		if (numMode != "fraction") result = round(result);
		return result;
	}
}
