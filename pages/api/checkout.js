import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.json("should be a POST request");
    return;
  }
  await mongooseConnect();
  const {
    name,
    email,
    city,
    postalCode,
    streetAddress,
    country,
    cartProducts,
  } = req.body;
  const productsIds = cartProducts;
  const uniqueIds = [...new Set(productsIds)];
  const productsInfos = await Product.find({ _id: uniqueIds });
  const line_items = [];
  for (const productId of uniqueIds) {
    const productInfo = productsInfos.find(
      (p) => p._id.toString() === productId
    );
    const quantity = productsIds.filter((id) => id === productId)?.length || 0;
    if (quantity > 0 && productInfo) {
      line_items.push({
        productId: productId,
        product: productInfo,
        quantity,
        price_data: {
          currency: "USD",
          product_data: { name: productInfo.title },
          unit_amount: quantity * productInfo.price,
        },
      });
    }
  }

  const orderDoc = await Order.create({
    line_items,
    name,
    email,
    city,
    postalCode,
    streetAddress,
    country,
    paid: true,
  });

  res.json(true);
}
