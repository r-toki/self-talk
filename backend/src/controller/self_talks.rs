use super::lib::AccessTokenDecoded;
use crate::lib::Error;
use crate::service::self_talks::*;
use actix_web::{
    delete, get, post,
    web::{Data, Json, Path, Query, ServiceConfig},
};
use sqlx::PgPool;

pub fn init(cfg: &mut ServiceConfig) {
    cfg.service(index);
    cfg.service(create);
    cfg.service(delete);
}

#[get("/self_talks")]
async fn index(
    pool: Data<PgPool>,
    at: AccessTokenDecoded,
    query: Query<GetSelfTalks>,
) -> Result<Json<Vec<SelfTalk>>, Error> {
    get_self_talks(&**pool, at.into_inner().uid, query.into_inner())
        .await
        .map(Json)
}

#[post("/self_talks")]
async fn create(
    pool: Data<PgPool>,
    at: AccessTokenDecoded,
    form: Json<CreateSelfTalk>,
) -> Result<Json<()>, Error> {
    create_self_talk(&**pool, at.into_inner().uid, form.into_inner())
        .await
        .map(Json)
}

#[delete("/self_talks/{self_talk_id}")]
async fn delete(
    pool: Data<PgPool>,
    at: AccessTokenDecoded,
    path: Path<i32>,
) -> Result<Json<()>, Error> {
    delete_self_talk(&**pool, at.into_inner().uid, path.into_inner())
        .await
        .map(Json)
}
