class LinearAnimation extends Animation {
  
  constructor(id, speed, controlPoints) {
    super(id);
    
    this.speed = speed;
    this.controlPoints = controlPoints;

    this.numCPs = this.controlPoints.length;
    this.position = this.controlPoints[0];

    this.lineSegments = [];
    this.curLineSegIdx = 0;

    this.lineSegDistances = [];
    this.runDist = 0;

  	for (let i = 1; i < this.numCPs; ++i) {
		let segX = this.controlPoints[i][0] - this.controlPoints[i-1][0];
		let segY = this.controlPoints[i][1] - this.controlPoints[i-1][1];
		let segZ = this.controlPoints[i][2] - this.controlPoints[i-1][2];
		this.lineSegments.push([segX, segY, segZ]);

		this.lineSegDistances.push(Math.sqrt(Math.pow(segX, 2) + Math.pow(segY, 2) + Math.pow(segZ, 2)));
	}

  }

  updatePosition(xInc, yInc, zInc) {
  	this.position[0] += xInc;
  	this.position[1] += yInc;
  	this.position[2] += zInc;

  	this.runDist += Math.sqrt(Math.pow(xInc, 2) + Math.pow(yInc, 2) + Math.pow(zInc, 2)));
  }

  checkEndOfSeg() {
  	if (this.runDist >= this.lineSegDistances[this.curLineSegIdx]) {
  		this.runDist = 0;
  		
	  	if (this.curLineSegIdx++ < this.numCPs) {
	  		this.stop();
	  	}
  	}
  }

  update(delta) {
  	if (!this.isDone()) 
  	{
	  	let lineSeg = this.lineSegments[this.curLineSegIdx];
	  	updatePosition(
		  	lineSeg[0] * delta * this.speed,
		  	lineSeg[1] * delta * this.speed,
		  	lineSeg[2] * delta * this.speed
		  );

	  	checkEndOfSeg();
	  }
  }

}
