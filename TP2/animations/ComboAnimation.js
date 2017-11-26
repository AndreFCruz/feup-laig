/**
 * A class used to represent a Combo Animation.
 * A Combo Animation is a set of sequential animations.
 * @augments Animation
 */
class ComboAnimation extends Animation {

  /**
   * Constructor for combo animation class.
   * 
   * @augments Animation
   * @param {Array} animations - set of animations
   * @constructor
   */
  constructor(animations) {
    super();
    this.animations = animations;
    this.cumulative = 0;
    this.animIdx = 0;

    this.calcComboDuration();
  }

  /**
   * Compute the animation total duration (sum of every single animation duration)
   * 
   * @return {null}
   */
  calcComboDuration() {
    this.duration = 0;
    for (let i = 0; i < this.animations.length; i++) {
      this.duration += this.animations[i].duration;
    }
  }

  /**
   * Change the current combo's animation, to the next animation.
   * 
   * @return {null}
   */
  increaseAnimIdx() {
    if (this.animIdx + 1 < this.animations.length) {
      this.animations[this.animIdx].reset();
      this.animIdx++;
    } else {
      this.reset();
    }
  }

  /**
   * Reset the animation combo.
   * 
   * @return {null}
   */
  reset() {
    this.cumulative = 0;
    this.animIdx = 0;
  }

  /**
   * @inheritdoc
   * @override 
   */
  update(elapsedTime) {
    if (elapsedTime > this.duration) {
      this.reset();
      return null;
    }

    let anim = this.animations[this.animIdx];
    if (elapsedTime - this.cumulative > anim.duration) {
      this.cumulative += anim.duration;
      this.increaseAnimIdx();
      anim = this.animations[this.animIdx];
    }

    let localElapsedTime = elapsedTime - this.cumulative;
    anim.update(localElapsedTime);
    this.matrix = anim.matrix;
  }
}
