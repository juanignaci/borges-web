var PARTICLECOUNT = 20;

Cluster.prototype = new THREE.Object3D;
function Cluster(x, y, scene, controller, cam)
{
	var particles = [];

	for (var i = PARTICLECOUNT - 1; i >= 0; i--)
	{
		var particle = new Node( 
			x + (Math.random() * sW * -2 + sW),
			(Math.random() * sH * -2 + sH) + camera.position.y,
			y + (Math.random() * sW * -2 + sW),
			new THREE.SpriteMaterial( {
			color: Math.random() * 0x808080 + 0x808080,
			fog: true,
			map: controller.materialLowDef 
			} ), controller );
		
		particles[i] = particle;

		scene.add( particle );
	};

	this.particleArr = particles;
	this.controller = controller;
	this.position = new THREE.Vector3(x * SCL, camera.position.y, y * SCL);
	this.camera = cam;
}

Cluster.prototype.updateNodes = function()
{
	for (var i = this.particleArr.length - 1; i >= 0; i--) {
		var dis = this.particleArr[i].position.distanceTo( this.camera.position );

		switch(controller.state)
		{
			case "intro":
				if(this.particleArr[i].asleep)
					continue;
				this.particleArr[i].position.set(this.particleArr[i].position.x + (this.particleArr[i].introPosition.x - this.particleArr[i].position.x) * 0.1,
											 this.particleArr[i].position.y + ((this.particleArr[i].introPosition.y + Math.sin(Date.now()*0.001 + this.particleArr[i].position.x * 0.5 + this.particleArr[i].position.z * 0.5) * 0.3) - this.particleArr[i].position.y) * 0.1,
											 this.particleArr[i].position.z + (this.particleArr[i].introPosition.z - this.particleArr[i].position.z) * 0.1);
			break;
			case "idle":
				this.particleArr[i].position.set(this.particleArr[i].position.x + (this.particleArr[i].nodePosition.x - this.particleArr[i].position.x) * 0.02,
											 this.particleArr[i].position.y + ((this.particleArr[i].nodePosition.y + Math.sin(Date.now()*0.001 + this.particleArr[i].position.x) * 0.02) - this.particleArr[i].position.y) * 0.06,
											 this.particleArr[i].position.z + (this.particleArr[i].nodePosition.z - this.particleArr[i].position.z) * 0.02);
				
				if(dis > 8)
				{
					this.particleArr[i].scale.x = this.particleArr[i].scale.y = this.particleArr[i].originalScale * 1.65;
					this.particleArr[i].material.map = controller.materialBlurFar;
				}					
				else if(dis > 5)
				{
					this.particleArr[i].scale.x = this.particleArr[i].scale.y = this.particleArr[i].originalScale * 1.55;
					this.particleArr[i].material.map = controller.materialBlur;
				}					
				else if (dis > 0.6)
				{
					this.particleArr[i].scale.x = this.particleArr[i].scale.y = this.particleArr[i].originalScale;
					this.particleArr[i].material.map = controller.materialLowDef;
				}
				else
				{
					this.particleArr[i].scale.x = this.particleArr[i].scale.y = this.particleArr[i].originalScale * 1.5;
					this.particleArr[i].material.map = controller.materialBlurNear;
				}
			break;
			case "selected":
				if(this.particleArr[i].selected)
				{
					this.particleArr[i].position.set(this.particleArr[i].position.x + (this.particleArr[i].targetPosition.x - this.particleArr[i].position.x) * 0.2,
												 this.particleArr[i].position.y + (this.particleArr[i].targetPosition.y - this.particleArr[i].position.y) * 0.2,
												 this.particleArr[i].position.z + (this.particleArr[i].targetPosition.z - this.particleArr[i].position.z) * 0.2);
					
					this.particleArr[i].material.map = controller.materialHiDef;
					this.particleArr[i].scale.x = this.particleArr[i].scale.y = this.particleArr[i].originalScale;
				} else {
				this.particleArr[i].position.set(this.particleArr[i].position.x + (this.particleArr[i].nodePosition.x - this.particleArr[i].position.x) * 0.1,
											this.particleArr[i].position.y + ((this.particleArr[i].introPosition.y + Math.sin(Date.now()*0.0005 + 
											this.particleArr[i].position.x * 0.5 + this.particleArr[i].position.z * 0.5) * 0.4) - 
											this.particleArr[i].position.y - (this.particleArr[i].introPosition.y + 3)) * 1/(dis * 5),
											this.particleArr[i].position.z + (this.particleArr[i].nodePosition.z - this.particleArr[i].position.z) * 0.1);
			
					this.particleArr[i].material.map = controller.materialBlurFar;
					this.particleArr[i].scale.x = this.particleArr[i].scale.y = this.particleArr[i].originalScale * 1.45;
				}
			break;
		}
	};
}

/*
Cluster.prototype.moveCluster(x, y)
{
	for (var i = 0; i < this.particleArr.length; i++) {
		var v3 = 
		this.particleArr[i].position.set
	};
}
*/
function NodeController()
{
	this.state = "intro";
	this.materialLowDef =  new THREE.TextureLoader().load( "images/node.png" );
	this.materialHiDef =  new THREE.TextureLoader().load( "images/node-hidef.png" );
	this.materialBlur =  new THREE.TextureLoader().load( "images/node-blurLess.png" );
	this.materialBlurNear =  new THREE.TextureLoader().load( "images/node-blurNear.png" );
	this.materialBlurFar =  new THREE.TextureLoader().load( "images/node-blur.png" );
}

