player.ani("idle");

player.x = 160 - player.w / 2;
player.y = 300;

function draw() {
	player.x += (mouseX - player.w / 2 - player.x) * 0.1;
	player.y += (mouseY - player.h / 2 - player.y) * 0.1;

	drawSprites();
}
