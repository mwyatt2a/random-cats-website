//file contains math functionality for graphics
use wasm_bindgen::prelude::*;
#[wasm_bindgen]
pub fn test(number: u32) -> String {
    let mut init = String::from("WebAssembly Works"); 
    for _ in 0..number {
        init = init + "!";
    }
    init
}

//(ztheta, ytheta, xtheta)
#[wasm_bindgen]
pub struct Rotation(f64, f64, f64);

#[wasm_bindgen]
impl Rotation {
    pub fn js_create(zero: f64, one: f64, two: f64) -> Self {
        Self(zero, one, two)
    }
}

//(xtrans, ytrans, ztrans)
#[wasm_bindgen]
pub struct Translation(f64, f64, f64);

#[wasm_bindgen]
impl Translation {
    pub fn js_create(zero: f64, one: f64, two: f64) -> Self {
        Self(zero, one, two)
    }
}

//(x, y, z)
#[wasm_bindgen]
pub struct Location(f64, f64, f64);

#[wasm_bindgen]
impl Location {
    pub fn js_create(zero: f64, one: f64, two: f64) -> Self {
        Self(zero, one, two)
    }
}

//(x, y, z)
struct GraphicsVector(f64, f64, f64);

impl GraphicsVector {
    fn normalize(&self) -> Self {
       let magnitude = (self.0*self.0 + self.1*self.1 + self.2*self.2).sqrt();
        Self(self.0/magnitude, self.1/magnitude, self.2/magnitude) 
    }

    fn cross_product(&self, v2: &Self) -> Self {
       Self(self.1*v2.2 - v2.1*self.2, self.2*v2.0 - self.0*v2.2, self.0*v2.2 - self.1*v2.0) 
    }
}

#[wasm_bindgen]
pub struct GraphicsMatrix {
    data: [f64; 16],
}

#[wasm_bindgen]
impl GraphicsMatrix {

    pub fn get_data(&self) -> Vec<f64> {
        Vec::from(self.data)
    }

    fn multiply(&self, b: &Self) -> Self {
        let mut c = Self {
            data: [0.0; 16],
        };
        for columns in 0..4 {
            for rows in 0..4 {
                for index in 0..4 {
                    c.data[rows*4 + columns] = self.data[rows*4 + index]*b.data[columns + index*4];
                }
            }
        }
        c
    }

    fn transpose(&self) -> Self {
        let at = Self {
            data: [self.data[0], self.data[4], self.data[8], self.data[12], self.data[1], self.data[5], self.data[9], self.data[13], self.data[2], self.data[6], self.data[10], self.data[14], self.data[3], self.data[7], self.data[11], self.data[15]],
        };
        at
    }

    fn inverse(&self) -> Self {
         let mut c = Self {
            data: [0.0; 16],
        };
        let mut f = [0.0; 18];
        f[0] = self.data[10]*self.data[15] - self.data[11]*self.data[14];
        f[1] = self.data[9]*self.data[15] - self.data[11]*self.data[13];
        f[2] = self.data[9]*self.data[14] - self.data[10]*self.data[13];
        f[3] = self.data[6]*self.data[15] - self.data[7]*self.data[14];
        f[4] = self.data[5]*self.data[15] - self.data[7]*self.data[13];
        f[5] = self.data[5]*self.data[14] - self.data[6]*self.data[13];
        f[6] = self.data[6]*self.data[11] - self.data[7]*self.data[10];
        f[7] = self.data[5]*self.data[11] - self.data[7]*self.data[9];
        f[8] = self.data[5]*self.data[10] - self.data[6]*self.data[9];
        f[9] = self.data[8]*self.data[15] - self.data[11]*self.data[12];
        f[10] = self.data[8]*self.data[14] - self.data[10]*self.data[12];
        f[11] = self.data[4]*self.data[15] - self.data[7]*self.data[12];
        f[12] = self.data[4]*self.data[14] - self.data[6]*self.data[12];
        f[13] = self.data[4]*self.data[11] - self.data[11]*self.data[8];
        f[14] = self.data[4]*self.data[10] - self.data[6]*self.data[8];
        f[15] = self.data[8]*self.data[13] - self.data[9]*self.data[12];
        f[16] = self.data[4]*self.data[13] - self.data[5]*self.data[12];
        f[17] = self.data[4]*self.data[9] - self.data[5]*self.data[8];
        c.data[0] = self.data[5]*f[0] - self.data[6]*f[1] + self.data[7]*f[2];
        c.data[1] = -self.data[1]*f[0] + self.data[2]*f[1] - self.data[3]*f[2];
        c.data[2] = self.data[1]*f[3] - self.data[2]*f[4] + self.data[3]*f[5];
        c.data[3] = -self.data[1]*f[6] + self.data[2]*f[7] - self.data[3]*f[8];
        c.data[4] = -self.data[4]*f[0] + self.data[6]*f[9] - self.data[7]*f[10];
        c.data[5] = self.data[0]*f[0] - self.data[2]*f[9] + self.data[3]*f[10];
        c.data[6] = -self.data[0]*f[3] + self.data[2]*f[11] - self.data[3]*f[12];
        c.data[7] = self.data[0]*f[6] - self.data[2]*f[13] + self.data[3]*f[14];
        c.data[8] = self.data[4]*f[1] - self.data[5]*f[9] + self.data[7]*f[15];
        c.data[9] = -self.data[0]*f[1] + self.data[1]*f[9] - self.data[3]*f[15];
        c.data[10] = self.data[0]*f[4] - self.data[1]*f[11] + self.data[3]*f[16];
        c.data[11] = -self.data[0]*f[7] + self.data[1]*f[13] - self.data[3]*f[17];
        c.data[12] = -self.data[4]*f[2] + self.data[5]*f[10] - self.data[6]*f[15];
        c.data[13] = self.data[0]*f[2] - self.data[1]*f[10] + self.data[2]*f[15];
        c.data[14] = -self.data[0]*f[5] + self.data[1]*f[12] - self.data[2]*f[16];
        c.data[15] = self.data[0]*f[8] - self.data[1]*f[14] + self.data[2]*f[17];
        let determinant = self.data[0]*c.data[0] + self.data[1]*c.data[4] + self.data[2]*c.data[8] + self.data[3]*c.data[12];
        for i in 0..16 {
            c.data[i] = c.data[i]/determinant;
        }
        c
    }

