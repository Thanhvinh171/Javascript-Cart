/* Them san pham vao gio hang */
const addSP = async(id,price) => {
    let listProduct = await app.getListProduct();
    let listCart = app.getLocalStorage(keyLocalItemCart);
    let hasProduct = listProduct.find(p => p.id === id)
    if(hasProduct.amount === 0){
        app.toast("Out of product","error");
        return
    }
    if(listCart){
        let item = listCart.find((cartItem) => cartItem.idSP == id);
        let isProductMax = false
        if(item){
            let list = listCart.map(cartItem => {
                if(cartItem.idSP === id && hasProduct.amount > cartItem.soLuong){
                    return{
                        ...cartItem,
                        soLuong: cartItem.soLuong + 1
                    }
                }
                if(cartItem.idSP === id && hasProduct.amount === cartItem.soLuong){
                    isProductMax = true;
                }
                return cartItem;
            });
            if(isProductMax){
                app.toast("Maximum product","error");
            }else{
                app.toast("Product added to cart");
            }
            app.setLocalStorage(keyLocalItemCart,list);
        }else{
            let listCartNew = [
                ...listCart,
                {
                    idSP: id,
                    soLuong: 1,
                    price: price
                }
            ];
            app.toast("Product added to cart");
            app.setLocalStorage(keyLocalItemCart, listCartNew);
        }
    }else{
        listCart = [{
            idSP: id,
            soLuong: 1,
            price: price
        }
        ]
        app.toast("Product added to cart")
        app.setLocalStorage(keyLocalItemCart, listCart);
    }
    renderCartNumber();
}

/* Hiển thị danh sách sản phẩm */
let productsDiv = document.getElementById("product");
const renderProducts = (products) => {
    renderCartNumber();
    let productHTML = '';
    products.map((product) => 
        {
            productHTML += `
                <div class="card">
                    <div class="small-card">
                        <i class="fa-solid fa-heart"></i>
                        <i class="fa-solid fa-share"></i>
                    </div>
                    <div class="image">
                        <img src="${product.image}" alt="">
                    </div>
                    <div class="product-text">
                        <h2>${product.name}</h2>
                        <p>
                            ${product.description}
                        </p>
                        <h3>${product.price.toLocaleString()} đ</h3>
                        <div class="products_star">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                        </div>
                        <p class="amount" id="amount">Amount: ${product.amount}</p>
                        <button class="btn" onclick="addSP(${product.id}, ${product.price})">Add To Cart</button>
                    </div>
                </div>
            `
            productsDiv.innerHTML = productHTML;
        }
    )
}

app.getListProduct().then(data => renderProducts(data));

