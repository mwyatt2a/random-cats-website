create database flaskdata;
create table urls(id serial primary key, url varchar(2048), views bigint, reports bigint);
create index urlindex on urls(url);
