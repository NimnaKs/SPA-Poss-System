import {item_db} from "../db/db.js";
import {ItemModel} from "../model/itemModel.js";

import {customer_db} from "../db/db.js";
import {CustomerModel} from "../model/customerModel.js";

import {order_db} from "../db/db.js";
import {OrderModel} from "../model/orderModel.js";

let customerIdCB = $("#customer_id1");
let itemIdCB = $("#item_code1");

/*generate current date*/
function generateCurrentDate(){
    $("#order_date").val(new Date().toISOString().slice(0, 10));
}

$('#order_page').on('click', function() {
    generateCurrentDate();
    populateCustomerIDs();
    populateItemIDs();
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