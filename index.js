import {menuArray} from "./data.js"

const container = document.getElementById("container")
const sectionContainerEl = document.getElementById("menu-section")
const orderPlacementEl = document.getElementById("order-placement-container")

let addedOrder = []
let allFilled

function renderMenuItem(menuarr){
    return menuarr.map((item)=>{
        return `
             <div class="menu-item-container" data-id="${item.id}">
                    <div class="menu-item">
                        <p class="item-image">${item.emoji}</p>
                            <div class="menu-item-desc">
                                <h2>${item.name}</h2>
                                <p class="menu-item-ingredients">
                                    ${item.ingredients}
                                </p>
                                <h3>$${item.price}</h3>
                            </div>
                    </div>
                    <i class="fa-solid fa-plus" data-status="${item.id}"></i>
                </div>
        `
    })
}

function renderSelectedItems(){
    
    const grouped = addedOrder.reduce((acc, item) => {
        if (acc[item.id]) {
            acc[item.id].quantity++
        } else {
            acc[item.id] = { ...item, quantity: 1 }
        }
        return acc
    }, {})
    
    const selectedItems = Object.values(grouped).map((i) => {
            return `
            <div class="order-item">
                <div class="order">
                    <h3>${i.name}${i.quantity > 1 ? ` x${i.quantity}` : ""}</h3>
                    <p id="remove" data-remove="${i.id}">remove</p>
                </div>
                <p class="price">$${i.price * i.quantity}</p>
            </div>
            `
    }).join("")
    
    const selectedOrderItem = document.getElementById("items-container")
    
    selectedOrderItem.innerHTML = selectedItems
    
    const total = addedOrder.reduce((total, acc) =>{
        return total + acc.price
    }, 0)
    
    document.getElementById("total-price").innerHTML = `$${total}`
    
    orderPlacementEl.style.display = "block"
}

function remove(id){
    const index = addedOrder.findIndex(i => i.id == id)
    
    if (index !== -1) addedOrder.splice(index, 1) // removes one of that item
    
    renderSelectedItems()    
}

function additem(item){
    const filteredItem = menuArray.find((i) => i.id == item)
              
    addedOrder.push(filteredItem)
    
    renderSelectedItems()
}

function renderForm(){
    if (document.getElementById("user-form")) return // don't open two forms

    container.insertAdjacentHTML("beforeend", `
        <article id="user-form">
            <form id="payment-form">
                <h1>Enter card details</h1>
                <input type="text" name="name" placeholder="Enter your name"
                       autocomplete="cc-name" required />
                <input type="text" name="card" placeholder="Enter card number"
                       inputmode="numeric" pattern="[0-9]{12,19}"
                       autocomplete="cc-number" required />
                <input type="text" name="cvv" placeholder="Enter CVV"
                       inputmode="numeric" pattern="[0-9]{3,4}"
                       autocomplete="cc-csc" required />
                <button type="submit">Pay</button>
            </form>
        </article>
    `)

    document.getElementById("payment-form")
        .addEventListener("submit", handleSubmit)
}

function handleSubmit(e){
    e.preventDefault()

    const name = new FormData(e.target).get("name")

    document.getElementById("user-form").remove()
    orderPlacementEl.style.display = "none"
    addedOrder = []

    const thanks = document.createElement("article")
    thanks.className = "thanks-msg"
    thanks.innerHTML = "<h4></h4>"
    thanks.querySelector("h4").textContent = `Thanks, ${name}! Your order is on its way!`
    container.append(thanks)
}

container.addEventListener("click", (e)=>{
    if(e.target.dataset.status){
        additem(e.target.dataset.status)
    }

    if(e.target.dataset.remove){
        remove(e.target.dataset.remove)
    }

    if(e.target.id == "submit-order" && addedOrder.length){
        renderForm()
    }
})

document.addEventListener("DOMContentLoaded", ()=>{
    sectionContainerEl.innerHTML = renderMenuItem(menuArray)
})