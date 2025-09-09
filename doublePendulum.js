let canvas = document.getElementById("pendulumCanvas");
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;
let middleX = width / 2;
let middleY = height / 2;

let g = 9.81; // gravity
let dt = 0.1; // time step 

let rod1Length = 140; // Length of the first pendulum rod (pixels)
let rod2Length = 140; // Length of the second pendulum rod (pixels)
let mass1 = 10; // Mass of the first bob (pixels)
let mass2 = 10; // Mass of the second bob (pixels)
let randomAngle = Math.random() * 2 * Math.PI; // Random initial angle for second pendulum
let angle1 = Math.PI ; // Initial angle for first pendulum (radians)
let angle2 = randomAngle; // Initial angle for second pendulum (radians)


// Initial angular velocity and acceleration for first pendulum
let angularVelocity1 = 0; // also known as theta prime (θ')
let angularAcceleration1 = 0; // also known as theta double prime (θ'')

// Initial angular velocity and acceleration for second pendulum
let angularVelocity2 = 0; // also known as theta prime (θ')
let angularAcceleration2 = 0; // also known as theta double prime (θ'')

let trace1 = [];
let trace2 = [];
const maxTraceLength = 100000; // Maximum length of the trace

// calculating angular acceleration for first pendulum
function calculateAngularAcceleration1() {
    return (-g * (2 * mass1 + mass2) * Math.sin(angle1) - mass2 * g * Math.sin(angle1 - 2 * angle2) - 2 * Math.sin(angle1 - angle2) * mass2 * (angularVelocity2 ** 2 * rod2Length + angularVelocity1 ** 2 * rod1Length * Math.cos(angle1 - angle2)))
     / (rod1Length * (2 * mass1 + mass2 - mass2 * Math.cos(2 * angle1 - 2 * angle2)));
}

// calculating angular acceleration for second pendulum
function calculateAngularAcceleration2() {
    return (2 * Math.sin(angle1 - angle2) * (angularVelocity1 ** 2 * rod1Length * (mass1 + mass2) + g * (mass1 + mass2) * Math.cos(angle1) + angularVelocity2 ** 2 * rod2Length * mass2 * Math.cos(angle1 - angle2)))
     / (rod2Length * (2 * mass1 + mass2 - mass2 * Math.cos(2 * angle1 - 2 * angle2)));
}
 
function updatePendulum() {


    // Update angular acceleration for both pendulums
    angularAcceleration1 = calculateAngularAcceleration1();
    angularAcceleration2 = calculateAngularAcceleration2();

    // Update angular velocity for both pendulums
    angularVelocity1 += angularAcceleration1 * dt;
    angularVelocity2 += angularAcceleration2 * dt;

    // Update angles for both pendulums
    angle1 += angularVelocity1 * dt;
    angle2 += angularVelocity2 * dt;
}

function drawPendulum(angle1, angle2) {
    ctx.clearRect(0, 0, width, height);

    // Calculate positions
    // Rod of first pendulum
    let x1 = rod1Length * Math.sin(angle1);
    let y1 = rod1Length * Math.cos(angle1);

    // Rod of second pendulum
    let x2 = x1 + rod2Length * Math.sin(angle2);
    let y2 = y1 + rod2Length * Math.cos(angle2);

    // Draw rod 1
    ctx.beginPath();
    ctx.moveTo(middleX, middleY);
    ctx.lineTo(middleX + x1, middleY + y1);

    // Draw rod 2
    ctx.lineTo(middleX + x2, middleY + y2);
    ctx.stroke();

     // --- Trace logic ---
    //trace1.push({x: middleX + x1, y: middleY + y1});
    trace2.push({x: middleX + x2, y: middleY + y2});
    //if (trace1.length > maxTraceLength) trace1.shift();
    if (trace2.length > maxTraceLength) trace2.shift();

    // Draw traces for bob 1
    // ctx.save();
    // ctx.globalAlpha = 0.5;
    // ctx.fillStyle = "lightblue";
    // for (let pt of trace1) {
    //     ctx.beginPath();
    //     ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
    //     ctx.fill();
    // }
    // Draw traces for bob 2
    ctx.fillStyle = "#222831";
    for (let pt of trace2) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
    // --- End of trace logic ---

    // Draw bobs
    // First bob
    ctx.beginPath();
    ctx.arc(middleX + x1, middleY + y1, mass1, 0, Math.PI * 2);
    ctx.fillStyle = "lightblue";
    ctx.fill();

    // Second bob
    ctx.beginPath();
    ctx.arc(middleX + x2, middleY + y2, mass2, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
}

drawPendulum(angle1, angle2);

let animationId;
function animate() {
    updatePendulum();
    drawPendulum(angle1, angle2);
    animationId = requestAnimationFrame(animate);
}

document.getElementById("start").onclick = function() {
    if (!animationId) animate();
};

document.getElementById("stop").onclick = function() {
    cancelAnimationFrame(animationId);
    animationId = null;
};


function drawTracesOnly() {
    ctx.clearRect(0, 0, width, height);

    // Draw traces for bob 1
    // ctx.fillStyle = "lightblue";
    // for (let pt of trace1) {
    //     ctx.beginPath();
    //     ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
    //     ctx.fill();
    // }
    // Draw traces for bob 2
    ctx.fillStyle = "blue";
    for (let pt of trace2) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

document.getElementById("print").onclick = function() {
    // Pause animation if running
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    // Draw only the traces
    drawTracesOnly();

    // Export canvas as image
    let imageURL = canvas.toDataURL("image/png");
    let a = document.createElement("a");
    a.href = imageURL;
    a.download = "double_pendulum_trace.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Redraw the full pendulum for continued viewing
    drawPendulum(angle1, angle2);
};