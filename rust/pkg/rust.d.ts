/* tslint:disable */
/* eslint-disable */
/**
* @param {number} number
* @returns {string}
*/
export function test(number: number): string;
/**
*/
export class GraphicsMatrix {
  free(): void;
/**
* @returns {Float32Array}
*/
  get_data(): Float32Array;
/**
* @param {number} scale
* @param {Rotation} thetas
* @param {Translation} trans
* @returns {GraphicsMatrix}
*/
  static create_model_matrix(scale: number, thetas: Rotation, trans: Translation): GraphicsMatrix;
/**
* @param {boolean} look_at
* @param {Rotation} cam_thetas
* @param {Translation} cam_trans
* @param {Location} focus_loc
* @returns {GraphicsMatrix}
*/
  static create_camera_matrix(look_at: boolean, cam_thetas: Rotation, cam_trans: Translation, focus_loc: Location): GraphicsMatrix;
/**
* @param {number} scale
* @param {Rotation} thetas
* @param {Translation} trans
* @returns {GraphicsMatrix}
*/
  static create_model_inverse_transpose_matrix(scale: number, thetas: Rotation, trans: Translation): GraphicsMatrix;
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
  static create_model_view_projection_matrix(scale: number, thetas: Rotation, trans: Translation, look_at: boolean, cam_thetas: Rotation, cam_trans: Translation, focus_loc: Location, aspect: number, field_of_view: number, near: number, far: number): GraphicsMatrix;
}
/**
*/
export class Location {
  free(): void;
/**
* @param {number} zero
* @param {number} one
* @param {number} two
* @returns {Location}
*/
  static js_create(zero: number, one: number, two: number): Location;
}
/**
*/
export class Rotation {
  free(): void;
/**
* @param {number} zero
* @param {number} one
* @param {number} two
* @returns {Rotation}
*/
  static js_create(zero: number, one: number, two: number): Rotation;
}
/**
*/
export class Translation {
  free(): void;
/**
* @param {number} zero
* @param {number} one
* @param {number} two
* @returns {Translation}
*/
  static js_create(zero: number, one: number, two: number): Translation;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly test: (a: number, b: number) => void;
  readonly __wbg_location_free: (a: number) => void;
  readonly location_js_create: (a: number, b: number, c: number) => number;
  readonly __wbg_graphicsmatrix_free: (a: number) => void;
  readonly graphicsmatrix_get_data: (a: number, b: number) => void;
  readonly graphicsmatrix_create_model_matrix: (a: number, b: number, c: number) => number;
  readonly graphicsmatrix_create_camera_matrix: (a: number, b: number, c: number, d: number) => number;
  readonly graphicsmatrix_create_model_inverse_transpose_matrix: (a: number, b: number, c: number) => number;
  readonly graphicsmatrix_create_model_view_projection_matrix: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => number;
  readonly translation_js_create: (a: number, b: number, c: number) => number;
  readonly rotation_js_create: (a: number, b: number, c: number) => number;
  readonly __wbg_translation_free: (a: number) => void;
  readonly __wbg_rotation_free: (a: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
