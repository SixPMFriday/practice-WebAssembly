// Allocate memory for the module
// Initial size is specified in pages of 16 kiB
const memory = new WebAssembly.Memory({initial:17});

// Everything we want to pass to our module during initialization
// Names of keys not important as long as WASM module knows what to look for
const imports = {
    js: {
        mem: memory
    }
};

fetch('./main.wasm')
    .then( response => response.arrayBuffer() )
    .then( bytes => WebAssembly.compile( bytes ) )
    .then( module => new WebAssembly.Instance( module, imports ) )
    .then( instance => {

        // set the pixel data in module's memory
        const res = instance.exports.run();

        // put the module's memory into an array suitable for use in ImageDAta
        // allocate width x height y number of color planes (RGBA = 4)
        const byteArray = new Uint8ClampedArray( memory.buffer, 0, 512 * 512 * 4 );

        // Create an ImageData instance from the array
        const img = new ImageData( byteArray, 512, 512);

        // Get the canvas element from DOM
        const canvas = document.getElementById('c');

        // get a 2d graphics context for the canvas
        const ctx = canvas.getContext('2d');

        // Put image data onto the canvas
        ctx.putImageData( img, 0, 0);

    });
    