create table self_talks (
  id serial primary key,
  body text not null,
  joy smallint not null,
  trust smallint not null,
  fear smallint not null,
  surprise smallint not null,
  sadness smallint not null,
  disgust smallint not null,
  anger smallint not null,
  anticipation smallint not null,
  created_at timestamptz not null,
  user_id text not null references users(id) on delete cascade
);
