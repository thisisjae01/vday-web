// ======== STARFIELD SETUP ========
const canvas = document.getElementById("starfield");
const context = canvas.getContext("2d");

let stars = 500;
let colorrange = [0, 60, 240];
let starArray = [];

// Random helper
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize stars
function initStars() {
    starArray = [];
    for (let i = 0; i < stars; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 1.2;
        const hue = colorrange[getRandom(0, colorrange.length - 1)];
        const sat = getRandom(50, 100);
        const opacity = Math.random();
        starArray.push({ x, y, radius, hue, sat, opacity });
    }
}
initStars();

// ======== VARIABLES ========
let frameNumber = 0;
let opacity = 0;
let secondOpacity = 0;
let thirdOpacity = 0;
let baseFrame;

// ======== STARFIELD FUNCTIONS ========
function drawStars() {
    for (let star of starArray) {
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
        context.fillStyle = `hsla(${star.hue}, ${star.sat}%, 88%, ${star.opacity})`;
        context.fill();
    }
}

function updateStars() {
    for (let star of starArray) {
        if (Math.random() > 0.99) star.opacity = Math.random();
    }
}

// ======== TEXT ANIMATION ========
function drawTextWithLineBreaks(lines, x, y, fontSize, lineHeight) {
    lines.forEach((line, i) => {
        context.fillText(line, x, y + i * (fontSize + lineHeight));
    });
}

function drawText() {
    const fontSize = Math.min(30, window.innerWidth / 24);
    const lineHeight = 8;

    context.font = `${fontSize}px Comic Sans MS`;
    context.textAlign = "center";

    // Glow effect
    context.shadowColor = "rgba(45, 45, 255, 1)";
    context.shadowBlur = 8;

    // Fade-in/out sequence helper
    function drawFade(textLines, startFrame, endFrame, opacityVar) {
        if (frameNumber >= startFrame && frameNumber < endFrame) {
            context.fillStyle = `rgba(45, 45, 255, ${opacityVar.value})`;
            if (window.innerWidth < 600 && textLines.length > 1) {
                drawTextWithLineBreaks(textLines, canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
            } else {
                context.fillText(textLines.join(" "), canvas.width / 2, canvas.height / 2);
            }
            // simple fade logic
            opacityVar.value += (frameNumber % 2 === 0 ? 0.01 : -0.01);
        }
    }

    drawFade(["everyday day I cannot believe how lucky I am"], 0, 500, { value: opacity });
    drawFade(["amongst trillions and trillions of stars,", "over billions of years"], 500, 1000, { value: opacity });
    drawFade(["to be alive, and to get to spend this life with you"], 1000, 1500, { value: opacity });
    drawFade(["is so incredibly, unfathomably unlikely"], 1500, 2000, { value: opacity });
    drawFade(["and yet here I am to get the impossible", "chance to get to know you"], 2000, 2500, { value: opacity });
    drawFade(["I like you Nat, more than", "all the time and space in the universe can contain"], 2500, 2750, { value: opacity });

    // Second line fade
    if (frameNumber >= 2750) {
        context.fillStyle = `rgba(45, 45, 255, ${secondOpacity})`;
        const lines = window.innerWidth < 600 
            ? ["and I can't wait to spend all the time in", "the world to share that love with you!"] 
            : ["and I can't wait to spend all the time in the world to share that love with you!"];
        drawTextWithLineBreaks(lines, canvas.width / 2, canvas.height / 2 + 60, fontSize, lineHeight);
        secondOpacity = Math.min(secondOpacity + 0.01, 1);
    }

    // Third line fade + show buttons
    if (frameNumber >= 3000) {
        context.fillStyle = `rgba(45, 45, 255, ${thirdOpacity})`;
        context.fillText("Will you be my Valentine on 14 Feb?", canvas.width/2, canvas.height/2 + 120);
        thirdOpacity = Math.min(thirdOpacity + 0.01, 1);

        // Fade in buttons
        if (!buttonContainer.style.opacity || buttonContainer.style.opacity < 1) {
            buttonContainer.style.display = "flex";
            buttonContainer.style.opacity = (parseFloat(buttonContainer.style.opacity) || 0) + 0.02;
        }
    }

    // Reset shadow
    context.shadowColor = "transparent";
    context.shadowBlur = 0;
}

// ======== DRAW LOOP ========
function draw() {
    if (baseFrame) context.putImageData(baseFrame, 0, 0);

    drawStars();
    updateStars();
    drawText();

    frameNumber++;
    requestAnimationFrame(draw);
}

// ======== WINDOW RESIZE ========
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
    baseFrame = context.getImageData(0, 0, canvas.width, canvas.height);
}
window.addEventListener("resize", resizeCanvas);

// ======== BUTTON LOGIC ========
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const buttonContainer = document.getElementById("buttonContainer");

yesButton.addEventListener("click", () => {
    alert("YAY!! 💖 I knew it 🥰");
});

// Helper to move the No button randomly within the screen
function moveNoButton() {
    const maxX = window.innerWidth - noButton.offsetWidth;
    const maxY = window.innerHeight - noButton.offsetHeight;

    let x = Math.random() * maxX;
    let y = Math.random() * maxY;

    // wiggle effect
    x += Math.sin(Date.now() / 50) * 20;
    y += Math.cos(Date.now() / 50) * 20;

    // clamp to screen
    x = Math.min(Math.max(x, 0), maxX);
    y = Math.min(Math.max(y, 0), maxY);

    noButton.style.position = "absolute";
    noButton.style.left = `${x}px`;
    noButton.style.top = `${y}px`;
}

// Desktop hover
noButton.addEventListener("mousemove", (e) => {
    const rect = noButton.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width/2);
    const dy = e.clientY - (rect.top + rect.height/2);
    const distance = Math.sqrt(dx*dx + dy*dy);

    if (distance < 100) moveNoButton();
});

// Mobile touch
function checkTouchMove(e) {
    const touch = e.touches[0];
    const rect = noButton.getBoundingClientRect();
    const dx = touch.clientX - (rect.left + rect.width/2);
    const dy = touch.clientY - (rect.top + rect.height/2);
    const distance = Math.sqrt(dx*dx + dy*dy);

    if (distance < 100) moveNoButton();
}

document.addEventListener("touchstart", checkTouchMove);
document.addEventListener("touchmove", checkTouchMove);

// ======== START ========
window.requestAnimationFrame(draw);
resizeCanvas();
