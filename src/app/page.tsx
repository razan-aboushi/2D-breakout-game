"use client";
import {useEffect, useRef} from "react";
import {CanvasContainer, CanvasStyled} from "@/app/styled.compoents";
import Swal from "sweetalert2";

export default function Home() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const ballRadius = 10;
        let x = canvas.width / 2;
        let y = canvas.height - 30;
        let dx = 2;
        let dy = -2;
        const paddleHeight = 10;
        const paddleWidth = 75;
        let paddleX = (canvas.width - paddleWidth) / 2;
        let rightPressed = false;
        let leftPressed = false;
        const brickRowCount = 5;
        const brickColumnCount = 3;
        const brickWidth = 75;
        const brickHeight = 20;
        const brickPadding = 10;
        const brickOffsetTop = 30;
        const brickOffsetLeft = 30;
        let score = 0;
        let lives = 3;

        const bricks = [];
        for (let r = 0; r < brickColumnCount; r++) {
            bricks[r] = [];
            for (let c = 0; c < brickRowCount; c++) {
                bricks[r][c] = {x: 0, y: 0, status: 1};
            }
        }

        const keyDownHandler = (e) => {
            if (e.keyCode === 39) {
                rightPressed = true;
            } else if (e.keyCode === 37) {
                leftPressed = true;
            }
        }

        const keyUpHandler = (e) => {
            if (e.keyCode === 39) {
                rightPressed = false;
            } else if (e.keyCode === 37) {
                leftPressed = false;
            }
        }

        const mouseMoveHandler = (e) => {
            const relativeX = e.clientX - canvas.offsetLeft;
            if (relativeX > 0 && relativeX < canvas.width) {
                paddleX = relativeX - paddleWidth / 2;
            }
        }

        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
        document.addEventListener("mousemove", mouseMoveHandler, false);

        const collisionDetection = () => {
            for (let i = 0; i < brickColumnCount; i++) {
                for (let j = 0; j < brickRowCount; j++) {
                    const b = bricks[i][j];
                    if (b.status === 1) {
                        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                            dy = -dy;
                            b.status = 0;
                            score++;
                            if (score === brickRowCount * brickColumnCount) {
                                Swal.fire("Congratulations, you win!");
                                window.location.reload();
                            }
                        }
                    }
                }
            }
        }

        const drawBall = () => {
            context.beginPath();
            context.arc(x, y, ballRadius, 0, Math.PI * 2);
            context.fillStyle = "#800080";
            context.fill();
            context.closePath();
        }

        const drawPaddle = () => {
            context.beginPath();
            context.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
            context.fillStyle = "#800080";
            context.fill();
            context.closePath();
        }

        const drawBricks = () => {
            for (let i = 0; i < brickColumnCount; i++) {
                for (let j = 0; j < brickRowCount; j++) {
                    if (bricks[i][j].status === 1) {
                        const brickX = (j * (brickWidth + brickPadding)) + brickOffsetLeft;
                        const brickY = (i * (brickHeight + brickPadding)) + brickOffsetTop;
                        bricks[i][j].x = brickX;
                        bricks[i][j].y = brickY;
                        context.beginPath();
                        context.rect(brickX, brickY, brickWidth, brickHeight);
                        context.fillStyle = "#800080";
                        context.fill();
                        context.closePath();
                    }
                }
            }
        }

        const drawScore = () => {
            context.font = "18px Arial";
            context.fillStyle = "#000000";
            context.fillText("Score: " + score, 10, 20);
        }

        const drawLives = () => {
            context.font = "18px Arial";
            context.fillStyle = "#000000";
            context.fillText("Lives: " + lives, canvas.width - 65, 20);
        }

        const draw = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawBricks();
            drawBall();
            drawPaddle();
            drawScore();
            drawLives();
            collisionDetection();

            if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
                dx = -dx;
            }
            if (y + dy < ballRadius) {
                dy = -dy;
            } else if (y + dy > canvas.height - ballRadius) {
                if (x > paddleX && x < paddleX + paddleWidth) {
                    dy = -dy;
                } else {
                    lives--;
                    if (!lives) {
                        Swal.fire("Game Over , please try again");
                        document.location.reload();
                    } else {
                        x = canvas.width / 2;
                        y = canvas.height - 30;
                        dx = 3;
                        dy = -3;
                        paddleX = (canvas.width - paddleWidth) / 2;
                    }
                }
            }

            if (rightPressed && paddleX < canvas.width - paddleWidth) {
                paddleX += 7;
            } else if (leftPressed && paddleX > 0) {
                paddleX -= 7;
            }

            x += dx;
            y += dy;
            requestAnimationFrame(draw);
        }

        draw();
    }, []);

    return (
        <CanvasContainer>
            <CanvasStyled width="560" height="400" id="myCanvas" ref={canvasRef}></CanvasStyled>
        </CanvasContainer>
    );
}
