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
