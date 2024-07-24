import styled from "styled-components";
import Center from "./Center";
import Button from "./Button";
import ButtonLink from "./ButtonLink";
import CartIcon from "./icons/CartIcon";
import { CartContext } from "./CartContext";
import { useContext } from "react";

const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 3rem;
  font-weight: normal;
`;

const Desc = styled.p`
  color: #aaa;
  font-size: 0.8rem;
`;

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1.1fr;
  gap: 40px;
  img {
    max-width: 100%;
  }
`;

const Column = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 5px;
`;

export default function Featued({ product }) {
  const { addProduct } = useContext(CartContext);

  function addFeatuedCart() {
    addProduct(product._id)
  }

  return (
    <Bg>
      <Center>
        <ColumnsWrapper>
          <Column>
            <div>
              <Title>{product.title}</Title>
              <Desc>{product.description}</Desc>
              <ButtonsWrapper>
                <ButtonLink
                  href={"/product/" + product._id}
                  white={1}
                  outline={1}
                >
                  Read more
                </ButtonLink>
                <Button
                  // href={"/products/" + product._id}
                  white={1}
                  onClick={addFeatuedCart}
                >
                  <CartIcon />
                  Add to cart
                </Button>
              </ButtonsWrapper>
            </div>
          </Column>

          <Column>
            <img
              src="https://www.freeiconspng.com/uploads/our-must-haves-macbook-photos-3.png"
              alt=""
            />
          </Column>
        </ColumnsWrapper>
      </Center>
    </Bg>
  );
}
