"use strict";

function resizeCanvasToDisplaySize(canvasObj)
{
   // Lookup the size the browser is displaying the canvas in CSS pixels.
   const displayWidth  = canvasObj.clientWidth;
   const displayHeight = canvasObj.clientHeight;

   // Check if the canvas is not the same size.
   const needResize = 
      (canvasObj.width  !== displayWidth) || 
      (canvasObj.height !== displayHeight);

   if (needResize) {
     // Make the canvas the same size
     canvasObj.width  = displayWidth;
     canvasObj.height = displayHeight;
   }

   return needResize;
}

var vertexShaderSource = `#version 300 es
   in vec4 a_position;

   void main() {
      gl_Position = a_position;
   }
`;

var fragmentShaderSource = `#version 300 es
   precision highp float;

   //declare 'output' for fragmentShader
   out vec4 outColor;

   void main() {
   // gl_FragColor is deprecated in version 3 GLSL
      outColor = vec4(0.43, 0.61, 0.48, 1);
   }
`;

function createShader(gl, type, source) {
   var shader = gl.createShader(type);
   gl.shaderSource(shader, source);
   gl.compileShader(shader);
   var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
   if (success) {
     return shader;
   }
 
   console.log(gl.getShaderInfoLog(shader));  // eslint-disable-line
   gl.deleteShader(shader);
   return undefined;
}
 
function createProgram(gl, vertexShader, fragmentShader) {
   var program = gl.createProgram();
   gl.attachShader(program, vertexShader);
   gl.attachShader(program, fragmentShader);
   gl.linkProgram(program);
   var success = gl.getProgramParameter(program, gl.LINK_STATUS);
   if (success) {
     return program;
   }
 
   console.log(gl.getProgramInfoLog(program));  // eslint-disable-line
   gl.deleteProgram(program);
   return undefined;
}

function drawSquare(gl, program, positionAttributeLocation, positions) {
   // Create a buffer and put 2d clip space points in it (x3)                           
   var positionBuffer = gl.createBuffer();
   // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
   //copies bound data to the positionBuffer on GPU
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

   // Create a vertex array object (attribute state)
   var vao = gl.createVertexArray();
   //set current/active vertex array object
   gl.bindVertexArray(vao);
   // Turn on the attribute
   gl.enableVertexAttribArray(positionAttributeLocation);
   // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
   var size = 2;          // 2 components per iteration
   var type = gl.FLOAT;   // the data is 32bit floats
   var normalize = false; // don't normalize the data
   var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
   var offset = 0;        // start at the beginning of the buffer
   gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);


   // Tell it to use our program (pair of shaders)
   gl.useProgram(program);  
   // Bind the attribute/buffer set we want.
   gl.bindVertexArray(vao);
   // draw
   var primitiveType = gl.TRIANGLE_FAN;
   var offset = 0;
   var count = 4;
   gl.drawArrays(primitiveType, offset, count);
}

function main() 
{
   const canvas = document.getElementById("webgl-canvas");
   console.log(canvas);

   const gl = canvas.getContext("webgl2");
   console.log(gl);

   if(gl === null)
   {
      console.log("Unable to initialize WebGl. Unsupported operation.");
      return;
   } else {
      resizeCanvasToDisplaySize(canvas); //helper function
      console.log(gl.canvas.width + " " + gl.canvas.height);
      //Set a canvas color "clear color" value
      gl.clearColor(0.0,0.0,0.0,1.0);
      //Clear the color buffer with specified "clear color"
      gl.clear(gl.COLOR_BUFFER_BIT);
   }

  //do stuff here

  // create GLSL shaders, upload the GLSL source, compile the shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  // Link the two shaders into a program
  var program = createProgram(gl, vertexShader, fragmentShader);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");


  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //1ST DRAW CALL
  //positions array for object to be rendered
  var positions = [-0.9, -0.9, -0.9, -0.3, -0.3, -0.3, -0.3, -0.9];
  drawSquare(gl, program, positionAttributeLocation, positions);


  //2ND DRAW CALL 
  var positions = [-0.3, -0.3, -0.3, 0.3, 0.3, 0.3, 0.3, -0.3];
  drawSquare(gl, program, positionAttributeLocation, positions);


  //3RD DRAW CALL 
  //positions array for object to be rendered
  var positions = [0.3, 0.3, 0.3, 0.9, 0.9, 0.9, 0.9, 0.3];
  drawSquare(gl, program, positionAttributeLocation, positions);
}


main();