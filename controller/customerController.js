import {customer_db, item_db} from "../db/db.js";
import {CustomerModel} from "../model/customerModel.js";

let submit = $('#Customer .btn-success').eq(0);
let update = $('#Customer .btn-primary').eq(0);
let delete_btn = $('#Customer .btn-danger').eq(0);
let reset = $('#Customer .btn-warning').eq(0);

let customer_id = $('#customer_id');
let name = $('#customer_name');
let address = $('#address');
let contact = $('#contact');
let email = $('#email');

let searchBtn=$('#search');
let searchField=$('#searchField');

/*Validation*/
const emailPattern = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$");
const mobilePattern = new RegExp("^(?:0|94|\\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\\d)\\d{6}$");

//customer search
searchField.on('input', function () {
    let search_term = searchField.val();

    let results = customer_db.filter((item) =>

        item.customer_id.toLowerCase().startsWith(search_term.toLowerCase()) || item.name.toLowerCase().startsWith(search_term.toLowerCase()) || item.address.toLowerCase().startsWith(search_term.toLowerCase()) ||
        item.contact.toLowerCase().startsWith(search_term) || item.email.toLowerCase().startsWith(search_term.toLowerCase())

    );

    $('tbody').eq(0).empty();
    results.map((item, index) => {
        let tbl_row = `<tr>
            <th scope="row">${item.customer_id}</th>
            <td>${item.name}</td>
            <td>${item.address}</td>
            <td>${item.contact}</td>
            <td>${item.email}</td>
        </tr>`;
        $('tbody').eq(0).append(tbl_row);
    });

});


/*Function to generate the next customer ID*/
function generateCustomerId() {
    let highestCustId = 0;

    for (let i = 0; i < customer_db.length; i++) {
        // Extract the numeric part of the item code
        const numericPart = parseInt(customer_db[i].customer_id.split('-')[1]);

        // Check if the numeric part is greater than the current highest
        if (!isNaN(numericPart) && numericPart > highestCustId) {
            highestCustId = numericPart;
        }
    }

    // Increment the highest numeric part and format as "item-XXX"
    return `cust-${String(highestCustId + 1).padStart(3, '0')}`;
}

/*Auto-generate the customer ID when navigating to the main section*/
$('#customer_page').on('click', function() {
    customer_id.val(generateCustomerId());
    populateCustomerTable();
    delete_btn.prop("disabled", true);
    update.prop("disabled", true);
    searchField.attr("placeholder", "Search Customer Here");
});

/*Reset Columns*/
function resetColumns() {
    reset.click();
    customer_id.val(generateCustomerId());
    delete_btn.prop("disabled", true);
    update.prop("disabled", true);
    submit.prop("disabled",false);
}

/*Validation*/
function validation(value,message,test) {
    if(!value){
        showValidationError('Null Input','Input '+message);
        return false;
    }
    if(test===null){
        return true;
    }
    if(!test){
        showValidationError('Invalid Input','Invalid Input '+message);
        return false;
    }
    return true;
}

/*Show Validation Error*/
function showValidationError(title, text) {
    Swal.fire({
        icon: 'error',
        title: title,
        text: text,
        footer: '<a href="">Why do I have this issue?</a>'
    });
}

/*Customer Form Submit*/
submit.on('click', (e) => {
    e.preventDefault();

    let customerIdValue = customer_id.val();
    let nameValue = name.val().trim();
    let addressValue = address.val().trim();
    let contactValue = contact.val().trim();
    let emailValue = email.val().trim();

    if(
        validation(nameValue, "customer name", null) &&
        validation(addressValue, "Address", null) &&
        validation(contactValue, "Contact", mobilePattern.test(contactValue)) &&
        validation(emailValue,"Email",emailPattern.test(emailValue))){
        let customer = new CustomerModel(
            customerIdValue,
            nameValue,
            addressValue,
            contactValue,
            emailValue
        );

        Swal.fire(
            'Save Successfully !',
            'Successful',
            'success'
        )

        customer_db.push(customer);

        populateCustomerTable();

        resetColumns();
    }

});

/*Populate Table*/
function populateCustomerTable(){
    $('tbody').eq(0).empty();
    customer_db.map((customer) => {
        $('tbody').eq(0).append(
            `<tr>
                <th scope="row">${customer.customer_id}</th>
                <td>${customer.name}</td>
                <td>${customer.address}</td>
                <td>${customer.contact}</td>
                <td>${customer.email}</td>
            </tr>`
        );
    });
}

// Function to populate the form fields with data from a clicked table row
$('#customerTable').on('click', 'tbody tr', function() {
    let customerIdValue = $(this).find('th').text();
    let nameValue = $(this).find('td:eq(0)').text();
    let addressValue = $(this).find('td:eq(1)').text();
    let contactValue = $(this).find('td:eq(2)').text();
    let emailValue = $(this).find('td:eq(3)').text();

    customer_id.val(customerIdValue);
    name.val(nameValue);
    address.val(addressValue);
    contact.val(contactValue);
    email.val(emailValue);

    submit.prop("disabled", true);
    delete_btn.prop("disabled", false);
    update.prop("disabled", false);

});

/*Customer Form Update*/
update.on('click', () => {

    let customerIdValue = customer_id.val();
    let nameValue = name.val().trim();
    let addressValue = address.val().trim();
    let contactValue = contact.val().trim();
    let emailValue = email.val().trim();

    if(
        validation(nameValue, "customer name", null) &&
        validation(addressValue, "Address", null) &&
        validation(contactValue, "Contact", mobilePattern.test(contactValue)) &&
        validation(emailValue,"Email",emailPattern.test(emailValue))) {

        customer_db.map((customer) => {
            if (customer.customer_id === customerIdValue) {
                customer.name = nameValue;
                customer.address = addressValue;
                customer.contact = contactValue;
                customer.email = emailValue;
            }
        });

        Swal.fire(
            'Update Successfully !',
            'Successful',
            'success'
        )

        populateCustomerTable();

        resetColumns();

    }

});

/*Customer Form Reset*/
reset.on('click', function(e) {
    e.preventDefault();
    customer_id.val(generateCustomerId());
    name.val('');
    address.val('');
    contact.val('');
    email.val('');
    submit.prop("disabled", false);
    delete_btn.prop("disabled", true);
    update.prop("disabled", true);
});

/*Customer Form Delete*/
delete_btn.on('click', () => {

    let customerIdValue = parseInt(customer_id.val(), 10);

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.isConfirmed) {
            let index = customer_db.findIndex(customer => customer.customer_id === customerIdValue);
            customer_db.splice(index, 1);
            populateCustomerTable();
            resetColumns();
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
        }
    });


});

