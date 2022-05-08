// set the initial animation and position for the player ship
player.ani("idle");
player.x = 160 - player.w / 2;
player.y = 300;

// init variables
let sparkCount = 0;
let objective = 0;
let equation = "";
let eqCount = 0;
let mathSymbols = ["+", "-", "x", "÷"];

// position asteroids
for (let i = 0; i < asteroids.length; i++) {
	let asteroid = asteroids[i];
	placeAsteroid(asteroid);
	asteroid.velocity.y = 0.2;
}

eraseRect(0, 0, 28, 5);

function placeAsteroid(asteroid) {
	let placed = false;
	while (!placed || asteroid.overlap(asteroids)) {
		asteroid.x = Math.floor(Math.random() * 320);
		asteroid.y = Math.floor(Math.random() * -400);
		placed = true;
	}

	if (Math.random() > 0.3) {
		asteroid.data = Math.floor(Math.random() * 20);
	} else {
		asteroid.data = mathSymbols[Math.floor(Math.random() * 4)];
		log(asteroid.data);
	}
}

function getObjective() {
	objective = Math.floor(Math.random() * 100);
	textRect(31, 1, 21, 3);
	textRect(31, 22, 5, 3);
	text("=" + objective, 32, 23);
}
getObjective();

function draw() {
	player.x += (mouseX - player.w / 2 - player.x) * 0.1;
	player.y += (mouseY - player.h / 2 - player.y) * 0.1;

	if (isKeyDown("a")) {
		player.rotation -= 5;
	}
	if (isKeyDown("d")) {
		player.rotation += 5;
	}

	player.collide(asteroids);

	drawSprites();

	fill(255);

	// draw asteroids
	for (let i = 0; i < asteroids.length; i++) {
		let asteroid = asteroids[i];
		// recycle asteroids that get placed off screen
		if (asteroid.y > 460) {
			placeAsteroid(asteroid);
		}
		drawText(asteroid.data, asteroid.x + 7, asteroid.y + 10);
	}

	asteroids.overlap(sparks, explosion);
}

function explosion(asteroid, spark) {
	spark.x = 1000;
	spark.y = 1000;

	console.log(asteroid);
	let data = asteroid.data;

	if (isNaN(data) && eqCount % 2 == 0) {
		return;
	}
	if (!isNaN(data) && eqCount % 2 == 1) {
		return;
	}

	equation += data;
	eqCount++;
	text(equation, 32, 2);
	placeAsteroid(asteroid);
}

function mousePressed() {
	let spark = sparks[sparkCount];
	spark.x = player.x - 4;
	spark.y = player.y;

	spark.rotation = player.rotation + 180;
	spark.setSpeed(5, player.rotation + 180);

	spark.ani("spark" + (eqCount % 2));
	if (spark) sparkCount++;
	if (sparkCount == 10) {
		sparkCount = 0;
	}
	log(sparkCount);
}

// group.overlap(otherSprite, explosion);

// function explosion(spriteA, spriteB) {
//   spriteA.remove();
//   spriteB.score++;
// }
