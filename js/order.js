const orderBodyDiv = document.querySelector(".order__body");
const orderContainerDiv = document.querySelector(".order__container");
const orderEmptyDiv = document.querySelector(".order__empty");
const renderBills = async() => {
    renderCartNumber();
    let orderInfoHtml = '';
    let orderEmptyHtml = '';
    let listOrder = await app.getListOrder();
    if(listOrder.length > 0){
        listOrder.forEach(item => {
            let orderDetailHTML = '';
            item.products.forEach((product) => {
                orderDetailHTML += `
                    <div class="order__detail__item grid-col-5">
                        <div><img src=${product.image} alt=${product.name}></div>
                        <div>${product.name}</div>
                        <div>${product.price}đ</div>
                        <div>${product.amount}</div>
                        <div>${product.description}</div>
                    </div>
                `
            });
            orderInfoHtml += `
                <div class="order__item grid-col-7">
                    <div class="flex-col">
                    ${item.id}
                    <button 
                        class="order__btnDetail" 
                        onClick={handleOrderBtnDetail(${item.id})}
                    >
                        Details <i class="order__btnDetail__icon-${item.id} fa-solid fa-caret-down"></i>
                    </button>
                    </div>
                    <div>${item.customerInfo.fullname}</div>
                    <div>${item.createAt}</div>
                    <div>${item.typeProductsNumber}</div>
                    <div>${item.amount}</div>
                    <div>${item.totalMoney}đ</div>
                    <div>
                    <i id="iconRefund-${item.id}"
                        onclick="refundOrder(${item.id})" 
                        class="order__btnRefund fa-sharp fa-solid fa-rotate-left"
                    ></i>
                    </div>
                </div>
                <div class="order__table__detail order-${item.id}">
                    <div class="order__detail__header grid-col-5">
                    <div>IMAGE</div>
                    <div>NAME</div>
                    <div>PRICE</div>
                    <div>AMOUNT</div>
                    <div>DESCRIPTION</div>
                    </div>
                    <div class="order__detail__body">
                    ${orderDetailHTML}
                    </div>
                </div>
            `
        });
        orderEmptyDiv.style.display = "none";
        orderContainerDiv.style.display = "block";
        orderBodyDiv.innerHTML = orderInfoHtml;
    }else{
        orderEmptyHtml += `
            <img src="./img/empty-cart.png" alt="order empty">
            <p>No Orders, Please click <a href="./index.html">here</a> to back to homepage!</p>
        `;
        orderContainerDiv.style.display = "none";
        orderEmptyDiv.style.display = "block";
        orderEmptyDiv.innerHTML = orderEmptyHtml;
        document.getElementById("btn-back").style.display = "none"
    }
   
}

const handleOrderBtnDetail = async(id) => {
    const detailIcon = $(`.order__btnDetail__icon-${id}`)
    const orderDetail = $(`.order-${id}`)
    orderDetail.classList.toggle("show");
    detailIcon.classList.toggle("fa-caret-down");
    detailIcon.classList.toggle("fa-caret-up");
}

const refundOrder = async(id) => {
    $(`#iconRefund-${id}`).classList.add("fa-spin");
    let listOrder = await app.getListOrder();
    let listProduct = await app.getListProduct();
    let itemOrder = listOrder.find((itemOrder) => itemOrder.id === id);
  
    await listProduct.forEach((product) => {
      for (let orderProduct of itemOrder.products) {
        if (product.id === orderProduct.id) {
          let productObject = {
            ...product,
            amount: product.amount + orderProduct.amount
          }
          app.putListProduct(product.id, productObject);
        }
      }
    });
    await app.deleteListOrder(itemOrder.id);
    app.toast("Đã hoàn đơn hàng");
    renderBills();
}

app.getListOrder().then((data) => renderBills(data));
