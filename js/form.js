let formElement = document.querySelector(".confirm");
let provinceSelect = document.getElementById("province");
let districtSelect = document.getElementById("district");
let wardSelect = document.getElementById("ward");
let cancel = document.getElementById("btn-cancel");
const url = "https://provinces.open-api.vn/api/";
let listProvinces = [];
let listDitricts = [];
let listWards = [];
let listDistrictByID = [];
let listWardsByID = [];
const getAllDivisions = async() => {
    /* Provinces */
    await fetch(url + "p/")
    .then(res => res.json())
    .then(data => {
        listProvinces = data;
    })
    .catch(error => console.log("error: ", error));
    /* Districts */
    await fetch(url + "d/")
    .then(res => res.json())
    .then(data => {
        listDitricts = data;
    })
    .catch(error => console.log("error: ", error));
    /* Ward */
    await fetch(url + "w/")
    .then(res => res.json())
    .then(data => {
        listWards = data;
    })
    .catch(error => console.log("error: ", error));
    renderDialog();
}

const getDistrictByID = (code) => {
    code = provinceSelect.value;
    listDistrictByID = [];
    for(let i in listDitricts){
        if(listDitricts[i].province_code == code){
            listDistrictByID.push(listDitricts[i])
        }
    }
    listDistrictByID.map((data) => {
        districtSelect.innerHTML +=`
            <option value="${data.code}">${data.name}</option>
        `
    })
}

const renderDialog = () =>{
    provinceSelect.innerHTML = '<option disable value="">-- Chọn Tỉnh/thành phố --</option>'
    districtSelect.innerHTML = '<option disable value="">-- Chọn Quận/Huyện --</option>'
    wardSelect.innerHTML = '<option disable value="">-- Chọn Phường/Xã --</option>'
    listProvinces.map((data) => {
        provinceSelect.innerHTML+=`
        <option value=${data.code}>${data.name}</option>
        `
    });
}

const getWardByID = (code) => {
    code = districtSelect.value;
    listWardsByID = [];
    for(let i in listWards){
        if(listWards[i].district_code == code){
            listWardsByID.push(listWards[i]);
        }
    }
    listWardsByID.map((data) => {
        wardSelect.innerHTML +=`
            <option value="${data.code}">${data.name}</option>
        `
    })
}

provinceSelect.addEventListener("change", getDistrictByID);
districtSelect.addEventListener("change", getWardByID);
cancel.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("header").style.display = "flex";
    document.getElementById("modal").style.display = "none";
    document.querySelector(".confirm").reset();
});

const randomID = (list = []) => {
    const id = Date.now()
    function checkID() {
        let check = list.find(item => item.id === id)
        return check ? randomID(list) : id
    }
    return checkID()
}

let enableInputs = formElement.querySelectorAll('[name]');
const getItemOrder = async (listCart) => {
    const totalCart = app.Total();
    const inputObject = {};
    const time = new Date()
    for(const input of enableInputs){
        inputObject[input.name] = input.value.trim();
    }
    const { firstname, lastname, email, phone, message } = inputObject;

    const province = provinceSelect.options[provinceSelect.selectedIndex].text;
    const district = districtSelect.options[districtSelect.selectedIndex].text;
    const ward = wardSelect.options[wardSelect.selectedIndex].text;
    
    const address = `${ward}, ${district}, ${province}`
    const fullname = firstname + " " + lastname;
    const amount = totalCart.get("totalProduct");
    const typeProductsNumber = listCart.length;
    const totalMoney = totalCart.get("totalMoney");
    const products = await app.getListCartProduct();
    const createAt = time.toLocaleDateString();
    const id = randomID();

    const itemOrder = {
        id,
        createAt,
        customerInfo: {
            fullname,
            email,
            phone,
            address
        },
        message,
        amount,
        typeProductsNumber,
        totalMoney,
        products,
    }
    return itemOrder;
}

/* Giảm số lượng sản phẩm khi xác nhận mua */
const reduceAmount = async(listCart) => {
    let listProduct = await app.getListProduct();
    listProduct.forEach((product) => {
        for (let itemCart of listCart) {
            if (product.id === itemCart.idSP) {
                let productObject = {
                    ...product,
                    amount: product.amount - itemCart.soLuong
                }
                app.putListProduct(product.id, productObject);
            }
        }
    })
}

const submitForm = async(event) => {
    event.preventDefault();
    const message = document.getElementById("message");
    const listCart = app.getLocalStorage(keyLocalItemCart);
    const itemOrder = await getItemOrder(listCart);
    for(const input of enableInputs){
        if (input.value.trim() === "" && input !== message) {
            return
        }
    }
    await app.postListOrder(itemOrder);
    await reduceAmount(listCart);
    localStorage.removeItem(keyLocalItemCart);
    app.toast("Check order in order list")
    renderCart();
    renderProducts();
    for (const input of enableInputs) {
        input.value = ""
    }

}

formElement.addEventListener("submit", submitForm);
getAllDivisions();