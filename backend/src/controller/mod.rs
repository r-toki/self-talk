mod lib;
mod me;

use actix_web::web::ServiceConfig;

pub fn init(cfg: &mut ServiceConfig) {
    me::init(cfg);
}
