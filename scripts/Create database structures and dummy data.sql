create table jsao_users (
   id number not null,
   email varchar2(100 byte) not null,
   role varchar2(10 byte) not null,
   password varchar2(100 byte) not null,
   constraint jsao_users_pk primary key (id),
   constraint jsao_users_chk1 check (role in ('BASE', 'ADMIN')),
   constraint jsao_users_uk1 unique (email)
);
 
create sequence jsao_users_seq;
 
create or replace trigger bir_jsao_users_trg
   before insert on jsao_users
   for each row
begin
   if :new.id is null
   then
      :new.id := jsao_users_seq.nextval;
   end if;
end bir_jsao_users_trg;
/
 
create table jsao_public_things (
   column1 varchar2(200 byte) not null
);
 
insert into jsao_public_things (column1) values ('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
insert into jsao_public_things (column1) values ('Morbi interdum, justo a commodo gravida, magna tortor scelerisque nisl, vitae iaculis odio nisi vel risus.');
insert into jsao_public_things (column1) values ('Fusce ac dui ullamcorper, dignissim purus sit amet, consequat dolor.');
insert into jsao_public_things (column1) values ('Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris porttitor tincidunt magna nec pharetra. ');
insert into jsao_public_things (column1) values ('Vestibulum mi purus, ornare ut sem sed, porttitor fermentum erat.');
 
create table jsao_protected_things(
   column1 varchar2(200 byte) not null
);
 
insert into jsao_protected_things (column1) values ('Bacon ipsum dolor amet shank sirloin capicola tenderloin pork chop salami.');
insert into jsao_protected_things (column1) values ('Pancetta frankfurter ham hock t-bone. ');
insert into jsao_protected_things (column1) values ('Boudin drumstick tongue ground round pork jerky prosciutto pork belly brisket meatball ham, doner biltong sausage.');
insert into jsao_protected_things (column1) values ('Beef ribs jerky chicken t-bone, andouille rump spare ribs short loin shankle frankfurter sirloin ham hock ball tip pork loin turducken.');
insert into jsao_protected_things (column1) values ('Porchetta beef brisket, jowl flank leberkas capicola turducken ground round meatloaf hamburger strip steak venison. ');
 
commit;
