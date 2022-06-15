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
		let explosion = explosions.sprite("default", player.x, player.y);
		explosion.life = 20;
		health -= 42;
		player.ghostTime = 180;
		if (health < 0) {
			gameOver();
		}
	}
});

// init variables
let sparkCount = 0;
let objective = 10;
let equation = [];
let shouldShootNumber = true;
let mathSymbols = ["+", "-", "x", "÷"];
let time = 60;
let health = 312;
let runtime = true;
let isPlaying = false;
let symbolRange = 2;

eraseRect(0, 0, 28, 5);

// position asteroids
function placeAsteroids() {
	for (let i = 0; i < asteroids.length; i++) {
		let asteroid = asteroids[i];
		placeAsteroid(asteroid);
		asteroid.velocity.x = random(-0.1, 0.1);
		asteroid.velocity.y = 0.8;
		asteroid.rotation = random(0, 360);
		asteroid.rotationSpeed = random(-1, 1);
	}
}

async function timer() {
	if (runtime) {
		await delay(1000);
		time--;
		text(time.toString().padStart(3, " "), 32, 24);
		if (time == 0) {
			gameOver();
			return;
		}
		timer();
	}
}

async function gameOver() {
	time = 1;
	runtime = false;
	await alert("Game Over. Try Again?");
	setObjective();
	shouldShootNumber = true;
	placeAsteroids();
	equation = [];
	text(" ".repeat(15), 32, 2);
	time = 60;
	health = 288;
	runtime = true;
	timer();
}

function nextNumber() {
	shouldShootNumber = false;
	equation = [objective];
	text(" ".repeat(15), 32, 1); // erase
	text(equation.join(""), 32, 1);
	setObjective();
	time += 30;
}

function placeAsteroid(asteroid) {
	let placed = false;
	// while (!placed || asteroid.overlap(asteroids)) {
	while (!placed) {
		asteroid.x = Math.floor(Math.random() * 320);
		asteroid.y = Math.floor(Math.random() * -1600);
		placed = true;
	}

	if (Math.random() < 0.5) {
		asteroid.data = Math.floor(Math.random() * 10);
	} else {
		asteroid.data = mathSymbols[Math.floor(Math.random() * symbolRange)];
	}
}

function setObjective() {
	// TODO don't let it pick the same number
	let prevObjective = objective;
	while (objective == prevObjective) {
		if (symbolRange == 2) {
			objective += Math.floor(Math.random() * 40 - 20);
		} else {
			objective = Math.floor(Math.random() * 100);
		}
	}
	textRect(31, 0, 3, 17);
	textRect(31, 17, 3, 6);
	textRect(31, 23, 3, 5);
	text(("=" + objective).padEnd(3, " "), 32, 18);
}

async function startGame() {
	erase();
	placeAsteroids();
	timer();
	setObjective();
	await delay(1000);
	isPlaying = true;
}

function mainMenu() {
	text("Number Dash", 5, 5);
	text("Select Game Mode", 7, 5);

	button("Add and Subtract", 10, 5, () => {
		symbolRange = 2; // sets it to -/+
		startGame();
	});
	button("Add, Subtract, Multiply, and Divide", 12, 5, () => {
		symbolRange = 4; // sets it to -/+/x/÷
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
	image(bg, 0, 0, 320, 544);
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

	image(stars, 0, 0, 320, 544);
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
		planet.display();
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
		return;
	}
	if (!isNaN(data) && !shouldShootNumber) {
		return;
	}
	shouldShootNumber = !shouldShootNumber;
	equation.push(data);
	text(equation.join(""), 32, 1);

	if (gotObjective()) {
		nextNumber();
	}

	placeAsteroid(asteroid);
}

function mousePressed() {
	if (isPlaying) {
		let spark = sparks[sparkCount];
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

		if (eval(jsEq.join("")) == objective) {
			return true;
		}
	}
}
