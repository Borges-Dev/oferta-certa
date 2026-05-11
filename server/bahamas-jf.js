import "dotenv/config";
import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const SEARCH_TERMS = ["arroz", "feijao", "leite", "cafe", "oleo", "acucar"];

const BRANCHES = [
  "Bahamas Centro",
  "Bahamas São Pedro",
  "Bahamas Cascatinha",
  "Bahamas Benfica",
  "Bahamas Avenida Brasil",
  "Bahamas Marechal Floriano",
  "Bahamas Distrito Industrial",
  "Bahamas São Mateus",
  "Bahamas Santo Antônio",
];

function clean(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function parsePrice(text) {
  const match = String(text).match(/R\$\s?(\d{1,3}(?:\.\d{3})*,\d{2})/);
  if (!match) return null;
  return Number(match[1].replace(/\./g, "").replace(",", "."));
}

function productMatchesTerm(name, term) {
  return clean(name).includes(clean(term));
}

async function getMarket() {
  const { data, error } = await supabase
    .from("markets")
    .select("*")
    .eq("name", "Bahamas Supermercado")
    .order("id", { ascending: true })
    .limit(1);

  if (error) throw error;

  if (data && data.length > 0) return data[0];

  const created = await supabase
    .from("markets")
    .insert({
      name: "Bahamas Supermercado",
      color: "from-emerald-500 to-lime-500",
    })
    .select()
    .limit(1);

  if (created.error) throw created.error;
  return created.data[0];
}

async function getBranches(marketId) {
  const { data, error } = await supabase
    .from("branches")
    .select("*")
    .eq("market_id", marketId);

  if (error) throw error;

  return data || [];
}

async function getOrCreateProduct(item) {
  const { data: existing, error: selectError } = await supabase
    .from("products")
    .select("*")
    .eq("name", item.name)
    .limit(1);

 if (selectError) throw selectError;
if (existing && existing.length > 0) return existing[0];

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: item.name,
      brand: "Bahamas",
      category: "Supermercado",
      barcode: null,
      unit: "",
      image: "🛒",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function saveOffer({ productId, marketId, branchId, price, validUntil }) {
  const { data: existing, error: selectError } = await supabase
    .from("offers")
    .select("*")
    .eq("product_id", productId)
    .eq("market_id", marketId)
    .eq("branch_id", branchId)
    .order("id", { ascending: true })
    .limit(1);

  if (selectError) throw selectError;

  if (existing && existing.length > 0) {
    const { error } = await supabase
      .from("offers")
      .update({
        old_price: existing[0].price,
        price,
        valid_until: validUntil,
      })
      .eq("id", existing[0].id);

    if (error) throw error;
    return "updated";
  }

  const { error } = await supabase.from("offers").insert({
    product_id: productId,
    market_id: marketId,
    branch_id: branchId,
    price,
    old_price: price,
    valid_until: validUntil,
  });

  if (error) throw error;
  return "created";
}

async function collectOffers() {
  const collected = [];

  for (const term of SEARCH_TERMS) {
    const fakePrice = Number((Math.random() * 20 + 5).toFixed(2));
    const fakeName = `${term} Bahamas`;

    if (productMatchesTerm(fakeName, term)) {
      collected.push({
        name: fakeName,
        price: fakePrice,
        valid_until: new Date(Date.now() + 7 * 86400000)
          .toISOString()
          .slice(0, 10),
      });
    }
  }

  return collected;
}

app.post("/scrape/bahamas-jf", async (req, res) => {
  try {
    const market = await getMarket();
    const allBranches = await getBranches(market.id);

    console.log("Mercado:", market.name, market.id);
    console.log("Filiais encontradas:", allBranches.map((b) => b.name));

    const selectedBranches = allBranches.filter((branch) =>
      BRANCHES.some((name) => clean(name) === clean(branch.name))
    );

    const collected = await collectOffers();

    let created = 0;
    let updated = 0;

    for (const item of collected) {
      const product = await getOrCreateProduct(item);

      for (const branch of selectedBranches) {
        const result = await saveOffer({
          productId: product.id,
          marketId: market.id,
          branchId: branch.id,
          price: item.price,
          validUntil: item.valid_until,
        });

        if (result === "created") created++;
        if (result === "updated") updated++;
      }
    }

    res.json({
      success: true,
      market: market.name,
      branches: selectedBranches.length,
      collected: collected.length,
      created,
      updated,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(3334, () => {
  console.log("Bahamas Juiz de Fora rodando em http://localhost:3334");
});