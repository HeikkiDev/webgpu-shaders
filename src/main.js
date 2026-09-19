import { shaderCode } from "./shader-code.js";

const canvas = document.getElementById("canvas");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

if (!navigator.gpu) {
    throw new Error("WebGPU is not supported");
}

const adapter = await navigator.gpu.requestAdapter();

if (!adapter) {
    throw new Error("No GPU adapter found");
}

const device = await adapter.requestDevice();

const uniformBuffer = device.createBuffer({
    size: 16,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
});

const context = canvas.getContext("webgpu");
const format = navigator.gpu.getPreferredCanvasFormat();

context.configure({
    device,
    format,
    alphaMode: "opaque"
});

const shaderModule = device.createShaderModule({
    code: shaderCode
});

const pipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: {
        module: shaderModule,
        entryPoint: "vertexMain"
    },
    fragment: {
        module: shaderModule,
        entryPoint: "fragmentMain",
        targets: [{ format }]
    },
    primitive: {
        topology: "triangle-list"
    }
});

const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
        {
            binding: 0,
            resource: { buffer: uniformBuffer }
        }
    ]
});

const startTime = performance.now();

function render() {
    const time = (performance.now() - startTime) / 1000;

    const uniforms = new Float32Array([
        canvas.width,
        canvas.height,
        time,
        0
    ]);

    device.queue.writeBuffer(uniformBuffer, 0, uniforms);

    const commandEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();

    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [
            {
                view: textureView,
                clearValue: { r: 0, g: 0, b: 0, a: 1 },
                loadOp: "clear",
                storeOp: "store"
            }
        ]
    });

    renderPass.setPipeline(pipeline);
    renderPass.setBindGroup(0, bindGroup);
    renderPass.draw(3);
    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);

    requestAnimationFrame(render);
}

render();
