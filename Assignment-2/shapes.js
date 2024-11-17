let gl = undefined;
let ms = undefined;
let angle = undefined;

let axes = undefined;
let tetra = undefined;
let sphere = undefined;


function init() 
{
  
  let canvas = document.getElementById("webgl_canvas");
  gl = canvas.getContext("webgl2");
  if (!gl) { alert("Your Web browser doesn't support WebGL 2\nPlease contact Dave"); }

  // Add initialization code here
  gl.clearColor(0.2, 0.2, 0.2, 1.0); //glwebcontext.member()

  // Tell WebGL how to convert from clip space to pixels
  // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // By default backfacing triangles will be culled.
  gl.enable(gl.CULL_FACE);

  // 
  gl.enable(gl.DEPTH_TEST);


  //Add 'Axes' to the canvas
  axes = new Axes(gl);    //Axes.js
  
  //Other Shapes
  tetra = new Tetrahedron(gl); 
  sphere = new Sphere(gl,18,9);       //Sphere(gl,numStrips,numSlices);

  ms = new MatrixStack(); //MatrixStack.js
  angle = 0.0;


  
  render();

}

function render() 
{
  // Add rendering code here
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



  //Axes
  // axes.P = perspective(0.60, gl.canvas.width/gl.canvas.height, 1, 100);
  angle += 3.0;
  angle %= 360.0; //3.0 mod 360.0
  ms.push();                    //MatrixStack.js
  ms.rotate(angle, [1, 1, 0]);  //MV.js  
  axes.MV = ms.current();             
  axes.draw();
  ms.pop();
  angle = 0.0;

  //Tetra
  angle += 3.0;
  angle %= 360.0;
  // ms = new MatrixStack(); //MatrixStack.js
  ms.push();
  ms.rotate(angle, [1, 1, 0]);
  ms.scale(0.5);
  tetra.MV = ms.current();
  tetra.draw();
  ms.pop();
  angle = 0.0;

  //Sphere
  // sphere.P = perspective(0.78, gl.canvas.width / gl.canvas.height, 1, 10);
  // console.log(typeof sphere.P);
  angle += 1.0;
  angle %= 360.0; //3.0 mod 360.0
  // ms = new MatrixStack();
  ms.push();
  ms.rotate(angle, [1, 1, 0]);
  ms.scale(0.3);
  sphere.MV = ms.current();
  sphere.draw();
  ms.pop();
  angle = 0.0;

  requestAnimationFrame(render);
}


// // ---- ONLOAD -----
// // window.onload = init;
window.addEventListener("load", () => {
  init();
});



