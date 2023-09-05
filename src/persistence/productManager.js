import fs from "fs";

export class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }
  fileExist() {
    return fs.existsSync(this.filePath);
  }
  async getProducts() {
    try {
      if (this.fileExist()) {
        const data = await fs.promises.readFile(this.filePath, "utf-8");
        return JSON.parse(data);
      } else {
        throw new Error("No es posible leer el archivo");
      }
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
  async addProduct(infoProduct) {
    try {
      if (
        !infoProduct.title ||
        !infoProduct.description ||
        !infoProduct.price ||
        !infoProduct.thumbnail ||
        !infoProduct.code ||
        !infoProduct.stock
      ) {
        throw new Error("Todos los campos son obligatorios");
      }
      const products = await this.getProducts();

      let newId;
      if (products.length === 0) {
        newId = 1;
      } else {
        newId = products[products.length - 1].id + 1;
      }

      const codeExist = products.some((prod) => prod.code === infoProduct.code);
      if (codeExist) {
        console.log(
          `El codigo "${infoProduct.code}" ya existe, no sera agregado`
        );
      } else {
        infoProduct.id = newId;
        products.push(infoProduct);
        console.log("Producto Agregado");
      }
      await fs.promises.writeFile(
        this.filePath,
        JSON.stringify(products, null, "\t")
      );
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const prodFound = products.find((prod) => prod.id === id);
      if (prodFound) {
        console.log("Producto encontrado", prodFound);
      } else {
        throw new Error("Producto no encontrado");
      }
    } catch (error) {
      console.log(error.message);
      throw new Error("El producto no existe");
    }
  }

  async updateProduct(id, product) {
    try {
      const products = await this.getProducts();
      const updatetId = products.findIndex((prod) => prod.id === id);

      if (updatetId) {
        products[updatetId] = {
          ...products[updatetId],
          ...product,
        };
        await fs.promises.writeFile(
          this.filePath,
          JSON.stringify(products, null, "\t")
        );
        console.log("Producto actualizado");
      } else {
        throw new Error("Producto no encontrado");
      }
    } catch (error) {
      console.log(error.message);
      throw new Error("Archivo inexistente, no se puede actualizar");
    }
  }
  async deleteProduct(id) {
    try {
      const products = await this.getProducts();

      const existId = products.find((prod) => prod.id === id);
      if (existId) {
        const deleteId = products.filter((prod) => prod.id !== id);
        await fs.promises.writeFile(
          this.filePath,
          JSON.stringify(deleteId, null, "\t")
        );
        console.log("Producto eliminado");
      } else {
        throw new Error("Producto no encontrado");
      }
    } catch (error) {
      console.log(error.message);
      throw new Error("El Producto a eliminar es inexistente");
    }
  }
}

async function operations() {
  try {
    const product = new ProductManager("./products.json");

    //Datos a agregar en json
    // await product.addProduct({ title: 'Remera Palm Angels', description: 'Talle S a XL', price: 5550, thumbnail: 'img7', code: Pal1, stock: 6 });

    //Repetido
    //await product.addProduct({ title: 'Remera Palm Angels', description: 'Talle S a XL', price: 5550, thumbnail: 'img7', code: Pal1, stock: 6 });

    //Nuevo producto
    //await product.addProduct({ title: 'Remera Huoky ', description: 'Talle S a XL', price: 8000, thumbnail: 'img8', code: HUO3, stock: 4 });

    //Nuevo producto
    //await product.addProduct({ title: 'Remera Huoky', description: 'Talle S a XL', price: 9000, thumbnail: 'img9', code: HUO4, stock: 3 });//codigo nuevo

    //Campos vacios o null
    //await product.addProduct({title: '', description: '', price: 0, thumbnail: '', code: 0, stock: 0});

    //Paso id del producto a actualizar y paso lo nuevo
    //await product.updateProduct(2, {title: 'Remera Abercrombie', description: 'Talle S a XL', price: 4000, thumbnail: 'img2', code: ABE1, stock: 8})

    //intrducir id a buscar
    //await product.getProductById()

    //introducir id a eliminar
    //await product.deleteProduct()
  } catch (error) {
    console.log(error.message);
  }
}

operations();
