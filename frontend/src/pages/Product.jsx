const Product = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center py-12" data-testid="product-page">
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-[#0F766E]/10 rounded-full flex items-center justify-center mx-auto">
          <span className="text-5xl">🚀</span>
        </div>
        <h1 className="heading-font text-5xl font-bold text-[#111111]" data-testid="coming-soon-heading">Coming Soon</h1>
        <p className="text-lg text-[#6F6F6F]">Our product line is under development</p>
      </div>
    </div>
  );
};

export default Product;