const keyLocalItemCart = "LISTITEMCART";
const keyLocalItemOrder = "DANHSACHDONHANG";
const $ = document.querySelector.bind(document);
const openCart = () => {
    document.getElementById("cart-form").style.display = "flex";
    document.getElementById("slide").style.display = "none";
    document.getElementById("product").style.display = "none";
    document.getElementById("list-product").style.display = "none";
}

const openNoProductInCart = () => {
    document.getElementById("cart-form").style.display = "none";
    document.getElementById("slide").style.display = "none";
    document.getElementById("product").style.display = "none";
    document.getElementById("list-product").style.display = "none";
    document.getElementById("form-no-product").style.display = "block";
}

const renderCartNumber = () => {
    const totalCart = app.Total().get("totalProduct");
    if(totalCart){
        document.querySelector(".header__nav__cart__number").innerText = totalCart;
        return
    }else{
        document.querySelector(".header__nav__cart__number").innerText = 0;

    }
}



const backToHome = document.getElementById("btn-back-home");
backToHome.addEventListener("click", () => {
    document.getElementById("slide").style.display = "block";
    document.getElementById("product").style.display = "flex";
    document.getElementById("cart-form").style.display = "none";
    document.getElementById("form-no-product").style.display = "none";
})
