// Copyright (C) 2023 saccharineboi
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

////////////////////////////////////////
const Exception = (objectName, functionName, message) => Object.freeze({
    getObjectName: () => objectName,
    getFunctionName: () => functionName,
    getMessage: () => message,
    toString: () => `= = = = = = = = = = EXCEPTION = = = = = = = = = =\n` +
                    `Object:\t\t${objectName}\n` +
                    `Function:\t${functionName}\n` +
                    `Message:\t${message}\n`
});

////////////////////////////////////////
const Util = Object.freeze({
    Epsilon: () => 1e-6,
    FloatEquals: (a, b) => Math.abs(a - b) <= Util.Epsilon() * Math.max(1.0, Math.max(Math.abs(a), Math.abs(b))),
    ToDegrees: rads => rads * 180.0 / Math.PI,
    ToRadians: degrees => degrees * Math.PI / 180.0,
    ViewportToWorldRay: (x, y, renderer, camera) => {
        const clipX = (2.0 * x) / renderer.getWidth() - 1.0;
        const clipY = 1.0 - (2.0 * y) / renderer.getHeight();
        const clipZ = -1.0;
        const clipW = 1.0;

        const ray_eye = camera.getProjectionMatrix().invert().mulVec4(Vec4(clipX, clipY, clipZ, clipW));
        ray_eye.setZ(-1.0);
        ray_eye.setW(0.0);

        const ray_world = camera.getViewMatrix().invert().mulVec4(ray_eye).norm();
        return ray_world;
    }
});

////////////////////////////////////////
const Vec2 = (x = 0, y = 0) => Object.freeze({
    getX: () => x,
    getY: () => y,
    setX: X => x = X,
    setY: Y => y = Y,
    set: v => {
        x = v.getX();
        y = v.getY();
    },
    add: v => Vec2(x + v.getX(), y + v.getY()),
    sub: v => Vec2(x - v.getX(), y - v.getY()),
    mul: v => Vec2(x * v.getX(), y * v.getY()),
    div: v => Vec2(x / v.getX(), y / v.getY()),
    dot: v => x * v.getX() + y * v.getY(),
    sqrLen: () => x * x + y * y,
    len: () => Math.sqrt(x * x + y * y),
    sqrDist: v => {
        const dx = x - v.getX();
        const dy = y - v.getY();
        return dx * dx + dy * dy;
    },
    dist: v => {
        const dx = x - v.getX();
        const dy = y - v.getY();
        return Math.sqrt(dx * dx + dy * dy);
    },
    scale: s => Vec2(x * s, y * s),
    norm: () => {
        const sqrlen = x * x + y * y;
        if (sqrlen > 0) {
            const s = 1.0 / Math.sqrt(sqrlen);
            return Vec2(x * s, y * s);
        }
        return Vec2(x, y);
    },
    invert: () => Vec2(1.0 / x, 1.0 / y),
    negate: () => Vec2(-x, -y),
    lerp: (v, t) => Vec2(x + t * (v.getX() - x), y + t * (v.getY() - y)),
    copy: () => Vec2(x, y),
    equals: v => Util.FloatEquals(x, v.getX()) && Util.FloatEquals(y, v.getY()),
    toString: () => `vec2: [ ${x}, ${y} ]`
});

////////////////////////////////////////
const Vec3 = (x = 0, y = 0, z = 0) => Object.freeze({
    getX: () => x,
    getY: () => y,
    getZ: () => z,
    setX: X => x = X,
    setY: Y => y = Y,
    setZ: Z => z = Z,
    set: v => {
        x = v.getX();
        y = v.getY();
        z = v.getZ();
    },
    add: v => Vec3(x + v.getX(), y + v.getY(), z + v.getZ()),
    sub: v => Vec3(x - v.getX(), y - v.getY(), z - v.getZ()),
    mul: v => Vec3(x * v.getX(), y * v.getY(), z * v.getZ()),
    div: v => Vec3(x / v.getX(), y / v.getY(), z / v.getZ()),
    dot: v => x * v.getX() + y * v.getY() + z * v.getZ(),
    sqrLen: () => x * x + y * y + z * z,
    len: () => Math.sqrt(x * x + y * y + z * z),
    sqrDist: v => {
        const dx = x - v.getX();
        const dy = y - v.getY();
        const dz = z - v.getZ();
        return dx * dx + dy * dy + dz * dz;
    },
    dist: v => {
        const dx = x - v.getX();
        const dy = y - v.getY();
        const dz = z - v.getZ();
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    },
    scale: s => Vec3(x * s, y * s, z * s),
    norm: () => {
        const sqrlen = x * x + y * y + z * z;
        if (sqrlen > 0) {
            const s = 1.0 / Math.sqrt(sqrlen);
            return Vec3(x * s, y * s, z * s);
        }
        return Vec3(x, y, z);
    },
    invert: () => Vec3(1.0 / x, 1.0 / y, 1.0 / z),
    negate: () => Vec3(-x, -y, -z),
    lerp: (v, t) => Vec3(x + t * (v.getX() - x),
                         y + t * (v.getY() - y),
                         z + t * (v.getZ() - z)),
    cross: v => Vec3(y * v.getZ() - z * v.getY(),
                     z * v.getX() - x * v.getZ(),
                     x * v.getY() - y * v.getX()),
    copy: () => Vec3(x, y, z),
    equals: v => Util.FloatEquals(x, v.getX()) &&
                 Util.FloatEquals(y, v.getY()) &&
                 Util.FloatEquals(z, v.getZ()),
    toString: () => `vec3: [ ${x}, ${y}, ${z} ]`
});

////////////////////////////////////////
const Vec4 = (x = 0, y = 0, z = 0, w = 1) => Object.freeze({
    getX: () => x,
    getY: () => y,
    getZ: () => z,
    getW: () => w,
    setX: X => x = X,
    setY: Y => y = Y,
    setZ: Z => z = Z,
    setW: W => w = W,
    set: v => {
        x = v.getX();
        y = v.getY();
        z = v.getZ();
        w = v.getW();
    },
    add: v => Vec4(x + v.getX(), y + v.getY(), z + v.getZ(), w + v.getW()),
    sub: v => Vec4(x - v.getX(), y - v.getY(), z - v.getZ(), w - v.getW()),
    mul: v => Vec4(x * v.getX(), y * v.getY(), z * v.getZ(), w * v.getW()),
    div: v => Vec4(x / v.getX(), y / v.getY(), z / v.getZ(), w / v.getW()),
    dot: v => x * v.getX() + y * v.getY() + z * v.getZ() + w * v.getW(),
    sqrLen: () => x * x + y * y + z * z + w * w,
    len: () => Math.sqrt(x * x + y * y + z * z + w * w),
    sqrDist: v => {
        const dx = x - v.getX();
        const dy = y - v.getY();
        const dz = z - v.getZ();
        const dw = w - v.getW();
        return dx * dx + dy * dy + dz * dz + dw * dw;
    },
    dist: v => {
        const dx = x - v.getX();
        const dy = y - v.getY();
        const dz = z - v.getZ();
        const dw = w - v.getW();
        return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
    },
    scale: s => Vec4(x * s, y * s, z * s, w * s),
    norm: () => {
        const sqrlen = x * x + y * y + z * z + w * w;
        if (sqrlen > 0) {
            const s = 1.0 / Math.sqrt(sqrlen);
            return Vec4(x * s, y * s, z * s, w * s);
        }
        return Vec4(x, y, z, w);
    },
    invert: () => Vec4(1.0 / x, 1.0 / y, 1.0 / z, 1.0 / w),
    negate: () => Vec4(-x, -y, -z, -w),
    lerp: (v, t) => Vec4(x + t * (v.getX() - x),
                         y + t * (v.getY() - y),
                         z + t * (v.getZ() - z),
                         w + t * (v.getW() - w)),
    copy: () => Vec4(x, y, z, w),
    equals: v => Util.FloatEquals(x, v.getX()) &&
                 Util.FloatEquals(y, v.getY()) &&
                 Util.FloatEquals(z, v.getZ()) &&
                 Util.FloatEquals(w, v.getW()),
    divideByW: () => Vec4(x / w, y / w, z / w, w / w),
    toString: () => `vec4: [ ${x}, ${y}, ${z}, ${w} ]`
});

