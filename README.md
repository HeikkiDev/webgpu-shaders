````markdown
# WebGPU Shaders

[🚀 **Live Demo**](https://heikkidev.github.io/webgpu-shaders/)

A learning project for exploring WebGPU and WGSL from scratch: a fullscreen
fragment shader that creates and lights a sphere using math, with real-time animation.

## Running it

WebGPU requires a supporting browser (Chrome/Edge 113+, or Safari 18+) and the
files must be served over HTTP (ES modules won't load from `file://`).

```bash
python3 -m http.server 8000

# then open http://localhost:8000
````

## How it works

| File                 | Role                                   |
| -------------------- | -------------------------------------- |
| `index.html`         | Canvas + module entry point            |
| `styles.css`         | Fullscreen canvas layout               |
| `src/main.js`        | WebGPU setup, uniforms and render loop |
| `src/shader-code.js` | WGSL vertex + fragment shaders         |

The vertex stage draws a single oversized triangle covering the screen, so all
the interesting work happens in the fragment shader. A uniform buffer provides
the canvas `resolution` and elapsed `time`, updated every frame.

## Current achievements

* ✅ WebGPU initialization: adapter, device, canvas context and preferred format
* ✅ Render pipeline with WGSL vertex + fragment entry points
* ✅ Fullscreen triangle trick (3 vertices, no vertex buffer)
* ✅ Uniform buffer with resolution and time
* ✅ Animation loop via `requestAnimationFrame`
* ✅ Responsive canvas that follows window resizes
* ✅ Aspect-ratio correction so shapes aren't stretched
* ✅ Procedural sphere derived from `x² + y² + z² = 1`
* ✅ Per-pixel surface normals
* ✅ Animated directional light
* ✅ Basic lighting using the dot product

## What's next

* 🎨 **Colored sphere** — replace the grayscale output with color
* 💡 **Better lighting** — add some light to the dark side of the sphere
* ✨ **Reflections** — make the sphere look shiny
* 🔷 **More shapes** — experiment with other shapes using math
* 🌀 **Shader effects** — experiment with noise, gradients and distortion
