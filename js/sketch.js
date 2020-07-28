const flock = [];
const num_boids = 40;
const width = 1080;
const height = 1080;
let qt;
let canvas_boundary;
function setup() {
  createCanvas(width, height);
  canvas_boundary = new Rectangle(width/2, height/2, width/2, height/2);
  qt = new QuadTree(canvas_boundary);
  const init_x_velocity = random(-4, 4);
  const init_y_velocity = random(-4, 0);
  for (let i = 0; i < num_boids; i++) { 
    const special = i === 0 || i === 1;
    const boid = new Boid(i % 2, special);
    flock.push(boid);
    qt.insert(boid);
  }
}

function draw() {
  background(44, 62, 80);
  const new_qt = new QuadTree(canvas_boundary);
  for(let i = 0; i < flock.length; i++) {
    if(flock[i].deleted)  {
      flock.splice(i, 1);
      continue;
    }
    flock[i].edges();
    flock[i].flock(qt, flock);
    flock[i].update();
    const boid = flock[i].show();
    new_qt.insert(boid);
  }
  
  qt = new_qt;
}

