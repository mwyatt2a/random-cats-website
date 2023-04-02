use wasm_bindgen::prelude::*;
#[wasm_bindgen]
pub fn test(number: u32) -> String {
    let mut init = String::from("I like cats and this is a test"); 
    for i in (0..number) {
        init = init + "!";
    }
    init
}
