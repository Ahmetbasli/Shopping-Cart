import Button from "@material-ui/core/Button";

//Types
import Wrapper, { CartItemType } from "../App";

type Props = {
  item: CartItemType;
  addToCart: (clickedItem: CartItemType) => void;
  removeFromCart: (id: number) => void;
};
const CartItem: React.FC = () => <div>Cart Item</div>;

export default CartItem;
