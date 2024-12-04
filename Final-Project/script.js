import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 
	45, (window.innerWidth/window.innerHeight), 0.1, 1000 );
	camera.position.z = 12;
	camera.position.y = 17;
	camera.position.x = 0;


const color = 0xF4E99B;
const intensity = 4;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);


const controls = new OrbitControls(camera, document.getElementById("webgl-canvas"));
controls.target.set(0, 0, 0);
controls.update();


const renderer = new THREE.WebGLRenderer();
const disFrame = document.getElementById("webgl-canvas");
renderer.setSize(disFrame.offsetWidth,disFrame.offsetHeight);
renderer.setAnimationLoop( animate );
document.getElementById("webgl-canvas").appendChild( renderer.domElement );


const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( {color: 0x454545} );
scene.add( new THREE.GridHelper() );

const cube = new THREE.Mesh( geometry, material );
scene.add( cube );


// LOAD a model into a Scene
const objLoader = new OBJLoader();
objLoader.load('hand.obj', 
	
	// called when loaded
	function(obj){
		obj.scale.set(0.38,0.38,0.38);
		obj.rotation.set(-Math.PI/2,0,Math.PI);
		obj.translateX(-0.6);
		// obj.color.set(0x454545);
		scene.add(obj);
		//Add box around 'obj', compute size and center
		const box = new THREE.Box3().setFromObject(obj);
		const boxSize = box.getSize(new THREE.Vector3()).length();
		const boxCenter = box.getCenter(new THREE.Vector3());
		console.log(boxSize);
		console.log(boxCenter);
	},
	// called when loading is in progress
	function(xhr){
		console.log((xhr.loaded/xhr.total*100) + '% loaded...');
	},
	// called when loading has errors
	function(err){
		console.log('An error occured!' + err);
	}

);


function animate() {

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );

}

