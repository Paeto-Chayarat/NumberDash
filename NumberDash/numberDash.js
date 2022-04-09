player.ani("idle");

player.x = 160 - player.w / 2;
player.y = 300;

for (let i = 0; i < asteroids.length; i++) {
	let number = numbers.createSprite("number" + i, 0, i);
	let asteroid = asteroids[i];

	asteroid.x = Math.floor(Math.random() * 320);
	asteroid.y = Math.floor(Math.random() * -60);
	number.x = asteroid.x + 5;
	number.y = asteroid.y + 2;

	asteroid.velocity.y = 0.2;
	number.velocity.y = 0.2;
}

function draw() {
	player.x += (mouseX - player.w / 2 - player.x) * 0.1;
	player.y += (mouseY - player.h / 2 - player.y) * 0.1;

	player.collide(asteroids);

	drawSprites();
}

function mousePressed() {
	log("hi");
	shots[0].x = player.x - 4;
	shots[0].y = player.y;
	shots[0].velocity.y = -5;
}
