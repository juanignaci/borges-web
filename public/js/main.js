	// MAIN
	// standard global variables
	var container, scene, camera, renderer, controls, stats;
	var clock = new THREE.Clock();
	var keyboard = new THREEx.KeyboardState();
	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();

	// custom global variables
	var dirV = new THREE.Vector3();
	var W = 20, H = 20, SCL = 2, sW = 2.5, sH = 2.5;

	var camVel = new THREE.Vector2(), camPos = new THREE.Vector2();
	var mousePressed = false;
	var lon = 90, lat = 0;
	var phi = 0, theta = 0;
	var grid, controller = new NodeController();
	var relatedNodes = null;
	var nodeSelected = null;
	var isInit = false;

	animate();

	// FUNCTIONS
	function init() 
	{
		//Hide loader
		setTimeout(function () {
			document.getElementById('loader').style.display = "none";
		}, 3000);

		// SCENE
		scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0x000000, 5, 15);

		// CAMERA
		var SCREEN_WIDTH = window.innerWidth - 16, SCREEN_HEIGHT = window.innerHeight - 16;
		var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 15;
		camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
		camera.position.y = 2;
		scene.add(camera);
		
		isInit = true;

		grid = createGrid();

		renderer = new THREE.WebGLRenderer( {antialias:true} );
		
		renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
		container = document.getElementById( 'ThreeJS' );
		container.appendChild( renderer.domElement );

		document.addEventListener( 'mousedown', onDocumentMouseDown, false );
		window.addEventListener( 'mousemove', onMouseMove, false );
		window.addEventListener( 'resize', onWindowResize, false );
	
	}
	
	function animate() {
	    
	    requestAnimationFrame( animate );
		
		if(!isInit)
			return;
		
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
		if(relatedNodes != null)
			relatedNodes.updateNodes();
	}

	function render() {

		camera.getWorldDirection( dirV );

		if(!mousePressed)
		{
			if(nodeSelected == null &&  controller.state != "intro")
			{
				camVel.x *= 0.9;
				camVel.y *= 0.9;
			}
			else 
			{
				camVel.x = 0;
				camVel.y = 0;
			}
		}
		

		if(keyboard.pressed("R"))
		{
			if(controller.state == "intro")
				controller.state = "idle";
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

		for (var i = W - 1; i >= 0; i--) {
			g[i] = [];
		};


		for (var x = 0; x < W; x++) {
			for (var y = 0; y < H; y++) {
				g[x][y] = new Cluster((-W / 2 + x)*SCL, (-H / 2 + y)*SCL, scene, controller, camera);
				scene.add(g[x][y]);
			};
		};
		
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

		if(controller.state == "intro")
		{
			if(document.getElementById('loader').style.display == "none")
				controller.state = "idle";
			
			return;
		}

		if(camVel.x <= 0.01 && camVel.y <= 0.01)
		{
			raycaster.setFromCamera( mouse, camera );	
			raycaster.far = 6.5;
			
			var intersects = raycaster.intersectObjects( scene.children);

			if(intersects.length > 0 && intersects[ 0 ].object.constructor.name == 'Sprite' && document.getElementById('big-modal').style.display != "block")
			{
				if(nodeSelected != null)
				{
					var b = false;
					if(intersects[ 0 ].object.selected)
						b = true;

					nodeSelected.deselectNode();

					if(b)
					{
						controller.state = "idle";
        				big_modal.style.display = "none";
						return;
					}
				}	
				
				controller.state = "selected";
				camera.getWorldDirection( dirV );
				
				if(relatedNodes == null)
					relatedNodes = new RelatedNodes(5, camera.position, dirV, controller);
				else relatedNodes.resetNodes(camera.position, dirV);

				nodeSelected = intersects[ 0 ].object;
				nodeSelected.selectNode(camera.position.clone().add(dirV.clone().multiplyScalar(0.5)));
				var url = "";

				if(nodeSelected.contentID == null)
					url = 'http://45.55.86.102:3003/api/post';
				else url = 'http://45.55.86.102:3003/api/post/' + nodeSelected.contentID;
				
				getJSON(url, function(err, data){
					if(err != null)
				    {
				    	console.log(err);
				    	return;
				    }
					
					showSmallModal(data);
				});  
			}
			else if(intersects.length > 0)
				console.log(intersects[ 0 ].object.constructor.name);
			else if(nodeSelected != null && document.getElementById('small-modal').style.display != "block")
			{	
				if(nodeSelected != null)
					nodeSelected.deselectNode();

				controller.state = "idle";
				nodeSelected = null;
			}
		}
	}

	function onDocumentMouseMove( event ) {
		if(nodeSelected != null || controller.state == "intro" ||  document.getElementById('big-modal').style.display == "block")
		{
			camVel.set(0, 0);
			return;
		}

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

	function onMouseMove( event )
	{
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	}

	function onWindowResize(){

	    camera.aspect = (window.innerWidth - 16) / (window.innerHeight - 16);
	    camera.updateProjectionMatrix();

	    renderer.setSize( window.innerWidth - 16, window.innerHeight - 16 );

	}

	function showSmallModal(data)
	{
		nodeSelected.contentID = data._id;

		document.getElementById('small-modal').innerHTML = 
					"<div class='small-modal'><div class='left-content pull-left'><div class='body-text'>" + data.content.title + "<br>" + 
					"<hr /><a onclick='changeToBigModal()' >Ver más</a></div></div><div class='image pull-left'><img src='https://unsplash.it/160/120' /></div></div>";

		document.getElementById('big-modal').innerHTML = 
			"<div class='big-modal'><div class='row'><div class='col-xs-11'><div class='title'><h3>" + data.content.title + "</h3></div></div>" + 
					"<div class='col-xs-1'><a onclick='closeBigModal()'><span class='glyphicon glyphicon-remove-circle close close-btn' aria-hidden='true'></span></a></div></div>" + 
					"<hr /><div class='row'><div class='col-xs-6'><div class='image'><img src='https://unsplash.it/460/320' /></div></div><div class='col-xs-6'>" + data.content.text +
					"<hr><div class='social-buttons'><img src='images/social.png' height='30px' /></div><hr><div class='tags'></div><small>Borges; infinito; universo;</small>" + 
					"<hr><div class='relations'><img src='https://unsplash.it/80/60?random' /><img src='https://unsplash.it/80/60?random' /><img src='https://unsplash.it/80/60?random' /><img src='https://unsplash.it/80/60?random' /><img src='https://unsplash.it/80/60?random' />" + 
					"</div></div></div><br><div class='source'><p>Fuente: TV Publica</p></div></div>";

		document.getElementById('small-modal').style.display = "block";
	}

	function changeToBigModal()
	{
		document.getElementById('small-modal').style.display = "none";
		document.getElementById('big-modal').style.display = "block";
	}

	function closeBigModal()
	{
		document.getElementById('big-modal').style.display = "none";
	}
	function de2ra(degree)   { return degree*(Math.PI/180); }
	/*
	function getJSONP(url, success) {
	    var ud = '_' + +new Date,
	        script = document.createElement('script'),
	        head = document.getElementsByTagName('head')[0] 
	               || document.documentElement;

	    window[ud] = function(data) {
	        head.removeChild(script);
	        success && success(data);
	    };

	    script.src = url.replace('callback=?', 'callback=' + ud);
	    head.appendChild(script);
	}
	*/
	var getJSON = function(url, callback) {
	    var xhr = new XMLHttpRequest();
	    xhr.open("get", url, true);
	    xhr.responseType = "json";
	    xhr.onload = function() {
	      var status = xhr.status;
	      if (status == 200) {
	        callback(null, xhr.response);
	      } else {
	        callback(status);
	      }
	    };
	    xhr.send();
	};