class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.new_acceleration = createVector();
    this.max_force = 0.1;
    this.max_speed = 0.1;
  }

  edges() {
    if (this.position.x > width) this.position.x = 0;
    else if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    else if (this.position.y < 0) this.position.y = height;
  }


  align(qt) {
    let proximity = 30;
    let total = 0;
    let steering = createVector();
    const range = new Rectangle(this.position.x, this.position.y, proximity/2, proximity/2);
    const boids_in_quadrant = qt.query(range)
    for (let i = 0; i < boids_in_quadrant.length; i++) {
      if (boids_in_quadrant[i] !== this) {
        const distance = dist(
          this.position.x, 
          this.position.y, 
          boids_in_quadrant[i].position.x,
          boids_in_quadrant[i].position.y
        );
        if (distance < proximity) {
          steering.add(boids_in_quadrant[i].velocity);
          total++;
        }
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.max_speed);
      steering.sub(this.velocity);
      steering.limit(this.max_force);
    }
    return steering;
  }

  
  cohesion(qt) {
    let proximity = 40;
    let total = 0;
    let steering = createVector();
    const range = new Rectangle(this.position.x, this.position.y, proximity/2, proximity/2);
    const boids_in_quadrant = qt.query(range);
    for (let i = 0; i < boids_in_quadrant.length; i++) {
      if (boids_in_quadrant[i] !== this) {
        if(!boids_in_quadrant[i]) debugger;
        const distance = dist(
          this.position.x, 
          this.position.y, 
          boids_in_quadrant[i].position.x,
          boids_in_quadrant[i].position.y
        );
        if (distance < proximity) {
          steering.add(boids_in_quadrant[i].position);
          total++;
        }
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.max_speed);
      steering.sub(this.velocity);
      steering.limit(this.max_force);
    }
    return steering;
  }

  separation(qt) {
    let proximity = 35;
    let total = 0;
    let steering = createVector();
    const range = new Rectangle(this.position.x, this.position.y, proximity/2, proximity/2);
    const boids_in_quadrant = qt.query(range)
    for (let i = 0; i < boids_in_quadrant.length; i++) {
      if (boids_in_quadrant[i] !== this) {
        const distance = dist(
          this.position.x, 
          this.position.y, 
          boids_in_quadrant[i].position.x,
          boids_in_quadrant[i].position.y
        );
        if (distance < proximity) {
         const difference = p5.Vector.sub(this.position, boids_in_quadrant[i].position);
          const dif_mag = difference.mag();
          if (dif_mag === 0) continue;
          difference.div(dif_mag * dif_mag);
          steering.add(difference);
          total++;
        }
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.max_speed);
      steering.sub(this.velocity);
      steering.limit(this.max_force);
    }
    return steering;
  }
  flock(boids) {
    const alignment = this.align(boids);
    const cohesion = this.cohesion(boids);
    const separation = this.separation(boids);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.max_speed);
    this.acceleration.mult(0);
    return this;
  }

  show() {
    let theta = this.velocity.heading() + PI / 2;
    strokeWeight(3);
    stroke(255);
    point(this.position.x, this.position.y);
    return this;
  }
}