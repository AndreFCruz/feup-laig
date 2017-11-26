function pointDiff(p1, p2, scale = 1) {
  return [
    scale * (p1[0] - p2[0]),
    scale * (p1[1] - p2[1]),
    scale * (p1[2] - p2[2])
  ];
}

function middlePoint(p1, p2) {
  return [
    p1[0] + (p2[0] - p1[0]) / 2,
    p1[1] + (p2[1] - p1[1]) / 2,
    p1[2] + (p2[2] - p1[2]) / 2,
  ];
}

function vecLength(vec) {
  return Math.sqrt(
    Math.pow(vec[0], 2) + 
    Math.pow(vec[1], 2) + 
    Math.pow(vec[2], 2)
  );
}

function distPoints(p1, p2) {
  return vecLength(pointDiff(p1, p2));
}

function hexToRgbVec(hexValue) {
  if (hexValue.charAt(0)=='#')
    hexValue = hexValue.substring(1,7);

  //Parsing RGB
  let red = parseInt(hexValue.substring(0, 2), 16) /255;
  let blue = parseInt(hexValue.substring(2, 4), 16) /255;
  let green = parseInt(hexValue.substring(4, 6), 16) /255;

  return vec4.fromValues(red, blue, green, 1);
}