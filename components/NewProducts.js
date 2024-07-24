import styled from "styled-components";
import Center from "./Center";
import ProductsGrid from "./ProductsGrid";

const Title = styled.div`
  font-size: 2rem;
  margin: 30px 0 20px;
  font-weight: 400;
`;

export default function NewProducts({ products }) {
  return (
    <Center>
      <Title>New arrivals</Title>
      <ProductsGrid products={products} />
    </Center>
  );
}
