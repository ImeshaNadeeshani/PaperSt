import { useContext } from "react";
import { ShopContext } from "../context/context";
export function useShop() {
  return useContext(ShopContext);
}