////////////////////////////////////////
const Quat = (x = 0, y = 0, z = 0, w = 1) => Object.freeze({
    getX: () => x,
    getY: () => y,
    getZ: () => z,
    getW: () => w,
    setX: X => x = X,
    setY: Y => y = Y,
    setZ: Z => z = Z,
    setW: W => w = W,
    set: q => {
        x = q.getX();
        y = q.getY();
        z = q.getZ();
        w = q.getW();
    },
    setAxisAngle: (axis, rads) => {
        const halfRads = rads * 0.5;
        const s = Math.sin(halfRads);
        const c = Math.cos(halfRads);

        x = s * axis.getX();
        y = s * axis.getY();
        z = s * axis.getZ();
        w = c;
    },
    setIdentity: () => {
        x = 0;
        y = 0;
        z = 0;
        w = 1;
    },
    add: q => Quat(x + q.getX(), y + q.getY(), z + q.getZ(), w + q.getW()),
    sub: q => Quat(x - q.getX(), y - q.getY(), z - q.getZ(), w - q.getW()),
    mul: q => {
        const qx = q.getX(),
              qy = q.getY(),
              qz = q.getZ(),
              qw = q.getW();

        return Quat(x * qw + w * qx + y * qz - z * qy,
                    y * qw + w * qy + z * qx - x * qz,
                    z * qw + w * qz + x * qy - y * qx,
                    w * qw - x * qx - y * qy - z * qz);
    },
    div: q => Quat(x / q.getX(), y / q.getY(), z / q.getZ(), w / q.getW()),
    invert: () => {
        const dot = x * x + y * y + z * z + w * w;
        if (dot > 0) {
            return Quat(-x / dot, -y / dot, -z / dot, w / dot);
        }
        return Quat(x, y, z, w);
    },
    norm: () => {
        const sqrlen = x * x + y * y + z * z + w * w;
        if (sqrlen > 0) {
            const s = 1.0 / Math.sqrt(sqrlen);
            return Quat(s * x, s * y, s * z, s * w);
        }
        return Quat(x, y, z, w);
    },
    toMat3: () => {
        const x2 = 2 * x * x,
              y2 = 2 * y * y,
              z2 = 2 * z * z,
              w2 = 2 * w * w;
        const xy = 2 * x * y,
              xz = 2 * x * z,
              xw = 2 * x * w,
              yz = 2 * y * z,
              yw = 2 * y * w,
              zw = 2 * z * w;

        return Mat3(1 - y2 - z2,    xy + zw,        xz - yw,
                    xy - zw,        1 - x2 - z2,    yz + xw,
                    xz + yw,        yz - xw,        1 - x2 - y2);
    },
    toMat4: () => {
        const x2 = 2 * x * x,
              y2 = 2 * y * y,
              z2 = 2 * z * z,
              w2 = 2 * w * w;
        const xy = 2 * x * y,
              xz = 2 * x * z,
              xw = 2 * x * w,
              yz = 2 * y * z,
              yw = 2 * y * w,
              zw = 2 * z * w;

        return Mat4(1 - y2 - z2,    xy + zw,        xz - yw,        0,
                    xy - zw,        1 - x2 - z2,    yz + xw,        0,
                    xz + yw,        yz - xw,        1 - x2 - y2,    0,
                    0,              0,              0,              1);
    },
    slerp: (q, t) => {
        const qx = q.getX(), qy = q.getY(), qz = q.getZ(), qw = q.getW();
        const dt = x * qx + y * qy + z * qz + w * qw;

        if (Math.abs(dt) >= 1.0) {
            return Quat(x, y, z, w);
        }

        const sin_omega = Math.sqrt(1 - dt * dt);
        if (Util.FloatEquals(sin_omega, 0.0)) {
            return Quat(x + t * (qx - x),
                        y + t * (qy - y),
                        z + t * (qz - z),
                        w + t * (qw - w));
        }

        const omega = Math.acos(dt);
        const a = Math.sin((1.0 - t) * omega) / sin_omega;
        const b = Math.sin(t * omega) / sin_omega;

        return Quat(x * a + qx * b,
                    y * a + qy * b,
                    z * a + qz * b,
                    w * a + qw * b);
    },
    lerp: (q, t) => Quat(x + t * (q.getX() - x),
                         y + t * (q.getY() - y),
                         z + t * (q.getZ() - z),
                         w + t * (q.getW() - w)),
    conjugate: () => Quat(-x, -y, -z, w),
    dot: q => x * q.getX() + y * q.getY() + z * q.getZ() + w * q.getW(),
    copy: () => Quat(x, y, z, w),
    equals: q => Util.FloatEquals(x, q.getX()) &&
                 Util.FloatEquals(y, q.getY()) &&
                 Util.FloatEquals(z, q.getZ()) &&
                 Util.FloatEquals(w, q.getW()),
    toString: () => `quat: [ ${x}, ${y}, ${z}, ${w} ]`
});

////////////////////////////////////////
const Mat2 = (m00 = 1.0, m01 = 0.0,
              m10 = 0.0, m11 = 1.0) => {
    const data = new Float32Array([
        m00, m01,
        m10, m11
    ]);

    return Object.freeze({
        get: i => data[i],
        set: m => data.set(m.getData()),
        getData: () => data,
        setData: Data => data.set(Data),
        add: m => Mat2(data[0] + m.get(0), data[1] + m.get(1),
                       data[2] + m.get(2), data[3] + m.get(3)),
        sub: m => Mat2(data[0] - m.get(0), data[1] - m.get(1),
                       data[2] - m.get(2), data[3] - m.get(3)),
        mul: m => {
            const m0 = m.get(0), m1 = m.get(1),
                  m2 = m.get(2), m3 = m.get(3);

            const m00 = data[0] * m0 + data[2] * m1;
            const m01 = data[1] * m0 + data[3] * m1;
            const m10 = data[0] * m2 + data[2] * m3;
            const m11 = data[1] * m2 + data[3] * m3;
            return Mat2(m00, m01,
                        m10, m11);
        },
        mulVec2: v => Vec2(data[0] * v.getX() + data[2] * v.getY(),
                           data[1] * v.getX() + data[3] * v.getY()),
        div: m => Mat2(data[0] / m.get(0), data[1] / m.get(1),
                       data[2] / m.get(2), data[3] / m.get(3)),
        det: () => data[0] * data[3] - data[1] * data[2],
        invert: () => {
            const d = data[0] * data[3] - data[1] * data[2];
            if (!Util.FloatEquals(d, 0.0)) {
                const s = 1.0 / d;
                return Mat2(s * data[3], s * -data[1],
                            s * -data[2], s * data[0]);
            }
            return Mat2(data[0], data[1],
                        data[2], data[3]);
        },
        transpose: () => Mat2(data[0], data[2],
                              data[1], data[3]),
        setIdentity: () => {
            data[0] = 1.0;  data[1] = 0.0;
            data[2] = 0.0;  data[3] = 1.0;
        },
        copy: () => Mat2(data[0], data[1],
                         data[2], data[3]),
        equals: m => Util.FloatEquals(data[0], m.get(0)) &&
                     Util.FloatEquals(data[1], m.get(1)) &&
                     Util.FloatEquals(data[2], m.get(2)) &&
                     Util.FloatEquals(data[3], m.get(3)),
        toString: () => `mat2x2:\n` +
                        `[ ${data[0]}, ${data[1]},\n` +
                        `  ${data[2]}, ${data[3]} ]`
    });
};

////////////////////////////////////////
const Mat3 = (m00 = 1.0, m01 = 0.0, m02 = 0.0,
              m10 = 0.0, m11 = 1.0, m12 = 0.0,
              m20 = 0.0, m21 = 0.0, m22 = 1.0) => {
    const data = new Float32Array([
        m00, m01, m02,
        m10, m11, m12,
        m20, m21, m22
    ]);

    return Object.freeze({
        get: i => data[i],
        set: m => data.set(m.getData()),
        getData: () => data,
        setData: Data => data.set(Data),
        add: m => Mat3(data[0] + m.get(0), data[1] + m.get(1), data[2] + m.get(2),
                       data[3] + m.get(3), data[4] + m.get(4), data[5] + m.get(5),
                       data[6] + m.get(6), data[7] + m.get(7), data[8] + m.get(8)),
        sub: m => Mat3(data[0] - m.get(0), data[1] - m.get(1), data[2] - m.get(2),
                       data[3] - m.get(3), data[4] - m.get(4), data[5] - m.get(5),
                       data[6] - m.get(6), data[7] - m.get(7), data[8] - m.get(8)),
        mul: m => {
            const x00 = m.get(0), x01 = m.get(1), x02 = m.get(2),
                  x10 = m.get(3), x11 = m.get(4), x12 = m.get(5),
                  x20 = m.get(6), x21 = m.get(7), x22 = m.get(8);

            const m00 = data[0] * x00 + data[1] * x10 + data[2] * x20;
            const m01 = data[0] * x01 + data[1] * x11 + data[2] * x21;
            const m02 = data[0] * x02 + data[1] * x12 + data[2] * x22;

            const m10 = data[3] * x00 + data[4] * x10 + data[5] * x20;
            const m11 = data[3] * x01 + data[4] * x11 + data[5] * x21;
            const m12 = data[3] * x02 + data[4] * x12 + data[5] * x22;

            const m20 = data[6] * x00 + data[7] * x10 + data[8] * x20;
            const m21 = data[6] * x01 + data[7] * x11 + data[8] * x21;
            const m22 = data[6] * x02 + data[7] * x12 + data[8] * x22;

            return Mat3(m00, m01, m02,
                        m10, m11, m12,
                        m20, m21, m22);
        },
        mulVec3: v => {
            const vx = v.getX(), vy = v.getY(), vz = v.getZ();
            return Vec3(data[0] * vx + data[3] * vy + data[6] * vz,
                        data[1] * vx + data[4] * vy + data[7] * vz,
                        data[2] * vx + data[5] * vy + data[8] * vz);
        },
        div: m => Mat3(data[0] / m.get(0), data[1] / m.get(1), data[2] / m.get(2),
                       data[3] / m.get(3), data[4] / m.get(4), data[5] / m.get(5),
                       data[6] / m.get(6), data[7] / m.get(7), data[8] / m.get(8)),
        det: () => data[0] * (data[4] * data[8] - data[5] * data[7]) -
                   data[1] * (data[3] * data[8] - data[5] * data[6]) +
                   data[2] * (data[3] * data[7] - data[4] * data[6]),
        invert: () => {
            const d = data[0] * (data[4] * data[8] - data[5] * data[7]) -
                      data[1] * (data[3] * data[8] - data[5] * data[6]) +
                      data[2] * (data[3] * data[7] - data[4] * data[6]);

            if (!Util.FloatEquals(d, 0.0)) {
                const m00 = (data[4] * data[8] - data[5] * data[7]) / d;
                const m01 = (data[2] * data[7] - data[1] * data[8]) / d;
                const m02 = (data[1] * data[5] - data[2] * data[4]) / d;

                const m10 = (data[5] * data[6] - data[3] * data[8]) / d;
                const m11 = (data[0] * data[8] - data[2] * data[6]) / d;
                const m12 = (data[2] * data[3] - data[0] * data[5]) / d;

                const m20 = (data[3] * data[7] - data[4] * data[6]) / d;
                const m21 = (data[1] * data[6] - data[0] * data[7]) / d;
                const m22 = (data[0] * data[4] - data[1] * data[3]) / d;

                return Mat3(m00, m01, m02,
                            m10, m11, m12,
                            m20, m21, m22);
            }
            return Mat3(data[0], data[1], data[2],
                        data[3], data[4], data[5],
                        data[6], data[7], data[8]);
        },
        transpose: () => Mat3(data[0], data[3], data[6],
                              data[1], data[4], data[7],
                              data[2], data[5], data[8]),
        setIdentity: () => {
            data[0] = 1.0;  data[1] = 0.0;  data[2] = 0.0;
            data[3] = 0.0;  data[4] = 1.0;  data[5] = 0.0;
            data[6] = 0.0;  data[7] = 0.0;  data[8] = 1.0;
        },
        copy: () => Mat3(data[0], data[1], data[2],
                         data[3], data[4], data[5],
                         data[6], data[7], data[8]),
        equals: m => Util.FloatEquals(data[0], m.get(0)) &&
                     Util.FloatEquals(data[1], m.get(1)) &&
                     Util.FloatEquals(data[2], m.get(2)) &&
                     Util.FloatEquals(data[3], m.get(3)) &&
                     Util.FloatEquals(data[4], m.get(4)) &&
                     Util.FloatEquals(data[5], m.get(5)) &&
                     Util.FloatEquals(data[6], m.get(6)) &&
                     Util.FloatEquals(data[7], m.get(7)) &&
                     Util.FloatEquals(data[8], m.get(8)),
        toString: () => `mat3x3:\n` +
                        `[ ${data[0]}, ${data[1]}, ${data[2]},\n` +
                        `  ${data[3]}, ${data[4]}, ${data[5]},\n` +
                        `  ${data[6]}, ${data[7]}, ${data[8]} ]`
    });
};

