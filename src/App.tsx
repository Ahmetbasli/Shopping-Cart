import React, { useState } from "react";
import { useQuery } from "react-query";
import axios, { AxiosResponse } from "axios";

// Components
import Drawer from "@material-ui/core/Drawer";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import Badge from "@material-ui/core/Badge";
import Item from "./Item/Item";
import Cart from "./Cart/Cart";
// styles
import { Wrapper, StyledButton } from "./App.styles";
//Types
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
};

const getProducts = async (): Promise<AxiosResponse<CartItemType[]>> => {
  const response = await axios.get("https://fakestoreapi.com/products");
  return response;
};

console.log(getProducts());

const App = () => {
  const [isCartopen, setIsCardOpen] = useState(false as boolean);

  const [cartItems, setCartItems] = useState([] as CartItemType[]);

  const {
    data: items,
    isLoading,
    error,
  } = useQuery<AxiosResponse<CartItemType[]>>("products", getProducts);

  console.log(items);
  console.log();

  const getTotalItems = (items: CartItemType[]) =>
    items.reduce((accumulator: number, item) => accumulator + item.amount, 0);

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems((previousItems) => {
      //1. is the item already add in the cart ?
      const isItemInCart = previousItems.find(
        (item) => item.id === clickedItem.id
      );
      if (isItemInCart) {
        return previousItems.map((item) =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      }

      // first time the item added to the cart
      return [...previousItems, { ...clickedItem, amount: 1 }];
    });
  };

  const handleRemoveFromCart = (clickedItemId: CartItemType["id"]) => {
    setCartItems((previousItems) =>
      previousItems.reduce((accumulator, item) => {
        //not to make amount of products negative
        if (item.id === clickedItemId) {
          if (item.amount === 1) return accumulator;
          return [...accumulator, { ...item, amount: item.amount - 1 }];
        }

        return [...accumulator, item];
      }, [] as CartItemType[])
    );
  };

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something went wrong ...</div>;

  return (
    <div>
      <Wrapper>
        <Drawer
          anchor="right"
          open={isCartopen}
          onClose={() => setIsCardOpen(false)}
        >
          <Cart
            cartItems={cartItems}
            addToCart={handleAddToCart}
            removeFromCart={handleRemoveFromCart}
          />
        </Drawer>
        <StyledButton onClick={() => setIsCardOpen(true)}>
          <Badge badgeContent={getTotalItems(cartItems)} color="error" />
          <AddShoppingCartIcon />
        </StyledButton>
        <Grid container spacing={3}>
          {items?.data.map((item) => (
            <Grid item key={item.id} xs={12} sm={4}>
              <Item item={item} handleAddToCart={handleAddToCart} />
            </Grid>
          ))}
        </Grid>
      </Wrapper>
    </div>
  );
};

export default App;

// I am gonna map items to show every item
