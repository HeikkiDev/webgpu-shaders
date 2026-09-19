export const shaderCode = `

struct Uniforms {
    resolution : vec2f,
    time : f32,
};

@group(0) @binding(0)
var<uniform> uniforms : Uniforms;

@vertex
fn vertexMain(
    @builtin(vertex_index) vertexIndex : u32
) -> @builtin(position) vec4f {

    var positions = array<vec2f, 3>(
        vec2f(-1.0, -1.0),
        vec2f( 3.0, -1.0),
        vec2f(-1.0,  3.0)
    );

    return vec4f(
        positions[vertexIndex],
        0.0,
        1.0
    );
}


@fragment
fn fragmentMain(
    @builtin(position) position : vec4f
) -> @location(0) vec4f {

    // Convertimos la posición del fragmento a coordenadas normalizadas entre 0 y 1.
    let uv = position.xy / uniforms.resolution;

    // Corregimos la proporción de la pantalla para que la esfera no se deforme.
    let aspect = uniforms.resolution.x / uniforms.resolution.y;

    // Movemos el origen al centro de la pantalla.
    let center = vec2f(0.5, 0.5);
    var p = uv - center;

    // Corregimos el eje X según el aspect ratio.
    p.x *= aspect;

    // Radio de nuestra esfera.
    let radius = 0.3;

    // Normalizamos p a coordenadas relativas al radio de la esfera.
    let spherePosition = p / radius;

    // Calculamos x² + y².
    let xySquared = dot(spherePosition, spherePosition);

    // Si estamos fuera del círculo, no estamos sobre la esfera, por tanto dibujar color negro.
    if (xySquared > 1.0) {
        return vec4f(0.0, 0.0, 0.0, 1.0);
    }

    // Usamos la ecuación de la esfera para obtener Z:
    //
    // x² + y² + z² = 1
    //
    let z = sqrt(1.0 - xySquared);

    // Punto 3D de la superficie de la esfera.
    let normal = vec3f(
        spherePosition.x,
        spherePosition.y,
        z
    );

    // Dirección desde la que viene la luz, que cambia con el tiempo.
    let lightDirection = normalize(
        vec3f(
            sin(uniforms.time),
            -0.5,
            cos(uniforms.time)
        )
    );

    // Calculamos cuánto está orientada la superficie hacia la luz.
    let brightness = max(
        dot(normal, lightDirection),
        0.0
    );

    // Usamos el resultado como intensidad de gris.
    return vec4f(
        brightness,
        brightness,
        brightness,
        1.0
    );
}

`;