////////////////////////////////////////
const Mat4 = (m00 = 1.0, m01 = 0.0, m02 = 0.0, m03 = 0.0,
              m10 = 0.0, m11 = 1.0, m12 = 0.0, m13 = 0.0,
              m20 = 0.0, m21 = 0.0, m22 = 1.0, m23 = 0.0,
              m30 = 0.0, m31 = 0.0, m32 = 0.0, m33 = 1.0) => {
    const data = new Float32Array([
        m00, m01, m02, m03,
        m10, m11, m12, m13,
        m20, m21, m22, m23,
        m30, m31, m32, m33
    ]);

    return Object.freeze({
        get: i => data[i],
        set: m => data.set(m.getData()),
        getData: () => data,
        setData: Data => data.set(Data),
        add: m => Mat4(data[0]  + m.get(0),  data[1]  + m.get(1),  data[2]  + m.get(2),  data[3]  + m.get(3),
                       data[4]  + m.get(4),  data[5]  + m.get(5),  data[6]  + m.get(6),  data[7]  + m.get(7),
                       data[8]  + m.get(8),  data[9]  + m.get(9),  data[10] + m.get(10), data[11] + m.get(11),
                       data[12] + m.get(12), data[13] + m.get(13), data[14] + m.get(14), data[15] + m.get(15)),
        sub: m => Mat4(data[0]  - m.get(0),  data[1]  - m.get(1),  data[2]  - m.get(2),  data[3]  - m.get(3),
                       data[4]  - m.get(4),  data[5]  - m.get(5),  data[6]  - m.get(6),  data[7]  - m.get(7),
                       data[8]  - m.get(8),  data[9]  - m.get(9),  data[10] - m.get(10), data[11] - m.get(11),
                       data[12] - m.get(12), data[13] - m.get(13), data[14] - m.get(14), data[15] - m.get(15)),
        mul: m => {
            const a00 = data[0],  a01 = data[1],  a02 = data[2],  a03 = data[3];
            const a10 = data[4],  a11 = data[5],  a12 = data[6],  a13 = data[7];
            const a20 = data[8],  a21 = data[9],  a22 = data[10], a23 = data[11];
            const a30 = data[12], a31 = data[13], a32 = data[14], a33 = data[15];

            let b0 = m.get(0), b1 = m.get(1), b2 = m.get(2), b3 = m.get(3);

            const r00 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            const r01 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            const r02 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            const r03 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = m.get(4), b1 = m.get(5), b2 = m.get(6), b3 = m.get(7);

            const r10 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            const r11 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            const r12 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            const r13 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = m.get(8), b1 = m.get(9), b2 = m.get(10), b3 = m.get(11);

            const r20 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            const r21 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            const r22 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            const r23 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = m.get(12), b1 = m.get(13), b2 = m.get(14), b3 = m.get(15);

            const r30 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            const r31 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            const r32 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            const r33 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            return Mat4(r00, r01, r02, r03,
                        r10, r11, r12, r13,
                        r20, r21, r22, r23,
                        r30, r31, r32, r33);
        },
        mulVec4: v => {
            const vx = v.getX(), vy = v.getY(), vz = v.getZ(), vw = v.getW();
            return Vec4(data[0] * vx + data[4] * vy + data[8] * vz + data[12] * vw,
                        data[1] * vx + data[5] * vy + data[9] * vz + data[13] * vw,
                        data[2] * vx + data[6] * vy + data[10] * vz + data[14] * vw,
                        data[3] * vx + data[7] * vy + data[11] * vz + data[15] * vw);
        },
        div: m => Mat4(data[0]  / m.get(0),  data[1]  / m.get(1),  data[2]  / m.get(2),  data[3]  / m.get(3),
                       data[4]  / m.get(4),  data[5]  / m.get(5),  data[6]  / m.get(6),  data[7]  / m.get(7),
                       data[8]  / m.get(8),  data[9]  / m.get(9),  data[10] / m.get(10), data[11] / m.get(11),
                       data[12] / m.get(12), data[13] / m.get(13), data[14] / m.get(14), data[15] / m.get(15)),
        det: () => {
            const m00 = data[0],  m01 = data[1],  m02 = data[2],  m03 = data[3];
            const m10 = data[4],  m11 = data[5],  m12 = data[6],  m13 = data[7];
            const m20 = data[8],  m21 = data[9],  m22 = data[10], m23 = data[11];
            const m30 = data[12], m31 = data[13], m32 = data[14], m33 = data[15];

            return m03 * m12 * m21 * m30 - m02 * m13 * m21 * m30 -
                   m03 * m11 * m22 * m30 + m01 * m13 * m22 * m30 +
                   m02 * m11 * m23 * m30 - m01 * m12 * m23 * m30 -
                   m03 * m12 * m20 * m31 + m02 * m13 * m20 * m31 +
                   m03 * m10 * m22 * m31 - m00 * m13 * m22 * m31 -
                   m02 * m10 * m23 * m31 + m00 * m12 * m23 * m31 +
                   m03 * m11 * m20 * m32 - m01 * m13 * m20 * m32 -
                   m03 * m10 * m21 * m32 + m00 * m13 * m21 * m32 +
                   m01 * m10 * m23 * m32 - m00 * m11 * m23 * m32 -
                   m02 * m11 * m20 * m33 + m01 * m12 * m20 * m33 +
                   m02 * m10 * m21 * m33 - m00 * m12 * m21 * m33 -
                   m01 * m10 * m22 * m33 + m00 * m11 * m22 * m33;
        },
        invert: () => {
            const m00 = data[0],  m01 = data[1],  m02 = data[2],  m03 = data[3];
            const m10 = data[4],  m11 = data[5],  m12 = data[6],  m13 = data[7];
            const m20 = data[8],  m21 = data[9],  m22 = data[10], m23 = data[11];
            const m30 = data[12], m31 = data[13], m32 = data[14], m33 = data[15];

            const b00 = m00 * m11 - m01 * m10;
            const b01 = m00 * m12 - m02 * m10;
            const b02 = m00 * m13 - m03 * m10;
            const b03 = m01 * m12 - m02 * m11;
            const b04 = m01 * m13 - m03 * m11;
            const b05 = m02 * m13 - m03 * m12;
            const b06 = m20 * m31 - m21 * m30;
            const b07 = m20 * m32 - m22 * m30;
            const b08 = m20 * m33 - m23 * m30;
            const b09 = m21 * m32 - m22 * m31;
            const b10 = m21 * m33 - m23 * m31;
            const b11 = m22 * m33 - m23 * m32;

            const det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
            if (!Util.FloatEquals(det, 0.0)) {
                const r00 = (m11 * b11 - m12 * b10 + m13 * b09) / det;
                const r01 = (m02 * b10 - m01 * b11 - m03 * b09) / det;
                const r02 = (m31 * b05 - m32 * b04 + m33 * b03) / det;
                const r03 = (m22 * b04 - m21 * b05 - m23 * b03) / det;

                const r10 = (m12 * b08 - m10 * b11 - m13 * b07) / det;
                const r11 = (m00 * b11 - m02 * b08 + m03 * b07) / det;
                const r12 = (m32 * b02 - m30 * b05 - m33 * b01) / det;
                const r13 = (m20 * b05 - m22 * b02 + m23 * b01) / det;

                const r20 = (m10 * b10 - m11 * b08 + m13 * b06) / det;
                const r21 = (m01 * b08 - m00 * b10 - m03 * b06) / det;
                const r22 = (m30 * b04 - m31 * b02 + m33 * b00) / det;
                const r23 = (m21 * b02 - m20 * b04 - m23 * b00) / det;

                const r30 = (m11 * b07 - m10 * b09 - m12 * b06) / det;
                const r31 = (m00 * b09 - m01 * b07 + m02 * b06) / det;
                const r32 = (m31 * b01 - m30 * b03 - m32 * b00) / det;
                const r33 = (m20 * b03 - m21 * b01 + m22 * b00) / det;

                return Mat4(r00, r01, r02, r03,
                            r10, r11, r12, r13,
                            r20, r21, r22, r23,
                            r30, r31, r32, r33);
            }
            return Mat4(m00, m01, m02, m03,
                        m10, m11, m12, m13,
                        m20, m21, m22, m23,
                        m30, m31, m32, m33);
        },
        transpose: () => Mat4(data[0], data[4], data[8],  data[12],
                              data[1], data[5], data[9],  data[13],
                              data[2], data[6], data[10], data[14],
                              data[3], data[7], data[11], data[15]),
        setIdentity: () => {
            data[0]  = 1.0;  data[1]  = 0.0;  data[2]  = 0.0;  data[3]  = 0.0;
            data[4]  = 0.0;  data[5]  = 1.0;  data[6]  = 0.0;  data[7]  = 0.0;
            data[8]  = 0.0;  data[9]  = 0.0;  data[10] = 1.0;  data[11] = 0.0;
            data[12] = 0.0;  data[13] = 0.0;  data[14] = 0.0;  data[15] = 1.0;
        },
        copy: () => Mat4(data[0],  data[1],  data[2],  data[3],
                         data[4],  data[5],  data[6],  data[7],
                         data[8],  data[9],  data[10], data[11],
                         data[12], data[13], data[14], data[15]),
        equals: m => Util.FloatEquals(data[0], m.get(0)) &&
                     Util.FloatEquals(data[1], m.get(1)) &&
                     Util.FloatEquals(data[2], m.get(2)) &&
                     Util.FloatEquals(data[3], m.get(3)) &&
                     Util.FloatEquals(data[4], m.get(4)) &&
                     Util.FloatEquals(data[5], m.get(5)) &&
                     Util.FloatEquals(data[6], m.get(6)) &&
                     Util.FloatEquals(data[7], m.get(7)) &&
                     Util.FloatEquals(data[8], m.get(8)) &&
                     Util.FloatEquals(data[9], m.get(9)) &&
                     Util.FloatEquals(data[10], m.get(10)) &&
                     Util.FloatEquals(data[11], m.get(11)) &&
                     Util.FloatEquals(data[12], m.get(12)) &&
                     Util.FloatEquals(data[13], m.get(13)) &&
                     Util.FloatEquals(data[14], m.get(14)) &&
                     Util.FloatEquals(data[15], m.get(15)),
        toString: () => `mat4x4:\n` +
                        `[ ${data[0]}, ${data[1]}, ${data[2]}, ${data[3]},\n` +
                        `  ${data[4]}, ${data[5]}, ${data[6]}, ${data[7]},\n` +
                        `  ${data[8]}, ${data[9]}, ${data[10]}, ${data[11]},\n` + 
                        `  ${data[12]}, ${data[13]}, ${data[14]}, ${data[15]}`
    });
};

