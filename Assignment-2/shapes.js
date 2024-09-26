let gl = undefined;

function init() 
{
  
  let canvas = document.getElementById("webgl_canvas");
  gl = canvas.getContext("webgl2");
  if (!gl) { alert("Your Web browser doesn't support WebGL 2\nPlease contact Dave"); }

  // Add initialization code here

  gl.clearColor(0.2, 0.2, 0.2, 1.0);

  let axes = new Axes(gl);
  let ms = new MatrixStack();
  let angle = 0.0;


  render();

  
}

function render() 
{
  // Add rendering code here
  gl.clear(gl.COLOR_BUFFER_BIT);

  angle += 3.0;
  angle %= 360.0;

  ms.push();
  ms.rotate(angle, [1, 1, 0]);
  axes.MV = ms.current();
  axes.draw();
  ms.pop();

  requestAnimationFrame(render);
}

// window.onload = init;
window.addEventListener("load", () => {
  init();
});
