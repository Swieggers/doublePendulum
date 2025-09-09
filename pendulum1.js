let canvas = document.getElementById("pendulumCanvas");
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;

let g = 9.81; // gravity
let dt = 0.1; // time step 

let rodLength = 150; // Length of the pendulum rod (pixels)
let angle = Math.PI / 4; // Initial angle (radians)
let angularVelocity = 0;
let angularAcceleration = 0;

let cx = width / 2;
let cy = height / 2;

function drawPendulum() {
    ctx.clearRect(0, 0, width, height);

    // Calculate bob position
    let bobX = cx + rodLength * Math.sin(angle);
    let bobY = cy + rodLength * Math.cos(angle);

    // Draw the rod
    ctx.beginPath();
    ctx.moveTo(cx, cy); // Origin point
    ctx.lineTo(bobX, bobY); // Bob position
    ctx.stroke();

    // Draw the bob
    ctx.beginPath();
    ctx.arc(bobX, bobY, 10, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
}

// Set angle from input and reset velocity
document.getElementById("setAngleBtn").onclick = function() {
    let deg = parseFloat(document.getElementById("angleInput").value);
    angle = deg * Math.PI / 180; // Convert degrees to radians
    angularVelocity = 0; // Reset velocity
    drawPendulum();
};

function updatePendulum() {
    // θ'' = -(g / L) * sin(θ)
    angularAcceleration = -(g / rodLength) * Math.sin(angle);
    angularVelocity += angularAcceleration * dt;
    angle += angularVelocity * dt;

    // Damping for realism (optional)
    angularVelocity *= 0.9999;
}

function animate() {
    updatePendulum();
    drawPendulum();
    requestAnimationFrame(animate);
}
animate();