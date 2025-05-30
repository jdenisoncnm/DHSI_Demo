let bgImg;
let infoDiv = null;  // holds our popup
let stars = [];  // array to hold star data
let bgMusic;  // background music

// define your interactive zones here — note the new `info` field!
const zones = [
  {
    name: 'Desk Display',
    x: 775, y: 600, w: 140, h: 90,
    info: 'You spot a smudged fingerprint on the display—could it belong to the saboteur?',
    onClick: () => showInfoBox('Desk Display', zones[0].info)
  },
  {
    name: 'Keypad',
    x: 520, y: 650, w: 120, h: 100,
    info: 'Tiny crumbs lodged between the keys hint someone ate here in a hurry.',
    onClick: () => showInfoBox('Keyboard', zones[1].info)
  },
  {
    name: 'Left Monitor',
    x: 150, y: 320, w: 260, h: 160,
    info: 'The left monitor still shows an unsent file: "top‐secret_mission.txt."',
    onClick: () => showInfoBox('Left Monitor', zones[2].info)
  },
  {
    name: 'Right Monitor',
    x: 370, y: 340, w: 120, h: 100,
    info: 'The right monitor displays security logs—one entry shows an unauthorized access at 23:47.',
    onClick: () => showInfoBox('Right Monitor', zones[3].info)
  },
  {
    name: 'Window',
    x: 750, y: 320, w: 480, h: 350,
    info: 'Beyond the window, you glimpse a distant starship—the final clue.',
    onClick: () => showInfoBox('Window', zones[4].info)
  }
];

let hoveredZone = null;

function preload() {
  bgImg = loadImage('office.jpg.png');
  bgMusic = loadSound('Starship_Office_Jazz.wav');
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
  
  // Start background music on loop
  if (bgMusic) {
    bgMusic.loop();
    bgMusic.setVolume(0.3); // Set volume to 30% so it's not too loud
  }
}

