import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { useEffect, useState } from "react";
import styled from "styled-components";

const CenterText = styled.div`
  margin: 0 auto;
  margin-top: 20px;
  padding-top: 15px;
  text-align: center;
  border-radius: 20px;
`;

const TitleCategory = styled.div`
  font-weight: 700;
  font-size: 2em;
`;

const CategoryChoice = styled.div`
  display: grid;
  gap: 5px;
  grid-template-columns: 1fr 1fr;
  padding: 0px 20px;
`;

const CategoryTitleWrapper = styled.div`
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  background-color: #272727;
  border-radius: 20px;
  border: 3px solid #747474;
`;

const CatWrapper = styled.div`
  display: grid;
  grid-template-columns: 0.6fr 1.4fr;
`;

const PropGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
`;

const Select = styled.select`
  background-color: #ccc;
  text-align: center;
  padding: 5px 5px;
  font-size: 14px;
`;

const Option = styled.option`
  background-color: #fff;
  text-align: center;
  padding: 0 15px;
  font-size: 14px;
`;

export default function CategoriesPage({ products, categories }) {
  const [category, setCategory] = useState(null);
  const [propValue, setPropValue] = useState([]);
  const [productsWithProp, setProductsWithProp] = useState([]);

  function setProdWithCategory() {
    setProductsWithProp(products);
    setProductsWithProp((prev) => {
      let newProducts = [...prev];
      newProducts = newProducts.filter((prod) => {
        return prod.category === category;
      });
      console.log(newProducts);
      return newProducts;
    });
  }

  useEffect(() => {
    setProdWithCategory();
  }, [category]);

  useEffect(() => {
    setProdWithCategory();
    setProductsWithProp((prev) => {
      let newProductsWithProp = [...prev];
      return newProductsWithProp.filter((prod) => {
        return Object.keys(propValue).some(
          (s) => propValue[s] !== prod.properties[s]
        )
          ? false
          : true;
      });
    });
  }, [propValue]);

  function setPropertyValue(propName, value) {
    setPropValue((prev) => {
      const newPropValue = { ...prev };
      if (value === "") {
        delete newPropValue[propName];
        return newPropValue;
      }
      newPropValue[propName] = value;
      console.log(newPropValue);
      return newPropValue;
    });
  }

  return (
    <>
      <Header />
      <Center>
        <CenterText>
          {!!category && (
            <>
              {categories
                .filter((cat) => cat._id === category)
                .map((cat) => (
                  <>
                    <CatWrapper>
                      <TitleCategory>{cat.name}</TitleCategory>
                      <PropGrid>
                        {cat.properties.map((prop) => (
                          <Select
                            className="bg-gray-50 border border-gray-300 text-gray-900"
                            value={propValue[prop.name]}
                            key={prop.name}
                            onChange={(ev) =>
                              setPropertyValue(prop.name, ev.target.value)
                            }
                          >
                            <Option value="">{prop.name + ": all"}</Option>
                            {prop.values.map((val) => (
                              <Option value={val} key={val}>
                                {val}
                              </Option>
                            ))}
                          </Select>
                        ))}
                      </PropGrid>
                    </CatWrapper>
                    <ProductsGrid products={productsWithProp} />
                  </>
                ))}
            </>
          )}
          {category === null && (
            <CategoryChoice>
              {categories.map((cat) => (
                <Title key={cat._id}>
                  <CategoryTitleWrapper onClick={() => setCategory(cat._id)}>
                    {cat.name}
                  </CategoryTitleWrapper>
                </Title>
              ))}
            </CategoryChoice>
          )}
        </CenterText>
      </Center>
    </>
  );
}

export async function getServerSideProps() {
  mongooseConnect();
  const categories = await Category.find();
  const products = await Product.find({}, null, { sort: { _id: -1 } });
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
}