    fn create_scaling_matrix(scale: f64) -> Self {
        Self {
            data: [scale, 0.0, 0.0, 0.0, 0.0, scale, 0.0, 0.0, 0.0, 0.0, scale, 0.0, 0.0, 0.0, 0.0, 1.0],
        }
    }

    pub fn create_rotation_matrix(thetas: &Rotation) -> Self {
        let z_rotation = Self {
            data: [thetas.0.cos(), thetas.0.sin(), 0.0, 0.0, -thetas.0.sin(), thetas.0.cos(), 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0],
        };
        let y_rotation = Self {
            data: [thetas.1.cos(), 0.0, -thetas.1.sin(), 0.0, 0.0, 1.0, 0.0, 0.0, thetas.1.sin(), 0.0, thetas.1.cos(), 0.0, 0.0, 0.0, 0.0, 1.0],
        };
        let x_rotation = Self {
            data: [1.0, 0.0, 0.0, 0.0, 0.0, thetas.2.cos(), thetas.2.sin(), 0.0, 0.0, -thetas.2.sin(), thetas.2.cos(), 0.0, 0.0, 0.0, 0.0, 1.0],
        };
        x_rotation//.multiply(&y_rotation).multiply(&z_rotation)
    }

    pub fn create_translation_matrix(trans: &Translation) -> Self {
        Self {
            data: [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, trans.0, trans.1, trans.2, 1.0],
        }    
    }

    fn create_model_matrix(scale: f64, thetas: &Rotation, trans: &Translation) -> Self {
        Self::create_translation_matrix(trans).multiply(&Self::create_rotation_matrix(&thetas)).multiply(&Self::create_scaling_matrix(scale))
    } 

    pub fn create_camera_matrix(look_at: bool, cam_thetas: &Rotation, cam_trans: &Translation, focus_loc: &Location) -> Self {
        if !look_at {
            Self::create_model_matrix(1.0, cam_thetas, cam_trans)
        }
        else {
            let new_z = GraphicsVector(cam_trans.0 - focus_loc.0, cam_trans.1 - focus_loc.1, cam_trans.2 - focus_loc.2);
            let new_x = GraphicsVector(0.0, 1.0, 0.0).cross_product(&new_z).normalize();
            let new_y = new_z.cross_product(&new_x).normalize();
            Self {
                data: [new_x.0, new_z.1, new_x.2, 0.0, new_y.0, new_y.1, new_y.2, 0.0, new_z.0, new_z.1, new_z.2, 0.0, cam_trans.0, cam_trans.1, cam_trans.2, 1.0],
            }
        }
    }

    pub fn create_model_inverse_transpose_matrix(scale: f64, thetas: &Rotation, trans: &Translation) -> Self {
        Self::create_model_matrix(scale, thetas, trans).inverse().transpose()
    }

    fn create_projection_matrix(aspect: f64, field_of_view: f64, near: f64, far: f64) -> Self {
        let f = (std::f64::consts::PI*0.5 - 0.5*field_of_view).tan();
        let range_inv = 1.0/(near - far);
        Self {
            data: [f/aspect, 0.0, 0.0, 0.0, 0.0, f, 0.0, 0.0, 0.0, 0.0, (near + far)*range_inv, -1.0, 0.0, 0.0, near*far*range_inv*2.0, 0.0],
        }
    }

    pub fn create_model_view_projection_matrix(scale: f64, thetas: &Rotation, trans: &Translation, look_at: bool, cam_thetas: &Rotation, cam_trans: &Translation, focus_loc: &Location, aspect: f64, field_of_view: f64, near: f64, far: f64)  -> Self {
    Self::create_projection_matrix(aspect, field_of_view, near, far).multiply(&Self::create_camera_matrix(look_at, cam_thetas, cam_trans, focus_loc).inverse()).multiply(&Self::create_model_matrix(scale, thetas, trans))
    }
}
