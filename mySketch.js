let bgImg;
let infoDiv = null;  // holds our popup
let stars = [];  // array to hold star data

// define your interactive zones here — note the new `info` field!
const zones = [
  {
    name: 'Desk Display',
    x: 655, y: 600, w: 140, h: 90,
    info: 'You spot a smudged fingerprint on the display—could it belong to the saboteur?',
    onClick: () => showInfoBox('Desk Display', zones[0].info)
  },
  {
    name: 'Keyboard',
    x: 450, y: 700, w: 360, h: 60,
    info: 'Tiny crumbs lodged between the keys hint someone ate here in a hurry.',
    onClick: () => showInfoBox('Keyboard', zones[1].info)
  },
  {
    name: 'Left Monitor',
    x: 150, y: 220, w: 260, h: 160,
    info: 'The left monitor still shows an unsent file: “top‐secret_mission.txt.”',
    onClick: () => showInfoBox('Left Monitor', zones[2].info)
  },
  {
    name: 'Window',
    x: 700, y: 350, w: 480, h: 350,
    info: 'Beyond the window, you glimpse a distant starship—the final clue.',
    onClick: () => showInfoBox('Window', zones[3].info)
  }
];

let hoveredZone = null;

function preload() {
  bgImg = loadImage('office.jpg.png');
}

function setup() {
  const cnv = createCanvas(1000, 1000);
  cnv.style('display', 'block');
  cnv.style('margin', 'auto');

  imageMode(CENTER);
  textSize(16);
  noStroke();
  
  // Initialize stars within the window area
  initializeStars();
}

function draw() {
  background(0);
  image(bgImg, width/2, height/2, width, height);

  // Draw flashing stars in the window area
  drawStars();

  hoveredZone = null;
  cursor(ARROW);

  zones.forEach((z, i) => {
    // use rectMode(CENTER)
    rectMode(CENTER);
    if (
      mouseX >= z.x - z.w/2 &&
      mouseX <= z.x + z.w/2 &&
      mouseY >= z.y - z.h/2 &&
      mouseY <= z.y + z.h/2
    ) {
      hoveredZone = z;
      // highlight it
      noFill();
      stroke(255, 0, 0);
      strokeWeight(2);
      rect(z.x, z.y, z.w, z.h);

      // show name
      noStroke();
      fill(255, 0, 0);
      text(z.name, mouseX + 10, mouseY + 30);

      cursor(HAND);
    }
  });

  // always show raw coords in corner
  fill(255);
  noStroke();
  text(`x: ${mouseX}, y: ${mouseY}`, 10, height - 10);
}

function mousePressed() {
  if (hoveredZone) {
    hoveredZone.onClick();
  }
}

// creates (or replaces) an HTML popup with your mystery text
function showInfoBox(title, message) {
  // remove existing box if present
  if (infoDiv) {
    infoDiv.remove();
  }

  // make a new div
  infoDiv = createDiv();
  infoDiv.style('position', 'absolute');
  infoDiv.style('top', '50%');
  infoDiv.style('left', '50%');
  infoDiv.style('transform', 'translate(-50%, -50%)');
  infoDiv.style('background', '#f9f9f9');
  infoDiv.style('padding', '20px');
  infoDiv.style('border', '2px solid #333');
  infoDiv.style('box-shadow', '0 0 10px rgba(0,0,0,0.5)');
  infoDiv.style('max-width', '300px');
  infoDiv.style('font-family', 'sans-serif');
  infoDiv.html(`
    <h3 style="margin-top:0;">${title}</h3>
    <p>${message}</p>
  `);

  // add a close button
  const closeBtn = createButton('Close');
  closeBtn.parent(infoDiv);
  closeBtn.style('margin-top', '10px');
  closeBtn.mousePressed(() => {
    infoDiv.remove();
    infoDiv = null;
  });
}

// Initialize stars within the window area
function initializeStars() {
  const windowZone = zones.find(z => z.name === 'Window');
  const numStars = 15; // Number of stars to create
  
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: random(windowZone.x - windowZone.w/2 + 20, windowZone.x + windowZone.w/2 - 20),
      y: random(windowZone.y - windowZone.h/2 + 20, windowZone.y + windowZone.h/2 - 20),
      size: random(2, 5),
      brightness: random(100, 255),
      flickerSpeed: random(0.02, 0.08),
      phase: random(0, TWO_PI) // Different starting phase for each star
    });
  }
}

// Draw the flashing stars
function drawStars() {
  const windowZone = zones.find(z => z.name === 'Window');
  
  // Only draw stars if we're not hovering over the window (so they don't interfere with the red highlight)
  if (!hoveredZone || hoveredZone.name !== 'Window') {
    stars.forEach(star => {
      // Calculate flashing brightness using sine wave
      let currentBrightness = star.brightness + sin(frameCount * star.flickerSpeed + star.phase) * 50;
      currentBrightness = constrain(currentBrightness, 50, 255);
      
      // Draw the star
      noStroke();
      fill(currentBrightness, currentBrightness, currentBrightness);
      circle(star.x, star.y, star.size);
      
      // Add a subtle glow effect
      fill(currentBrightness, currentBrightness, currentBrightness, 100);
      circle(star.x, star.y, star.size * 2);
    });
  }
}