////////////////////////////////////////
const Transform = Object.freeze({
    Perspective: (aspectRatio, fovy, near, far) => {
        const f = 1.0 / Math.tan(fovy / 2);
        const nf = 1.0 / (near - far);

        const m00 = f / aspectRatio;
        const m01 = 0;
        const m02 = 0;
        const m03 = 0;

        const m10 = 0;
        const m11 = f;
        const m12 = 0;
        const m13 = 0;

        const m20 = 0;
        const m21 = 0;
        const m22 = (far + near) * nf;
        const m23 = -1;

        const m30 = 0;
        const m31 = 0;
        const m32 = 2 * far * near * nf;
        const m33 = 0;

        return Mat4(m00, m01, m02, m03,
                    m10, m11, m12, m13,
                    m20, m21, m22, m23,
                    m30, m31, m32, m33);
    },
    LookAt: (eye, target, up) => {
        const zAxis = eye.sub(target).norm();
        const xAxis = up.cross(zAxis).norm();
        const yAxis = zAxis.cross(xAxis).norm();

        return Mat4( xAxis.getX(),    yAxis.getX(),    zAxis.getX(),   0.0,
                     xAxis.getY(),    yAxis.getY(),    zAxis.getY(),   0.0,
                     xAxis.getZ(),    yAxis.getZ(),    zAxis.getZ(),   0.0,
                    -xAxis.dot(eye), -yAxis.dot(eye), -zAxis.dot(eye), 1.0);
    },
    Translate: t => {
        const tx = t.getX(),
              ty = t.getY(),
              tz = t.getZ();

        return Mat4(1,  0,  0,  0,
                    0,  1,  0,  0,
                    0,  0,  1,  0,
                    tx, ty, tz, 1.0);
    },
    Rotate: q => {
        const x = q.getX(),
              y = q.getY(),
              z = q.getZ(),
              w = q.getW();

        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const xy = x * y2;
        const xz = x * z2;
        const yy = y * y2;
        const yz = y * z2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;

        const m00 = (1 - (yy + zz));
        const m01 = (xy + wz);
        const m02 = (xz - wy);
        const m03 = 0;

        const m10 = (xy - wz);
        const m11 = (1 - (xx + zz));
        const m12 = (yz + wx);
        const m13 = 0;

        const m20 = (xz + wy);
        const m21 = (yz - wx);
        const m22 = (1 - (xx + yy));
        const m23 = 0;

        const m30 = 0;
        const m31 = 0;
        const m32 = 0;
        const m33 = 1;

        return Mat4(m00, m01, m02, m03,
                    m10, m11, m12, m13,
                    m20, m21, m22, m23,
                    m30, m31, m32, m33);
    },
    Scale: s => {
        const sx = s.getX();
        const sy = s.getY();
        const sz = s.getZ();

        return Mat4(sx,     0,      0,      0,
                    0,      sy,     0,      0,
                    0,      0,      sz,     0,
                    0,      0,      0,      1);
    },
    RotateTranslateScale: (q, t, s) => {
        const x = q.getX(),
              y = q.getY(),
              z = q.getZ(),
              w = q.getW();

        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const xy = x * y2;
        const xz = x * z2;
        const yy = y * y2;
        const yz = y * z2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;

        const sx = s.getX();
        const sy = s.getY();
        const sz = s.getZ();

        const m00 = (1 - (yy + zz)) * sx;
        const m01 = (xy + wz) * sx;
        const m02 = (xz - wy) * sx;
        const m03 = 0;

        const m10 = (xy - wz) * sy;
        const m11 = (1 - (xx + zz)) * sy;
        const m12 = (yz + wx) * sy;
        const m13 = 0;

        const m20 = (xz + wy) * sz;
        const m21 = (yz - wx) * sz;
        const m22 = (1 - (xx + yy)) * sz;
        const m23 = 0;

        const m30 = t.getX();
        const m31 = t.getY();
        const m32 = t.getZ();
        const m33 = 1;

        return Mat4(m00, m01, m02, m03,
                    m10, m11, m12, m13,
                    m20, m21, m22, m23,
                    m30, m31, m32, m33);
    },
    RandomVec2: () => Vec2(Math.random(), Math.random()),
    RandomVec3: () => Vec3(Math.random(), Math.random(), Math.random()),
    RandomVec4: () => Vec4(Math.random(), Math.random(), Math.random(), Math.random()),
    QuatFromAxisAngle: (axis, rads) => {
        const halfRads = rads * 0.5;
        const s = Math.sin(halfRads);
        const c = Math.cos(halfRads);

        const x = s * axis.getX();
        const y = s * axis.getY();
        const z = s * axis.getZ();
        const w = c;

        return Quat(x, y, z, w);
    }
});

////////////////////////////////////////
const Canvas = (canvasId, glOptions) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        throw Exception(null, "Canvas", `${canvasId} doesn't exist`);
    }

    const gl = canvas.getContext("webgl2", glOptions);
    if (!gl) {
        throw Exception(null, "Renderer", "webgl 2.0 is not supported");
    }

    const resize = () => {
        if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
        }
    };
    resize();

    return Object.freeze({
        getCanvas: () => canvas,
        getGL: () => gl,
        resize: resize,
        getWidth: () => canvas.width,
        getHeight: () => canvas.height,
        getAspectRatio: () => canvas.width / canvas.height
    });
};

////////////////////////////////////////
const SHADER_BASIC_VERT = `#version 300 es
                           
                           layout (location = 0) in vec3 aPos;
                           layout (location = 1) in vec3 aColor;

                           out vec3 vColor;

                           void main()
                           {
                                gl_Position = vec4(aPos, 1.0f);
                                vColor = aColor;
                           }`;

////////////////////////////////////////
const SHADER_BASIC_FRAG = `#version 300 es
                           precision highp float;

                           in vec3 vColor;

                           out vec4 color;
                           void main()
                           {
                                color = vec4(vColor, 1.0f);
                           }`;

////////////////////////////////////////
const SHADER_EMISSIVE_COLOR_VERT = `#version 300 es

                                    layout (location = 0) in vec3 aPos;

                                    uniform mat4 uPVM;

                                    void main()
                                    {
                                        gl_Position = uPVM * vec4(aPos, 1.0f);
                                    }`;

////////////////////////////////////////
const SHADER_EMISSIVE_COLOR_FRAG = `#version 300 es
                                    precision highp float;

                                    uniform vec4 uColor;

                                    out vec4 color;
                                    void main()
                                    {
                                        color = uColor;
                                    }`;

////////////////////////////////////////
const SHADER_POINT_VERT = `#version 300 es

                           const vec3 positions[6] = vec3[]
                           (
                                vec3(-0.5f, -0.5f, 0.0f),
                                vec3(0.5f, -0.5f, 0.0f),
                                vec3(0.5f, 0.5f, 0.0f),
                                
                                vec3(0.5f, 0.5f, 0.0f),
                                vec3(-0.5f, 0.5f, 0.0f),
                                vec3(-0.5f, -0.5f, 0.0f)
                           );

                           layout (location = 0) in mat4 aModel;
                           layout (location = 4) in vec4 aColor;

                           uniform mat4 uProjectionView;

                           out vec3 vVertexPos;
                           out vec4 vColor;

                           void main()
                           {
                               gl_Position = uProjectionView * aModel * vec4(positions[gl_VertexID], 1.0f);
                               vVertexPos = positions[gl_VertexID];
                               vColor = aColor;
                           }`;

////////////////////////////////////////
const SHADER_POINT_FRAG = `#version 300 es
                           precision highp float;

                           in vec3 vVertexPos;
                           in vec4 vColor;

                           out vec4 color;
                           void main()
                           {
                               color = vColor;
                               float r = length(vVertexPos);
                               color.a = clamp(10.0f * (1.0f - clamp((r + 0.5f), 0.0f, 1.0f)), 0.0f, 1.0f);
                           }`;

////////////////////////////////////////
const SHADER_POSTPROCESS_VERT = `#version 300 es
                                 
                                 const vec3 positions[6] = vec3[]
                                 (
                                    vec3(-1.0f, -1.0f, 0.0f),
                                    vec3(1.0f, -1.0f, 0.0f),
                                    vec3(1.0f, 1.0f, 0.0f),
                                    
                                    vec3(1.0f, 1.0f, 0.0f),
                                    vec3(-1.0f, 1.0f, 0.0f),
                                    vec3(-1.0f, -1.0f, 0.0f)
                                 );

                                 const vec2 texcoords[6] = vec2[]
                                 (
                                    vec2(0.0f, 0.0f),
                                    vec2(1.0f, 0.0f),
                                    vec2(1.0f, 1.0f),

                                    vec2(1.0f, 1.0f),
                                    vec2(0.0f, 1.0f),
                                    vec2(0.0f, 0.0f)
                                 );

                                 out vec2 vTexCoord;

                                 void main()
                                 {
                                    gl_Position = vec4(positions[gl_VertexID], 1.0f);
                                    vTexCoord = texcoords[gl_VertexID];
                                 }`;

////////////////////////////////////////
const SHADER_POSTPROCESS_FRAG = `#version 300 es
                                 precision highp float;

                                 uniform sampler2D uScreenTexture;
                                 in vec2 vTexCoord;

                                 uniform float uGamma;
                                 uniform float uExposure;

                                 out vec4 color;
                                 void main()
                                 {
                                    vec3 hdrColor = texture(uScreenTexture, vTexCoord).rgb;
                                    vec3 tonemapped = vec3(1.0f) - exp(-hdrColor * uExposure);
                                    color = vec4(pow(tonemapped, vec3(1.0f / uGamma)), 1.0f);
                                 }`;

