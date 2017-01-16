
drop table "user" cascade constraints;

/*==============================================================*/
/* Table: "user"                                           */
/*==============================================================*/

create table "user"
(
    id Variable Characters(32) default '1' not null,
    name Variable Characters(40) not null,
    age Double(5,2) not null,
    constraint PK_USER primary  key (id)
) tablespace test01;
comment on table "user" is '用户表';
comment on column "user".id is '主键ID';
comment on column "user".name is '姓名';
comment on column "user".age is '年龄';