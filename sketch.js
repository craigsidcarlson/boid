const flock = [];
const num_boids = 100;


function setup() {
  createCanvas(1080, 720);
  for (let i = 0; i < num_boids; i++) { 
    flock.push(new Boid());
  }
}

function draw() {
  background(51);
  const old_flock = flock.slice();
  for(let i = 0; i < flock.length; i++) {
    flock[i].flock(old_flock);
    flock[i].edges();
    flock[i].update();
    flock[i].show();
  }
}