////////////////////////////////////////
const SHADER_SKYBOX_VERT = `#version 300 es

                            // assume CCW
                            const vec3 positions[36] = vec3[](
                                // front face
                                vec3(-1.0f, -1.0f,  1.0f),
                                vec3(-1.0f,  1.0f,  1.0f),
                                vec3( 1.0f,  1.0f,  1.0f),
                                vec3( 1.0f,  1.0f,  1.0f),
                                vec3( 1.0f, -1.0f,  1.0f),
                                vec3(-1.0f, -1.0f,  1.0f),

                                // back face
                                vec3(-1.0f, -1.0f, -1.0f),
                                vec3( 1.0f, -1.0f, -1.0f),
                                vec3( 1.0f,  1.0f, -1.0f),
                                vec3( 1.0f,  1.0f, -1.0f),
                                vec3(-1.0f,  1.0f, -1.0f),
                                vec3(-1.0f, -1.0f, -1.0f),

                                // left face
                                vec3(-1.0f, -1.0f, -1.0f),
                                vec3(-1.0f,  1.0f, -1.0f),
                                vec3(-1.0f,  1.0f,  1.0f),
                                vec3(-1.0f,  1.0f,  1.0f),
                                vec3(-1.0f, -1.0f,  1.0f),
                                vec3(-1.0f, -1.0f, -1.0f),

                                // right face
                                vec3( 1.0f, -1.0f,  1.0f),
                                vec3( 1.0f,  1.0f,  1.0f),
                                vec3( 1.0f,  1.0f, -1.0f),
                                vec3( 1.0f,  1.0f, -1.0f),
                                vec3( 1.0f, -1.0f, -1.0f),
                                vec3( 1.0f, -1.0f,  1.0f),

                                // top face
                                vec3(-1.0f,  1.0f,  1.0f),
                                vec3(-1.0f,  1.0f, -1.0f),
                                vec3( 1.0f,  1.0f, -1.0f),
                                vec3( 1.0f,  1.0f, -1.0f),
                                vec3( 1.0f,  1.0f,  1.0f),
                                vec3(-1.0f,  1.0f,  1.0f),

                                // bottom face
                                vec3(-1.0f, -1.0f, -1.0f),
                                vec3(-1.0f, -1.0f,  1.0f),
                                vec3( 1.0f, -1.0f,  1.0f),
                                vec3( 1.0f, -1.0f,  1.0f),
                                vec3( 1.0f, -1.0f, -1.0f),
                                vec3(-1.0f, -1.0f, -1.0f)
                            );

                            out vec3 vTexCoord;

                            uniform mat4 uProjection;
                            uniform mat4 uView;

                            void main()
                            {
                                vec4 vertexPos = uProjection * mat4(mat3(uView)) * vec4(positions[gl_VertexID], 1.0f);
                                gl_Position = vertexPos.xyww;
                                vTexCoord = positions[gl_VertexID];
                            }`;

////////////////////////////////////////
const SHADER_SKYBOX_FRAG = `#version 300 es
                            precision highp float;

                            in vec3 vTexCoord;

                            uniform samplerCube uSkybox;

                            out vec4 color;
                            void main()
                            {
                                color = texture(uSkybox, vTexCoord); 
                            }`;

////////////////////////////////////////
const Buffer = (gl, type, data, usage, dataSize) => {
    const id = gl.createBuffer();
    gl.bindBuffer(type, id);
    if (data !== null) {
        gl.bufferData(type, data, usage);
        dataSize = data.length * data.BYTES_PER_ELEMENT;
    }
    else {
        gl.bufferData(type, dataSize, usage);
    }
    gl.bindBuffer(type, null);

    return Object.freeze({
        getId: () => id,
        getType: () => type,
        getData: () => data,
        getDataLength: () => data.length,
        getDataSizeInBytes: () => data.length * data.BYTES_PER_ELEMENT,
        getUsage: () => usage,
        bind: () => gl.bindBuffer(type, id),
        unbind: () => gl.bindBuffer(type, null),
        modify: (offset, newData) => gl.bufferSubData(type, offset, newData)
    });
};

////////////////////////////////////////
const VAO = (gl, vbo, ebo, ...configs) => {
    const id = gl.createVertexArray();
    gl.bindVertexArray(id);
        vbo.bind();
        for (const config of configs) {
            gl.enableVertexAttribArray(config.id);
            gl.vertexAttribPointer(config.id, config.size, config.type, gl.FALSE, config.stride, config.offset);
            if (config.isInstanced) {
                gl.vertexAttribDivisor(config.id, 1);
            }
        }
        vbo.unbind();
        if (ebo) {
            ebo.bind();
        }
    gl.bindVertexArray(null);
    if (ebo) {
        ebo.unbind();
    }

    return Object.freeze({
        getId: () => id,
        getVbo: () => vbo,
        getEbo: () => ebo,
        bind: () => gl.bindVertexArray(id),
        unbind: () => gl.bindVertexArray(null),
        draw: (mode = gl.TRIANGLES) => gl.drawElements(mode, ebo.getDataLength(), gl.UNSIGNED_INT, null),
        drawArraysInstanced: (vertexCount, instanceCount, mode = gl.TRIANGLES) => gl.drawArraysInstanced(mode, 0, vertexCount, instanceCount),
        drawElementsInstanced: (instanceCount, mode = gl.TRIANGLES) => gl.drawElementsInstanced(mode, ebo.getDataLength(), 0, instanceCount)
    });
};

