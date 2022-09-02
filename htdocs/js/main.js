'use strict'
var canvas = document.getElementById("myCanvas");

if (canvas) {
	var ctx = canvas.getContext("2d");

	// параметры мяча
	var x = canvas.width / 2;
	var y = canvas.height - 30;
	var dx = 3;
	var dy = -3;

	var ballRadius = 10;

	// параметры ракетки
	var paddleHeight = 10;
	var paddleWidth = 75;
	var paddleX = (canvas.width-paddleWidth)/2;

	var rightPressed = false;
	var leftPressed = false;

	// параметры блоков
	var brickRowCount = 3;
	var brickColumnCount = 5;
	var brickWidth = 75;
	var brickHeight = 20;
	var brickPadding = 10;
	var brickOffsetTop = 30;
	var brickOffsetLeft = 30;

	var bricks = [];

	for(var c=0; c<brickColumnCount; c++) {
		bricks[c] = [];
		for(var r=0; r<brickRowCount; r++) {
			bricks[c][r] = { x: 0, y: 0, status: 1 };
		}
	}

	// параметры счета
	var score = 0;
	var lives = 3;

	function drawBall() {
		ctx.beginPath();
		ctx.arc(x, y, ballRadius, 0, Math.PI*2);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.closePath();
	}

	function drawPaddle() {
		ctx.beginPath();
		ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.closePath();
	}

	function drawBricks() {
		for(var c=0; c<brickColumnCount; c++) {
			for(var r=0; r<brickRowCount; r++) {
				if(bricks[c][r].status == 1) {
					var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
					var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
					bricks[c][r].x = brickX;
					bricks[c][r].y = brickY;
					ctx.beginPath();
					ctx.rect(brickX, brickY, brickWidth, brickHeight);
					ctx.fillStyle = "#0095DD";
					ctx.fill();
					ctx.closePath();
				}
			}
		}
	}

	function drawScore() {
		ctx.font = "16px Arial";
		ctx.fillStyle = "#0095DD";
		ctx.fillText("Score: "+score, 8, 20);
	}

	function drawLives() {
		ctx.font = "16px Arial";
		ctx.fillStyle = "#0095DD";
		ctx.fillText("Lives: "+lives, canvas.width-65, 20);
	}

	// функция обнаружения столкновения
	function collisionDetection() {
		for(var c=0; c<brickColumnCount; c++) {
			for(var r=0; r<brickRowCount; r++) {
				var b = bricks[c][r];

				if(b.status == 1) {
					// if
					// координата X шара больше, чем координата X кирпича.
					// координата X шара меньше, чем  X-координата кирпича плюс его ширина.
					// координата Y шара больше, чем Y-координата кирпича.
					// координата Y шара меньше, чем Y-координата кирпича плюс его высота.
					if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
						dy = -dy;
						b.status = 0;
						score++;

						// вывод результатов игры
						if(score == brickRowCount*brickColumnCount) {
							alert("YOU WIN, CONGRATULATIONS!");
							document.location.reload();
						}
					}
				}
			}
		}
	}

	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBall();
		drawPaddle();
		drawBricks();
		drawScore();
		drawLives();
		collisionDetection();
		x += dx;
		y += dy;


		// движение мяча
		if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
			dx = -dx;
		}

		if(y + dy < ballRadius) {
			dy = -dy;
		} else if(y + dy > canvas.height-ballRadius) {
			if(x > paddleX && x < paddleX + paddleWidth) {
				dy = -dy;
			}
			else {
				lives--;
				if(!lives) {
					alert("GAME OVER");
					document.location.reload();
					// clearInterval(interval); // требуется для Chrome, чтобы завершить игру
				}
				else {
					x = canvas.width/2;
					y = canvas.height-30;
					dx = 3;
					dy = -3;
					paddleX = (canvas.width-paddleWidth)/2;
				}   
			}   
		}

		// движение ракетки
		if (rightPressed && paddleX < canvas.width-paddleWidth) {
			paddleX += 7;
		}
		else if (leftPressed && paddleX > 0) {
			paddleX -= 7;
		}

		requestAnimationFrame(draw);
	}

	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	document.addEventListener("mousemove", mouseMoveHandler, false);

	function keyDownHandler(e) {
		if (e.keyCode == 39) {
			rightPressed = true;
		}
		else if (e.keyCode == 37) {
			leftPressed = true;
		}
	}

	function keyUpHandler(e) {
		if (e.keyCode == 39) {
			rightPressed = false;
		}
		else if (e.keyCode == 37) {
			leftPressed = false;
		}
	}

	function mouseMoveHandler(e) {
		var relativeX = e.clientX - canvas.offsetLeft;
		if(relativeX - paddleWidth/2 > 0 && relativeX + paddleWidth/2 < canvas.width) {
			paddleX = relativeX - paddleWidth/2;
		}
	}

	draw();
}

var body = document.querySelector('body')

if (body.classList.value === 'phaser') {
	var game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
		preload: preload, create: create, update: update
	});

	var ball;
	
	function preload() {
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.stage.backgroundColor = '#eee';
		game.load.image('ball', '../img/ball.png');
	}

	function create() {
		game.physics.startSystem(Phaser.Physics.ARCADE);
		ball = game.add.sprite(50, 50, 'ball');
		game.physics.enable(ball, Phaser.Physics.ARCADE);
		ball.body.velocity.set(150, 150);
	}
	function update() {
	}
}
