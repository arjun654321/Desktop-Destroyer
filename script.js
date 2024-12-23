
const canvas = document.getElementById('destroyCanvas');
const ctx = canvas.getContext('2d');
const termiteCanvas = document.getElementById('termiteCanvas');
const termiteCtx = termiteCanvas.getContext('2d');

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    termiteCanvas.width = canvas.width;
    termiteCanvas.height = canvas.height;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let currentTool = 'hammer';
let termites = [];

const crackImage = new Image();
crackImage.src = 'crack.png';

const cutImage = new Image();
cutImage.src = 'cut.png';

const termiteImage = new Image();
termiteImage.src = 'termite.png';


const hammerSound = new Audio('hammer.mp3');
const chainsawSound = new Audio('chainsaw.mp3');
const termiteSound = new Audio('termite.mp3');


document.getElementById('hammer').addEventListener('click', () => selectTool('hammer'));
document.getElementById('chainsaw').addEventListener('click', () => selectTool('chainsaw'));
document.getElementById('termites').addEventListener('click', () => selectTool('termites'));
document.getElementById('clear').addEventListener('click', clearCanvas);

canvas.addEventListener('click', handleCanvasClick);
termiteCanvas.addEventListener('click', handleCanvasClick);

function handleCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (currentTool === 'hammer') {
        drawCrack(x, y);
        hammerSound.play().catch(error => console.error('Error playing hammer sound:', error));
    } else if (currentTool === 'chainsaw') {
        drawChainsawCut(x, y);
        chainsawSound.play().catch(error => console.error('Error playing chainsaw sound:', error));
    } else if (currentTool === 'termites') {
        spawnTermite(x, y);
        termiteSound.play().catch(error => console.error('Error playing termite sound:', error));
    }
}

function selectTool(tool) {
    currentTool = tool;
    updateCursor(tool);
}

function updateCursor(tool) {
    let cursorUrl = '';
    if (tool === 'hammer') {
        cursorUrl = 'hammer-cursor.png'; 
    } else if (tool === 'chainsaw') {
        cursorUrl = 'chainsaw-cursor.png'; 
    } else if (tool === 'termites') {
        cursorUrl = 'termite-cursor.png'; 
    }

   
    canvas.style.cursor = cursorUrl ? `url("${cursorUrl}") 16 16, auto` : 'auto';
    termiteCanvas.style.cursor = cursorUrl ? `url("${cursorUrl}") 16 16, auto` : 'auto';
}


function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    termiteCtx.clearRect(0, 0, termiteCanvas.width, termiteCanvas.height);
    termites = [];  
}


function drawCrack(x, y) {
    ctx.drawImage(crackImage, x - crackImage.width / 2, y - crackImage.height / 2);
}


function drawChainsawCut(x, y) {
    ctx.drawImage(cutImage, x - cutImage.width / 2, y - cutImage.height / 2);
}


function spawnTermite(x, y) {
    const termite = { x, y, size: 5, moveX: (Math.random() - 0.5) * 0.5, moveY: (Math.random() - 0.5) * 0.5 }; 
    termites.push(termite);
    if (termites.length === 1) {
        animateTermites();
    }
}


function animateTermites() {
    termiteCtx.clearRect(0, 0, termiteCanvas.width, termiteCanvas.height);  
    termites.forEach(termite => {
        termite.x += termite.moveX;
        termite.y += termite.moveY;

        if (termite.x < 0) termite.x = 0;
        if (termite.x > termiteCanvas.width) termite.x = termiteCanvas.width;
        if (termite.y < 0) termite.y = 0;
        if (termite.y > termiteCanvas.height) termite.y = termiteCanvas.height;

        termiteCtx.drawImage(termiteImage, termite.x - termiteImage.width / 2, termite.y - termiteImage.height / 2);
    });

    requestAnimationFrame(animateTermites);  
}