////////////////////////////////////////
const Mesh = (gl, vertices, indices, ...configs) => {
    const vbo = Buffer(gl, gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    const ebo = Buffer(gl, gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    const vao = VAO(gl, vbo, ebo, ...configs);

    return Object.freeze({
        getVertices: () => vertices,
        getIndices: () => indices,
        getConfigs: () => configs,
        getVbo: () => vbo,
        getEbo: () => ebo,
        getVao: () => vao,
        bind: () => vao.bind(),
        unbind: () => vao.unbind(),
        draw: (mode = gl.TRIANGLES) => vao.draw(mode),
        drawPoints: () => vao.draw(gl.POINTS),
        drawLines: () => vao.draw(gl.LINES),
        drawLineLoop: () => vao.draw(gl.LINE_LOOP),
        drawLineStrip: () => vao.draw(gl.LINE_STRIP),
        drawTriangles: () => vao.draw(gl.TRIANGLES),
        drawTriangleStrip: () => vao.draw(gl.TRIANGLE_STRIP)
    });
};

////////////////////////////////////////
const LoadColoredTriangle = gl => {
    const vertices = new Float32Array([
        -0.5, -0.5, 0.0,        1.0, 0.0, 0.0,
         0.5, -0.5, 0.0,        0.0, 1.0, 0.0,
         0.0,  0.5, 0.0,        0.0, 0.0, 1.0
    ]);

    const indices = new Uint32Array([ 0, 1, 2 ]);

    return Mesh(gl, vertices, indices, { id: 0, size: 3, type: gl.FLOAT, stride: 6 * Float32Array.BYTES_PER_ELEMENT, offset: 0 },
                                       { id: 1, size: 3, type: gl.FLOAT, stride: 6 * Float32Array.BYTES_PER_ELEMENT, offset: 3 * Float32Array.BYTES_PER_ELEMENT });
};

////////////////////////////////////////
const LoadColoredQuad = gl => {
    const vertices = new Float32Array([
        -0.5, -0.5, 0.0,        1.0, 0.0, 0.0,
         0.5, -0.5, 0.0,        0.0, 1.0, 0.0,
         0.5,  0.5, 0.0,        0.0, 0.0, 1.0,
        -0.5,  0.5, 0.0,        1.0, 1.0, 0.0
    ]);

    const indices = new Uint32Array([ 0, 1, 2, 2, 3, 0 ]);

    return Mesh(gl, vertices, indices, { id: 0, size: 3, type: gl.FLOAT, stride: 6 * Float32Array.BYTES_PER_ELEMENT, offset: 0 },
                                       { id: 1, size: 3, type: gl.FLOAT, stride: 6 * Float32Array.BYTES_PER_ELEMENT, offset: 3 * Float32Array.BYTES_PER_ELEMENT });
};

////////////////////////////////////////
const LoadTriangle = gl => {
    const vertices = new Float32Array([
        -0.5, -0.5, 0.0,    0.0, 0.0, 1.0,      0.0, 0.0,
         0.5, -0.5, 0.0,    0.0, 0.0, 1.0,      1.0, 0.0,
         0.0,  0.5, 0.0,    0.0, 0.0, 1.0,      0.5, 1.0
    ]);

    const indices = new Uint32Array([ 0, 1, 2 ]);

    return Mesh(gl, vertices, indices, { id: 0, size: 3, type: gl.FLOAT, stride: 8 * Float32Array.BYTES_PER_ELEMENT, offset: 0 },
                                       { id: 1, size: 3, type: gl.FLOAT, stride: 8 * Float32Array.BYTES_PER_ELEMENT, offset: 3 * Float32Array.BYTES_PER_ELEMENT },
                                       { id: 2, size: 2, type: gl.FLOAT, stride: 8 * Float32Array.BYTES_PER_ELEMENT, offset: 6 * Float32Array.BYTES_PER_ELEMENT });
};

////////////////////////////////////////
const LoadQuad = gl => {
    const vertices = new Float32Array([
        -0.5, -0.5, 0.0,    0.0, 0.0, 1.0,      0.0, 0.0,
         0.5, -0.5, 0.0,    0.0, 0.0, 1.0,      1.0, 0.0,
         0.5,  0.5, 0.0,    0.0, 0.0, 1.0,      1.0, 1.0,
        -0.5,  0.5, 0.0,    0.0, 0.0, 1.0,      0.0, 1.0
    ]);

    const indices = new Uint32Array([ 0, 1, 2, 2, 3, 0 ]);

    return Mesh(gl, vertices, indices, { id: 0, size: 3, type: gl.FLOAT, stride: 8 * Float32Array.BYTES_PER_ELEMENT, offset: 0 },
                                       { id: 1, size: 3, type: gl.FLOAT, stride: 8 * Float32Array.BYTES_PER_ELEMENT, offset: 3 * Float32Array.BYTES_PER_ELEMENT },
                                       { id: 2, size: 2, type: gl.FLOAT, stride: 8 * Float32Array.BYTES_PER_ELEMENT, offset: 6 * Float32Array.BYTES_PER_ELEMENT });
};

////////////////////////////////////////
const LoadGrid = (gl, numXLines, numZLines, xOffset, zOffset) => {
    const vertices = new Float32Array((numXLines + numZLines + 2) * 6);
    const indices = new Uint32Array((numXLines + numZLines + 2) * 2);

    let cnt = 0;
    for (let i = -numZLines / 2; i <= numZLines / 2; ++i) {
        vertices[cnt + 0] = -numXLines / 2;
        vertices[cnt + 1] = 0;
        vertices[cnt + 2] = i * zOffset;

        vertices[cnt + 3] = numXLines / 2;
        vertices[cnt + 4] = 0;
        vertices[cnt + 5] = i * zOffset;

        cnt += 6;
    }
    for (let i = -numXLines / 2; i <= numXLines / 2; ++i) {
        vertices[cnt + 0] = i * xOffset;
        vertices[cnt + 1] = 0;
        vertices[cnt + 2] = -numZLines / 2;

        vertices[cnt + 3] = i * xOffset;
        vertices[cnt + 4] = 0;
        vertices[cnt + 5] = numZLines / 2;

        cnt += 6;
    }

    for (let i = 0; i <= (numXLines + numZLines + 2) * 2; ++i) {
        indices[i] = i;
    }

    return Mesh(gl, vertices, indices, { id: 0, size: 3, type: gl.FLOAT, stride: 3 * Float32Array.BYTES_PER_ELEMENT, offset: 0 });
};

////////////////////////////////////////
const Shader = (gl, type, source) => {
    const id = gl.createShader(type);
    gl.shaderSource(id, source);
    gl.compileShader(id);

    if (!gl.getShaderParameter(id, gl.COMPILE_STATUS)) {
        throw Exception(null, "Shader", gl.getShaderInfoLog(id));
    }

    return Object.freeze({
        getId: () => id,
        getType: () => type,
        getSource: () => source,
        delete: () => gl.deleteShader(id)
    });
};

////////////////////////////////////////
const Program = (gl, ...shaders) => {
    const id = gl.createProgram();
    for (const shader of shaders) {
        gl.attachShader(id, shader.getId());
    }
    gl.linkProgram(id);

    if (!gl.getProgramParameter(id, gl.LINK_STATUS)) {
        throw Exception(null, "Program", gl.getProgramInfoLog(id));
    }

    for (const shader of shaders) {
        gl.detachShader(id, shader.getId());
        shader.delete();
    }

    const uniforms = {};

    const getUniformLoc = name => {
        if (!uniforms[name]) {
            const loc = gl.getUniformLocation(id, name);
            if (loc === -1) {
                throw Exception("Program", "uniform3f", `uniform ${name} doesn't exist`);
            }
            uniforms[name] = loc;
            return loc;
        }
        return uniforms[name];
    };

    return Object.freeze({
        getId: () => id,
        getShaders: () => shaders,
        use: () => gl.useProgram(id),
        halt: () => gl.useProgram(null),
        uniform1i: (name, s) => gl.uniform1i(getUniformLoc(name), s),
        uniform2i: (name, s) => gl.uniform2i(getUniformLoc(name), s),
        uniform3i: (name, s) => gl.uniform3i(getUniformLoc(name), s),
        uniform4i: (name, s) => gl.uniform4i(getUniformLoc(name), s),
        uniform1f: (name, s) => gl.uniform1f(getUniformLoc(name), s),
        uniform2f: (name, v) => gl.uniform2f(getUniformLoc(name), v.getX(), v.getY()),
        uniform3f: (name, v) => gl.uniform3f(getUniformLoc(name), v.getX(), v.getY(), v.getZ()),
        uniform4f: (name, v) => gl.uniform4f(getUniformLoc(name), v.getX(), v.getY(), v.getZ(), v.getW()),
        uniformMatrix2: (name, m) => gl.uniformMatrix2fv(getUniformLoc(name), gl.FALSE, m.getData()),
        uniformMatrix3: (name, m) => gl.uniformMatrix3fv(getUniformLoc(name), gl.FALSE, m.getData()),
        uniformMatrix4: (name, m) => gl.uniformMatrix4fv(getUniformLoc(name), gl.FALSE, m.getData())
    });
};

////////////////////////////////////////
const LoadBasicProgram = gl => {
    const vshader = Shader(gl, gl.VERTEX_SHADER, SHADER_BASIC_VERT);
    const fshader = Shader(gl, gl.FRAGMENT_SHADER, SHADER_BASIC_FRAG);
    return Program(gl, vshader, fshader);
};

////////////////////////////////////////
const LoadEmissiveColorProgram = gl => {
    const vshader = Shader(gl, gl.VERTEX_SHADER, SHADER_EMISSIVE_COLOR_VERT);
    const fshader = Shader(gl, gl.FRAGMENT_SHADER, SHADER_EMISSIVE_COLOR_FRAG);
    const program = Program(gl, vshader, fshader);

    return Object.freeze({
        program: () => program,
        setPVM: m => program.uniformMatrix4("uPVM", m),
        setColor: c => program.uniform4f("uColor", c)
    });
};

////////////////////////////////////////
const LoadPointProgram = gl => {
    const vshader = Shader(gl, gl.VERTEX_SHADER, SHADER_POINT_VERT);
    const fshader = Shader(gl, gl.FRAGMENT_SHADER, SHADER_POINT_FRAG);
    const program = Program(gl, vshader, fshader);
    
    return Object.freeze({
        program: () => program,
        setColor: c => program.uniform4f("uColor", c),
        setProjectionViewMatrix: m => program.uniformMatrix4("uProjectionView", m)
    });
};

////////////////////////////////////////
const LoadPostProcessProgram = gl => {
    const vshader = Shader(gl, gl.VERTEX_SHADER, SHADER_POSTPROCESS_VERT);
    const fshader = Shader(gl, gl.FRAGMENT_SHADER, SHADER_POSTPROCESS_FRAG);
    const program = Program(gl, vshader, fshader);

    program.use();
    program.uniform1i("uScreenTexture", 0);
    program.halt();

    return Object.freeze({
        program: () => program,
        setGamma: gamma => program.uniform1f("uGamma", gamma),
        setExposure: exposure => program.uniform1f("uExposure", exposure)
    });
};

////////////////////////////////////////
const LoadSkyboxProgram = gl => {
    const vshader = Shader(gl, gl.VERTEX_SHADER, SHADER_SKYBOX_VERT);
    const fshader = Shader(gl, gl.FRAGMENT_SHADER, SHADER_SKYBOX_FRAG);
    const program = Program(gl, vshader, fshader);

    program.use();
    program.uniform1i("uSkybox", 0);
    program.halt();

    return Object.freeze({
        program: () => program,
        setProjection: projection => program.uniformMatrix4("uProjection", projection),
        setView: view => program.uniformMatrix4("uView", view),
        draw: () => gl.drawArrays(gl.TRIANGLES, 0, 36)
    });
};

////////////////////////////////////////
const FramebufferTexture2D = (gl, width, height) => {
    let id = gl.createTexture();


    const create = () => {
        gl.bindTexture(gl.TEXTURE_2D, id);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA16F, width, height);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    create();

    return Object.freeze({
        getId: () => id,
        getWidth: () => width,
        getHeight: () => height,
        bind: () => gl.bindTexture(gl.TEXTURE_2D, id),
        unbind: () => gl.bindTexture(gl.TEXTURE_2D, null),
        delete: () => gl.deleteTexture(id),
        resize: (newWidth, newHeight) => {
            width = newWidth;
            height = newHeight;

            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.deleteTexture(id);
            id = gl.createTexture();
            create();
        }
    });
};

////////////////////////////////////////
const Framebuffer = gl => {
    let id = gl.createFramebuffer();

    return Object.freeze({
        getId: () => id,
        bind: () => gl.bindFramebuffer(gl.FRAMEBUFFER, id),
        bindRead: () => gl.bindFramebuffer(gl.READ_FRAMEBUFFER, id),
        bindDraw: () => gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, id),
        unbind: () => gl.bindFramebuffer(gl.FRAMEBUFFER, null),
        unbindRead: () => gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null),
        unbindDraw: () => gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null),
        check: () => gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE,
        attachRenderbufferColor: (index, rb) => gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + index, gl.RENDERBUFFER, rb.getId()),
        attachRenderbufferDepthStencil: rb => gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, rb.getId()),
        attachTexture2DColor: (index, tex) => gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + index, gl.TEXTURE_2D, tex.getId(), 0),
        blit: (width, height) => gl.blitFramebuffer(0, 0, width, height, 0, 0, width, height, gl.COLOR_BUFFER_BIT, gl.NEAREST),
        clearColorDepthStencil: () => gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT),
        clearColorDepth: () => gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT),
        clearColor: () => gl.clear(gl.COLOR_BUFFER_BIT),
        delete: () => gl.deleteFramebuffer(id),
        recreate: () => id = gl.createFramebuffer()
    });
};

////////////////////////////////////////
const Renderbuffer = (gl, width, height, format, numSamples) => {
    let id = gl.createRenderbuffer();

    const create = () => {
        gl.bindRenderbuffer(gl.RENDERBUFFER, id);
        numSamples = numSamples ?? 0;
        if (numSamples > 0) {
            gl.renderbufferStorageMultisample(gl.RENDERBUFFER, numSamples, format, width, height);
        }
        else {
            gl.renderbufferStorage(gl.RENDERBUFFER, format, width, height);
        }
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }
    create();

    return Object.freeze({
        getId: () => id,
        getWidth: () => width,
        getHeight: () => height,
        getFormat: () => format,
        getNumSamples: () => numSamples,
        bind: () => gl.bindRenderbuffer(gl.RENDERBUFFER, id),
        unbind: () => gl.bindRenderbuffer(gl.RENDERBUFFER, null),
        delete: () => gl.deleteRenderbuffer(id),
        resize: (newWidth, newHeight) => {
            width = newWidth;
            height = newHeight;

            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            gl.deleteRenderbuffer(id);
            id = gl.createRenderbuffer();
            create();
        }
    });
};

