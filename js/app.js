/* IIFE */
const app = (function(){
    const URL_PRODUCT = "http://localhost:3000/listProduct/";
    const URL_PATH__ORDER = "http://localhost:3000/listOrder/"
    /* hàm lưu dữ liệu vào localStorage */
    const setLocalStorage = (key,value) => {
        if(value){
            let data = JSON.stringify(value);
            localStorage.setItem(key,data);
        }else{
            alert("Dữ liệu không hợp lệ!");
        }
    }
    /* Hàm lấy dữ liệu từ localStorage */
    const getLocalStorage = (key) => {
        let data = localStorage.getItem(key);
        return JSON.parse(data);
    }

    /* Lấy ra danh sách sản phẩm */
    const getListProduct = async() => {
        const response = await fetch(URL_PRODUCT);
        if(!response.ok){
            const message = `An error has occurred: ${response.status}`;
            throw new Error(message);
        }
        const data = await response.json();
        return data;
    }

    const putListProduct = async(id, productObject) => {
        const response = await fetch(URL_PRODUCT + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productObject)
        })
        if (!response.ok) {
            const message = `An error has occurred: ${response.status}`;
            throw new Error(message);
        }
        const data = await response.json()
        return data;
    }

    const getListCartProduct = async() => {
        const product = [];
        let listCart = getLocalStorage(keyLocalItemCart);
        let listProduct = await getListProduct();
        listCart.forEach(element => {
            let products = listProduct.find(product => product.id === element.idSP);
            if(products){
                products = {
                    ...products,
                    amount: element.soLuong
                }
                product.push(products);
            }
        });
        return product;
    }
    /* List Order */
    const getListOrder = async () => {
        const response = await fetch(URL_PATH__ORDER)
        if (!response.ok) {
            const message = `An error has occurred: ${response.status}`;
            throw new Error(message);
        }
        const data = await response.json()
        return data;
    }

    const postListOrder = async (cartObject) => {
        const response = await fetch(URL_PATH__ORDER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartObject)
        })
        if (!response.ok) {
            const message = `An error has occurred: ${response.status}`;
            throw new Error(message);
        }
        const data = await response.json()
        return data;
    }

    const putListOrder = async (id, cartObject) => {
        const response = await fetch(URL_PATH__ORDER + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartObject)
        })
        if (!response.ok) {
            const message = `An error has occurred: ${response.status}`;
            throw new Error(message);
        }
        const data = await response.json()
        return data;
    }

    const deleteListOrder = async (id) => {
        const response = await fetch(URL_PATH__ORDER + id, {
            method: 'DELETE',
        })
        if (!response.ok) {
            const message = `An error has occurred: ${response.status}`;
            throw new Error(message);
        }
        const data = await response.json()
        return data;
    }

    const Total = () => {
        let total = 0;
        const totalCart = new Map();
        let listCart = getLocalStorage(keyLocalItemCart);
        if(listCart){
            const totalProduct = listCart.reduce((total, currentValue) =>
                    total + currentValue.soLuong,
                    total
                );
    
            const totalMoney = listCart.reduce((total, currentValue) =>
                    total + currentValue.price * currentValue.soLuong,
                    total
                )
    
                totalCart.set("totalProduct", totalProduct)
                totalCart.set("totalMoney", totalMoney)
        }
        return totalCart;
    }

    /* Tạo toast thông báo lỗi, thành công */
    const toast = (message,type) => {
        let background = "#47d147"

        if (type === "warn") {
            background = "yellow"
        }
        if (type === "error") {
            background = "red"
        }
        Toastify({
            text: message,
            position: "right",
            duration: 1500,
            style: {
                background,
                fontSize: "17px",
                border: "2px",
            },
            offset: {
                x: 30,
                y: 55
            },
        }).showToast();
    }
    return {
        setLocalStorage,
        getLocalStorage,
        getListProduct,
        getListCartProduct,
        putListProduct,
        toast,
        Total,
        getListOrder,
        postListOrder,
        putListOrder,
        deleteListOrder
    }
})()