class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.new_acceleration = createVector();
    this.max_force =0.1;
    this.max_speed = 3;
  }

  edges() {
    if (this.position.x > width) this.velocity.reflect(createVector(-1, 0));
    else if (this.position.x < 0 ) this.velocity.reflect(createVector(1, 0));
    if (this.position.y > height) this.velocity.reflect(createVector(0, -1));
    else if (this.position.y < 0) this.velocity.reflect(createVector(0, 1)); 
  }

  act(boids) {
    let alignment_proximity = 100;
    let cohesion_proximity = 75;
    let separation_proximity = 75;
    let align_total = 0;
    let cohesion_total = 0;
    let separation_total = 0;
    let align = createVector();
    let cohesion = createVector();
    let separation = createVector();
    for(let i = 0; i < boids.length; i++) {
      if (boids[i] !== this) {
        const distance = dist(
          this.position.x, 
          this.position.y, 
          boids[i].position.x,
          boids[i].position.y
        );
        if (distance < alignment_proximity) {
          align.add(boids[i].velocity);
          align_total++;
        }
        if (distance < cohesion_proximity) {
          cohesion.add(boids[i].position);
          cohesion_total++;
        }
        if (distance < separation_proximity) {
          let difference = p5.Vector.sub(this.position, boids[i].position);
          difference.div(distance);
          separation.add(difference);
          separation_total++;
        }
      }
    }
    if (align_total > 0) {
      align.div(align_total);
      align.sub(this.velocity);
      align.limit(this.max_force);
    }
    if (cohesion_total > 0) {
      cohesion.div(cohesion_total);
      cohesion.sub(this.position);
      cohesion.sub(this.velocity);
      cohesion.limit(this.max_force);
    }
    if (separation_total > 0) {
      separation.div(separation_total);
      separation.sub(this.velocity);
      separation.limit(this.max_force);
    }
    let steer = createVector().add(align).add(cohesion).add(separation);
    if(steer.mag() < 1.5) steer.setMag(steer.mag() * random(1.1, 1.2));
    return steer;
  }

  // align(boids) {
  //   let proximity = 50;
  //   let total = 0;
  //   let steering = createVector();
  //   for(let i = 0; i < boids.length; i++) {
  //     if (boids[i] !== this) {
  //       const distance = dist(
  //         this.position.x, 
  //         this.position.y, 
  //         boids[i].position.x,
  //         boids[i].position.y
  //       );
  //       if (distance < proximity) {
  //         steering.add(boids[i].velocity);
  //         total++;
  //       }
  //     }
  //   }
  //   if (total > 0) {
  //     steering.div(total);
  //     steering.setMag(this.max_speed);
  //     steering.sub(this.velocity);
  //     steering.limit(this.max_force);
  //   }
  //   return steering;
  // }

  
  // cohesion(boids) {
  //   let proximity = 100;
  //   let total = 0;
  //   let steering = createVector();
  //   for(let i = 0; i < boids.length; i++) {
  //     if (boids[i] !== this) {
  //       const distance = dist(
  //         this.position.x, 
  //         this.position.y, 
  //         boids[i].position.x,
  //         boids[i].position.y
  //       );
  //       if (distance < proximity) {
  //         steering.add(boids[i].position);
  //         total++;
  //       }
  //     }
  //   }
  //   if (total > 0) {
  //     steering.div(total);
  //     steering.sub(this.position);
  //     steering.setMag(this.max_speed);
  //     steering.sub(this.velocity);
  //     steering.limit(this.max_force);
  //   }
  //   return steering;
  // }

  // separation(boids) {
  //   let proximity = 75;
  //   let total = 0;
  //   let steering = createVector();
  //   for(let i = 0; i < boids.length; i++) {
  //     if (boids[i] !== this) {
  //       const distance = dist(
  //         this.position.x, 
  //         this.position.y, 
  //         boids[i].position.x,
  //         boids[i].position.y
  //       );
  //       if (distance < proximity) {
  //         let difference = p5.Vector.sub(this.position, boids[i].position);
  //         difference.div(distance);
  //         steering.add(difference);
  //         total++;
  //       }
  //     }
  //   }
  //   if (total > 0) {
  //     steering.div(total);
  //     steering.setMag(this.max_speed);
  //     steering.sub(this.velocity);
  //     steering.limit(this.max_force);
  //   }
  //   return steering;
  // }

  flock(boids) {
    this.acceleration.set(0,0);
    let steer = this.act(boids);
    this.acceleration.add(steer);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.max_speed);
  }

  show() {
    strokeWeight(7);
    stroke(255);
    point(this.position.x, this.position.y);
  }
}