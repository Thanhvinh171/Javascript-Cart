const table = document.getElementById("table-cart");
const total = document.getElementById("total");
const back = document.getElementById("btn-back");
const buy = document.getElementById("btn-buy");
const renderCart = async() => {
    renderCartNumber();
    openCart();
    const listProduct = await app.getListProduct();
    const listCart = app.getLocalStorage(keyLocalItemCart);
    const totalCart = app.Total(listCart);
    let cartTotalHTML = '';
    let tableHTML = `
        <tr>
            <th class="img"></th>
            <th>PRICE</th>
            <th>QUANTITY</th>
            <th>TOTAL</th> 
            <th>CLEAR CART</th>
        </tr>
    `
    if(listCart){
        listCart.map(function(data){
            let product = listProduct.find(p => p.id === data.idSP);
            return tableHTML += `
                <tr>
                    <td>
                        <img src="${product.image}">
                    </td>
                    <td>${product.price}</td>
                    <td>
                        <div class="cart-quantity">
                            <span class="down" onClick="decreaseQuantity(${data.idSP})">
                                <i class="fa-solid fa-minus"></i>
                            </span>
                            <b>${data.soLuong}</b>
                            <span class="up" onClick="increaseQuantity(${data.idSP})">
                                <i class="fa-solid fa-plus"></i>
                            </span>
                        </div>
                    </td>
                    <td>${data.price * data.soLuong}</td>
                    <td>
                        <div class="icon-cart" onclick="removeItemCart(${data.idSP})">
                            <i class="fa-solid fa-trash"></i>
                        </div>
                    </td>
                </tr>
            `
        })
        cartTotalHTML += `
            <p id="totalProduct">Total Product: ${totalCart.get("totalProduct")}</p>
            <p id="totalMoney">Total: ${totalCart.get("totalMoney")} đ</p>
        `
        table.innerHTML = tableHTML;
        total.innerHTML = cartTotalHTML;
    }else{
        openNoProductInCart();
    }
}

const removeItemCart = (id) => {
    let listCart = app.getLocalStorage(keyLocalItemCart);
    let listCartNew = listCart.filter(cartItem => cartItem.idSP != id);
    if(listCartNew.length){
        app.setLocalStorage(keyLocalItemCart, listCartNew);
        app.toast("Deleted Success");
        renderCart();
        return
    }
    localStorage.removeItem(keyLocalItemCart);
    renderCart();
}

//Giam so luong
const decreaseQuantity = async(id) => {
    let listCart = app.getLocalStorage(keyLocalItemCart);
    let listCartNew = listCart.map(cartItem => {
        if (cartItem.idSP === id) {
            return {
                ...cartItem,
                soLuong: cartItem.soLuong - 1
            }
        }
        return cartItem
    });
    app.setLocalStorage(keyLocalItemCart,listCartNew);
    renderCart();
}

// Tang so luong
const increaseQuantity = async(id) => {
    let listProduct = await app.getListProduct();
    let listCart = app.getLocalStorage(keyLocalItemCart);
    let hasProduct = listProduct.find(p => p.id === id)
    let listCartNew = listCart.map(cartItem => {
        if(cartItem.idSP === id && hasProduct.amount === cartItem.soLuong){
            console.log("Tối đa sản phẩm");
        }
        if (cartItem.idSP === id && hasProduct.amount > cartItem.soLuong) {
            return {
                ...cartItem,
                soLuong: cartItem.soLuong + 1
            }
        }
        return cartItem
    });
    app.setLocalStorage(keyLocalItemCart,listCartNew);
    renderCart();
}

back.addEventListener("click", () => {
    document.getElementById("slide").style.display = "block";
    document.getElementById("product").style.display = "flex";
    document.getElementById("cart-form").style.display = "none";
    document.getElementById("form-no-product").style.display = "none";
});

buy.addEventListener("click", () => {
    document.getElementById("header").style.display = "none";
    document.getElementById("modal").style.display = "block";
})