////////////////////////////////////////
const PostProcessStack = (gl, renderer) => {
    if (!renderer) {
        throw Exception("PostProcessStack", "PostProcessStack", "renderer is null");
    }
    const program = renderer.createPostProcessProgram();

    const colorRenderbufferMS = renderer.createRenderbufferForColor(renderer.getWidth(), renderer.getHeight(), renderer.getMaxNumSamples());
    const depthStencilRenderbufferMS = renderer.createRenderbufferForDepthStencil(renderer.getWidth(), renderer.getHeight(), renderer.getMaxNumSamples());
    const firstFBO = renderer.createFramebuffer();
    firstFBO.bind();
    firstFBO.attachRenderbufferColor(0, colorRenderbufferMS);
    firstFBO.attachRenderbufferDepthStencil(depthStencilRenderbufferMS);
    if (!firstFBO.check()) {
        throw Exception("PostProcessStack", "PostProcessStack", "firstFBO is incomplete");
    }
    firstFBO.unbind();

    const fbColorTexture = renderer.createFramebufferTexture2D(renderer.getWidth(), renderer.getHeight());
    const secondFBO = renderer.createFramebuffer();
    secondFBO.bind();
    secondFBO.attachTexture2DColor(0, fbColorTexture);
    if (!secondFBO.check()) {
        throw Exception("PostProcessStack", "PostProcessStack", "secondFBO is incomplete");
    }
    secondFBO.unbind();

    ////////////////////////////////////////
    let gamma = 2.2;
    let exposure = 1.0;

    return Object.freeze({
        resize: () => {
            colorRenderbufferMS.resize(renderer.getWidth(), renderer.getHeight());
            depthStencilRenderbufferMS.resize(renderer.getWidth(), renderer.getHeight());
            firstFBO.delete();
            firstFBO.recreate();
            firstFBO.bind();
            firstFBO.attachRenderbufferColor(0, colorRenderbufferMS);
            firstFBO.attachRenderbufferDepthStencil(depthStencilRenderbufferMS);
            if (!firstFBO.check()) {
                throw Exception("PostProcessStack", "PostProcessStack", "firstFBO is incomplete");
            }
            firstFBO.unbind();

            fbColorTexture.resize(renderer.getWidth(), renderer.getHeight());
            secondFBO.delete();
            secondFBO.recreate();
            secondFBO.bind();
            secondFBO.attachTexture2DColor(0, fbColorTexture);
            if (!secondFBO.check()) {
                throw Exception("PostProcessStack", "PostProcessStack", "secondFBO is incomplete");
            }
            secondFBO.unbind();
        },
        firstPass: () => {
            firstFBO.bind();
            firstFBO.clearColorDepthStencil();
        },
        finalPass: () => {
            firstFBO.bindRead();
            secondFBO.bindDraw();
            secondFBO.clearColor();
            firstFBO.blit(renderer.getWidth(), renderer.getHeight());

            secondFBO.bindRead();
            secondFBO.unbindDraw();
            renderer.clear();
            secondFBO.blit(renderer.getWidth(), renderer.getHeight());

            program.program().use();
            program.setGamma(gamma);
            program.setExposure(exposure);

            fbColorTexture.bind();
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        },
        setGamma: newGamma => gamma = newGamma,
        setExposure: newExposure => exposure = newExposure
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////
const Skybox = (gl, ...textures) => {
    const id = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, id);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    for (const texture of textures) {
        let face = null;
        switch (texture.face) {
            case "front":
                face = gl.TEXTURE_CUBE_MAP_POSITIVE_Z;
                break;
            case "back":
                face = gl.TEXTURE_CUBE_MAP_NEGATIVE_Z;
                break;
            case "left":
                face = gl.TEXTURE_CUBE_MAP_NEGATIVE_X;
                break;
            case "right":
                face = gl.TEXTURE_CUBE_MAP_POSITIVE_X;
                break;
            case "top":
                face = gl.TEXTURE_CUBE_MAP_POSITIVE_Y;
                break;
            case "bottom":
                face = gl.TEXTURE_CUBE_MAP_NEGATIVE_Y;
                break;
        }
        if (!face) {
            throw Exception("Skybox", "Skybox", "face is null");
        }
        gl.texImage2D(face, 0, texture.internalFormat, texture.width, texture.height, 0, texture.format, texture.type, texture.data);
    }

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

    return Object.freeze({
        getId: () => id,
        bind: () => gl.bindTexture(gl.TEXTURE_CUBE_MAP, id),
        unbind: () => gl.bindTexture(gl.TEXTURE_CUBE_MAP, null)
    });
};

////////////////////////////////////////
const LoadSkybox = async (gl, ...textures) => {
    for (let i = 0; i < 6; ++i) {
        if (!textures[i]) {
            throw Exception("renderer", "loadSkybox", `texture ${i} is not specified`, i);
        }
        const response = await fetch(textures[i].url);
        if (!response.ok) {
            throw Exception("renderer", "loadSkybox", `couldn't fetch ${textures[i].url}`);
        }
        const imageData = await response.blob();
        const image = new Image();
        image.src = URL.createObjectURL(imageData);
        await new Promise(resolve => { image.onload = resolve; });
        textures[i].data = image;
        textures[i].width = image.width;
        textures[i].height = image.height;
    }
    return Skybox(gl, ...textures);
};

////////////////////////////////////////
const SimpleOrbitCamera = config => {
    const renderer = config.renderer ?? null;

    let fovy = config.fovy ?? Util.ToRadians(90);
    let near = config.near ?? 0.3;
    let far = config.far ?? 1000.0;
    let smoothing = config.smoothing ?? 0.01;
    let sensitivity = config.sensitivity ?? 0.001;

    const position = config.position ?? Vec3(0, 0, 10);
    const nextPosition = position.copy();

    const target = config.target ?? Vec3();
    const up = config.up ?? Vec3(0, 1, 0);

    const projectionMatrix = Mat4();
    const viewMatrix = Mat4();

    const orientation = config.orientation ?? Quat();
    const nextOrientation = orientation.copy();
    const euler = Vec3();

    const computePerspectiveMatrix = () => {
        projectionMatrix.set(Transform.Perspective(renderer.getAspectRatio(),
                                                   fovy, near, far));
    };

    const computeViewMatrix = () => {
        viewMatrix.set(orientation.toMat4().mul(Transform.Translate(position.negate())));
    };

    let isOrbiting = false;
    let oldX = 0, oldY = 0;

    const minDistance = config.minDistance ?? 2;
    const maxDistance = config.maxDistance ?? 25;

    const minPitch = config.minPitch ?? Util.ToRadians(-60);
    const maxPitch = config.maxPitch ?? Util.ToRadians(60);

    const minYaw = config.minYaw ?? Util.ToRadians(-60);
    const maxYaw = config.maxYaw ?? Util.ToRadians(60);

    return Object.freeze({
        getPosition: () => position,
        getTarget: () => target,
        getDirection: () => viewMatrix.invert().mulVec4(Vec4(0, 0, -1, 0)).norm(),
        getUp: () => up,

        getProjectionMatrix: () => projectionMatrix,
        getViewMatrix: () => viewMatrix,

        getFovy: () => fovy,
        getNear: () => near,
        getFar: () => far,
        getSmoothing: () => smoothing,
        getSensitivity: () => sensitivity,

        setFovy: Fovy => fovy = Fovy,
        setNear: Near => near = Near,
        setFar: Far => far = Far,
        setSmoothing: Smoothing => smoothing = Smoothing,
        setSensitivity: Sensitivity => sensitivity = Sensitivity,

        update: dt => {
            position.set(position.lerp(nextPosition, dt * smoothing));
            orientation.set(orientation.lerp(nextOrientation, dt * smoothing));

            computePerspectiveMatrix();
            computeViewMatrix();
        },

        scrollCallback: e => {
            const prevPosition = nextPosition.copy();
            const s = e.deltaY > 0 ? -1 : e.deltaY < 0 ? 1 : 0;

            const dir = position.negate().norm().scale(s);

            const newPosition = nextPosition.add(dir);
            if (newPosition.len() > minDistance) {
                nextPosition.set(newPosition);
            }
            if (newPosition.len() > maxDistance) {
                nextPosition.set(newPosition.norm().scale(maxDistance));
            }
        },

        startOrbitingCallback: e => {
            e.preventDefault();
            if (e.button === 2) {
                isOrbiting = true;
                oldX = oldY = 0;
                document.body.classList.add("grabbing");
            }
        },

        stopOrbitingCallback: e => {
            e.preventDefault();
            if (e.button === 2) {
                isOrbiting = false;
                document.body.classList.remove("grabbing");
            }
        },

        orbitCallback: e => {
            e.preventDefault();
            if (isOrbiting) {
                if (!oldX && !oldY) {
                    oldX = e.clientX;
                    oldY = e.clientY;
                    return;
                }

                const dx = (e.clientX - oldX) * sensitivity;
                const dy = (e.clientY - oldY) * sensitivity;

                oldX = e.clientX;
                oldY = e.clientY;

                euler.setX(euler.getX() + dy);
                euler.setY(euler.getY() + dx);

                if (euler.getX() < minPitch)
                    euler.setX(minPitch);
                else if (euler.getX() > maxPitch)
                    euler.setX(maxPitch);

                if (euler.getY() < minYaw)
                    euler.setY(minYaw);
                else if (euler.getY() > maxYaw)
                    euler.setY(maxYaw);

                const xRot = Quat();
                xRot.setAxisAngle(Vec3(1, 0, 0), euler.getX())

                const yRot = Quat();
                yRot.setAxisAngle(Vec3(0, 1, 0), euler.getY());

                nextOrientation.set(yRot.mul(xRot));
            }
        }
    });
};

////////////////////////////////////////
const PointController = (gl, config) => {

    const renderer = config.renderer ?? null;
    const camera = config.camera ?? null;

    if (!renderer || !camera) {
        throw Exception("PointController", "PointController", "either renderer or camera is null");
    }

    const panelScale = config.panelScale ?? 0;

    const program = LoadPointProgram(gl);
    const maxNumPoints = config.maxNumPoints ?? 1000;

    let numCurrentPoints = 0;
    const pointPositions = [];

    const bytesPerInstance = 64 + 16;
    const pointDataBuffer = Buffer(gl, gl.ARRAY_BUFFER, null, gl.STATIC_DRAW, bytesPerInstance * maxNumPoints * Float32Array.BYTES_PER_ELEMENT);

    const pointVAO = VAO(gl, pointDataBuffer, null, {
        id: 0,
        size: 4,
        type: gl.FLOAT,
        stride: 20 * Float32Array.BYTES_PER_ELEMENT,
        offset: 0,
        isInstanced: true
    }, {
        id: 1,
        size: 4,
        type: gl.FLOAT,
        stride: 20 * Float32Array.BYTES_PER_ELEMENT,
        offset: 4 * Float32Array.BYTES_PER_ELEMENT,
        isInstanced: true
    }, {
        id: 2,
        size: 4,
        type: gl.FLOAT,
        stride: 20 * Float32Array.BYTES_PER_ELEMENT,
        offset: 8 * Float32Array.BYTES_PER_ELEMENT,
        isInstanced: true
    }, {
        id: 3,
        size: 4,
        type: gl.FLOAT,
        stride: 20 * Float32Array.BYTES_PER_ELEMENT,
        offset: 12 * Float32Array.BYTES_PER_ELEMENT,
        isInstanced: true
    }, {
        id: 4,
        size: 4,
        type: gl.FLOAT,
        stride: 20 * Float32Array.BYTES_PER_ELEMENT,
        offset: 16 * Float32Array.BYTES_PER_ELEMENT,
        isInstanced: true
    });

    const pushPoint = (translation, rotation, scale, color) => {
        if (numCurrentPoints < maxNumPoints - 1) {
            const modelMatrix = Transform.RotateTranslateScale(rotation, translation, scale);
            const newData = new Float32Array(16 + 4);
            for (let i = 0; i < 16; ++i)
                newData[i] = modelMatrix.get(i);

            newData[16] = color.getX();
            newData[17] = color.getY();
            newData[18] = color.getZ();
            newData[19] = 1.0; // alpha

            pointDataBuffer.bind();
            pointDataBuffer.modify(numCurrentPoints * (16 + 4) * Float32Array.BYTES_PER_ELEMENT, newData);
            pointDataBuffer.unbind();

            ++numCurrentPoints;
            pointPositions.push(translation);
        }
    };

    const popPoint = () => {
        if (numCurrentPoints > 0) {
            --numCurrentPoints;
            pointPositions.pop();
        }
    };

    return Object.freeze({
        program: () => program.program(),
        getMaxNumPoints: () => maxNumPoints,
        getNumCurrentPoints: () => numCurrentPoints,
        addPoint: e => {
            if (e.button === 0) {
                const ray = Util.ViewportToWorldRay(e.clientX, e.clientY, renderer, camera);
                const planeNormal = Vec3(0, 0, 1);
                const origin = camera.getPosition();
                const t = -(origin.dot(planeNormal)) / planeNormal.dot(ray);
                const hit = origin.add(ray.scale(t)).scale(1.0 / (panelScale * 0.5));
                const hitX = hit.getX(), hitY = hit.getY();

                if (hitX > -1.0 && hitX < 1.0 && hitY > -1.0 && hitY < 1.0) {
                    const translation = Vec3(hitX * (panelScale * 0.5),
                                             hitY * (panelScale * 0.5),
                                             0.05);
                    const rotation = Quat();
                    const scale = Vec3(1, 1, 1);
                    const color = Transform.RandomVec3();
                    pushPoint(translation, rotation, scale, color.scale(2));
                }
            }
        },
        removeLastPoint: e => {
            if (e.ctrlKey && e.key === "z") {
                popPoint();
            }
        },
        setProjectionViewMatrix: m => program.setProjectionViewMatrix(m),
        bindVAO: () => pointVAO.bind(),
        draw: (mode = gl.TRIANGLES) => pointVAO.drawArraysInstanced(6, numCurrentPoints, mode),
        getPointPositions: () => pointPositions
    });
};

////////////////////////////////////////
const Renderer = (canvasId, glOptions) => {
    const canvas = Canvas(canvasId, glOptions);
    const gl = canvas.getGL();

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.enable(gl.CULL_FACE);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let lastTime = 0;

    // required extensions
    if (!gl.getExtension("EXT_color_buffer_float")) {
        throw Exception("Renderer", "Renderer", "ERROR: EXT_color_buffer_float is not available");
    }

    return Object.freeze({
        clear: () => gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT),
        clearColor: c => gl.clearColor(c.getX(), c.getY(), c.getZ(), c.getW()),

        resize: () => canvas.resize(),

        enableDepthTest: () => gl.enable(gl.DEPTH_TEST),
        disableDepthTest: () => gl.disable(gl.DEPTH_TEST),

        enableCullFace: () => gl.enable(gl.CULL_FACE),
        disableCullFace: () => gl.disable(gl.CULL_FACE),

        createColoredTriangle: () => LoadColoredTriangle(gl),
        createColoredQuad: () => LoadColoredQuad(gl),
        createTriangle: () => LoadTriangle(gl),
        createQuad: () => LoadQuad(gl),
        createGrid: (numXLines, numZLines, xOffset, zOffset) => LoadGrid(gl, numXLines, numZLines, xOffset, zOffset),

        createBasicProgram: () => LoadBasicProgram(gl),
        createEmissiveColorProgram: () => LoadEmissiveColorProgram(gl),
        createPointProgram: () => LoadPointProgram(gl),
        createPostProcessProgram: () => LoadPostProcessProgram(gl),

        createRenderbufferForColor: (width, height, numSamples) => Renderbuffer(gl, width, height, gl.RGBA16F, numSamples),
        createRenderbufferForDepthStencil: (width, height, numSamples) => Renderbuffer(gl, width, height, gl.DEPTH24_STENCIL8, numSamples),

        createFramebuffer: () => Framebuffer(gl),

        createFramebufferTexture2D: (width, height) => FramebufferTexture2D(gl, width, height),

        createPostProcessStack: renderer => PostProcessStack(gl, renderer),
        createPointController: config => PointController(gl, config),

        get_RGB_Format: () => gl.RGB,
        get_RGBA_Format: () => gl.RGBA,
        get_SRGB_Format: () => gl.RGB,
        get_SRGBA_Format: () => gl.RGBA,

        get_RGB_InternalFormat: () => gl.RGB8,
        get_RGBA_InternalFormat: () => gl.RBBA8,
        get_SRGB_InternalFormat: () => gl.SRGB8,
        get_SRGBA_InternalFormat: () => gl.SRGB8_ALPHA8,

        getUnsignedByteType: () => gl.UNSIGNED_BYTE,

        createSkybox: (...textures) => Skybox(gl, ...textures),
        loadPredefinedSkybox: async (name) => {
            switch (name) {
                case "ulukai_corona":
                    return await LoadSkybox(gl, {
                        url: "../skyboxes/ulukai/corona_bk.jpg",
                        face: "back",
                        format: gl.RGB,
                        internalFormat: gl.SRGB8,
                        type: gl.UNSIGNED_BYTE
                    }, {
                        url: "../skyboxes/ulukai/corona_dn.jpg",
                        face: "bottom",
                        format: gl.RGB,
                        internalFormat: gl.SRGB8,
                        type: gl.UNSIGNED_BYTE
                    }, {
                        url: "../skyboxes/ulukai/corona_ft.jpg",
                        face: "front",
                        format: gl.RGB,
                        internalFormat: gl.SRGB8,
                        type: gl.UNSIGNED_BYTE
                    }, {
                        url: "../skyboxes/ulukai/corona_lf.jpg",
                        face: "left",
                        format: gl.RGB,
                        internalFormat: gl.SRGB8,
                        type: gl.UNSIGNED_BYTE
                    }, {
                        url: "../skyboxes/ulukai/corona_rt.jpg",
                        face: "right",
                        format: gl.RGB,
                        internalFormat: gl.SRGB8,
                        type: gl.UNSIGNED_BYTE
                    }, {
                        url: "../skyboxes/ulukai/corona_up.jpg",
                        face: "top",
                        format: gl.RGB,
                        internalFormat: gl.SRGB8,
                        type: gl.UNSIGNED_BYTE
                    });
                case "ulukai_redeclipse":
                    return await LoadSkybox(gl, {
                        url: "../skyboxes/ulukai/redeclipse_bk.jpg",
                        face: "back",
                        format: gl.RGB,
                        internalFormat: gl.SRGB8,
                        type: gl.UNSIGNED_BYTE
                    }, {
                        url: "../skyboxes/ulukai/redeclipse_dn.jpg",
                        face: "bottom",
                        format: gl.RGB,
                        internalFormat: gl.SRGB8,
                        type: gl.UNSIGNED_BYTE
                    }, {
                        url: "../skyboxes/ulukai/redeclipse_ft.jpg",
                        face: "front",
                        format: gl.RGB,
                        internalFormat: gl.SRGB8,
                        type: gl.UNSIGNED_BYTE
                    }, {
                        url: "../skyboxes/ulukai/redeclipse_lf.jpg",
                        face: "left",
                        format: gl.RGB,
                        internalFormat: gl.SRGB8,
                        type: gl.UNSIGNED_BYTE
                    }, {
                        url: "../skyboxes/ulukai/redeclipse_rt.jpg",
                        face: "right",
                        format: gl.RGB,
                        internalFormat: gl.SRGB8,
                        type: gl.UNSIGNED_BYTE
                    }, {
                        url: "../skyboxes/ulukai/redeclipse_up.jpg",
                        face: "top",
                        format: gl.RGB,
                        internalFormat: gl.SRGB8,
                        type: gl.UNSIGNED_BYTE
                    });
                case "clouds1":
                    return await LoadSkybox(gl, {
                        url: "../skyboxes/clouds1/clouds1_south.bmp",
                        face: "front",
                        format: gl.RGB,
                        internalFormat: gl.SRGB8,
                        type: gl.UNSIGNED_BYTE
                    }, {
                        url: "../skyboxes/clouds1/clouds1_up.bmp",
                        face: "bottom",
                        format: gl.RGB,
                        internalFormat: gl.SRGB8,
                        type: gl.UNSIGNED_BYTE
                    }, {
                        url: "../skyboxes/clouds1/clouds1_north.bmp",
                        face: "back",
                        format: gl.RGB,
                        internalFormat: gl.SRGB8,
                        type: gl.UNSIGNED_BYTE
                    }, {
                        url: "../skyboxes/clouds1/clouds1_west.bmp",
                        face: "left",
                        format: gl.RGB,
                        internalFormat: gl.SRGB8,
                        type: gl.UNSIGNED_BYTE
                    }, {
                        url: "../skyboxes/clouds1/clouds1_east.bmp",
                        face: "right",
                        format: gl.RGB,
                        internalFormat: gl.SRGB8,
                        type: gl.UNSIGNED_BYTE
                    }, {
                        url: "../skyboxes/clouds1/clouds1_down.bmp",
                        face: "top",
                        format: gl.RGB,
                        internalFormat: gl.SRGB8,
                        type: gl.UNSIGNED_BYTE
                    });
                default:
                    throw Exception("renderer", "loadPredefinedSkybox", `${name} doesn't exist`);
            }
        },
        createSkyboxProgram: () => LoadSkyboxProgram(gl),

        getWidth: () => canvas.getWidth(),
        getHeight: () => canvas.getHeight(),
        getAspectRatio: () => canvas.getAspectRatio(),

        computeDeltaTime: () => {
            if (!lastTime) {
                lastTime = window.performance.now();
                return 0;
            }
            const currentTime = window.performance.now();
            const dt = currentTime - lastTime;
            lastTime = currentTime;
            return dt;
        },

        getMaxNumSamples: () => gl.getParameter(gl.MAX_SAMPLES)
    });
};

export { Util,
         Vec2,
         Vec3,
         Vec4,
         Mat2,
         Mat3,
         Mat4,
         Quat,
         Transform,
         SimpleOrbitCamera,
         PointController,
         Renderer };
