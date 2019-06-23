class Quad {
    constructor(x, y, z, us, vs, ue, ve) {
        let xx = x || 0;
        let yy = y || 0;
        let zz = z || 0;

        this.center = new THREE.Vector3(xx, yy, zz);
        this.width  = 1;
        this.height = 1;

        this.v1 = new THREE.Vector3(xx - this.width * 0.5, yy - this.height * 0.5, zz);
        this.v2 = new THREE.Vector3(xx + this.width * 0.5, yy - this.height * 0.5, zz);
        this.v3 = new THREE.Vector3(xx - this.width * 0.5, yy + this.height * 0.5, zz);

        this.col = new THREE.Vector3(1, 1, 1);

        this.uv1 = new THREE.Vector2(us || 0, vs || 0);
        this.uv2 = new THREE.Vector2(
            ue !== undefined ? ue : 1, 
            ve !== undefined ? ve : 1);

        return this;
    }

    color(r,g,b) {
        this.col.set(r,g,b);

        return this;
    }

    rotate(ax, ay, az, angle) {

        this.v1.applyAxisAngle(new THREE.Vector3(ax, ay, az), angle);
        this.v2.applyAxisAngle(new THREE.Vector3(ax, ay, az), angle);
        this.v3.applyAxisAngle(new THREE.Vector3(ax, ay, az), angle);

        return this;
    }

    translate(x, y, z) {
        
        this.v1.add(new THREE.Vector3(x, y, z));
        this.v2.add(new THREE.Vector3(x, y, z));
        this.v3.add(new THREE.Vector3(x, y, z));

        return this;
    }

    scale(x, y, z) {

        if(y === undefined) y = x;
        if(z === undefined) z = x;
                
        this.v1.multiply(new THREE.Vector3(x, y, z));
        this.v2.multiply(new THREE.Vector3(x, y, z));
        this.v3.multiply(new THREE.Vector3(x, y, z));

        return this;
    }
}