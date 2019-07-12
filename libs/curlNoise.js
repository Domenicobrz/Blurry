//	Simplex 3D Noise 
//	by Ian McEwan, Ashima Arts - ported from glsl
//
/* vec4 */ function permute(/* vec4 */ x) {
    // return mod(((x*34.0)+1.0)*x, 289.0);

    let retVec = new THREE.Vector4();
    retVec.x = (((x.x * 34.0) + 1) * x.x) % 289.0;
    retVec.y = (((x.y * 34.0) + 1) * x.y) % 289.0;
    retVec.z = (((x.z * 34.0) + 1) * x.z) % 289.0;
    retVec.w = (((x.w * 34.0) + 1) * x.w) % 289.0;
    
    return retVec;
}
/* vec4 */ function taylorInvSqrt(/* vec4 */ r){
    // return 1.79284291400159 - 0.85373472095314 * r;

    let retVec = new THREE.Vector4();
    retVec.x = (1.79284291400159 - 0.85373472095314) * r.x;
    retVec.y = (1.79284291400159 - 0.85373472095314) * r.y;
    retVec.z = (1.79284291400159 - 0.85373472095314) * r.z;
    retVec.w = (1.79284291400159 - 0.85373472095314) * r.w;
    
    return retVec;
}

function vec3step(edge, x) {
    let rv = new THREE.Vector3(0,0,0);
    rv.x = x.x < edge.x ? 0 : 1;
    rv.y = x.y < edge.y ? 0 : 1;
    rv.z = x.z < edge.z ? 0 : 1;

    return rv;
} 

function vec4step(edge, x) {
    let rv = new THREE.Vector4(0,0,0,0);
    rv.x = x.x < edge.x ? 0 : 1;
    rv.y = x.y < edge.y ? 0 : 1;
    rv.z = x.z < edge.z ? 0 : 1;
    rv.w = x.w < edge.w ? 0 : 1;

    return rv;
} 

function vec3min(v1, v2) {
    let rv = new THREE.Vector3(0,0,0);
    rv.x = v1.x < v2.x ? v1.x : v2.x;
    rv.y = v1.y < v2.y ? v1.y : v2.y;
    rv.z = v1.z < v2.z ? v1.z : v2.z;

    return rv;
}
function vec3max(v1, v2) {
    let rv = new THREE.Vector3(0,0,0);
    rv.x = v1.x > v2.x ? v1.x : v2.x;
    rv.y = v1.y > v2.y ? v1.y : v2.y;
    rv.z = v1.z > v2.z ? v1.z : v2.z;

    return rv;
}

function vec3mod(v1, mod) {
    let rv = new THREE.Vector3(0,0,0);
    rv.x = v1.x % mod;
    rv.y = v1.y % mod;
    rv.z = v1.z % mod;

    return rv;
}

