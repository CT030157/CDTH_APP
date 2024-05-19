class Product {
   constructor(writer, title, description, price = 0, images = [], category = 1, sold = 0, views = 0) {
       this.writer = writer;
       this.title = title;
       this.description = description;
       this.price = price;
       this.images = images;
       this.category = category;
       this.sold = sold;
       this.views = views;
   }
}

export default Product;