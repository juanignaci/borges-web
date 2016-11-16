	// MAIN
	// standard global variables
	var container, scene, camera, renderer, controls, stats;
	var clock = new THREE.Clock();
	var keyboard = new THREEx.KeyboardState();
	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();

	// custom global variables
	var dirV = new THREE.Vector3();
	var W = 20, H = 20, SCL = 2;

	var camVel = new THREE.Vector2(), camPos = new THREE.Vector2();
	var mousePressed = false;
	var lon = 90, lat = 0;
	var phi = 0, theta = 0;
	var grid, controller = new NodeController();
	// init();
	animate();

	// FUNCTIONS 		
	function init() 
	{
		//Hide loader
		document.getElementById('loader').style.display = "none";
		
		// SCENE
		scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0x000000, 5, 15);

		// CAMERA
		var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
		var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 15;
		camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
		camera.position.y = 2;
		scene.add(camera);

		grid = createGrid();

		renderer = new THREE.WebGLRenderer( {antialias:true} );
		
		renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
		container = document.getElementById( 'ThreeJS' );
		container.appendChild( renderer.domElement );

		var axes = new THREE.AxisHelper(100);
		scene.add( axes );

		document.addEventListener( 'mousedown', onDocumentMouseDown, false );
		window.addEventListener( 'mousemove', onMouseMove, false );
	}
	
	function animate() {
	    requestAnimationFrame( animate );
		render();
		update();
	}
	function update() {
		camera.rotation.y += camVel.x;
		camera.position.x += dirV.x * camVel.y;
		camera.position.z += dirV.z * camVel.y;
		camPos.x = Math.round(camera.position.x) / SCL;
		camPos.y = Math.round(camera.position.z) / SCL;

		updateGridNodes(grid);
	}

	function render() {
		camera.getWorldDirection( dirV );
		//updateInput();		
		if(!mousePressed)
		{
			camVel.x *= 0.9;
			camVel.y *= 0.9;
		}

		// update the picking ray with the camera and mouse position	
		//raycaster.setFromCamera( mouse, camera );	

		/*
		// calculate objects intersecting the picking ray
		var intersects = raycaster.intersectObjects( scene.children);

		for ( var i = 0; i < intersects.length; i++ ) {

			//intersects[ i ].object.material.color.set( 0x00ff00 );
		
		}
		*/

		if(keyboard.pressed("R"))
		{
			if(controller.state == "intro")
				controller.state = "idle";
			/*else
				controller.state = "intro";*/
		}

		if(keyboard.pressed("b")) {
			document.getElementById('big-modal').style.display = "block";
		}

		if(keyboard.pressed("s")) {
			document.getElementById('small-modal').style.display = "block";
		}

		renderer.render( scene, camera );
	}

	function createGrid() {
		var g = [];
		var texture =  new THREE.TextureLoader().load( "images/node.png" );


		for (var i = W - 1; i >= 0; i--) {
			g[i] = [];
		};


		for (var x = 0; x < W; x++) {
			for (var y = 0; y < H; y++) {
				g[x][y] = new Cluster((-W / 2 + x)*SCL, (-H / 2 + y)*SCL, texture, scene, controller);
				scene.add(g[x][y]);
			};
		};

		console.log(g);
		console.log(controller);
		return g;
	}

	function updateGridNodes(g)
	{
		for (var x = 0; x < W; x++) {
			for (var y = 0; y < H; y++) {
				g[x][y].updateNodes();
			};
		};
	}

	function onDocumentMouseDown( event ) {
		mousePressed = true;
		event.preventDefault();
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	}

	function onDocumentMouseMove( event ) {
		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
		camVel.x -= movementX * 0.00008;
		camVel.y -= movementY * 0.0002;
	}

	function onDocumentMouseUp( event ) {
		mousePressed = false;
		document.removeEventListener( 'mousemove', onDocumentMouseMove );
		document.removeEventListener( 'mouseup', onDocumentMouseUp );
	}

	function onMouseMove( event ) {
		// calculate mouse position in normalized device coordinates
		// (-1 to +1) for both components

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	}

	function de2ra(degree)   { return degree*(Math.PI/180); }