class Environment {
  constructor(qt) {
    this.flock = [];
    this.qt = qt;
    this.carry_capacity = 1000;
    this.max_carry_capacity = 2000;
    this.starting_count = width < this.max_carry_capacity ? floor(width/2) : floor(this.carry_capacity/2);

    this.num_offspring = 2;

    this.speed = 3.8;
    this.mass = 1;
    this.force = 0.07;

    this.breed_chance = 1;
    this.expire_chance =  1;

    this.breed_mass_min = 0.5;
    this.bread_mass_loss = 0.02;
    this.expire_mass_reward = 0.05;

    this.red_team_count = this.starting_count / 4;
    this.blue_team_count = this.starting_count / 4;
    this.green_team_count = this.starting_count / 4;
    this.yellow_team_count = this.starting_count / 4;

    this.red_leader;
    this.blue_leader;
    this.green_leader;
    this.yellow_leader;
    
    this.red_stats = {
      count: this.starting_count / 4,
      avg_speed: this.speed,
      avg_mass: this.mass,
      avg_force: this.force
    };
    this.blue_stats = {
      count: this.starting_count / 4,
      avg_speed: this.speed,
      avg_mass: this.mass,
      avg_force: this.force
    };
    this.green_stats = {
      count: this.starting_count / 4,
      avg_speed: this.speed,
      avg_mass: this.mass,
      avg_force: this.force
    };
    this.yellow_stats = {
      count: this.starting_count / 4,
      avg_speed: this.speed,
      avg_mass: this.mass,
      avg_force: this.force
    };
  }

  breed_event(source, target) {
    const will_breed = floor(random(this.breed_chance));
    if (will_breed !== 0 || source.mass < this.breed_mass_min || this.flock.length > this.carry_capacity) return;
    target.deleted = true;
    for (let i = 0; i < this.num_offspring; i++) {
      const max_force = target.max_force + random(-0.01, 0.01);
      const mass = target.mass + random(-0.01, 0.01);
      const max_speed = target.max_speed + random(-0.01, 0.01);

      const stats = { max_force, mass, max_speed, team: source.team };
      const position = source.position;
      this.add_boid(position, stats);
    }
    source.mass -= this.bread_mass_loss;
    if (source.team) this.red_team_count++;
    else this.blue_team_count++;
  }

  expire_event(source, target) {
    if(target.special) {
      target.mass = this.breed_mass_min;
      source.mass += this.expire_mass_reward; 
      return;
    }
    const will_expire = floor(random(this.expire_chance));
    if (will_expire !== 0) return;
    target.deleted = true;
    source.mass += this.expire_mass_reward;
    if(target.team) this.blue_team_count--;
    else this.red_team_count--;
  }

  add_boid(p = null, s = null) {
    const index = this.flock.length;
    const position = p || { x: random(width), y: random(height) };
    let special = false;
    if (index === 0 || index === 1 || index === 2 || index === 3) special = true;
    const stats = s || { max_force: this.force, mass: this.mass, max_speed: this.speed, team: index % 4, special };
    const new_boid = new Boid(index, position, stats);
    this.flock.push(new_boid);
    if (index === 0) {
      this.red_leader = new_boid;
    } else if(index === 1) {
      this.blue_leader = new_boid;
    } else if(index === 2) {
      this.green_leader = new_boid;
    } else if(index === 3) {
      this.yellow_leader = new_boid;
    }
    return new_boid;
  }
}
