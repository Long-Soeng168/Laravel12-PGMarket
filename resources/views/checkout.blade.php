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
      <div class="col-12">
        <h1>PayPal Payment Test</h1>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-12">
        <div class="row">
          <div class="col-12 col-lg-6 offset-lg-3">
            <p class="text-danger">
              WARNING!!!<br />
              This is set to LIVE mode, so real money is used.<br />
              No refunds, use at your own risk.
            </p>
          </div>
        </div>

        <div class="row mt-3" id="paypal-success" style="display: none;">
          <div class="col-12 col-lg-6 offset-lg-3">
            <div class="alert alert-success" role="alert">
              You have successfully sent me money! Thank you!
            </div>
          </div>
        </div>

        <div class="row mt-3">
          <div class="col-12 col-lg-6 offset-lg-3">
            <div class="input-group">
              <span class="input-group-text">£</span>
              <input type="text"
                class="form-control"
                id="paypal-amount"
                value="0.5"
                aria-label="Amount (to the nearest pound)">
              <span class="input-group-text">.00</span>
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
      return fetch("/create/" + document.getElementById("paypal-amount").value)
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
          //paypal_buttons.close();
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