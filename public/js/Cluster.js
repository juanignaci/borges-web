var PARTICLECOUNT = 20;

Cluster.prototype = new THREE.Object3D;
function Cluster(x, y, nodeTexture, scene, controller)
{
	var particles = [];

	for (var i = PARTICLECOUNT - 1; i >= 0; i--)
	{		
		var particle = new Node( 
			x + (Math.random() * SCL * -2 + SCL),
			(Math.random() * SCL * 2.5) - SCL * 0.25,
			y + (Math.random() * SCL * -2 + SCL),
			new THREE.SpriteMaterial( {
			color: Math.random() * 0x808080 + 0x808080,
			fog: true,
			map: nodeTexture
		} ) );
		
		particles[i] = particle;
		scene.add( particle );
	};

	this.particleArr = particles;
	this.controller = controller;
}

Cluster.prototype.updateNodes = function()
{
	for (var i = this.particleArr.length - 1; i >= 0; i--) {
		switch(controller.state)
		{
			case "intro":
				this.particleArr[i].position.set(this.particleArr[i].position.x + (this.particleArr[i].introPosition.x - this.particleArr[i].position.x) * 0.1,
											 this.particleArr[i].position.y + ((this.particleArr[i].introPosition.y + Math.sin(Date.now()*0.001 + this.particleArr[i].position.x * 0.5 + this.particleArr[i].position.z * 0.5) * 0.3) - this.particleArr[i].position.y) * 0.1,
											 this.particleArr[i].position.z + (this.particleArr[i].introPosition.z - this.particleArr[i].position.z) * 0.1);
			break;
			case "idle":
				this.particleArr[i].position.set(this.particleArr[i].position.x + (this.particleArr[i].nodePosition.x - this.particleArr[i].position.x) * 0.02,
											 this.particleArr[i].position.y + ((this.particleArr[i].nodePosition.y + Math.sin(Date.now()*0.001 + this.particleArr[i].position.x) * 0.02) - this.particleArr[i].position.y) * 0.06,
											 this.particleArr[i].position.z + (this.particleArr[i].nodePosition.z - this.particleArr[i].position.z) * 0.02);
			break;
		}
	};
}

function NodeController()
{
	this.state = "intro";
}

Node.prototype = new THREE.Sprite;
function Node(x, y, z, material, controller)
{
	THREE.Sprite.call(this, material);
	this.scale.x = this.scale.y = Math.random() * 0.05 + 0.1;

	this.nodePosition = new THREE.Vector3(x, y, z);
	this.introPosition = new THREE.Vector3(Math.round(x), 1.8, Math.round(z) + this.scale.x * 0.1);

	this.position.x = x;
	this.position.y = 0;
	this.position.z = z;

}