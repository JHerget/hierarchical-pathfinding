class Chest {
	constructor(x, y){
		this.pos = createVector(x, y);
		this.opened = false;
	}

	draw(){
		fill(118, 88, 66);
		stroke(118, 88, 66);
		strokeWeight(1);
		rect(this.pos.x - camera.pos.x, this.pos.y - camera.pos.y, TILE, TILE);

		if(this.opened){
			noFill();
			stroke(50);
			strokeWeight(2);
			circle(this.pos.x + TILE/2 - camera.pos.x, this.pos.y + TILE/2 - camera.pos.y, TILE);
		}else{
			noFill();
			stroke(50);
			strokeWeight(2);
			line(this.pos.x - camera.pos.x, this.pos.y - camera.pos.y, this.pos.x + TILE - camera.pos.x, this.pos.y + TILE - camera.pos.y);
			line(this.pos.x + TILE - camera.pos.x, this.pos.y - camera.pos.y, this.pos.x - camera.pos.x, this.pos.y + TILE  - camera.pos.y);
		}
	}
}