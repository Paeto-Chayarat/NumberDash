function preload() {
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
		bg: loadImage(QuintOS.dir + '/img/blue-background/blue-back.png'),
		stars: loadImage(QuintOS.dir + '/img/blue-background/blue-stars.png'),
		planet: loadImage(QuintOS.dir + '/img/blue-background/prop-planet-big.png')
	};

	themes.green = {
		bg: loadImage(QuintOS.dir + '/img/green-background/green-back.png'),
		stars: loadImage(QuintOS.dir + '/img/green-background/green-stars.png'),
		planet: loadImage(QuintOS.dir + '/img/green-background/green-planet.png'),
		ring: loadImage(QuintOS.dir + '/img/green-background/ring-planet.png'),
		planet1: loadImage(QuintOS.dir + '/img/green-background/blue-planet.png')
	};

	themes.desert = {
		bg: loadImage(QuintOS.dir + '/img/desert-background/desert-background.png'),
		clouds: loadImage(QuintOS.dir + '/img/desert-background/clouds.png'),
		tpClouds: loadImage(QuintOS.dir + '/img/desert-background/clouds-transparent.png')
	};

	themes.orange = {
		bg: loadImage(QuintOS.dir + '/img/orange-background/orange-back.png'),
		stars: loadImage(QuintOS.dir + '/img/orange-background/orange-stars.png'),
		planet1: loadImage(QuintOS.dir + '/img/orange-background/planet-1.png'),
		planet2: loadImage(QuintOS.dir + '/img/orange-background/planet-2.png')
	};

	bgProps = new Group();
	bgProps.layer = 0;
	bgProps.collider = 'none';

	player = new Sprite(150, 300, 32);
	player.layer = 1;
	player.spriteSheet = loadImage(QuintOS.dir + '/img/player.png');
	player.addAni('idle', { size: [29, 29], frames: 4, delay: 6 });
	player.rotation = 90;
	player.rotationLocked = true;
	// player.setCollider("circle");

	/* Spark shots */

	sparks = new Group();
	sparks.spriteSheet = loadImage(QuintOS.dir + '/img/spark.png');
	sparks.addAni('spark0', { line: 0, frames: 5, size: [64, 32] });
	sparks.spriteSheet = loadImage(QuintOS.dir + '/img/spark2.png');
	sparks.addAni('spark1', { line: 0, frames: 5, size: [64, 32] });
	sparks.rotation = -90;
	sparks.rotationLocked = true;

	for (let i = 0; i < 10; i++) {
		new sparks.Sprite('spark0', 1000, 1000, 2, 2);
	}

	/* Asteroids */

	allAsteroids = new Group();
	for (let i = 0; i < 5; i++) {
		let img = loadImage(QuintOS.dir + '/img/asteroids/asteroid-' + i + '.png');
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
	explosions.spriteSheet = loadImage(QuintOS.dir + '/img/explosion.png');
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
let numMode = 'num';
let starsOpacity = 255;
let starsShine = false;

function setup() {
	// set the initial animation and position for the player ship
	player.ani = 'idle';
	player.overlap(sparks);
	player.overlap(explosions);
	explosions.overlap(asteroids);
	asteroids.overlap(asteroids);

	player.ghostTime = 0;

	player.overlap(asteroids, (player, asteroid) => {
		if (player.ghostTime == 0) {
			placeAsteroid(asteroid);
			play(crashSound);
			let explosion = new explosions.Sprite('default', player.x, player.y);
			explosion.life = 20;
			health -= 42;
			player.ghostTime = 180;
			if (health < 0) {
				gameOver('You got hit too many times, your ship was destroyed.');
			}
		}
	});

	sparks.collide(asteroids, explosion);
	mainMenu();
}

// position asteroids
function placeAsteroids() {
	// for (let i = 0; i < allAsteroids.length; i++) {
	// 	placeAsteroid(allAsteroids[i]);
	// }
	for (let i = 0; i < asteroids.length; i++) {
		placeAsteroid(asteroids[i]);
	}
	for (let i = 0; i < bgAsteroids.length; i++) {
		placeAsteroid(bgAsteroids[i]);
	}
	for (let i = 0; i < frAsteroids.length; i++) {
		placeAsteroid(frAsteroids[i]);
	}
}

async function timer() {
	text(time.toString().padStart(3, ' '), 32, 24);
	await delay(1000);
	time--;
	if (!isInGame) return;
	if (time == 0) {
		gameOver('You ran out of time!');
		return;
	}
	timer();
}

async function gameOver(msg) {
	play(gameOverSound);
	isInGame = false;
	time = 1;
	await alert(msg + ' Game Over. Try Again?');
	startGame();
}

async function gameWon(msg) {
	isInGame = false;
	time = 1;
	await alert(msg + 'You Won! Try doing the next lvl!');
}

function nextNumber() {
	shouldShootNumber = false;
	equation = [objective];

	displayEquation();

	if (mode == 'add' && objective == 100) {
		gameWon();
		return;
	}

	for (let asteroid of asteroids) {
		if (asteroid.y < -10) {
			changeAsteroidData(asteroid);
		}
	}

	setObjective();
	time += 30;
	health += 21;
}

function changeAsteroidData(asteroid) {
	if (mode == 'add & subtract' && numMode == 'fraction') {
		if (Math.random() < symbOrNum) {
			let chance = Math.random();
			if (chance < 0.5) {
				//make denominater near goal
				asteroid.data = Math.floor(Math.random() * 7) + '\n' + Math.ceil(Math.random() * 5);
			} else if (equation.length && chance < 0.75) {
				asteroid.data = Math.floor(Math.random() * 7) + '\n' + equation[0][2];
			} else {
				asteroid.data = Math.floor(Math.random() * 7) + '\n' + objective[2];
			}
		} else {
			asteroid.data = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
		}
	} else {
		if (Math.random() < symbOrNum) {
			asteroid.data = Math.floor(Math.random() * 10);
		} else {
			asteroid.data = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
		}
	}
}

function placeAsteroid(asteroid) {
	let placed = false;
	// while (!placed || asteroid.overlap(asteroids)) {
	while (!placed) {
		asteroid.x = Math.floor(Math.random() * 320);
		asteroid.y = Math.floor(Math.random() * -1600);
		placed = true;
	}

	if (asteroids.includes(asteroid)) {
		changeAsteroidData(asteroid);
		asteroid.velocity.x = random(-0.1, 0.1);
		asteroid.velocity.y = 0.8;
		asteroid.rotation = random(0, 360);
		asteroid.rotationSpeed = random(-1, 1);
	} else if (bgAsteroids.includes(asteroid)) {
		asteroid.velocity.x = random(-0.1, 0.1);
		asteroid.velocity.y = 0.4;
		asteroid.rotation = random(0, 360);
		asteroid.rotationSpeed = random(-1, 1);
	} else if (frAsteroids.includes(asteroid)) {
		asteroid.velocity.x = random(-0.1, 0.1);
		asteroid.velocity.y = 1.2;
		asteroid.rotation = random(0, 360);
		asteroid.rotationSpeed = random(-1, 1);
	}
}

function setObjective() {
	// TODO don't let it pick the same number
	let prevObjective = objective;
	while (objective == prevObjective) {
		if (mode == 'add & subtract' && numMode == 'num') {
			objective += Math.floor(Math.random() * 40 - 20);
		} else if (mode == 'add & subtract' && numMode == 'fraction') {
			objective = Math.floor(Math.random() * 7) + '/' + Math.ceil(Math.random() * 5);
		} else if (mode == 'add') {
			objective += Math.floor(Math.random() * 20);
		} else if (mode == 'subtract') {
			objective -= Math.floor(Math.random() * 20);
		} else {
			objective = Math.floor(Math.random() * 100);
		}
		if (objective > 100 && mode == 'add') {
			objective = 100;
		}
	}
	if (numMode != 'fraction') {
		textRect(31, 0, 3, 17);
		textRect(31, 17, 3, 6);
		textRect(31, 23, 3, 5);
		text(('=' + objective).padEnd(4, ' '), 32, 18);
	} else {
		textRect(30, 0, 5, 17);
		textRect(30, 17, 5, 6);
		textRect(30, 23, 5, 5);
		text('=', 32, 18);
		text(objective.replace('/', '\n-\n').padEnd(4, ' '), 31, 19);
	}
}

function makeTheme() {
	if (mode == 'add') {
		let planet = new bgProps.Sprite(themes.blue.planet, 50, 20);
		planet.vel.y = 0.01;
		planet.scale = 2;
	}

	if (mode == 'subtract') {
		theme = 'green';

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

		equation = [100];
		objective = 100;
		shouldShootNumber = false;
		displayEquation();
	}
	if (mode == 'add & subtract') {
		theme = 'desert';

		for (let i = 0; i < 40; i++) {
			let prevY = 100;
			if (bgProps[i - 1]) prevY = bgProps[i - 1].y;

			let tpClouds = new bgProps.Sprite(themes.desert.tpClouds, 170, prevY - random(40, 70) * i);
			if (i % 3) tpClouds.y -= 300;
			tpClouds.scale = 1.5;
			tpClouds.vel.x = random(-0.005, 0.005);
			tpClouds.vel.y = random(0.15, 0.25);
			tpClouds.mirrorX = Math.random() > 0.5;
			tpClouds.mirrorY = Math.random() > 0.5;
			log(tpClouds.y);

			let clouds = new bgProps.Sprite(themes.desert.clouds, 170, prevY - random(40, 70) * i);
			if (i % 3) clouds.y -= 300;
			clouds.scale = 1.5;
			clouds.vel.x = random(-0.005, 0.005);
			clouds.vel.y = random(0.15, 0.25);
			clouds.mirrorX = Math.random() > 0.5;
			clouds.mirrorY = Math.random() > 0.5;
			log(clouds.y);
		}
	}
	if (mode == 'all') {
		theme = 'orange';

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
	text(' '.repeat(15), 31, 1);
	text(' '.repeat(15), 32, 1);
	text(' '.repeat(15), 33, 1);
	equation = [];
	shouldShootNumber = true;
	setObjective();
	placeAsteroids();
	if (moreBg) {
		makeTheme();
	}
	moreBg = false;
	time = 60;
	health = 288;

	await delay(1000);
	isInGame = true;
	timer();
}

function mainMenu() {
	text('Number Dash', 5, 5);
	text('Select Game Mode', 7, 5);

	button('Addition', 9, 5, () => {
		mode = 'add';
		mathSymbols = ['+'];
		symbOrNum = 0.7;
		erase();
		startGame();
	});

	button('Subtract', 11, 5, () => {
		mode = 'subtract';
		mathSymbols = ['-'];
		symbOrNum = 0.7;
		erase();
		startGame();
	});

	button('Add and Subtract', 13, 5, () => {
		mode = 'add & subtract';
		mathSymbols = ['+', '-'];
		symbOrNum = 0.5;
		erase();
		startGame();
	});
	button('Add, Subtract, Multiply, and Divide', 15, 5, () => {
		mode = 'all';
		mathSymbols = ['+', '-', 'x', '÷'];
		symbOrNum = 0.5;
		erase();
		startGame();
	});
	button('fractions', 17, 5, () => {
		mode = 'add & subtract';
		numMode = 'fraction';
		mathSymbols = ['+', '-'];
		symbOrNum = 0.5;
		erase();
		startGame();
	});
}

function draw() {
	if (player.ghostTime > 0) {
		player.ghostTime--;
	}
	image(themes[theme].bg, 0, 0, 320, 544);
	if (mode == 'add' || mode == 'subtract' || mode == 'all') {
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

		fill(255, 80, 70);
		rect(4, 360, health, 3);

		player.moveTowards(mouseX, mouseY, 0.1);

		for (let explosion of explosions) {
			explosion.moveTowards(player.x, player.y, 1);
		}

		if (keyIsDown('a')) {
			player.rotation -= 5;
		}
		if (keyIsDown('d')) {
			player.rotation += 5;
		}
		player.angularVelocity = 0;

		if (!isPaused) updateSprites();

		bgProps.draw();

		push();
		tint(200);
		bgAsteroids.draw();
		pop();

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
			if (asteroid.data.toString().length == 1) {
				textSize(20);
				drawText(asteroid.data, asteroid.x - 6, asteroid.y + 4);
			} else {
				textSize(12);
				drawText(asteroid.data, asteroid.x - 6, asteroid.y - 4);
				drawText('_', asteroid.x - 6, asteroid.y - 2);
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
	}
}

function restartGame() {
	isPaused = false;
	noTint();
	startGame();
	eraseRect(0, 0, 26, 28);
}

function keyPressed() {
	if (key == ' ') {
		isPaused = !isPaused;
		if (isPaused) {
			tint(128, 32);

			button('restart', 20, 4, restartGame);
		} else {
			noTint();
			eraseRect(0, 0, 26, 28);
		}
	}
}

function explosion(spark, asteroid) {
	spark.x = 1000;
	spark.y = 1000;
	spark.velocity.x = 0;
	spark.velocity.y = 0;

	asteroid.velocity.x = 0;
	asteroid.velocity.y = 0.2;

	log(asteroid);
	let data = asteroid.data;

	if (data == '') {
		placeAsteroid(asteroid);
		return;
	}

	if (mathSymbols.includes(data) && shouldShootNumber) {
		play(wrongHitSound);
		return;
	}
	if (!mathSymbols.includes(data) && !shouldShootNumber) {
		play(wrongHitSound);
		return;
	}
	play(hitSound);
	shouldShootNumber = !shouldShootNumber;
	if (numMode == 'fraction' && !mathSymbols.includes(data)) {
		data = data.replace('\n', '/');
	}
	equation.push(data);

	displayEquation();

	if (gotObjective()) {
		nextNumber();
	} else if (equation.length > 14) {
		// if there is too many numers on eq box
		gameOver('Your equation is too long.');
	}

	placeAsteroid(asteroid);
}

function displayEquation() {
	if (numMode != 'fraction') {
		text(' '.repeat(15), 32, 1); // erase
		text(equation.join(''), 32, 1);
	} else {
		text(' '.repeat(15), 31, 1); // erase
		text(' '.repeat(15), 32, 1);
		text(' '.repeat(15), 33, 1);

		// equation -> ['3/4', '+', '1/2']
		// 3 1
		// -+-
		// 4 2

		let top = '';
		let mid = '';
		let low = '';

		for (let item of equation) {
			if (item.length > 1) {
				top += item[0];
				mid += '-';
				low += item[2];
			} else {
				top += ' ';
				mid += item;
				low += ' ';
			}
		}
		text(top, 31, 1);
		text(mid, 32, 1);
		text(low, 33, 1);
	}
}

function mousePressed() {
	if (isInGame) {
		let spark = sparks[sparkCount];
		play(shootSound);
		spark.x = player.x - 4;
		spark.y = player.y;

		spark.rotation = player.rotation + 180;
		spark.direction = spark.rotation;
		spark.speed = 5;

		// ternary condition, used to write if + else  on one line
		spark.ani = 'spark' + (shouldShootNumber ? 0 : 1);
		if (spark) sparkCount++;
		if (sparkCount == 10) {
			sparkCount = 0;
		}
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

function gotObjective() {
	// check if equation does not end with math symbol
	if (!mathSymbols.includes(equation[equation.length - 1])) {
		let lcm = 1;
		// create new array with contents of the equation array
		// so that we can edit it without changing the equation array
		let jsEq = [...equation];

		if (numMode == 'fraction') {
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
			if (jsEq[i] == '÷') {
				let result = Math.round(jsEq[i - 1] / jsEq[i + 1]);
				jsEq.splice(i - 1, 3, result);
				i -= 2;
			} else if (jsEq[i] == 'x') {
				jsEq[i] = '*';
			}
		}

		let goal = objective;
		if (numMode == 'fraction') {
			let multiple = lcm / goal[2];
			goal = goal[0] * multiple;
		}

		let result = eval(jsEq.join(''));
		if (result == goal) {
			return true;
		}
		if (mode == 'add' && result > goal) {
			gameOver('The result of your equation is higher than the objective.');
		}
		if (mode == 'subtract' && result < goal) {
			gameOver('The result of your equation is lower than the objective.');
		}
	}
}
