import styled from "styled-components";
import ProductBox from "./ProductBox";

const StyledProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20px;
  padding-top: 30px;
`;

export default function ProductsGrid({ products }) {
  return (
    <StyledProductsGrid>
      {products?.length > 0 &&
        products.map((product) => (
          <ProductBox key={product._id} {...product} /> //все равно, что _id={product._id} title={product.title} и т.д.
        ))}
    </StyledProductsGrid>
  );
}
