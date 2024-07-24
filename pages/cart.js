import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Table from "@/components/Table";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 40px;
  padding-top: 20px;
`;

export const ProductInfoCell = styled.td`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 10px 0;
`;

export const ProductImageBox = styled.div`
  width: 100px;
  height: 100px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img {
    max-width: 80px;
    max-height: 80px;
  }
`;

const QuantityLabel = styled.span`
  padding: 0 3px;
`;

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

const CartTitle = styled.h2`
  text-align: center;
  margin-top: 0px;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 22px;
`;

export const PriceCell = styled.td`
  padding-top: 10px;
  font-size: 17px;
  font-weight: 600;
`;

export default function CartPage() {
  const { cartProducts, addProduct, removeProduct, clearCart } =
    useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [country, setCountry] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (cartProducts?.length > 0) {
      axios.post("/api/cart", { ids: cartProducts }).then((response) => {
        setProducts(response.data);
      });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  useEffect(() => {
    if (success) {
      console.log("cleared");
      clearCart();
    }
  }, [success]);

  function moreOfThisProduct(id) {
    addProduct(id);
  }

  function lessOfThisProduct(id) {
    removeProduct(id);
  }

  let total = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id === productId)?.price || 0;
    total += price;
  }

  async function goToPayment() {
    const response = await axios.post("/api/checkout", {
      name,
      email,
      city,
      postalCode,
      streetAddress,
      country,
      cartProducts,
    });
    if (response.data === true) {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <>
        <Header />
        <Center>
          <ColumnsWrapper>
            <Box>
              <h1>Thanks for your order</h1>
              <p>We will email you when your order will be sent</p>
            </Box>
          </ColumnsWrapper>
        </Center>
      </>
    );
  }

  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <Box>
            <CartTitle>Cart</CartTitle>
            {!cartProducts?.length && <div>Your cart is empty</div>}
            {cartProducts?.length > 0 && (
              <Table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, i) => (
                    <tr key={i}>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <img src={product.images[0]} alt="" />
                        </ProductImageBox>
                        {product.title}
                      </ProductInfoCell>
                      <td>
                        <Button
                          grey={1}
                          onClick={() => lessOfThisProduct(product._id)}
                        >
                          -
                        </Button>
                        <QuantityLabel>
                          {
                            cartProducts.filter((id) => id === product._id)
                              .length
                          }
                        </QuantityLabel>
                        <Button
                          grey={1}
                          onClick={() => moreOfThisProduct(product._id)}
                        >
                          +
                        </Button>
                      </td>
                      <td>
                        $
                        {cartProducts.filter((id) => id === product._id)
                          .length * product.price}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <PriceCell>Total price</PriceCell>
                    <td></td>
                    <td>{total}</td>
                  </tr>
                </tbody>
              </Table>
            )}
          </Box>

          {!!cartProducts?.length && (
            <Box>
              <h2>Order information</h2>
              <Input
                type="text"
                placeholder="Name"
                name="name"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
              />
              <Input
                type="text"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
              />
              <CityHolder>
                <Input
                  type="text"
                  placeholder="City"
                  name="city"
                  value={city}
                  onChange={(ev) => setCity(ev.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Postal Code"
                  name="postalCode"
                  value={postalCode}
                  onChange={(ev) => setPostalCode(ev.target.value)}
                />
              </CityHolder>

              <Input
                type="text"
                placeholder="Street Address"
                name="streetAddress"
                value={streetAddress}
                onChange={(ev) => setStreetAddress(ev.target.value)}
              />
              <Input
                type="text"
                placeholder="Country"
                name="country"
                value={country}
                onChange={(ev) => setCountry(ev.target.value)}
              />
              <Button black={1} block={1} onClick={goToPayment}>
                Continue to payment
              </Button>
            </Box>
          )}
        </ColumnsWrapper>
      </Center>
    </>
  );
}
