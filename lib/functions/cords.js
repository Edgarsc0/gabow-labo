const sin = (x) => {
    return Math.sin((Math.PI * x) / 180);
}

const cos = (x) => {
    return Math.cos((Math.PI * x) / 180);
}

const asin = (x) => {
    return Math.asin(x) * 180 / Math.PI;
}

const acos = (x) => {
    return Math.acos(x) * 180 / Math.PI;
}

const rt = 6.371009 * Math.pow(10, 6);

const positionVector = (lat, lon) => {
    return [
        rt * cos(lat) * cos(lon),
        rt * cos(lat) * sin(lon),
        rt * sin(lat)
    ];
}

//devuelve v2-v1
const directionVector = (v1, v2) => {
    return [
        v2[0] - v1[0],
        v2[1] - v1[1],
        v2[2] - v1[2]
    ];
}

const productPoint = (v1, v2) => {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

const unitVector = (v) => {
    const magintude = magintudeVector(v);
    return [
        v[0] / magintude,
        v[1] / magintude,
        v[2] / magintude
    ];
}

const magintudeVector = (v) => {
    return (v[0] ** 2 + v[1] ** 2 + v[2] ** 2) ** (0.5);
}

const angleBetweenVectors = (v1, v2) => {
    return acos(productPoint(v1, v2) / (magintudeVector(v1) * magintudeVector(v2)));
}

const calculateVectorWithDistance = (v1, v2, distance) => {
    const xiVector = directionVector(v1, v2);
    const theta = distance * 180 / (Math.PI * rt);
    const sigma = angleBetweenVectors(v1, xiVector) - theta;
    const k0 = rt * sin(theta) / sin(sigma);
    const unitDirectionalVector = unitVector(xiVector);
    const preLongitude = [k0 * unitDirectionalVector[0], k0 * unitDirectionalVector[1], k0 * unitDirectionalVector[2]];
    const wVector = [v1[0] + preLongitude[0], v1[1] + preLongitude[1], +v1[2] + preLongitude[2]];
    const wUnitVector = unitVector(wVector);
    const finalVector = [rt * wUnitVector[0], rt * wUnitVector[1], rt * wUnitVector[2]];
    const proyectionVectorMagnitude = (finalVector[0] ** 2 + finalVector[1] ** 2) ** (0.5);
    return {
        finalVector,
        latitud: asin(finalVector[2] / rt),
        longitude: finalVector[1] > 0 ? acos(finalVector[0] / proyectionVectorMagnitude) : -acos(finalVector[0] / proyectionVectorMagnitude),
        xiVector,
        theta,
        sigma,
    }
}

export { positionVector };

