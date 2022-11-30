use crate::lib::Error;
use serde::{Deserialize, Serialize};
use sqlx::{query, query_as, FromRow, PgPool};
use validator::Validate;

#[derive(Serialize, FromRow)]
pub struct Me {
    id: String,
    name: String,
}

pub async fn get_me(pool: &PgPool, id: String) -> Result<Me, Error> {
    query_as!(
        Me,
        "
        select id, name from users
        where id = $1
        ",
        id
    )
    .fetch_one(pool)
    .await
    .map_err(Into::into)
}

#[derive(Deserialize, Validate)]
pub struct CreateMe {
    #[validate(length(min = 3))]
    name: String,
}

pub async fn create_me(pool: &PgPool, id: String, input: CreateMe) -> Result<(), Error> {
    query!(
        "
        insert into users (id, name, created_at, updated_at)
        values ($1, $2, current_timestamp, current_timestamp)
        ",
        id,
        input.name
    )
    .execute(pool)
    .await
    .map(|_| ())
    .map_err(Into::into)
}

// NOTE:
// get,create,update,delete を verb として使いたい
// id,input を分けて引数としたい
