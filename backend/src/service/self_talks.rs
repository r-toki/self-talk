use crate::lib::Error;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{query, query_as, FromRow, PgPool};
use validator::Validate;

#[derive(Serialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct SelfTalk {
    id: i32,
    body: String,
    joy: i16,
    trust: i16,
    fear: i16,
    surprise: i16,
    sadness: i16,
    disgust: i16,
    anger: i16,
    anticipation: i16,
    created_at: DateTime<Utc>,
}

pub async fn get_self_talks(pool: &PgPool, user_id: String) -> Result<Vec<SelfTalk>, Error> {
    query_as!(
        SelfTalk,
        "
        select id, body, joy, trust, fear, surprise, sadness, disgust, anger, anticipation, created_at
        from self_talks
        where user_id = $1
        order by created_at desc
        ",
        user_id
    )
    .fetch_all(pool)
    .await
    .map_err(Into::into)
}

#[derive(Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct CreateSelfTalk {
    #[validate(length(min = 1))]
    body: String,
    #[validate(range(min = 0, max = 3))]
    joy: i16,
    #[validate(range(min = 0, max = 3))]
    trust: i16,
    #[validate(range(min = 0, max = 3))]
    fear: i16,
    #[validate(range(min = 0, max = 3))]
    surprise: i16,
    #[validate(range(min = 0, max = 3))]
    sadness: i16,
    #[validate(range(min = 0, max = 3))]
    disgust: i16,
    #[validate(range(min = 0, max = 3))]
    anger: i16,
    #[validate(range(min = 0, max = 3))]
    anticipation: i16,
}

pub async fn create_self_talk(
    pool: &PgPool,
    user_id: String,
    input: CreateSelfTalk,
) -> Result<(), Error> {
    query!(
        "
        insert into self_talks (body, joy, trust, fear, surprise, sadness, disgust, anger, anticipation, created_at, user_id)
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, current_timestamp, $10)
        ",
        input.body,
        input.joy,
        input.trust,
        input.fear,
        input.surprise,
        input.sadness,
        input.disgust,
        input.anger,
        input.anticipation,
        user_id
    )
    .execute(pool)
    .await
    .map(|_| ())
    .map_err(Into::into)
}

pub async fn delete_self_talk(
    pool: &PgPool,
    user_id: String,
    self_talk_id: i32,
) -> Result<(), Error> {
    query!(
        "
        delete from self_talks
        where user_id = $1
        and id = $2
        ",
        user_id,
        self_talk_id
    )
    .execute(pool)
    .await
    .map(|_| ())
    .map_err(Into::into)
}
