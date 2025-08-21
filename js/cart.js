$(document).ready(function () {
  // Sample data
  let products = [
    { id: 1, name: "Mona Lisa", price: 120, qty: 2, img: "https://via.placeholder.com/70" },
    { id: 2, name: "The Starry Night", price: 120, qty: 2, img: "https://via.placeholder.com/70" },
    { id: 3, name: "Girl with a Pearl Earring", price: 120, qty: 1, img: "https://via.placeholder.com/70" },
    { id: 4, name: "The Last Supper", price: 120, qty: 2, img: "https://via.placeholder.com/70" },
    { id: 5, name: "The Kiss", price: 120, qty: 1, img: "https://via.placeholder.com/70" }
  ];

  // Render Cart
  function renderCart() {
    let cartBody = $("#cartBody");
    cartBody.empty();
    if (products.length === 0) {
      $("#emptyMsg").show();
      $("#grandTotal").text("0");
      return;
    }
    $("#emptyMsg").hide();

    let grandTotal = 0;
    products.forEach((p) => {
      let totalPrice = p.price * p.qty;
      grandTotal += totalPrice;
      cartBody.append(`
        <tr data-id="${p.id}">
          <td><input type="checkbox" class="item-check"></td>
          <td class="text-start">
            <img src="${p.img}" alt="">
            <p>${p.name}</p>
          </td>
          <td>RM ${p.price}</td>
          <td>
            <button class="btn btn-sm btn-outline-secondary minus">-</button>
            <span class="mx-2">${p.qty}</span>
            <button class="btn btn-sm btn-outline-secondary plus">+</button>
          </td>
          <td>RM ${totalPrice}</td>
          <td><button class="btn btn-danger btn-sm deleteBtn">Delete</button></td>
        </tr>
      `);
    });
    $("#grandTotal").text(grandTotal);
  }

  // Initial render
  renderCart();

  // Quantity increase
  $(document).on("click", ".plus", function () {
    let id = $(this).closest("tr").data("id");
    let item = products.find((p) => p.id === id);
    item.qty++;
    renderCart();
  });

  // Quantity decrease
  $(document).on("click", ".minus", function () {
    let id = $(this).closest("tr").data("id");
    let item = products.find((p) => p.id === id);
    if (item.qty > 1) {
      item.qty--;
    }
    renderCart();
  });

  // Delete single product
  $(document).on("click", ".deleteBtn", function () {
    let id = $(this).closest("tr").data("id");
    products = products.filter((p) => p.id !== id);
    renderCart();
  });

  // Select all
  $("#selectAll").on("change", function () {
    $(".item-check").prop("checked", $(this).prop("checked"));
  });

  // Delete selected
  $("#deleteSelected").click(function () {
    let idsToDelete = [];
    $(".item-check:checked").each(function () {
      let id = $(this).closest("tr").data("id");
      idsToDelete.push(id);
    });
    products = products.filter((p) => !idsToDelete.includes(p.id));
    renderCart();
  });

  // Checkout
  $("#checkoutBtn").click(function () {
    if (products.length === 0) {
      alert("Your cart is empty!");
    } else {
      alert("Proceeding to checkout with total: RM " + $("#grandTotal").text());
    }
  });
});
