
drop table if exists person;
/*==============================================================*/
/* Table: person                                           */
/*==============================================================*/
create table person
(
    id Varchar(20) not null comment '人员ID',
    name Varchar(40) not null comment '姓名',
    age Integer(5) not null comment '年龄'
);
alter table person comment '人员表';