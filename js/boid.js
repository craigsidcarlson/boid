class Boid {
  constructor(index, position, stats) {
    this.index = index;
    const x = position.x;
    const y = position.y;

    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.align_proximity = 30;
    this.cohesion_proximity = 20;
    this.separation_proximity = 35;
    this.special_proximity = 10;
    this.largest_proximity = this.align_proximity;
    if (this.cohesion_proximity > this.largest_proximity) this.largest_proximity = this.cohesion_proximity;
    if (this.separation_proximity > this.largest_proximity) this.largest_proximity = this.separation_proximity;

    this.max_force = stats.max_force;
    this.mass = stats.mass;
    this.max_speed = stats.max_speed;
    this.boid_fov = PI / 4; // 300 degrees
    this.special = stats.special || false ;
    this.team = stats.team;
    if(this.team === 0) {
      this.color = this.special ? color('red') : color(246, 193, 1);
    } else {
      this.color = this.special ? color('white') : color(0,139,139);
    }
  }

  edges() {
    if (this.position.x > width) {
      this.position.y = height - this.position.y;
      this.velocity.rotate(PI);
    }
    else if (this.position.x < 0) {
      this.position.y = height - this.position.y;
      this.velocity.rotate(PI);    
    }
    if (this.position.y > height) {
      this.position.x = width - this.position.x;
      this.velocity.rotate(PI);    
    }
    else if (this.position.y < 0) {
      this.position.x = width - this.position.x;
      this.velocity.rotate(PI);
    }
  }

  async flock() {
    const approximate_range = new Rectangle(this.position.x, this.position.y, this.largest_proximity/2, this.largest_proximity/2);
    const boids_in_quadrant = env.qt.query(approximate_range);

    let align_steering = createVector();
    let cohesion_steering = createVector();
    let separation_steering = createVector();

    let align_total = 0;
    let cohesion_total = 0;
    let separation_total = 0;

    for (let i = 0; i < boids_in_quadrant.length; i++) {
        const distance = dist(
          this.position.x, 
          this.position.y, 
          boids_in_quadrant[i].position.x,
          boids_in_quadrant[i].position.y
        );
        if (distance === 0) continue;

        // Alignment
        // if (distance < this.align_proximity && this.isFriendly(boids_in_quadrant[i])) {
        if (distance < this.align_proximity) {
          if (distance < this.cohesion_proximity && this.isFriendly(boids_in_quadrant[i])) {
            align_steering.add(boids_in_quadrant[i].velocity);
          } else {
            const lerp = p5.Vector.lerp(align_steering, boids_in_quadrant[i].velocity, 0.25);
            align_steering.add(lerp);
          }
          align_total++;
        }

        // Cohesion
        if (distance < this.cohesion_proximity && this.isFriendly(boids_in_quadrant[i])) {
          cohesion_steering.add(boids_in_quadrant[i].position);
          cohesion_total++;
        }
        // Separation
        if (distance < this.separation_proximity) {
          const difference = p5.Vector.sub(this.position, boids_in_quadrant[i].position);
          const dif_mag = difference.mag();
          if (dif_mag === 0) continue;
          difference.div(dif_mag * dif_mag);
          separation_steering.add(difference);
          separation_total++;
        }
        // Environment interaction
        if (this.special && this.inView(boids_in_quadrant[i]) && distance < this.special_proximity) {
          this.interact(boids_in_quadrant[i]);
        }
    }
    const alignVector = this.getAlignVector(align_steering, align_total);
    const cohesionVector = this.getCohesionVector(cohesion_steering, cohesion_total);
    const separationVector = this.getSeparationVector(separation_steering, separation_total);
    this.acceleration.add(alignVector);
    this.acceleration.add(cohesionVector);
    this.acceleration.add(separationVector);
  }

  getAlignVector(steering, total) {
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.max_speed);
      steering.sub(this.velocity);
      steering.limit(this.max_force * this.mass);
    }
    return steering;
  }

  getCohesionVector(steering, total)  {
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.max_speed);
      steering.sub(this.velocity);
      steering.limit(this.max_force * this.mass);
    }
    return steering;
  }

  getSeparationVector(steering, total) {
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.max_speed);
      steering.sub(this.velocity);
      steering.limit(this.max_force * this.mass);
    }
    return steering;
  }

   interact(target) {
    if(this.team === target.team) {
      env.breed_event(this, target);
    } else {
      console.log('Boid eaten');
      env.expire_event(this, target);
    }
  }

  inView(target) {
    const sub = p5.Vector.sub(target.position, this.position);
    const angleBetween = abs(this.velocity.angleBetween(sub));
    const inView = angleBetween < (this.boid_fov / 2);
    // if(this.special) debugger;
    return inView;
  }

  isFriendly(target) {
    if (this.special) return true;
    return this.team === target.team;
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.max_speed);
    this.acceleration.mult(0);
  }

  show() {
    strokeWeight(this.mass);
    stroke(this.color);
    noFill(); // It is more performant without filling

		const r = 3;
		const angle = this.velocity.heading();
		const anglePlus = 2.5;
    triangle(
			this.position.x + Math.cos(angle) * r, this.position.y + Math.sin(angle) * r,
			this.position.x + Math.cos(angle + anglePlus) * r, this.position.y + Math.sin(angle + anglePlus) * r,
			this.position.x + Math.cos(angle - anglePlus) * r, this.position.y + Math.sin(angle - anglePlus) * r
    );

    // if(this.special) {
    //   const arc_start = this.velocity.heading() - (this.boid_fov / 2);
    //   const arc_end = this.velocity.heading() + (this.boid_fov / 2);
    //   const diameter = this.special_proximity;
    //   stroke('rgba(255,255,255, 0.25)');
    //   fill('rgba(255,255,255, 0.25)');
    //   arc(this.position.x, this.position.y, diameter, diameter, arc_start, arc_end); 
    // }
    return this;
  }
}