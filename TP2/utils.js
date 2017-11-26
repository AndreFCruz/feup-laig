/**
 * Computes the vector that turns p1 into p2, multiplied by the given scale, returning it.
 * Uses 3D points.
 * 
 * @param {Array} p1 - One point
 * @param {Array} p2 - The other point
 * @param {Number} scale - Scale factor for distance, default value is 1
 * @return {Array}
 */
function pointDiff(p1, p2, scale = 1) {
  return [
    scale * (p1[0] - p2[0]),
    scale * (p1[1] - p2[1]),
    scale * (p1[2] - p2[2])
  ];
}

/**
 * Computes the middle point between two given points, returning it.
 * Uses 3D points.
 * 
 * @param {Array} p1 - One point
 * @param {Array} p2 - The other point
 * @return {Array}
 */
function middlePoint(p1, p2) {
  return [
    p1[0] + (p2[0] - p1[0]) / 2,
    p1[1] + (p2[1] - p1[1]) / 2,
    p1[2] + (p2[2] - p1[2]) / 2,
  ];
}

/**
 * Computes the length of a given 3D vector
 * 
 * @param {Array} vec - 3D Vector
 * @return {Number} - vector's length
 */
function vecLength(vec) {
  return Math.sqrt(
    Math.pow(vec[0], 2) + 
    Math.pow(vec[1], 2) + 
    Math.pow(vec[2], 2)
  );
}

/**
 * Computes the distance between two 3D points, returning it.
 * 
 * @param {Array} p1 - One point
 * @param {Array} p2 - The other point
 * @return {Number}
 */
function distPoints(p1, p2) {
  return vecLength(pointDiff(p1, p2));
}

/**
 * Receives a hexadecimal value of a color, and parses it into the RGB system, with the components varying between [0, 1].
 * 
 * @param {String} hexValue - Color hexadecimal value, in format #RRGGBB
 * @return {vec4} - Vector containing the RGB compounents, in format [R, G, B, alpha]
 */
function hexToRgbVec(hexValue) {
  if (hexValue.charAt(0)=='#')
    hexValue = hexValue.substring(1,7);

  //Parsing RGB
  let red = parseInt(hexValue.substring(0, 2), 16) /255;
  let blue = parseInt(hexValue.substring(2, 4), 16) /255;
  let green = parseInt(hexValue.substring(4, 6), 16) /255;

  return vec4.fromValues(red, blue, green, 1);
}