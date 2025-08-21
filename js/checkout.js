// Select all checkbox
$("#selectAll").on("change", function(){
  $("input[type=checkbox]").prop("checked", $(this).prop("checked"));
});

//Shipping Method
$("input[name=shipping]").on("change", function() {
  let shippingMethod = $(this).val();
  
  if (shippingMethod === "Home Delivery") {
    $("#addressBox").show();
  } else {
    $("#addressBox").hide();
  }
});

// Save address to Local Storage
$("#saveAddressBtn").on("click", function() {
  let address = $("#deliveryAddress").val().trim();

  if (address === "") {
    alert("Please enter your address before saving.");
  } else {
    localStorage.setItem("deliveryAddress", address);
    alert("Your address has been saved!");
  }
});

// Load saved address on page load
$(document).ready(function() {
  let savedAddress = localStorage.getItem("deliveryAddress");
  if (savedAddress) {
    $("#deliveryAddress").val(savedAddress);
  }
});

// Handle Confirm Order button
$(".btn-confirm").on("click", function(){
  let shipping = $("input[name=shipping]:checked").val();
  let payment = $("input[name=payment]:checked").val();

function updatePrices(productTotal, shipping) {
  $("#productPrice").text("RM " + productTotal);
  $("#shippingFee").text("RM " + shipping);
  $("#totalPrice").text("RM " + (productTotal + shipping));
}

// Delete All Products button
$("#deleteAllBtn").on("click", function(){
  if(confirm("Are you sure you want to delete all products from the cart?")) {
    $(".checkout-table tbody").empty(); // remove all rows
    updatePrices(0, 0); // reset totals to RM 0
    alert("All products have been removed from your cart.");
  }
});
//Situation: User doesn't select shipping/ payment method
  if(!shipping || !payment) {
    alert("Please select a shipping and payment method before confirming your order.");
  } else {
    alert("Order confirmed!\nShipping: " + shipping + "\nPayment: " + payment);
  }
});

// Update Subtotal & Total Price
function updateCartTotals() {
  let productTotal = 0;

  $(".checkout-table tbody tr").each(function() {
    let unitPrice = parseFloat($(this).find(".unit-price").text());
    let qty = parseInt($(this).find(".quantity").val());
    let subtotal = unitPrice * qty;

    $(this).find(".subtotal").text(subtotal.toFixed(2));
    productTotal += subtotal;
  });

  // Update summary section
  $("#productPrice").text("RM " + productTotal.toFixed(2));
  $("#totalPrice").text("RM " + productTotal.toFixed(2)); // assuming shipping is RM 0
}

// Quantity control functionality
document.querySelector('.minus').addEventListener('click', function () {
    const input = document.querySelector('.quantity-input');
    let value = parseInt(input.value) || 1;
    if (value > 1) {
        input.value = value - 1;
    }
});

document.querySelector('.plus').addEventListener('click', function () {
    const input = document.querySelector('.quantity-input');
    let value = parseInt(input.value) || 1;
    if (value < currentStock) {
        input.value = value + 1;
    }
});

// Manual input (typing number directly)
$(document).on("change", ".quantity", function() {
  let val = parseInt($(this).val());
  if (isNaN(val) || val < 1) {
    $(this).val(1);
  }
  updateCartTotals();
});

// Initialize totals on page load
$(document).ready(function() {
  updateCartTotals();
});
