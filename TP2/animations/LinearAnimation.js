/**
 * A class used to represent a Linear Animation
 * @augments Animation
 */
class LinearAnimation extends Animation {
  
  /**
   * Constructor for linear animation class.
   * The animation will be made of (number of controlpoints - 1) segments.
   * 
   * @augments Animation
   * @param {Number} speed - Animation Speed
   * @param {Array} controlPoints - Control Points that will define the animation movements.
   * @constructor
   */
  constructor(speed, controlPoints) {
    super();
    this.speed = speed;

    this.controlPoints = controlPoints;

    this.lineSegments = [];
    this.length = 0;
    this.segmentIdx = 0;
    this.divisions = [0];	//Percentages where new segments start

    this.calcLengthAndDivions();
    this.setOrientation(this.lineSegments[0]); //Setting the orientation of the first segment
    
    this.duration = this.length / this.speed * 1000;
  }

  /**
   * @inheritdoc
   * @override 
   */
  update(elapsedTime) {
  	if (elapsedTime > this.duration)
  		return null;

    let t = elapsedTime / this.duration;

    let pos = this.calcPosition(t);

    mat4.identity(this.matrix);
    mat4.translate(this.matrix, this.matrix, pos);
    this.calcMatrixOrientation();
  }

  /**
   * Compute the Length of the total moviment
   * 
   * @return {null}
   */
  calcLengthAndDivions() {
  	for (let i = 1; i < this.controlPoints.length; ++i) {
			let newSegment = pointDiff(this.controlPoints[i], this.controlPoints[i-1]);
			this.lineSegments.push(newSegment);

			this.length += vecLength(newSegment);
			this.divisions.push(this.length);
		}

		for (let i = 0; i < this.divisions.length; ++i)
			this.divisions[i] /= this.length;
  }

  calcPosition(t) {
    if (t < 0 || t > 1)
        throw new Error("Invalid t parameter to Linear Animation");

		if (t > this.divisions[this.segmentIdx + 1]) {
      this.segmentIdx++;
			this.setOrientation(this.lineSegments[this.segmentIdx]);
		}

		let currSegmentPercentage = ((t - this.divisions[this.segmentIdx]) / (this.divisions[this.segmentIdx + 1] - this.divisions[this.segmentIdx]));
		let currentSeg = this.lineSegments[this.segmentIdx];

		return [
			this.controlPoints[this.segmentIdx][0] + currentSeg[0]* currSegmentPercentage,
			this.controlPoints[this.segmentIdx][1] + currentSeg[1]* currSegmentPercentage,
			this.controlPoints[this.segmentIdx][2] + currentSeg[2]* currSegmentPercentage
		];
  }

}
