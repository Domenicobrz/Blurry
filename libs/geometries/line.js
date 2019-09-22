class Line {
    constructor(arg) {
        if(arguments.length === 12) {
            this.x1 = arguments[0];
            this.y1 = arguments[1];
            this.z1 = arguments[2];
            
            this.x2 = arguments[3];
            this.y2 = arguments[4];
            this.z2 = arguments[5];
        
            this.c1r = arguments[6];
            this.c1g = arguments[7];
            this.c1b = arguments[8];

            this.c2r = arguments[9];
            this.c2g = arguments[10];
            this.c2b = arguments[11];

            this.v1  = new THREE.Vector3(this.x1, this.y1, this.z1);
            this.v2  = new THREE.Vector3(this.x2, this.y2, this.z2);
        } else {
            this.x1 = arg.v1.x;
            this.y1 = arg.v1.y;
            this.z1 = arg.v1.z;
            
            this.x2 = arg.v2.x;
            this.y2 = arg.v2.y;
            this.z2 = arg.v2.z;
        
            this.c1r = arg.c1.x;
            this.c1g = arg.c1.y;
            this.c1b = arg.c1.z;

            this.c2r = arg.c2.x;
            this.c2g = arg.c2.y;
            this.c2b = arg.c2.z;

            this.v1 = arg.v1;
            this.v2 = arg.v2;
        }
    }

    set c1(value) {
        this.c1r = value.x;
        this.c1g = value.y;
        this.c1b = value.z;
    }

    set c2(value) {
        this.c2r = value.x;
        this.c2g = value.y;
        this.c2b = value.z;
    }
}