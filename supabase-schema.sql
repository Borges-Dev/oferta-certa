create table if not exists markets (
  id text primary key,
  name text not null,
  color text
);

create table if not exists branches (
  id text primary key,
  market_id text references markets(id) on delete cascade,
  name text not null,
  city text default 'Juiz de Fora',
  region text
);

create table if not exists products (
  id text primary key,
  name text not null,
  brand text,
  category text,
  unit text,
  barcode text,
  image text
);

create table if not exists offers (
  id bigint generated always as identity primary key,
  product_id text references products(id) on delete cascade,
  market_id text references markets(id) on delete cascade,
  branch_id text references branches(id) on delete cascade,
  price numeric not null,
  old_price numeric,
  valid_until date,
  created_at timestamp default now()
);

alter table markets enable row level security;
alter table branches enable row level security;
alter table products enable row level security;
alter table offers enable row level security;

drop policy if exists "public read markets" on markets;
drop policy if exists "public read branches" on branches;
drop policy if exists "public read products" on products;
drop policy if exists "public read offers" on offers;
drop policy if exists "public insert offers" on offers;
drop policy if exists "public delete offers" on offers;

create policy "public read markets" on markets for select using (true);
create policy "public read branches" on branches for select using (true);
create policy "public read products" on products for select using (true);
create policy "public read offers" on offers for select using (true);
create policy "public insert offers" on offers for insert with check (true);
create policy "public delete offers" on offers for delete using (true);

insert into markets (id, name, color) values
('extra','Extra','from-red-500 to-orange-500'),
('carrefour','Carrefour','from-blue-600 to-sky-500'),
('bahamas','Bahamas Supermercado','from-emerald-500 to-lime-500'),
('pais-filhos','Pais e Filhos','from-purple-500 to-fuchsia-500')
on conflict (id) do nothing;

insert into branches (id, market_id, name, city, region) values
('extra-centro','extra','Extra Centro','Juiz de Fora','Centro'),
('extra-sao-pedro','extra','Extra São Pedro','Juiz de Fora','São Pedro'),
('carrefour-centro','carrefour','Carrefour Centro','Juiz de Fora','Centro'),
('carrefour-independencia','carrefour','Carrefour Independência','Juiz de Fora','Independência'),
('bahamas-centro','bahamas','Bahamas Centro','Juiz de Fora','Centro'),
('bahamas-cascatinha','bahamas','Bahamas Cascatinha','Juiz de Fora','Cascatinha'),
('pais-filhos-centro','pais-filhos','Pais e Filhos Centro','Juiz de Fora','Centro'),
('pais-filhos-bairu','pais-filhos','Pais e Filhos Bairu','Juiz de Fora','Bairu')
on conflict (id) do nothing;

insert into products (id, name, brand, category, unit, barcode, image) values
('arroz-5kg','Arroz Tipo 1 5kg','Tio João','Mercearia','5kg','789100000001','🍚'),
('feijao-1kg','Feijão Carioca 1kg','Camil','Mercearia','1kg','789100000002','🫘'),
('leite-1l','Leite Integral 1L','Itambé','Laticínios','1L','789100000003','🥛'),
('acucar-5kg','Açúcar Cristal 5kg','União','Mercearia','5kg','789100000004','🧂'),
('cafe-500g','Café Tradicional 500g','Pilão','Bebidas','500g','789100000005','☕'),
('oleo-900ml','Óleo de Soja 900ml','Liza','Mercearia','900ml','789100000006','🛢️'),
('detergente-500ml','Detergente Neutro 500ml','Ypê','Limpeza','500ml','789100000007','🧴'),
('sabao-po-1kg','Sabão em Pó 1kg','Omo','Limpeza','1kg','789100000008','🫧')
on conflict (id) do nothing;

insert into offers (product_id, market_id, branch_id, price, old_price, valid_until) values
('arroz-5kg','extra','extra-centro',24.90,29.90,'2026-05-18'),
('arroz-5kg','carrefour','carrefour-centro',23.49,28.90,'2026-05-17'),
('arroz-5kg','bahamas','bahamas-centro',25.99,30.50,'2026-05-20'),
('arroz-5kg','pais-filhos','pais-filhos-centro',22.99,27.99,'2026-05-16'),
('feijao-1kg','extra','extra-sao-pedro',7.49,9.99,'2026-05-19'),
('feijao-1kg','bahamas','bahamas-centro',6.99,8.99,'2026-05-18'),
('leite-1l','carrefour','carrefour-centro',4.19,5.19,'2026-05-15'),
('cafe-500g','bahamas','bahamas-centro',18.49,23.90,'2026-05-19'),
('oleo-900ml','carrefour','carrefour-independencia',5.69,7.29,'2026-05-16');