function draw() {
  background(0);
  image(bgImg, width/2, height/2, width, height);

  // Draw flashing stars in the window area
  drawStars();
  
  // Draw blinking lights for left monitor
  drawMonitorLights();
  
  // Draw blinking lights for right monitor
  drawRightMonitorLights();
  
  // Draw blinking lights for desk display
  drawDeskDisplayLights();
  
  // Draw blinking lights for keypad
  drawKeypadLights();

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
  // Start audio if it hasn't started yet (browsers require user interaction)
  if (bgMusic && !bgMusic.isPlaying()) {
    bgMusic.loop();
  }
  
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

// Draw blinking blue and yellow lights for the left monitor
function drawMonitorLights() {
  const leftMonitor = zones.find(z => z.name === 'Left Monitor');
  
  // Only draw lights if we're not hovering over the monitor (so it doesn't interfere with red highlight)
  if (!hoveredZone || hoveredZone.name !== 'Left Monitor') {
    // Calculate blinking states using sine waves at different speeds
    let blueIntensity = (sin(frameCount * 0.08) + 1) * 127.5; // Medium pace for blue
    let yellowIntensity = (sin(frameCount * 0.12 + PI/3) + 1) * 127.5; // Slightly faster, offset phase for yellow
    
    // Create multiple indicator lights inside the monitor
    noStroke();
    
    // Blue lights in the left area of monitor
    fill(0, 100, 255, blueIntensity);
    circle(leftMonitor.x - leftMonitor.w/2 + 30, leftMonitor.y - 50, 8);
    circle(leftMonitor.x - leftMonitor.w/2 + 30, leftMonitor.y - 20, 8);
    circle(leftMonitor.x - leftMonitor.w/2 + 30, leftMonitor.y + 10, 8);
    circle(leftMonitor.x - leftMonitor.w/2 + 30, leftMonitor.y + 40, 8);
    
    // Yellow lights in the right area of monitor
    fill(255, 255, 0, yellowIntensity);
    circle(leftMonitor.x + leftMonitor.w/2 - 30, leftMonitor.y - 50, 8);
    circle(leftMonitor.x + leftMonitor.w/2 - 30, leftMonitor.y - 20, 8);
    circle(leftMonitor.x + leftMonitor.w/2 - 30, leftMonitor.y + 10, 8);
    circle(leftMonitor.x + leftMonitor.w/2 - 30, leftMonitor.y + 40, 8);
    
    // Blue lights in the center-left
    fill(0, 150, 255, blueIntensity * 0.8);
    circle(leftMonitor.x - 40, leftMonitor.y - 30, 6);
    circle(leftMonitor.x - 40, leftMonitor.y + 20, 6);
    
    // Yellow lights in the center-right
    fill(255, 220, 0, yellowIntensity * 0.8);
    circle(leftMonitor.x + 40, leftMonitor.y - 30, 6);
    circle(leftMonitor.x + 40, leftMonitor.y + 20, 6);
    
    // Add a subtle screen glow effect
    rectMode(CENTER);
    noFill();
    let screenGlow = (sin(frameCount * 0.05) + 1) * 30 + 20; // Slow pulsing glow
    stroke(100, 200, 255, screenGlow);
    strokeWeight(2);
    rect(leftMonitor.x, leftMonitor.y, leftMonitor.w + 5, leftMonitor.h + 5);
  }
}

// Draw blinking lights for the right monitor (security display)
function drawRightMonitorLights() {
  const rightMonitor = zones.find(z => z.name === 'Right Monitor');
  
  // Only draw lights if we're not hovering over the monitor (so it doesn't interfere with red highlight)
  if (!hoveredZone || hoveredZone.name !== 'Right Monitor') {
    // Calculate blinking states using sine waves at different speeds for security theme
    let redIntensity = (sin(frameCount * 0.15) + 1) * 127.5; // Medium-fast pace for red (security alert)
    let greenIntensity = (sin(frameCount * 0.09 + PI/2) + 1) * 127.5; // Offset phase for green (system OK)
    let whiteIntensity = (sin(frameCount * 0.06) + 1) * 127.5; // Slow white pulse (data flow)
    
    // Create security-themed indicator lights inside the monitor
    noStroke();
    
    // Red security alert lights in the top area
    fill(255, 50, 50, redIntensity);
    circle(rightMonitor.x - rightMonitor.w/2 + 25, rightMonitor.y - 35, 6);
    circle(rightMonitor.x - rightMonitor.w/2 + 45, rightMonitor.y - 35, 6);
    circle(rightMonitor.x - rightMonitor.w/2 + 65, rightMonitor.y - 35, 6);
    
    // Green system status lights in the middle area
    fill(50, 255, 50, greenIntensity);
    circle(rightMonitor.x + rightMonitor.w/2 - 25, rightMonitor.y - 10, 6);
    circle(rightMonitor.x + rightMonitor.w/2 - 45, rightMonitor.y - 10, 6);
    circle(rightMonitor.x + rightMonitor.w/2 - 65, rightMonitor.y - 10, 6);
    
    // White data flow lights in the bottom area
    fill(255, 255, 255, whiteIntensity);
    circle(rightMonitor.x - 40, rightMonitor.y + 25, 5);
    circle(rightMonitor.x - 20, rightMonitor.y + 25, 5);
    circle(rightMonitor.x, rightMonitor.y + 25, 5);
    circle(rightMonitor.x + 20, rightMonitor.y + 25, 5);
    circle(rightMonitor.x + 40, rightMonitor.y + 25, 5);
    
    // Scrolling data lines effect (thin rectangles)
    let scrollOffset = (frameCount * 0.5) % 40; // Scrolling effect
    fill(0, 255, 255, 150); // Cyan data lines
    rectMode(CENTER);
    for (let i = 0; i < 4; i++) {
      let lineY = rightMonitor.y - 20 + i * 15 + scrollOffset;
      if (lineY > rightMonitor.y - rightMonitor.h/2 && lineY < rightMonitor.y + rightMonitor.h/2) {
        rect(rightMonitor.x, lineY, rightMonitor.w - 20, 2);
      }
    }
    
    // Add a subtle security monitor glow effect (orange/amber like security systems)
    rectMode(CENTER);
    noFill();
    let securityGlow = (sin(frameCount * 0.08) + 1) * 35 + 25; // Medium pulsing glow
    stroke(255, 165, 0, securityGlow); // Orange glow for security theme
    strokeWeight(2);
    rect(rightMonitor.x, rightMonitor.y, rightMonitor.w + 5, rightMonitor.h + 5);
  }
}

// Draw blinking lights for the desk display
function drawDeskDisplayLights() {
  const deskDisplay = zones.find(z => z.name === 'Desk Display');
  
  // Only draw lights if we're not hovering over the display (so it doesn't interfere with red highlight)
  if (!hoveredZone || hoveredZone.name !== 'Desk Display') {
    // Calculate alternating colors using sine waves with different phases
    let time = frameCount * 0.1; // Medium pace
    let lightBlueIntensity = (sin(time) + 1) * 127.5;
    let yellowOrangeIntensity = (sin(time + PI) + 1) * 127.5; // 180 degrees out of phase
    
    // Create button-like lights inside the display
    noStroke();
    
    // Top row of buttons - alternating colors
    // Light blue buttons
    fill(173, 216, 230, lightBlueIntensity); // Light blue
    circle(deskDisplay.x - 40, deskDisplay.y - 20, 12);
    circle(deskDisplay.x, deskDisplay.y - 20, 12);
    circle(deskDisplay.x + 40, deskDisplay.y - 20, 12);
    
    // Light yellow-orange buttons (offset phase)
    fill(255, 218, 185, yellowOrangeIntensity); // Light yellow-orange
    circle(deskDisplay.x - 20, deskDisplay.y - 20, 12);
    circle(deskDisplay.x + 20, deskDisplay.y - 20, 12);
    
    // Bottom row of buttons - alternating pattern
    // Light yellow-orange buttons
    fill(255, 218, 185, yellowOrangeIntensity);
    circle(deskDisplay.x - 40, deskDisplay.y + 20, 12);
    circle(deskDisplay.x, deskDisplay.y + 20, 12);
    circle(deskDisplay.x + 40, deskDisplay.y + 20, 12);
    
    // Light blue buttons (offset phase)
    fill(173, 216, 230, lightBlueIntensity);
    circle(deskDisplay.x - 20, deskDisplay.y + 20, 12);
    circle(deskDisplay.x + 20, deskDisplay.y + 20, 12);
    
    // Add a subtle display glow effect
    rectMode(CENTER);
    noFill();
    let displayGlow = (sin(frameCount * 0.06) + 1) * 25 + 15; // Slow pulsing glow
    stroke(200, 200, 255, displayGlow);
    strokeWeight(1);
    rect(deskDisplay.x, deskDisplay.y, deskDisplay.w + 3, deskDisplay.h + 3);
  }
}

// Draw blinking lights for the keypad
function drawKeypadLights() {
  const keypad = zones.find(z => z.name === 'Keypad');
  
  // Only draw lights if we're not hovering over the keypad (so it doesn't interfere with red highlight)
  if (!hoveredZone || hoveredZone.name !== 'Keypad') {
    // Calculate alternating colors using sine waves with frequent changes
    let time = frameCount * 0.2; // Frequent pace - faster than other displays
    let lightBlueIntensity = (sin(time) + 1) * 127.5;
    let darkBlueIntensity = (sin(time + PI) + 1) * 127.5; // 180 degrees out of phase
    
    // Create keypad button grid (3x4 like a phone keypad)
    noStroke();
    
    let buttonSize = 8;
    let spacing = 20;
    
    // Start position for the grid
    let startX = keypad.x - spacing;
    let startY = keypad.y - spacing * 1.5;
    
    // Draw 4 rows of 3 buttons each
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        let x = startX + col * spacing;
        let y = startY + row * spacing;
        
        // Alternate colors in a checkerboard pattern
        if ((row + col) % 2 === 0) {
          // Light blue buttons
          fill(135, 206, 250, lightBlueIntensity); // Light sky blue
        } else {
          // Dark blue buttons
          fill(25, 25, 112, darkBlueIntensity); // Midnight blue
        }
        
        circle(x, y, buttonSize);
      }
    }
    
    // Add some accent lights around the keypad
    // Light blue accent lights
    fill(173, 216, 230, lightBlueIntensity * 0.7);
    circle(keypad.x - keypad.w/2 + 10, keypad.y - keypad.h/2 + 10, 6);
    circle(keypad.x + keypad.w/2 - 10, keypad.y - keypad.h/2 + 10, 6);
    
    // Dark blue accent lights
    fill(25, 25, 112, darkBlueIntensity * 0.7);
    circle(keypad.x - keypad.w/2 + 10, keypad.y + keypad.h/2 - 10, 6);
    circle(keypad.x + keypad.w/2 - 10, keypad.y + keypad.h/2 - 10, 6);
    
    // Add a subtle keypad glow effect
    rectMode(CENTER);
    noFill();
    let keypadGlow = (sin(frameCount * 0.15) + 1) * 20 + 10; // Medium pulsing glow
    stroke(100, 149, 237, keypadGlow); // Cornflower blue
    strokeWeight(1);
    rect(keypad.x, keypad.y, keypad.w + 5, keypad.h + 5);
  }
}