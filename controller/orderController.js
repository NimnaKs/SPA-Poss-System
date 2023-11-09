import {item_db} from "../db/db.js";
import {ItemModel} from "../model/itemModel.js";

import {customer_db} from "../db/db.js";
import {CustomerModel} from "../model/customerModel.js";

import {order_db} from "../db/db.js";
import {OrderModel} from "../model/orderModel.js";

let customerIdCB = $('#customer_id1');
let itemIdCB = $('#item_code1');
let orderId=$('#order_id');
let itemName=$('#item_name1');
let price=$('#price1');
let qtyOnHand=$('#qty_on_hand');
let qty=$('#getQty');
let customerName=$('#customer_name1');
let total=$('#total');
let discountInput = $('#discount');
let subTotalInput = $('#sub_total');
let cashInput=$('#Cash');
let balanceInput=$('#balance');


let add = $('#addBtn');
let resetItemDetails=$('#resetItemDetailsBtn');
let submitBtn=$('#submitBtn2');
let updateBtn=$('#updateBtn2');
let deleteBtn=$('#deleteBtn2');
let resetBtn=$('#resetBtn2');

let items = [];

/*generate current date*/
function generateCurrentDate(){
    $("#order_date").val(new Date().toISOString().slice(0, 10));
}

$('#order_page').on('click', function() {
    generateCurrentDate();
    populateCustomerIDs();
    populateItemIDs();
    orderId.val(generateOrderId());
    customerName.val('');
    itemName.val('');
    price.val('');
    qtyOnHand.val('');
    total.val('');
    discountInput.val('');
    cashInput.val('');
    subTotalInput.val('');
    balanceInput.val('');
});

/*Function to populate the CustomerId Combo Box*/
function populateCustomerIDs() {

    // Clear existing options except the default one
    customerIdCB.find("option:not(:first-child)").remove();

    // Iterate through the customerArray and add options to the select element
    for (let i = 0; i < customer_db.length; i++) {
        customerIdCB.append($("<option>", {
            value: customer_db[i].customer_id,
            text: customer_db[i].customer_id
        }));
    }
}

/*Function to populate the ItemId Combo Box*/
function populateItemIDs() {

    // Clear existing options except the default one
    itemIdCB.find("option:not(:first-child)").remove();

    // Iterate through the customerArray and add options to the select element
    for (let i = 0; i < item_db.length; i++) {
        itemIdCB.append($("<option>", {
            value: item_db[i].item_code,
            text: item_db[i].item_code
        }));
    }
}

function generateOrderId() {
    let highestOrderId = 0;

    for (let i = 0; i < order_db.length; i++) {
        // Extract the numeric part of the item code
        const numericPart = parseInt(order_db[i].order_id.split('-')[1]);

        // Check if the numeric part is greater than the current highest
        if (!isNaN(numericPart) && numericPart > highestOrderId) {
            highestOrderId = numericPart;
        }
    }

    // Increment the highest numeric part and format as "item-XXX"
    return `order-${String(highestOrderId + 1).padStart(3, '0')}`;
}

itemIdCB.on("change", function() {
    // Capture the selected value in a variable
    let selectedValue = $(this).val();

    let itemObj = $.grep(item_db, function(item) {
        return item.item_code === selectedValue;
    });

    if (itemObj.length > 0) {
        // Access the first element in the filtered array
        itemName.val(itemObj[0].item_name); // Assuming there is an 'item_name' property
        price.val(itemObj[0].price);
        qtyOnHand.val(itemObj[0].qty_on_hand);
    }

    // Check if the item is already in the items array
    let existingItem = items.find(item => item.itemCode === selectedValue);

    if (existingItem) {
        qty.val(existingItem.qtyValue);
    }
});

customerIdCB.on("change", function() {
    // Capture the selected value in a variable
    let selectedValue = $(this).val();

    let customerObj = $.grep(customer_db, function(customer) {
        return customer.customer_id === selectedValue;
    });

    if (customerObj.length > 0) {
        // Access the first element in the filtered array
        customerName.val(customerObj[0].name);
    }
});

/* Function to populate the table with items*/
function populateItemTable() {
    $('tbody').eq(2).empty();
    items.map((item) => {
        $('tbody').eq(2).append(
            `<tr>
                <th scope="row">${item.itemCode}</th>
                <td>${item.itemName}</td>
                <td>${item.priceValue}</td>
                <td>${item.qtyOnHand}</td>
                <td>${item.qtyValue}</td>
            </tr>`
        );
    });
}

/*Event handler for the "Add" button*/
add.on("click", function() {
    let itemCodeValue = itemIdCB.val();
    let qtyValue = parseInt(qty.val());

    /*Check if the item is already in the items array*/
    let existingItem = items.find(item => item.itemCode === itemCodeValue);

    if (existingItem) {
        if (qtyOnHand.val() >= qtyValue) {
            /*Update the quantity of the existing item*/
            existingItem.qtyValue = qtyValue;

            /*Populate the Item table*/
            populateItemTable();

            /*Reset the item details*/
            resetItemDetails.click();
        } else {
            showValidationError('Invalid Input', 'Out of stock');
        }
    } else {
        if (qtyOnHand.val() >= qtyValue) {
            let itemNameValue = itemName.val();
            let priceValue = price.val();
            let qtyOnHandValue = qtyOnHand.val();

            /*Add a new item to the items array*/
            items.push({
                itemCode: itemCodeValue,
                itemName: itemNameValue,
                priceValue: priceValue,
                qtyOnHand: qtyOnHandValue,
                qtyValue: qtyValue
            });

            /*Populate the Item table*/
            populateItemTable();

            /*Reset the item details*/
            resetItemDetails.click();
        } else {
            showValidationError('Invalid Input', 'Out of stock');
        }
    }

    total.val(calculateTotal());
});

function showValidationError(title, text) {
    Swal.fire({
        icon: 'error',
        title: title,
        text: text,
        footer: '<a href="">Why do I have this issue?</a>'
    });
}

resetItemDetails.on("click", function () {
    itemIdCB.val('Select Item Code');
    qty.val('');
    itemName.val('');
    price.val('');
    qtyOnHand.val('');
});

function calculateTotal() {
    let total = 0;
    items.forEach((item) => {
        total += item.priceValue * item.qtyValue;
    });
    return total;
}

discountInput.on("input", function() {
    const discountValue = parseFloat(discountInput.val()) || 0; // Get the discount value as a float
    const totalValue = calculateTotal(); // Calculate the total based on your logic
    const subtotalValue = totalValue - (totalValue * (discountValue / 100)); // Calculate the subtotal

    // Update the sub-total input field
    subTotalInput.val(subtotalValue);
});

cashInput.on("input", function() {
    const cashValue = parseFloat(cashInput.val()) || 0; // Get the cash value as a float
    const totalValue = parseFloat(subTotalInput.val())||0; // Calculate the total based on your logic
    const balanceValue = cashValue - totalValue; // Calculate the balance

    // Update the balance input field
    balanceInput.val(balanceValue);
});

submitBtn.on("click",function (){
    
});