/* float */ function snoise(/* vec3 */ v) { 
    // const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    // const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // // First corner
    // vec3 i  = floor(v + dot(v, C.yyy) );
    // vec3 x0 =   v - i + dot(i, C.xxx) ;

    // // Other corners
    // vec3 g = step(x0.yzx, x0.xyz);
    // vec3 l = 1.0 - g;
    // vec3 i1 = min( g.xyz, l.zxy );
    // vec3 i2 = max( g.xyz, l.zxy );

    // //  x0 = x0 - 0. + 0.0 * C 
    // vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    // vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    // vec3 x3 = x0 - 1. + 3.0 * C.xxx;

    // // Permutations
    // i = mod(i, 289.0 ); 
    // vec4 p = permute( permute( permute( 
    //          i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
    //        + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
    //        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // // Gradients
    // // ( N*N points uniformly over a square, mapped onto an octahedron.)
    // float n_ = 1.0/7.0; // N=7
    // vec3  ns = n_ * D.wyz - D.xzx;

    // vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

    // vec4 x_ = floor(j * ns.z);
    // vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    // vec4 x = x_ *ns.x + ns.yyyy;
    // vec4 y = y_ *ns.x + ns.yyyy;
    // vec4 h = 1.0 - abs(x) - abs(y);

    // vec4 b0 = vec4( x.xy, y.xy );
    // vec4 b1 = vec4( x.zw, y.zw );

    // vec4 s0 = floor(b0)*2.0 + 1.0;
    // vec4 s1 = floor(b1)*2.0 + 1.0;
    // vec4 sh = -step(h, vec4(0.0));

    // vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    // vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    // vec3 p0 = vec3(a0.xy,h.x);
    // vec3 p1 = vec3(a0.zw,h.y);
    // vec3 p2 = vec3(a1.xy,h.z);
    // vec3 p3 = vec3(a1.zw,h.w);

    // //Normalise gradients
    // vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    // p0 *= norm.x;
    // p1 *= norm.y;
    // p2 *= norm.z;
    // p3 *= norm.w;

    // // Mix final noise value
    // vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    // m = m * m;
    // return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
    //                             dot(p2,x2), dot(p3,x3) ) );



    let C = new THREE.Vector2(1.0/6.0, 1.0/3.0);
    let D = new THREE.Vector4(0.0, 0.5, 1.0, 2.0);

    // First corner

    let i = new THREE.Vector3(v.x, v.y, v.z);
    i.addScalar(i.dot(new THREE.Vector3(C.y, C.y, C.y)));
    i.x = Math.floor(i.x);
    i.y = Math.floor(i.y);
    i.z = Math.floor(i.z);
    i.w = Math.floor(i.w);


    let x0 = new THREE.Vector3(v.x, v.y, v.z);
    x0.sub(i);
    x0.addScalar(i.dot(new THREE.Vector3(C.x, C.x, C.x)));


    let g = new THREE.Vector3(0,0,0);
    g = vec3step(new THREE.Vector3(x0.y, x0.z, x0.x), new THREE.Vector3(x0.x, x0.y, x0.z));
    let l = new THREE.Vector3(1,1,1);
    l.sub(g);
    let i1 = vec3min( g, new THREE.Vector3(l.z, l.x, l.y) );
    let i2 = vec3max( g, new THREE.Vector3(l.z, l.x, l.y) );


    let x1 = new THREE.Vector3();
    x1.add(x0); x1.sub(i1); x1.addScalar(C.x);
    let x2 = new THREE.Vector3();
    x2.add(x0); x2.sub(i2); x2.addScalar(2 * C.x);
    let x3 = new THREE.Vector3();
    x3.add(x0); x3.subScalar(1); x3.addScalar(3 * C.x);
    
    i = vec3mod(i, 289.0 ); 
    let p = new THREE.Vector4();
    p = permute( permute( permute (
        new THREE.Vector4( 
            i.z + i.y + i.x, 
            i.z + i.y + i.x + i1.z + i1.y + i1.x, 
            i.z + i.y + i.x + i2.z + i2.y + i2.x, 
            i.z + i.y + i.x + 1, 1, 1, 
        )
    )));

    let n_ = 1.0 / 7.0; // N=7
    let ns = new THREE.Vector3(n_, n_, n_);
    ns.x = (ns.x * D.w) - D.x;
    ns.y = (ns.y * D.y) - D.z;
    ns.z = (ns.z * D.z) - D.x;


    let j = new THREE.Vector4();
    j.x = p.x - 49 * Math.floor(p.x * ns.z * ns.z); 
    j.y = p.y - 49 * Math.floor(p.y * ns.z * ns.z); 
    j.z = p.z - 49 * Math.floor(p.z * ns.z * ns.z); 
    j.w = p.w - 49 * Math.floor(p.w * ns.z * ns.z); 

    let x_ = new THREE.Vector4();
    x_.x = Math.floor(j.x * ns.z); 
    x_.y = Math.floor(j.y * ns.z); 
    x_.z = Math.floor(j.z * ns.z); 
    x_.w = Math.floor(j.w * ns.z); 

    let y_ = new THREE.Vector4();
    y_.x = Math.floor(j.x - 7 * x_.x); 
    y_.y = Math.floor(j.y - 7 * x_.y); 
    y_.z = Math.floor(j.z - 7 * x_.z); 
    y_.w = Math.floor(j.w - 7 * x_.w); 



    let x = new THREE.Vector4();
    x.x = x_.x * ns.x + ns.y; 
    x.y = x_.y * ns.x + ns.y; 
    x.z = x_.z * ns.x + ns.y; 
    x.w = x_.w * ns.x + ns.y; 

    let y = new THREE.Vector4();
    y.x = y_.x * ns.x + ns.y; 
    y.y = y_.y * ns.x + ns.y; 
    y.z = y_.z * ns.x + ns.y; 
    y.w = y_.w * ns.x + ns.y;

    let h = new THREE.Vector4();
    h.x = 1 - Math.abs(x.x) - Math.abs(y.x); 
    h.y = 1 - Math.abs(x.y) - Math.abs(y.y); 
    h.z = 1 - Math.abs(x.z) - Math.abs(y.z); 
    h.w = 1 - Math.abs(x.w) - Math.abs(y.w);
    

    // vec4 b0 = vec4( x.xy, y.xy );
    let b0 = new THREE.Vector4(x.x, x.y, y.x, y.y);
    // vec4 b1 = vec4( x.zw, y.zw );
    let b1 = new THREE.Vector4(x.z, x.w, y.z, y.w);

    // vec4 s0 = floor(b0)*2.0 + 1.0;
    let s0 = new THREE.Vector4();
    s0.x = Math.floor(b0.x) * 2 + 1; 
    s0.y = Math.floor(b0.y) * 2 + 1; 
    s0.z = Math.floor(b0.z) * 2 + 1; 
    s0.w = Math.floor(b0.w) * 2 + 1; 

    // vec4 s1 = floor(b1)*2.0 + 1.0;
    let s1 = new THREE.Vector4();
    s1.x = Math.floor(b1.x) * 2 + 1; 
    s1.y = Math.floor(b1.y) * 2 + 1; 
    s1.z = Math.floor(b1.z) * 2 + 1; 
    s1.w = Math.floor(b1.w) * 2 + 1; 

    // vec4 sh = -step(h, vec4(0.0));
    let sh = new THREE.Vector4();
    sh = vec4step(h, new THREE.Vector4(0,0,0,0)).multiplyScalar(-1);

    // vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    let a0 = new THREE.Vector4();
    a0.x = b0.x + s0.x * sh.x;
    a0.y = b0.z + s0.z * sh.x;
    a0.z = b0.y + s0.y * sh.y;
    a0.w = b0.w + s0.w * sh.y;
    // vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    let a1 = new THREE.Vector4();
    a1.x = b1.x + s1.x * sh.z;
    a1.y = b1.z + s1.z * sh.z;
    a1.z = b1.y + s1.y * sh.w;
    a1.w = b1.w + s1.w * sh.w;


    // vec3 p0 = vec3(a0.xy,h.x);
    let p0 = new THREE.Vector3(a0.x, a0.y, h.x);
    // vec3 p1 = vec3(a0.zw,h.y);
    let p1 = new THREE.Vector3(a0.z, a0.w, h.y);
    // vec3 p2 = vec3(a1.xy,h.z);
    let p2 = new THREE.Vector3(a1.x, a1.y, h.z);
    // vec3 p3 = vec3(a1.zw,h.w);
    let p3 = new THREE.Vector3(a1.z, a1.w, h.w);


    // vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    let norm = taylorInvSqrt(new THREE.Vector4( p0.dot(p0), p1.dot(p1), p2.dot(p2), p3.dot(p3) ));
    p0.multiplyScalar(norm.x);
    p1.multiplyScalar(norm.y);
    p2.multiplyScalar(norm.z);
    p3.multiplyScalar(norm.w);






    // // Mix final noise value 
    // vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    let t1 = new THREE.Vector4(x0.dot(x0), x1.dot(x1), x2.dot(x2), x3.dot(x3));
    t1.multiplyScalar(-1); 
    t1.addScalar(0.6);
    t1.x = Math.max(t1.x, 0.0); 
    t1.y = Math.max(t1.y, 0.0); 
    t1.z = Math.max(t1.z, 0.0); 
    t1.w = Math.max(t1.w, 0.0); 
    // m = m * m;
    let m = new THREE.Vector4(t1.x * t1.x, t1.y * t1.y, t1.z * t1.z, t1.w * t1.w);
    let m2 = new THREE.Vector4(m.x * m.x, m.y * m.y, m.z * m.z, m.w * m.w);

    // return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
    //                             dot(p2,x2), dot(p3,x3) ) );
    return 42 * m2.dot( new THREE.Vector4( p0.dot(x0), p1.dot(x1), p2.dot(x2), p3.dot(x3) ));
}




