import { productPage } from "@/assets/content/product";

const Product = () => {
  const p = productPage;
  return (
    <div
      id="page-product"
      className="min-h-screen bg-[#FAFAFA] flex items-center justify-center py-12"
      data-testid="product-page"
    >
      <div id="product-content" className="text-center space-y-6">
        <div className="w-24 h-24 bg-[#0F766E]/10 rounded-full flex items-center justify-center mx-auto">
          <span className="text-5xl">{p.emoji}</span>
        </div>
        <h1
          id="product-page-title"
          className="heading-font text-5xl font-bold text-[#333]"
          data-testid="coming-soon-heading"
        >
          {p.heading}
        </h1>
        <p className="text-lg text-[#6F6F6F]">{p.description}</p>
      </div>
    </div>
  );
};

export default Product;
