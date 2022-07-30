$(document).ready(() => {
  $("#collapse-show").click(() => {
    $("#collapse-nav").css("width", "40%");
  });

  $("#collapse-dismiss").click(() => {
    $("#collapse-nav").css("width", "0");
  });

  if ($(window)[0].innerWidth <= 990) {
    $("#col-table").removeClass("col-9").addClass("col");
    $("#add-product").addClass("mb-4");
  } else {
    $("#col-table").removeClass("col").addClass("col-9");
    $("#add-product").removeClass("mb-4");
  }

  $(window).resize(() => {
    if ($(this)[0].innerWidth <= 991) {
      $("#col-table").removeClass("col-9").addClass("col");
      $("#add-product").addClass("mb-4");
    } else {
      $("#col-table").removeClass("col").addClass("col-9");
      $("#add-product").removeClass("mb-4");
    }
  });

  // If a user is logged in, show their name in the navigation menu
  if (localStorage.getItem("currentUser") !== null) {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    localStorage.removeItem("guest");
    $("a[data-target='#modal-login-register']").hide();
    $("#current-user").html(`Welcome, ${currentUser.username}`);
    if (currentUser.username === "Admin") {
      console.log("I'm an admin!");
      $("a[data-target='#modal-cart']").hide();
      $("#stocklist").removeClass("d-none");
      $("#modal-add-to-cart").attr("disabled", "disabled");
    } else {
      displayCartItems();
    }
  } else {
    var guest =
      localStorage.getItem("guest") !== null
        ? JSON.parse(localStorage.getItem("guest"))
        : [];
    localStorage.setItem("guest", JSON.stringify(guest));
    displayCartItems();
  }

  var listOfProducts =
    localStorage.getItem("listOfProducts") !== null
      ? JSON.parse(localStorage.getItem("listOfProducts"))
      : [
          {
            productImage: "images/forest-fox.png",
            productName: "Forest Fox",
            productPrice: 2.5,
            productInfo: "A wallpaper of a forest and a fox.",
          },
          {
            productImage: "images/city-sunset.jpg",
            productName: "City Sunset",
            productPrice: 2.5,
            productInfo: "A wallpaper of a urban sunset.",
          },
          {
            productImage: "images/dystopian-world.png",
            productName: "Dystopian World",
            productPrice: 2.5,
            productInfo: "A wallpaper of a dystopian world.",
          },
          {
            productImage: "images/starry-sky.jpg",
            productName: "Starry Sky",
            productPrice: 2.5,
            productInfo: "A wallpaper of a starry sky.",
          },
          {
            productImage: "images/tree.jpg",
            productName: "Blossoming Tree",
            productPrice: 2.5,
            productInfo: "A wallpaper of a blossoming tree.",
          },
          {
            productImage: "images/street.jpg",
            productName: "Japanese Street",
            productPrice: 2.5,
            productInfo: "A wallpaper of a Japanese street.",
          },
        ];
  localStorage.setItem("listOfProducts", JSON.stringify(listOfProducts));

  // Displays the products
  function displayProducts() {
    var limitedCollection = "";
    var storeProducts = "";
    var stockList = "";
    for (var i in listOfProducts) {
      i = parseInt(i);
      if (i + 1 < 10) {
        listOfProducts[i].productID = `000${i + 1}`;
      } else if (i + 1 >= 10) {
        listOfProducts[i].productID = `00${i + 1}`;
      } else if (i + 1 >= 100) {
        listOfProducts[i].productID = `0${i + 1}`;
      }
      limitedCollection += `<div class="col text-center product" role="button" value="${i}">
                <img src="${listOfProducts[i].productImage}" class="img-fluid">
                <h6 class="mt-3">${listOfProducts[i].productName}</h6>
                <small>$${parseFloat(listOfProducts[i].productPrice).toFixed(
                  2
                )}</small>
              </div>`;
      storeProducts += `<div class="col-4 text-center product p-4" role="button" value="${i}">
                <img src="${listOfProducts[i].productImage}" class="img-fluid">
                <h6 class="mt-3">${listOfProducts[i].productName}</h6>
                <small>$${parseFloat(listOfProducts[i].productPrice).toFixed(
                  2
                )}</small>
             </div>`;
      stockList += `<tr>
                    <td>${listOfProducts[i].productID}</td>
                    <td class="w-25"><img src="${
                      listOfProducts[i].productImage
                    }" class="img-fluid"></td>
                    <td>${listOfProducts[i].productName}</td>
                    <td>$${parseFloat(listOfProducts[i].productPrice).toFixed(
                      2
                    )}</td>
                  </tr>`;
    }
    $("#collection").html(limitedCollection);
    $("#store-products").html(storeProducts);
    $("#stocklist-items").html(stockList);
  }
  displayProducts();

  // Displays cart items
  function displayCartItems() {
    var cart =
      localStorage.getItem("currentUser") !== null
        ? JSON.parse(localStorage.getItem("currentUser")).cart
        : JSON.parse(localStorage.getItem("guest"));
    if (cart.length === 0) {
      $("#modal-cart .modal-footer").hide();
      $("#empty-cart-message").removeClass("d-none").addClass("d-block");
    } else {
      $("#modal-cart .modal-footer").show();
      $("#empty-cart-message").removeClass("d-block").addClass("d-none");
    }
    console.log(cart);
    var cartItems = "";
    var subtotal = 0;
    var numberOfItems = 0;
    for (var i in cart) {
      cartItems += `<div class="row mb-3">
                      <div class="col-3">
                        <img src="${cart[i].productImage}" class="img-fluid">
                      </div>
                      <div class="col-6">
                        <h2 class="d-inline">${cart[i].productName}</h2>
                        <p class="mb-0">Product ID: ${cart[i].productID}</p>
                        <p class="mb-0">Size: ${cart[i].productSize}</p>
                        <p class="mb-0">Quantity: ${cart[i].productQuantity}</p>
                      </div>
                      <div class="col-3 text-right">
                        <h5 class="text-right d-inline">Price: <span>$${parseFloat(
                          cart[i].productPrice * cart[i].productQuantity
                        ).toFixed(2)}</span></h5>
                        <a href="#" id="delete-item" class="d-block" value="${i}">Delete</a>
                      </div>
                    </div>
                `;
      subtotal +=
        parseFloat(cart[i].productPrice) * parseFloat(cart[i].productQuantity);
      numberOfItems += parseFloat(cart[i].productQuantity);
    }
    $("#number-of-items").html(numberOfItems);
    $("#cart-items").html(cartItems);
    $("#subtotal").html("$" + subtotal.toFixed(2));
  }

  //Allows the user to delete an item in their cart
  $("#cart-items").on("click", 'a[id="delete-item"]', function () {
    var buttonIndex = $(this).attr("value");
    if (localStorage.getItem("currentUser") !== null) {
      listOfUsers[currentUser.index].cart.splice(buttonIndex, 1);
      currentUser.cart.splice(buttonIndex, 1);
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      localStorage.setItem("listOfUsers", JSON.stringify(listOfUsers));
    } else {
      guest.splice(buttonIndex, 1);
      localStorage.setItem("guest", JSON.stringify(guest));
    }
    displayCartItems();
  });

  // Enables the user to add to their cart
  $("#modal-add-to-cart").click(function () {
    var productIndex = $(this).attr("value");
    var currentProduct = listOfProducts[productIndex];
    var productSize = $("#modal-product-size").val().trim();
    var productQuantity = $("#modal-product-quantity").val().trim();
    var productToAdd = {
      productID: currentProduct.productID,
      productImage: currentProduct.productImage,
      productInfo: currentProduct.productInfo,
      productName: currentProduct.productName,
      productPrice: currentProduct.productPrice,
      productSize: productSize,
      productQuantity: productQuantity,
    };

    if (!$("#modal-product-size")[0].checkValidity())
      $("#modal-product-size").addClass("is-invalid");
    if (!$("#modal-product-quantity")[0].checkValidity())
      $("#modal-product-quantity").addClass("is-invalid");

    if (
      $("#modal-product-size")[0].checkValidity() &&
      $("#modal-product-quantity")[0].checkValidity()
    ) {
      if (localStorage.getItem("currentUser") !== null) {
        console.log(currentUser.cart[i]);
        for (var i in currentUser.cart) {
          if (
            productToAdd.productName == currentUser.cart[i].productName &&
            productToAdd.productSize == currentUser.cart[i].productSize
          ) {
            $(".alert-warning").removeClass("d-none");
            $(".alert-success").removeClass("d-none");
            currentUser.cart[i].productQuantity += parseInt(
              productToAdd.productQuantity
            );
            listOfUsers[currentUser.index].cart[i].productQuantity += parseInt(
              productToAdd.productQuantity
            );
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            localStorage.setItem("listOfUser", JSON.stringify(listOfUsers));
            displayCartItems();
            return;
          }
        }
        $(".alert-success").removeClass("d-none");
        listOfUsers[currentUser.index].cart.push(productToAdd);
        currentUser.cart.push(productToAdd);
        localStorage.setItem("listOfUsers", JSON.stringify(listOfUsers));
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        displayCartItems();
      } else {
        for (i in guest) {
          if (
            productToAdd.productName == guest[i].productName &&
            productToAdd.productSize == guest[i].productSize
          ) {
            $(".alert-warning").removeClass("d-none");
            $(".alert-success").removeClass("d-none");
            guest[i].productQuantity =
              parseInt(guest[i].productQuantity) +
              parseInt(productToAdd.productQuantity);
            localStorage.setItem("guest", JSON.stringify(guest));
            displayCartItems();
            return;
          }
        }
        $(".alert-success").removeClass("d-none");
        guest.push(productToAdd);
        localStorage.setItem("guest", JSON.stringify(guest));
        displayCartItems();
      }
    }
  });

  // Displays the limited edition collection in a carousel
  $("#collection").slick({
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 3,
    swipe: false,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          dots: true,
        },
      },
      {
        breakpoint: 300,
        settings: "unslick", // Destroys Slick
      },
    ],
  });

  // Shows a modal containing information of the product that is clicked
  $("#store-products #collection, .product").click(function () {
    var productIndex = $(this).attr("value");
    $("#modal-product-interface").modal("show");
    $("#modal-product-image").attr("src", $(this).find("img").attr("src"));
    $("#modal-product-name").html($(this).find("h6").html());
    $("#modal-product-price").html($(this).find("small").html());
    $("#modal-product-id").html(
      `Product ID: ${listOfProducts[productIndex].productID}`
    );
    $("#modal-product-info").html(listOfProducts[productIndex].productInfo);
    $("#modal-add-to-cart").attr("value", productIndex);
  });

  $(
    "#register, #modal-product-interface, #form-add-product input, select, textarea"
  ).on("input", function () {
    $(this).removeClass("is-invalid");
    $(".alert-success, .alert-warning").addClass("d-none");
  });

  $(".modal").on("hidden.bs.modal", function () {
    $(this).find("form").trigger("reset");
    $(this).find("input").removeClass("is-invalid");
    $(this).find(".alert").addClass("d-none");
    $("a[href='#login']").tab("show");
  });

  $(".modal").on("hidden.bs.tab", function () {
    $(this).find("form").trigger("reset");
    $(this).find("input").removeClass("is-invalid");
    $(this).find(".alert").addClass("d-none");
  });

  var listOfUsers =
    localStorage.getItem("listOfUsers") !== null
      ? JSON.parse(localStorage.getItem("listOfUsers"))
      : [
          {
            username: "Admin",
            password: "Admin",
          },
        ];
  localStorage.setItem("listOfUsers", JSON.stringify(listOfUsers));

  // Registers a new User
  $("#save-and-continue").click(() => {
    var listOfUsers = JSON.parse(localStorage.getItem("listOfUsers"));

    if (!$("#register-username")[0].checkValidity())
      $("#username").addClass("is-invalid");
    if (!$("#register-email")[0].checkValidity())
      $("#register-email").addClass("is-invalid");
    if (!$("#phone-number")[0].checkValidity())
      $("#phone-number").addClass("is-invalid");
    if (!$("#register-password")[0].checkValidity())
      $("#register-password").addClass("is-invalid");

    for (var i in listOfUsers) {
      if ($("#register-email").val().trim() === listOfProducts[i].email) {
        $("#invalid-username").html("This username has already been taken");
        $("#register-username").addClass("is-invalid");
        return;
      }
    }

    if (
      $("#register-username")[0].checkValidity() &&
      $("#register-email")[0].checkValidity() &&
      $("#phone-number")[0].checkValidity() &&
      $("#register-password")[0].checkValidity()
    ) {
      listOfUsers.push({
        username: $("#register-username").val().trim(),
        email: $("#register-email").val().trim(),
        phoneNumber: $("#phone-number").val().trim(),
        password: $("#register-password").val().trim(),
        cart: [],
      });
      localStorage.setItem("listOfUsers", JSON.stringify(listOfUsers));
      swal
        .fire({
          title: "Registration Successful!",
          text: "You may now login",
          icon: "success",
        })
        .then(() => {
          $("a[href='#login']").tab("show");
        });
    }
  });

  // Enables the user to log in
  $("#submit").click(() => {
    var listOfUsers = JSON.parse(localStorage.getItem("listOfUsers"));
    var counter = 0;

    for (var i in listOfUsers) {
      if (
        $("#login-username").val().trim() === listOfUsers[i].username &&
        $("#login-password").val().trim()
      ) {
        listOfUsers[i].index = i;
        localStorage.setItem("currentUser", JSON.stringify(listOfUsers[i]));
        counter--;
        location.reload();
      } else counter++;
    }

    if (counter === listOfUsers.length) {
      $("#login-username").addClass("is-invalid");
      $("#login-password").addClass("is-invalid");
      $("#login-alert").removeClass("d-none");
    }
  });

  //Allows the user to logout
  $("#logout").click(() => {
    localStorage.removeItem("currentUser");
    $(location).attr("href", "index.html");
  });

  $("#new-product-image").change((e) => {
    var file = e.target.files[0];
    var imageType = /image.*/;

    if (file.type.match(imageType)) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        $(".custom-file-label").html(file.name);
        $("#new-product-image-preview").html("");
        var img = new Image();
        img.src = reader.result;
        $(img).addClass("img-fluid");
        $("#new-product-image-preview").append(img);
      };
    } else {
      $("#invalid-product-image").html("This file type is not supported.");
      $("#new-product-image").addClass("is-invalid");
    }
  });

  // Allows the admin to add a new product to the stocklist
  $("#add-product").click(() => {
    if (!$("#new-product-name")[0].checkValidity())
      $("#new-product-name").addClass("is-invalid");
    if (!$("#new-product-price")[0].checkValidity())
      $("#new-product-price").addClass("is-invalid");
    if (!$("#new-product-description")[0].checkValidity())
      $("#new-product-description").addClass("is-invalid");
    if (!$("#new-product-image")[0].checkValidity())
      $("#new-product-image").addClass("is-invalid");

    for (var i in listOfProducts) {
      if (
        $("#new-product-name").val().trim() === listOfProducts[i].productName
      ) {
        $("#new-product-name").addClass("is-invalid");
        $("#invalid-product-name").html("This product already exists.");
        return;
      }
    }

    if (
      $("#new-product-name")[0].checkValidity() &&
      $("#new-product-price")[0].checkValidity() &&
      $("#new-product-description")[0].checkValidity() &&
      $("#new-product-image")[0].checkValidity()
    ) {
      var newProduct = {
        productName: $("#new-product-name").val().trim(),
        productPrice: parseInt($("#new-product-price").val().trim()).toFixed(2),
        productInfo: $("#new-product-description").val().trim(),
      };
      var file = $("#new-product-image")[0].files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        var img = reader.result;
        newProduct.productImage = img;
        listOfProducts.push(newProduct);
        localStorage.setItem("listOfProducts", JSON.stringify(listOfProducts));
        displayProducts();
      };
    }
  });
});

$("#checkout").click(() => {
  if (localStorage.getItem("currentUser") !== null) {
    swal
      .fire({
        title: "Purchase Successful!",
        text: "Thank you for making a purchase! ",
        icon: "success",
      })
      .then(() => {
        currentUser.cart = new Array();
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        displayCartItems();
      });
  } else {
    swal.fire({
      title: "Error...",
      text:
        "You must be signed in to make a purchase.",
      icon: "error",
    });
  }
});
