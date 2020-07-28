const flock = [];
const num_boids = 100;
const width = 1080;
const height = 1080;
let qt;
let canvas_boundary;
function setup() {
  createCanvas(width, height);
  canvas_boundary = new Rectangle(width/2 + 16, height/2 + 16, width/2 -16, height/2 -16);
  qt = new QuadTree(canvas_boundary);

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
  let teamZero = 0;
  let teamOne = 0;
  for(let i = 0; i < flock.length; i++) {
    if(flock[i].deleted)  {
      flock.splice(i, 1);
      continue;
    }
    if(flock[i].team) teamOne++;
    else teamZero++;
    flock[i].edges();
    flock[i].flock(qt, flock);
    flock[i].update();
    const boid = flock[i].show();
    new_qt.insert(boid);
  }
  textSize(12);
  fill(255);
  text(`Red Team: ${teamZero}`, 10, 30);
  text(`Blue Team: ${teamOne}`, 10, 60);
  qt = new_qt;
}

