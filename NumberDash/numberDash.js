// set the initial animation and position for the player ship
player.ani("idle");
player.overlap(sparks);
player.overlap(explosions);
explosions.overlap(asteroids);
asteroids.overlap(asteroids);

player.ghostTime = 0;

player.overlap(asteroids, (player, asteroid) => {
	if (player.ghostTime == 0) {
		placeAsteroid(asteroid);
		play(crashSound);
		let explosion = explosions.sprite("default", player.x, player.y);
		explosion.life = 20;
		health -= 42;
		player.ghostTime = 180;
		if (health < 0) {
			gameOver("You got hit too many times, your ship was destroyed.");
		}
	}
});

// init variables
let sparkCount = 0;
let objective = 10;
let equation = [];
let shouldShootNumber = true;
let mathSymbols;
let time = 60;
let health = 312;
let isPlaying = false;
let mode;
let symbOrNum;
let moreBg = true;

eraseRect(0, 0, 28, 5);

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
	text(time.toString().padStart(3, " "), 32, 24);
	await delay(1000);
	time--;
	if (!isPlaying) return;
	if (time == 0) {
		gameOver("You ran out of time!");
		return;
	}
	timer();
}

async function gameOver(msg) {
	play(gameOverSound);
	isPlaying = false;
	time = 1;
	await alert(msg + " Game Over. Try Again?");
	startGame();
}

async function gameWon(msg) {
	isPlaying = false;
	time = 1;
	await alert(msg + "You Won! Try doing the next lvl!");
}

function nextNumber() {
	shouldShootNumber = false;
	equation = [objective];
	text(" ".repeat(15), 32, 1); // erase
	text(equation.join(""), 32, 1);

	if (mode == "add" && objective == 100) {
		gameWon();
		return;
	}

	setObjective();
	time += 30;
	health += 21;
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
		if (Math.random() < symbOrNum) {
			asteroid.data = Math.floor(Math.random() * 10);
		} else {
			asteroid.data =
				mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
		}
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
		if (mode == "add & subtract") {
			objective += Math.floor(Math.random() * 40 - 20);
		} else if (mode == "add") {
			objective += Math.floor(Math.random() * 20);
		} else if (mode == "subtract") {
			objective -= Math.floor(Math.random() * 20);
		} else {
			objective = Math.floor(Math.random() * 100);
		}
		if (objective > 100 && mode == "add") {
			objective = 100;
		}
	}
	textRect(31, 0, 3, 17);
	textRect(31, 17, 3, 6);
	textRect(31, 23, 3, 5);
	text(("=" + objective).padEnd(4, " "), 32, 18);
}

async function startGame() {
	text(" ".repeat(15), 32, 1);
	placeAsteroids();
	if (moreBg) {
		if (mode == "add") {
			let planet = new Sprite(themes.blue.planet, 50, 20, "none");
			planet.vel.y = 0.01;
			planet.scale = 2;
			planet.layer = 0;
			bgProps.add(planet);
		}

		if (mode == "subtract") {
			theme = "green";

			let planet = new Sprite(themes.green.planet, 50, 20, "none");
			planet.layer = 0;
			planet.vel.x = 0.02;
			planet.vel.y = 0.005;
			bgProps.add(planet);

			let planet1 = new Sprite(themes.green.planet1, 100, 300, "none");
			planet1.layer = 0;
			planet1.scale = 1.5;
			planet1.vel.x = 0.01;
			planet1.vel.y = 0.01;
			bgProps.add(planet1);

			let ring = new Sprite(themes.green.ring, 200, 150, "none");
			ring.layer = 0;
			ring.scale = 2;
			ring.vel.y = 0.005;
			bgProps.add(ring);

			equation = [100];
			objective = 100;
			shouldShootNumber = false;
			text(equation.join(""), 32, 1);
		} else {
			equation = [];
			objective = 0;
			shouldShootNumber = true;
		}
	}
	moreBg = false;
	setObjective();
	time = 60;
	health = 288;

	await delay(1000);
	isPlaying = true;
	timer();
}

