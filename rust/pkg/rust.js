let wasm;

const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}
/**
* @param {number} number
* @returns {string}
*/
export function test(number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.test(retptr, number);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
    }
}

let cachedFloat32Memory0 = null;

function getFloat32Memory0() {
    if (cachedFloat32Memory0 === null || cachedFloat32Memory0.byteLength === 0) {
        cachedFloat32Memory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32Memory0;
}

function getArrayF32FromWasm0(ptr, len) {
    return getFloat32Memory0().subarray(ptr / 4, ptr / 4 + len);
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}
/**
*/
export class GraphicsMatrix {

    static __wrap(ptr) {
        const obj = Object.create(GraphicsMatrix.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_graphicsmatrix_free(ptr);
    }
    /**
    * @returns {Float32Array}
    */
    get_data() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.graphicsmatrix_get_data(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayF32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} scale
    * @param {Rotation} thetas
    * @param {Translation} trans
    * @returns {GraphicsMatrix}
    */
    static create_model_matrix(scale, thetas, trans) {
        _assertClass(thetas, Rotation);
        _assertClass(trans, Translation);
        const ret = wasm.graphicsmatrix_create_model_matrix(scale, thetas.ptr, trans.ptr);
        return GraphicsMatrix.__wrap(ret);
    }
    /**
    * @param {boolean} look_at
    * @param {Rotation} cam_thetas
    * @param {Translation} cam_trans
    * @param {Location} focus_loc
    * @returns {GraphicsMatrix}
    */
    static create_camera_matrix(look_at, cam_thetas, cam_trans, focus_loc) {
        _assertClass(cam_thetas, Rotation);
        _assertClass(cam_trans, Translation);
        _assertClass(focus_loc, Location);
        const ret = wasm.graphicsmatrix_create_camera_matrix(look_at, cam_thetas.ptr, cam_trans.ptr, focus_loc.ptr);
        return GraphicsMatrix.__wrap(ret);
    }
    /**
    * @param {number} scale
    * @param {Rotation} thetas
    * @param {Translation} trans
    * @returns {GraphicsMatrix}
    */
    static create_model_inverse_transpose_matrix(scale, thetas, trans) {
        _assertClass(thetas, Rotation);
        _assertClass(trans, Translation);
        const ret = wasm.graphicsmatrix_create_model_inverse_transpose_matrix(scale, thetas.ptr, trans.ptr);
        return GraphicsMatrix.__wrap(ret);
    }
    /**
    * @param {number} scale
    * @param {Rotation} thetas
    * @param {Translation} trans
    * @param {boolean} look_at
    * @param {Rotation} cam_thetas
    * @param {Translation} cam_trans
    * @param {Location} focus_loc
    * @param {number} aspect
    * @param {number} field_of_view
    * @param {number} near
    * @param {number} far
    * @returns {GraphicsMatrix}
    */
    static create_model_view_projection_matrix(scale, thetas, trans, look_at, cam_thetas, cam_trans, focus_loc, aspect, field_of_view, near, far) {
        _assertClass(thetas, Rotation);
        _assertClass(trans, Translation);
        _assertClass(cam_thetas, Rotation);
        _assertClass(cam_trans, Translation);
        _assertClass(focus_loc, Location);
        const ret = wasm.graphicsmatrix_create_model_view_projection_matrix(scale, thetas.ptr, trans.ptr, look_at, cam_thetas.ptr, cam_trans.ptr, focus_loc.ptr, aspect, field_of_view, near, far);
        return GraphicsMatrix.__wrap(ret);
    }
}
/**
*/
export class Location {

    static __wrap(ptr) {
        const obj = Object.create(Location.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_location_free(ptr);
    }
    /**
    * @param {number} zero
    * @param {number} one
    * @param {number} two
    * @returns {Location}
    */
    static js_create(zero, one, two) {
        const ret = wasm.location_js_create(zero, one, two);
        return Location.__wrap(ret);
    }
}
/**
*/
export class Rotation {

    static __wrap(ptr) {
        const obj = Object.create(Rotation.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_rotation_free(ptr);
    }
    /**
    * @param {number} zero
    * @param {number} one
    * @param {number} two
    * @returns {Rotation}
    */
    static js_create(zero, one, two) {
        const ret = wasm.location_js_create(zero, one, two);
        return Rotation.__wrap(ret);
    }
}
/**
*/
export class Translation {

    static __wrap(ptr) {
        const obj = Object.create(Translation.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_translation_free(ptr);
    }
    /**
    * @param {number} zero
    * @param {number} one
    * @param {number} two
    * @returns {Translation}
    */
    static js_create(zero, one, two) {
        const ret = wasm.location_js_create(zero, one, two);
        return Translation.__wrap(ret);
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function getImports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function initMemory(imports, maybe_memory) {

}

function finalizeInit(instance, module) {
    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    cachedFloat32Memory0 = null;
    cachedInt32Memory0 = null;
    cachedUint8Memory0 = null;


    return wasm;
}

function initSync(module) {
    const imports = getImports();

    initMemory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return finalizeInit(instance, module);
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('rust_bg.wasm', import.meta.url);
    }
    const imports = getImports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    initMemory(imports);

    const { instance, module } = await load(await input, imports);

    return finalizeInit(instance, module);
}

export { initSync }
export default init;
