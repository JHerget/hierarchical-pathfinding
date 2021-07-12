class Player {
	constructor(x, y, d = 30){
		this.pos = createVector(x, y);
		this.vel = createVector(0, 0);
		this.d = d;
		this.speed = 3;
		this.path = [];
	}

	update(){
		this.pos.add(this.vel);
		this.vel.mult(0);

		this.collision();
	}

	draw(){
		fill(255);
		stroke(255, 50);
		strokeWeight(5);
		circle(this.pos.x - camera.pos.x, this.pos.y - camera.pos.y, this.d);
	}

	move(){
		if(!this.path.length){
			return;
		}

		if(this.pos.dist(this.path[0].pos) > this.d/2){
			let dir = Vector.subtract(this.path[0].pos, this.pos);

			dir.setMag(this.speed);
			this.vel.add(dir);
		}else{
			this.path.shift();
		}
	}

	collision(){
		let v = 8;
		let ui = Math.floor((this.pos.x)/TILE), uj = Math.floor((this.pos.y - v)/TILE);
		let ri = Math.floor((this.pos.x + v)/TILE), rj = Math.floor((this.pos.y)/TILE);
		let di = Math.floor((this.pos.x)/TILE), dj = Math.floor((this.pos.y + v)/TILE);
		let li = Math.floor((this.pos.x - v)/TILE), lj = Math.floor((this.pos.y)/TILE);
		let lui = Math.floor((this.pos.x - v)/TILE), luj = Math.floor((this.pos.y - v)/TILE);
		let rui = Math.floor((this.pos.x + v)/TILE), ruj = Math.floor((this.pos.y - v)/TILE);
		let rdi = Math.floor((this.pos.x + v)/TILE), rdj = Math.floor((this.pos.y + v)/TILE);
		let ldi = Math.floor((this.pos.x - v)/TILE), ldj = Math.floor((this.pos.y + v)/TILE);

		if((map[lui][luj] && map[ui][uj]) || (map[ui][uj] && map[rui][ruj])){ //top
			if(typeof map[ui][uj] != "number"){
				if(!map[ui][uj].opened){
					map[ui][uj].opened = true;
					opened_chests++;
				}
			}else{
				this.pos.y = luj*TILE + TILE + v;
			}
		}
		if((map[rui][ruj] && map[ri][rj]) || (map[ri][rj] && map[rdi][rdj])){ //right
			if(typeof map[ri][rj] != "number"){
				if(!map[ri][rj].opened){
					map[ri][rj].opened = true;
					opened_chests++;
				}
			}else{
				this.pos.x = rui*TILE - v;
			}
		}
		if((map[rdi][rdj] && map[di][dj]) || (map[di][dj] && map[ldi][ldj])){ //bottom
			if(typeof map[di][dj] != "number"){
				if(!map[di][dj].opened){
					map[di][dj].opened = true;
					opened_chests++;
				}
			}else{
				this.pos.y = rdj*TILE - v;
			}
		}
		if((map[ldi][ldj] && map[li][lj]) || (map[li][lj] && map[lui][luj])){ //down
			if(typeof map[li][lj] != "number"){
				if(!map[li][lj].opened){
					map[li][lj].opened = true;
					opened_chests++;
				}
			}else{
				this.pos.x = ldi*TILE + TILE + v;
			}
		}
	}
}

let collision = function(x, y){
	let i = Math.floor(x/TILE);
	let j = Math.floor(y/TILE);

	if(map[i][j]){
		return true;
	}

	return false;
}