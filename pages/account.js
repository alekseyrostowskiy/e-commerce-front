import Center from "@/components/Center";
import Header from "@/components/Header";
import Title from "@/components/Title";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import styled from "styled-components";
import axios from "axios";
import Table from "@/components/Table";
import { PriceCell, ProductImageBox, ProductInfoCell } from "./cart";
import Link from "next/link";

const PageWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 0.6fr;
  gap: 20px;
  margin-top: 20px;
`;

const MenuWrapper = styled.div`
  padding: 20px 20px;
  border-radius: 10px;
  height: auto;
  background-color: #fff;
  /* column-count: 2; */
`;

const NavWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const NavButton = styled.div`
  text-align: center;
  font-size: 2em;
  cursor: pointer;
  ${(props) =>
    props.active
      ? `
      text-decoration:underline;`
      : `
      color:#aaa;
  `};
`;

const TableWrapper = styled.div`
  text-align: center;
  grid-column: 1/4;
`;

const OrderTitle = styled.div`
  font-size: 21px;
  font-weight: 500;
  text-align: center;
`;

const LogoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
`;

export default function AccountPage() {
  const [ordersToggle, setOrdersToggle] = useState(true);
  const [wishlistToggle, setWishlistToggle] = useState(false);
  const [orders, setOrders] = useState([]);

  const { data: session } = useSession();

  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);

  function toggleMenu(menu) {
    if (menu === "orders") {
      setOrdersToggle(true);
      setWishlistToggle(false);
    }
    if (menu === "wishlist") {
      setOrdersToggle(false);
      setWishlistToggle(true);
    }
  }
  return (
    <>
      <Header />
      <Center>
        <PageWrapper>
          <MenuWrapper>
            <NavWrapper>
              <NavButton
                active={ordersToggle}
                onClick={() => toggleMenu("orders")}
              >
                Orders
              </NavButton>
              <NavButton
                active={wishlistToggle}
                onClick={() => toggleMenu("wishlist")}
              >
                Wishlist
              </NavButton>

              {ordersToggle && !session && <div>Login to see your orders</div>}
              {ordersToggle && session && (
                <TableWrapper>
                  {orders.length > 0 &&
                    orders.map((order, i) => {
                      let totalPrice = 0;
                      return (
                        <>
                          <OrderTitle>Order №{i + 1}</OrderTitle>
                          <Table>
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.line_items.map((line) => {
                                totalPrice += line.price_data.unit_amount;
                                return (
                                  <tr>
                                    <ProductInfoCell>
                                      <ProductImageBox>
                                        <Link
                                          href={
                                            line?.productId ||
                                            "http://localhost:3001/"
                                          }
                                        >
                                          <img
                                            src={line.product.images[0]}
                                            alt=""
                                          />
                                        </Link>
                                      </ProductImageBox>
                                      <Link
                                        href={
                                          line?.productId ||
                                          "http://localhost:3001/"
                                        }
                                      >
                                        {line.product.title}
                                      </Link>
                                    </ProductInfoCell>
                                    <td>{line.quantity}</td>
                                    <td>${line.price_data.unit_amount}</td>
                                  </tr>
                                );
                              })}

                              <tr>
                                <PriceCell>Total price</PriceCell>
                                <td></td>
                                <td> ${totalPrice}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </>
                      );
                    })}
                </TableWrapper>
              )}
              {wishlistToggle && <TableWrapper>Your wishlist</TableWrapper>}
            </NavWrapper>
          </MenuWrapper>
          <div>
            {session && (
              <LogoutWrapper>
                <div className="flex gap-1 text-black rounded-lg ">
                  <img
                    src={session?.user?.image}
                    alt=""
                    className="w-6 h-6"
                  ></img>
                  {session?.user?.name}
                </div>
                <div>
                  <button
                    onClick={() => {
                      signOut("google");
                    }}
                    className="bg-white p-2 px-4 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              </LogoutWrapper>
            )}
            {!session && (
              <div>
                <Title>Login</Title>
                <button
                  onClick={() => {
                    signIn("google");
                  }}
                  className="bg-white p-2 px-4 rounded-lg"
                >
                  Login with Google
                </button>
              </div>
            )}
          </div>
        </PageWrapper>
      </Center>
    </>
  );
}
