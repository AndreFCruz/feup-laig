#ifdef GL_ES
precision highp float;
#endif

varying vec4 vFinalColor;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform bool uUseTexture;

uniform vec4 secondaryColor;
uniform float timeFactor;

void main() {
    
    vec4 fragmentColor;

    if (uUseTexture) {
        fragmentColor = texture2D(uSampler, vTextureCoord) * vFinalColor;
    } else {
        fragmentColor = vFinalColor;
    }
    
    gl_FragColor =  mix(fragmentColor, secondaryColor, timeFactor);
}
