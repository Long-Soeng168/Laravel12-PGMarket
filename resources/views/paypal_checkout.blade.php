<!doctype html>
<html lang="en">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link rel="icon" type="image/x-icon" href="https://assets.edlin.app/favicon/favicon.ico">

  <link rel="stylesheet" href="https://assets.edlin.app/bootstrap/v5.3/bootstrap.css">

  <script src="https://www.paypal.com/sdk/js?client-id={{config('paypal.client_id')}}&currency=GBP&intent=capture"></script>

  <!-- Title -->
  <title>PayPal Laravel</title>
</head>

<body>
  <div class="container text-center">
    <div class="row mt-3">
      <div style="
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
">
        <h2 style="
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
  ">
          Cart Summary
        </h2>

        <table style="
    width: 100%;
    font-size: 0.875rem;
    border-collapse: collapse;
  " id="cart-items-table">
          <thead>
            <tr>
              <th style="padding: 0.5rem; text-align: left;">Product</th>
              <th style="padding: 0.5rem; text-align: right;">Price</th>
              <th style="padding: 0.5rem; text-align: center;">Quantity</th>
              <th style="padding: 0.5rem; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody id="cart-items-body">
            <!-- JS will inject rows here -->
          </tbody>
        </table>

        <div style="
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
    padding-top: 1rem;
    font-size: 1.125rem;
    font-weight: 600;
  ">
          <span>Total:</span>
          <span id="cart-total">$0.00</span>
        </div>
      </div>


      <script>
        document.addEventListener('DOMContentLoaded', () => {
          const cart = JSON.parse(localStorage.getItem('cart')) || {
            cartItems: []
          };
          const tbody = document.getElementById('cart-items-body');
          const totalElement = document.getElementById('cart-total');

          let total = 0;

          cart.cartItems.forEach(item => {
            const row = document.createElement('tr');

            const imageUrl = item.images && item.images.length > 0 ?
              `/assets/images/items/thumb/${item.images[0].image}` :
              'https://via.placeholder.com/60';

            row.innerHTML = `
    <td style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem;">
        <img src="${imageUrl}" alt="" style="width: 3.5rem; height: 3.5rem; object-fit: cover; border-radius: 0.375rem;">
        <span>${item.name}</span>
    </td>
    <td style="padding: 0.5rem; text-align: right;">£${parseFloat(item.price).toFixed(2)}</td>
    <td style="padding: 0.5rem; text-align: center;">${item.cartQuantity}</td>
    <td style="padding: 0.5rem; text-align: right;">£${(item.price * item.cartQuantity).toFixed(2)}</td>
`;


            tbody.appendChild(row);
            total += item.price * item.cartQuantity;
          });

          totalElement.textContent = `£${total.toFixed(2)}`;
        });
      </script>


    </div>
    <div class="row mt-5">
      <div class="col-12">
        <!-- <div class="row">
          <div class="col-12 col-lg-6 offset-lg-3">
            <p class="text-danger">
              WARNING!!!<br />
              This is set to LIVE mode, so real money is used.<br />
              No refunds, use at your own risk.
            </p>
          </div>
        </div> -->

        <div class="row mt-3" id="paypal-success" style="display: none;">
          <div class="col-12 col-lg-6 offset-lg-3">
            <div class="alert alert-success" role="alert">
              You have successfully sent me money! Thank you!
            </div>
          </div>
        </div>

        <div class="row mt-3">
          <div class="col-12 col-lg-6 offset-lg-3" id="payment_options"></div>
        </div>
      </div>
    </div>
  </div>
</body>
<script>
  paypal.Buttons({
    createOrder: function() {
      const cart = JSON.parse(localStorage.getItem('cart')) || {
        cartItems: []
      };
      const total = cart.cartItems.reduce((sum, item) => {
        const itemPrice = parseFloat(item.price);
        const itemDiscount = parseFloat(item.discount || 0);
        const discountAmount = item.discount_type === 'percentage' ?
          (itemPrice * itemDiscount) / 100 :
          itemDiscount;

        const itemTotal = (itemPrice - (itemDiscount ? discountAmount : 0)) * item.cartQuantity;
        return sum + itemTotal;
      }, 0);

      return fetch("/create/" + total.toFixed(2))
        .then((response) => response.text())
        .then((id) => {
          return id;
        });
    },

    onApprove: function() {
      return fetch("/complete", {
          method: "post",
          headers: {
            "X-CSRF-Token": '{{csrf_token()}}'
          }
        })
        .then((response) => response.json())
        .then((order_details) => {
          console.log(order_details);
          document.getElementById("paypal-success").style.display = 'block';

          // Now: get cart items from localStorage
          const cart = JSON.parse(localStorage.getItem('cart')) || {
            cartItems: []
          };

          // Map to your desired order item format
          const items = cart.cartItems.map(item => {
            const itemPrice = parseFloat(item.price);
            const itemDiscount = parseFloat(item.discount || 0);
            const discountAmount = item.discount_type === 'percentage' ?
              (itemPrice * itemDiscount) / 100 :
              itemDiscount;

            const itemTotal = (itemPrice - (itemDiscount ? discountAmount : 0)) * item.cartQuantity;

            return {
              item_id: item.id,
              price: itemPrice,
              discount: itemDiscount,
              discount_type: item.discount_type,
              quantity: item.cartQuantity,
              total: itemTotal
            };
          });

          // Send order items to your /orders endpoint
          fetch("/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": '{{csrf_token()}}'
              },
              body: JSON.stringify({
                transaction_id: order_details.id,
                payment_type: 'paypal',
                items
              })
            })
            .then(response => {
              if (!response.ok) {
                throw new Error("HTTP status " + response.status);
              }
              return response.json();
            })
            .then(data => {
              console.log("Order stored successfully:", data);
              // Optional: clear localStorage cart if needed
              localStorage.removeItem('cart');
              window.location.href = '/checkout_success';
            })
            .catch(error => {
              console.error("Failed to store order:", error);
            });

        })
        .catch((error) => {
          console.log(error);
        });
    },

    onCancel: function(data) {
      //todo
    },

    onError: function(err) {
      //todo
      console.log(err);
    }
  }).render('#payment_options');
</script>

</html>