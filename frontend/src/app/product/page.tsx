import Product from "@/views/Product";
import { productPage } from "@/assets/content/product";

export const dynamic = "force-static";

export const metadata = {
  title: "Product",
  description: productPage.description,
};

export default function ProductPage() {
  return <Product />;
}
