// set the initial animation and position for the player ship
player.ani("idle");
player.x = 160 - player.w / 2;
player.y = 300;

// init variables
let sparkCount = 0;
let objective = 0;

// position asteroids
for (let i = 0; i < asteroids.length; i++) {
	let asteroid = asteroids[i];
	placeAsteroid(asteroid);
	asteroid.velocity.y = 0.2;
}

function placeAsteroid(asteroid) {
	asteroid.x = Math.floor(Math.random() * 320);
	asteroid.y = Math.floor(Math.random() * -60);
	if (Math.random() > 0.3) {
		asteroid.data = Math.floor(Math.random() * 20);
	} else {
		let symbols = ["+", "-", "x", "÷"];
		asteroid.data = symbols[Math.floor(Math.random() * 4)];
		log(asteroid.data);
	}
}

function getObjective() {
	objective = Math.floor(Math.random() * 100);
	textRect(0, 23, 4, 3);
	text(objective, 1, 24);
}
getObjective();

function draw() {
	player.x += (mouseX - player.w / 2 - player.x) * 0.1;
	player.y += (mouseY - player.h / 2 - player.y) * 0.1;

	player.collide(asteroids);

	drawSprites();
	fill(255);
	for (let i = 0; i < asteroids.length; i++) {
		let asteroid = asteroids[i];
		if (asteroid.y > 460) {
			placeAsteroid(asteroid);
		}
		drawText(asteroid.data, asteroid.x + 7, asteroid.y + 10);
	}

	asteroids.collide(sparks, explosion);
}

function explosion(spriteA, spriteB) {
	placeAsteroid(spriteA);
	spriteB.x = 1000;
	spriteB.y = 1000;
}

function mousePressed() {
	sparks[sparkCount].x = player.x - 4;
	sparks[sparkCount].y = player.y;
	sparks[sparkCount].velocity.y = -5;
	sparkCount++;
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
