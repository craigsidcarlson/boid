const flock = [];
const num_boids = 100;
function setup() {
  createCanvas(640, 360);
  for (let i = 0; i < num_boids; i++) { 
    flock.push(new Boid());
  }
}

function draw() {
  background(51);

  for(let i = 0; i < flock.length; i++) {
    flock[i].update();
    flock[i].show();
  }
}

