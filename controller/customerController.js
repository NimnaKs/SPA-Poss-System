import {customer_db} from "../db/db.js";
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


/*Function to generate the next customer ID*/
function generateCustomerId() {
    let custId = 0;
    for (let i = 0; i < customer_db.length; i++) {
        if (customer_db[i].customer_id > custId) {
            custId = customer_db[i].customer_id;
        }
    }
    return custId + 1;
}

/*Auto-generate the customer ID when navigating to the main section*/
$('#customer_page').on('click', function() {
    customer_id.val(generateCustomerId());
});

/*Reset Columns*/
function resetColumns() {
    reset.click();
    customer_id.val(generateCustomerId());
}

/*Customer Form Submit*/
submit.on('click', () => {

    let customerIdValue = parseInt(customer_id.val(), 10);
    let nameValue = name.val().trim();
    let addressValue = address.val().trim();
    let contactValue = contact.val().trim();
    let emailValue = email.val().trim();

    let customer = new CustomerModel(
        customerIdValue,
        nameValue,
        addressValue,
        contactValue,
        emailValue
    );

    customer_db.push(customer);

    populateStudentTable();

    resetColumns();

});

/*Populate Table*/
function populateStudentTable(){
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
$('table').on('click', 'tbody tr', function() {
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
});

/*Customer Form Update*/
update.on('click', () => {

    let customerIdValue = parseInt(customer_id.val(), 10);
    let nameValue = name.val().trim();
    let addressValue = address.val().trim();
    let contactValue = contact.val().trim();
    let emailValue = email.val().trim();

    customer_db.map((customer) => {
        if (customer.customer_id === customerIdValue){
            customer.name = nameValue;
            customer.address = addressValue;
            customer.contact = contactValue;
            customer.email = emailValue;
        }
    });

    populateStudentTable();

    resetColumns();

});

/*Customer Form Reset*/
reset.on('click', function(e) {
    e.preventDefault();
    customer_id.val(generateCustomerId());
    name.val('');
    address.val('');
    contact.val('');
    email.val('');
});

/*Customer Form Delete*/
delete_btn.on('click', () => {

    let customerIdValue = parseInt(customer_id.val(), 10);
    let index = customer_db.findIndex(customer => customer.customer_id === customerIdValue);
    customer_db.splice(index, 1);
    populateStudentTable();
    reset.click();

});