function mainMenu() {
	text("Number Dash", 5, 5);
	text("Select Game Mode", 7, 5);

	button("Addition", 9, 5, () => {
		mode = "add";
		mathSymbols = ["+"];
		symbOrNum = 0.7;
		erase();
		startGame();
	});

	button("Subtract", 11, 5, () => {
		mode = "subtract";
		mathSymbols = ["-"];
		symbOrNum = 0.7;
		erase();
		startGame();
	});

	button("Add and Subtract", 13, 5, () => {
		mode = "add & subtract";
		mathSymbols = ["+", "-"];
		symbOrNum = 0.5;
		erase();
		startGame();
	});
	button("Add, Subtract, Multiply, and Divide", 15, 5, () => {
		mode = "all";
		mathSymbols = ["+", "-", "x", "÷"];
		symbOrNum = 0.5;
		erase();
		startGame();
	});
}

mainMenu();

let starsOpacity = 255;
let starsShine = false;

function draw() {
	if (player.ghostTime > 0) {
		player.ghostTime--;
	}
	image(themes[theme].bg, 0, 0, 320, 544);
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
	if (isPlaying) {
		if (health <= 0 || time <= 0) return;

		fill(255, 80, 70);
		rect(4, 360, health, 3);

		player.moveTowards(mouseX, mouseY, 0.1);

		for (let explosion of explosions) {
			explosion.moveTowards(player.x, player.y, 1);
		}

		if (isKeyDown("a")) {
			player.rotation -= 5;
		}
		if (isKeyDown("d")) {
			player.rotation += 5;
		}
		player.angularVelocity = 0;

		updateSprites();
		drawSprites(bgProps);

		push();
		tint(200);
		drawSprites(bgAsteroids);
		pop();

		drawSprites(asteroids);
		drawSprites(sparks);

		push();
		if (player.ghostTime > 0 && frameCount % 30 < 15) {
			tint(255, 128);
		}

		player.display();
		drawSprites(explosions);
		pop();

		fill(255);
		// draw asteroid data
		for (let i = 0; i < asteroids.length; i++) {
			let asteroid = asteroids[i];
			// recycle asteroids that get placed off screen
			if (asteroid.y > 460) {
				placeAsteroid(asteroid);
			}
			drawText(asteroid.data, asteroid.x, asteroid.y);
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
		drawSprites(frAsteroids);
	}
}

sparks.collide(asteroids, explosion);

function explosion(spark, asteroid) {
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

	if (isNaN(data) && shouldShootNumber) {
		play(wrongHitSound);
		return;
	}
	if (!isNaN(data) && !shouldShootNumber) {
		play(wrongHitSound);
		return;
	}
	play(hitSound);
	shouldShootNumber = !shouldShootNumber;
	equation.push(data);
	text(equation.join(""), 32, 1);
	if (equation.length > 14) {
		// if there is too many numers on eq box
		gameOver("Your equation is too long.");
	}

	if (gotObjective()) {
		nextNumber();
	}

	placeAsteroid(asteroid);
}

function mousePressed() {
	if (isPlaying) {
		let spark = sparks[sparkCount];
		play(shootSound);
		spark.x = player.x - 4;
		spark.y = player.y;

		spark.rotation = player.rotation + 180;
		spark.rotationLocked = true;
		spark.setSpeed(5, player.rotation + 180);

		// ternary condition, used to write if + else  on one line
		spark.ani("spark" + (shouldShootNumber ? 0 : 1));
		if (spark) sparkCount++;
		if (sparkCount == 10) {
			sparkCount = 0;
		}
	}
}

function gotObjective() {
	// create new array with contents of the equation array
	// so that we can edit it without changing the equation array
	if (!mathSymbols.includes(equation[equation.length - 1])) {
		let jsEq = [...equation];
		for (let i = 1; i < jsEq.length; i += 2) {
			if (jsEq[i] == "÷") {
				let result = Math.round(jsEq[i - 1] / jsEq[i + 1]);
				jsEq.splice(i - 1, 3, result);
				i -= 2;
			} else if (jsEq[i] == "x") {
				jsEq[i] = "*";
			}
		}

		let result = eval(jsEq.join(""));
		if (result == objective) {
			return true;
		}
		if (mode == "add" && result > objective) {
			gameOver("The result of your equation is higher than the objective.");
		}
		if (mode == "subtract" && result < objective) {
			gameOver("The result of your equation is lower than the objective.");
		}
	}
}