function RelatedNodes(count, camPos, camForward, controller)
{
	console.log(camPos);
	console.log(camForward);
	this.particles = [];
	this.controller = controller;
	var v3 = new THREE.Vector3(camForward.x * 4, Math.random() - 0.5, camForward.z * 4);
	for (var i = 0; i < count; i++) {
		var rV = Math.random() * 6 - 3;
		var v3R = new THREE.Vector3(camForward.z * rV, Math.random() * 2 - 1, camForward.x * -rV);
		var particle = new Node(camPos.x + v3.x + v3R.x,
								2 + v3R.y,
								camPos.z + v3.z + v3R.z,
								new THREE.SpriteMaterial( {
								color: Math.random() * 0x808080 + 0x808080,
								fog: true,
								map: controller.materialLowDef 
								} ), controller);
		/*
		particle.position.set(camPos.x + v3.x + v3R.x,
								2 + v3R.y,
								camPos.z + v3.z + v3R.z);
		particle.scale.set(0.1, 0.1, 1);
		*/
		this.particles[i] = particle;
		scene.add(particle);
	
		//console.log(particle);
	};
}

RelatedNodes.prototype.updateNodes = function()
{
	for (var i = 0; i < this.particles.length; i++) {
		if(this.particles[i].selected)
		{
			this.particles[i].position.set(this.particles[i].position.x + (this.particles[i].targetPosition.x - this.particles[i].position.x) * 0.2,
										 this.particles[i].position.y + (this.particles[i].targetPosition.y - this.particles[i].position.y) * 0.2,
										 this.particles[i].position.z + (this.particles[i].targetPosition.z - this.particles[i].position.z) * 0.2);
			
			this.particles[i].material.map = controller.materialHiDef;
			this.particles[i].scale.x = this.particles[i].scale.y = this.particles[i].originalScale;
		} else {
			this.particles[i].position.set(this.particles[i].position.x + (this.particles[i].nodePosition.x - this.particles[i].position.x) * 0.02,
											 this.particles[i].position.y + ((this.particles[i].nodePosition.y + Math.sin(Date.now()*0.001 + this.particles[i].position.x) * 0.02) - this.particles[i].position.y) * 0.06,
											 this.particles[i].position.z + (this.particles[i].nodePosition.z - this.particles[i].position.z) * 0.02);
				
			this.particles[i].material.map = controller.materialBlurFar;
			this.particles[i].scale.x = this.particles[i].scale.y = this.particles[i].originalScale * 1.45;
		}
	};
}

RelatedNodes.prototype.resetNodes = function(camPos, camForward)
{
	var v3 = new THREE.Vector3(camForward.x * 4, Math.random() - 0.5, camForward.z * 4);
	for (var i = 0; i < this.particles.length; i++) {
		var rV = Math.random() * 6 - 3;
		var v3R = new THREE.Vector3(camForward.z * rV, Math.random() * 2 - 1, camForward.x * -rV);
		
		if(!this.particles[i].selected)
			this.particles[i].position.set(camPos.x + v3.x + v3R.x,
									(-this.particles[i].position.length() - 2) * 2,
									camPos.z + v3.z + v3R.z);
		
		this.particles[i].nodePosition.set(camPos.x + v3.x + v3R.x,
								2 + v3R.y,
								camPos.z + v3.z + v3R.z);
	};
}

Node.prototype = new THREE.Sprite;
function Node(x, y, z, material, controller)
{
	THREE.Sprite.call(this, material);
	
	this.selected = false;
	this.asleep = true;
	this.scale.x = this.scale.y = Math.random() * 0.09 + 0.06;
	this.connections = [];
	this.contentID = null;
	
	this.controller = controller;
	this.nodePosition = new THREE.Vector3(x, y, z);
	this.selNodePosition = new THREE.Vector3(x, y, z);
	this.introPosition = new THREE.Vector3(Math.round(x), 1.8, Math.round(z) + this.scale.x * 0.1);
	this.targetPosition = new THREE.Vector3();
	this.originalScale = this.scale.x;
	this.position.x = this.introPosition.x;
	this.position.y = (-this.position.length() - 2) * 2;
	this.position.z = this.introPosition.z;

	var v2Pos = new THREE.Vector2(this.position.x, this.position.z); 

	if(v2Pos.length() > 12)
	{
		this.scale.x = this.scale.y = this.originalScale * 2.2;
		this.material.map = controller.materialBlurFar;
	}
	else if(v2Pos.length() > 5)
	{
		this.scale.x = this.scale.y = this.originalScale * 1.5;
		this.material.map = controller.materialBlur;
	}
	else
	{
		this.scale.x = this.scale.y = this.originalScale;
		this.material.map = controller.materialLowDef;
	}

	var t = this;
	setTimeout(function() { t.asleep = false }, (this.position.length() - 3) * 150);
}

Node.prototype.selectNode = function(target)
{
	this.selected = true;
	this.targetPosition.set(target.x, target.y, target.z);

	this.material.map = this.controller.materialHiDef;
}

Node.prototype.addConnection = function(target)
{
	connections[connections.length] = target;
}

Node.prototype.deselectNode = function()
{
	this.selected = false;

	this.material.map = this.controller.materialLowDef;
}

Node.prototype.wakeUp = function()
{
	this.asleep = false;
}