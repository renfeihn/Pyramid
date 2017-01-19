
drop table person cascade constraints;

/*==============================================================*/
/* Table: person                                           */
/*==============================================================*/

create table person
(
    id Variable Characters(10) not null,
    name Variable Characters(10) not null,
    age Integer(10) not null
) tablespace test03;
comment on table person is '人员表';
comment on column person.id is '人员ID';
comment on column person.name is '姓名';
comment on column person.age is '年龄';