/*vec3*/ function snoiseVec3( /* vec3 */ x ) {
    // float s  = snoise(vec3( x ));
    // float s1 = snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
    // float s2 = snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
    // vec3 c = vec3( s , s1 , s2 );
    // return c;

    let s  = snoise(new THREE.Vector3( x.x, x.y, x.z ));
    let s1 = snoise(new THREE.Vector3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
    let s2 = snoise(new THREE.Vector3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
    let c  = new THREE.Vector3( s , s1 , s2 );
    return c;
};


function pnoisev3(px, py, pz) {
    let rv = new THREE.Vector3();

    let x = noise.simplex3(px, py, pz);
    let y = noise.simplex3(px - 129825, py, pz + 1230951);
    let z = noise.simplex3(px, py - 321523, pz + 1523512);

    rv.x = x;
    rv.y = y;
    rv.z = z;

    return rv;
}


function initCurlNoise() {
    noise.seed(Utils.getSeed());
}

/* vec3 */ function curlNoise( /* vec3 */ p ) {
    let e = 0.1;

    let dx = new THREE.Vector3(e, 0, 0);
    let dy = new THREE.Vector3(0, e, 0);
    let dz = new THREE.Vector3(0, 0, e);

    let p_x0 = pnoisev3(p.x - dx.x, p.y - dx.y, p.z - dx.z );  
    let p_x1 = pnoisev3(p.x + dx.x, p.y + dx.y, p.z + dx.z );
    let p_y0 = pnoisev3(p.x - dy.x, p.y - dy.y, p.z - dy.z );  
    let p_y1 = pnoisev3(p.x + dy.x, p.y + dy.y, p.z + dy.z );
    let p_z0 = pnoisev3(p.x - dz.x, p.y - dz.y, p.z - dz.z );  
    let p_z1 = pnoisev3(p.x + dz.x, p.y + dz.y, p.z + dz.z );
      
    // float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
    let x =      p_y1.z - p_y0.z - p_z1.y + p_z0.y;
    // float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
    let y =      p_z1.x - p_z0.x - p_x1.z + p_x0.z;
    // float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;
    let z =      p_x1.y - p_x0.y - p_y1.x + p_y0.x; 
    
    let divisor = 1.0 / ( 2.0 * e );
    let rv = new THREE.Vector3(x, y, z);
    rv.multiplyScalar(divisor);
    rv.normalize();

    return rv;
    // return normalize( vec3( x , y , z ) * divisor );
}