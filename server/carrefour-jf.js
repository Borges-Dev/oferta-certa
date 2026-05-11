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

const SEARCH_TERMS = [
  "arroz",
  "feijao",
  "leite",
  "cafe",
  "oleo",
  "acucar"
];

function parsePrice(text) {
  const match = text.match(/R\$\s?(\d{1,3}(?:\.\d{3})*,\d{2})/);
  if (!match) return null;
  return Number(match[1].replace(/\./g, "").replace(",", "."));
}

function normalizeName(text) {
  const lines = String(text || "")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const invalidPatterns = [
    /^home$/i,
    /^r\$/i,
    /^\d+$/,
    /produtos encontrados/i,
    /resultado/i,
    /ordenar/i,
    /filtrar/i,
    /mais relevantes/i,
    /menor preço/i,
    /maior preço/i,
    /departamento/i,
    /categoria/i,
    /limpar filtros/i,
    /carregar mais/i,
    /adicionar/i,
    /comprar/i,
    /carrefour/i,
    /mercado/i,
    /login/i,
    /entrar/i,
    /carrinho/i,
  ];

  const priceIndex = lines.findIndex((line) => /R\$\s?\d/i.test(line));
  const beforePrice = priceIndex > 0 ? lines.slice(0, priceIndex) : lines;

  const candidates = beforePrice.filter((line) => {
    if (line.length < 8) return false;
    if (line.length > 120) return false;
    if (invalidPatterns.some((regex) => regex.test(line))) return false;
    if (/R\$\s?\d/i.test(line)) return false;
    if (!/[a-zA-ZÀ-ÿ]/.test(line)) return false;
    return true;
  });

  return candidates[candidates.length - 1] || "";
}

function cleanText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function productMatchesTerm(name, term) {
  const cleanName = cleanText(name);
  const cleanTerm = cleanText(term);

  return cleanName.includes(cleanTerm);
}

async function getOrCreateMarket() {
  const { data: existing } = await supabase
    .from("markets")
    .select("*")
    .eq("name", "Carrefour")
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabase
    .from("markets")
    .insert({ name: "Carrefour", color: "from-blue-600 to-sky-500" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function getOrCreateBranch(marketId) {
  const { data: existing } = await supabase
    .from("branches")
    .select("*")
    .eq("market_id", marketId)
    .eq("name", "Carrefour Juiz de Fora")
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabase
    .from("branches")
    .insert({
      market_id: marketId,
      name: "Carrefour Juiz de Fora",
      city: "Juiz de Fora",
      region: "Juiz de Fora",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function getOrCreateProduct(item) {
  const { data: existing } = await supabase
    .from("products")
    .select("*")
    .eq("name", item.name)
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: item.name,
      brand: item.brand || "Carrefour",
      category: item.category || "Supermercado",
      barcode: item.barcode || null,
      unit: "",
      image: "🛒",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function upsertOffer({ productId, marketId, branchId, price, validUntil }) {
  const { data: existing } = await supabase
    .from("offers")
    .select("*")
    .eq("product_id", productId)
    .eq("market_id", marketId)
    .eq("branch_id", branchId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("offers")
      .update({
        price,
        old_price: existing.price,
        valid_until: validUntil,
      })
      .eq("id", existing.id);

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

async function collectCarrefourOffers() {
  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();
  const collected = [];

  for (const term of SEARCH_TERMS) {
    const url = `https://mercado.carrefour.com.br/busca/${encodeURIComponent(term)}`;

    try {
      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 45000,
      });

   const items = await page.evaluate(() => {
  const nodes = Array.from(
    document.querySelectorAll(
      "article, [data-testid*='product'], [class*='product-card'], [class*='ProductCard'], [class*='shelf-item']"
    )
  );

  return nodes
    .map((el) => el.innerText)
    .filter(Boolean)
    .filter((text) => text.includes("R$"))
    .filter((text) => !/produtos encontrados/i.test(text))
    .filter((text) => !/^home/i.test(text.trim()))
    .filter((text) => text.length > 30 && text.length < 700)
    .slice(0, 20);
});
      for (const text of items) {
        const price = parsePrice(text);
        const name = normalizeName(text);

        if (name && price && productMatchesTerm(name, term)) {
          collected.push({
            name,
            brand: "Carrefour",
            category: "Supermercado",
            barcode: null,
            price,
            valid_until: new Date(Date.now() + 7 * 86400000)
              .toISOString()
              .slice(0, 10),
          });
        }
      }
    } catch (error) {
      console.log("Erro ao buscar:", term, error.message);
    }
  }

  await browser.close();

  const unique = [];
  const map = new Map();

  for (const item of collected) {
    const key = `${item.name}-${item.price}`;
    if (!map.has(key)) {
      map.set(key, true);
      unique.push(item);
    }
  }

  return unique;
}

app.post("/scrape/carrefour-jf", async (req, res) => {
  try {
    const market = await getOrCreateMarket();
    const branch = await getOrCreateBranch(market.id);
    const collected = await collectCarrefourOffers();

    let created = 0;
    let updated = 0;

    for (const item of collected) {
      const product = await getOrCreateProduct(item);

      const result = await upsertOffer({
        productId: product.id,
        marketId: market.id,
        branchId: branch.id,
        price: item.price,
        validUntil: item.valid_until,
      });

      if (result === "created") created++;
      if (result === "updated") updated++;
    }

    res.json({
      success: true,
      market: market.name,
      branch: branch.name,
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

app.listen(3333, () => {
  console.log("Coletor Carrefour rodando em http://localhost:3333");
});