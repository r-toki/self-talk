mod lib;
mod me;
mod self_talks;

use actix_web::web::ServiceConfig;

pub fn init(cfg: &mut ServiceConfig) {
    me::init(cfg);
    self_talks::init(cfg);
}
