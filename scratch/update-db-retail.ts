import { createClient } from '../src/lib/supabase/client';

async function updateRetailPrices() {
  const supabase = createClient();
  console.log('Fetching products from se_products using client...');
  const { data: products, error } = await supabase.from('se_products').select('id, sku, name, wholesale_price');
  
  if (error || !products) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`Found ${products.length} products to update in Supabase DB.`);

  let updatedCount = 0;
  for (const p of products) {
    const wholesale = Number(p.wholesale_price) || 700;
    // Markup between 1.08 and 1.25 (8% to 25% higher than wholesale price)
    const seed = ((p.sku.charCodeAt(p.sku.length - 1) + p.sku.charCodeAt(0)) % 15) / 100;
    const markupFactor = 1.08 + seed; // 1.08 to 1.23 (8% to 23% above wholesale)
    const retailSalePrice = Math.round(wholesale * markupFactor);
    const retailRegPrice = Math.round(retailSalePrice * 1.15);

    const { error: updateErr } = await supabase
      .from('se_products')
      .update({
        retail_sale_price: retailSalePrice,
        retail_reg_price: retailRegPrice
      })
      .eq('id', p.id);

    if (updateErr) {
      console.error(`Failed to update ${p.sku}:`, updateErr.message);
    } else {
      updatedCount++;
    }
  }

  console.log(`Successfully updated retail prices for ${updatedCount} products in Supabase DB!`);
}

updateRetailPrices();
