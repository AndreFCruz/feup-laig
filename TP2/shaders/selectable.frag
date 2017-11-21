#ifdef GL_ES
precision highp float;
#endif

varying vec4 vFinalColor;

uniform vec4 secondaryColor;
uniform float timeFactor;

void main() {
    
//    vec4 fragmentColor;
//    vec4.lerp(fragmentColor, vFinalColor, secondaryColor, timeFactor);
    
    gl_FragColor =  vFinalColor;
}
