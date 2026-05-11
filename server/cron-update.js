import "dotenv/config";

async function callCollector(url, name) {
  console.log(`Atualizando ${name}...`);

  const response = await fetch(url, {
    method: "POST",
  });

  const data = await response.json();

  console.log(name, data);
}

async function main() {
  await callCollector(process.env.CARREFOUR_URL, "Carrefour");
  await callCollector(process.env.BAHAMAS_URL, "Bahamas");
}

main();