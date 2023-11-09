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
    /*Capture the selected value in a variable*/
    let selectedValue = $(this).val();

    let itemObj = $.grep(item_db, function(item) {
        return item.item_code === selectedValue;
    });

    if (itemObj.length > 0) {
        /*Access the first element in the filtered array*/
        itemName.val(itemObj[0].item_name); /*Assuming there is an 'item_name' property*/
        price.val(itemObj[0].price);
        qtyOnHand.val(itemObj[0].qty_on_hand);
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
