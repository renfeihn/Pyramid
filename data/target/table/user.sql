
drop table if exists user;
/*==============================================================*/
/* Table: user                                           */
/*==============================================================*/
create table user
(
    id Variable Characters(32) not null default '1' comment '主键ID',
    name Variable Characters(40) not null comment '姓名',
    age Double(5,2) not null comment '年龄',
    primary  key (id,name,age)
);
alter table user comment '用户表';