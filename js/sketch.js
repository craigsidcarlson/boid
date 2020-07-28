let width;
let height;
let env;
let canvas_boundary;
let carry_capacity_slider;
function setup() {
  width = windowWidth;
  height = windowHeight;
  createCanvas(width, height);
  frameRate(30);
  canvas_boundary = new Rectangle(width/2, height/2 , width/2, height/2);
  const qt = new QuadTree(canvas_boundary);
  env = new Environment(qt);
  carry_capacity_slider = createSlider(0, env.max_carry_capacity, env.carry_capacity);
  carry_capacity_slider.position(width-175, height-32);
  for (let i = 0; i < env.starting_count; i++) { 
    const boid = env.add_boid();
    env.qt.insert(boid);
  }
}

function draw() {
  background(44, 62, 80);
  env.carry_capacity = carry_capacity_slider.value();
  const new_qt = new QuadTree(canvas_boundary);
  for(let i = 0; i < env.flock.length; i++) {
    if(env.flock[i].deleted)  {
      env.flock.splice(i, 1);
      continue;
    }

    env.flock[i].edges();
    env.flock[i].flock();
    env.flock[i].update();
    const boid = env.flock[i].show();
    new_qt.insert(boid);
  }
  strokeWeight(0);
  textSize(12);
  fill(255);
  text(`Red: ${env.red_team_count}`, 10, 30);
  text(`Blue: ${env.blue_team_count}`, 65, 30);
  text(`${frameRate().toFixed(0)}`, width - 30, 30);
  text(`Carry Capacity: ${env.carry_capacity}`, width - 285, height-14);
  env.qt = new_qt;
}

