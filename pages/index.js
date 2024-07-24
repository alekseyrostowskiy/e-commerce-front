import Featued from "@/components/Featured";
import Header from "@/components/Header";
import NewProducts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default function Home({ featuredProduct, newProducts }) {
  return (
    <div>
      <Header />
      <Featued product={featuredProduct} />
      <NewProducts products={newProducts}/>
    </div>
  );
}

export async function getServerSideProps() {
  const featuredProductId = "665550e87a5a18be8acff65f";
  await mongooseConnect();
  const featuredProduct = await Product.findById(featuredProductId);
  const newProducts = await Product.find({}, null, {
    sort: { _id: -1 },
    limit: 10,
  });
  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)), // когда передаём пропс с БД, данные должны быть совместимы с JSON(а mongoose-данные не совместимы с JSON)
      newProducts: JSON.parse(JSON.stringify(newProducts)),
    },
  };
}
