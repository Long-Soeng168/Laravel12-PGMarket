import { usePage } from '@inertiajs/react';
const PaymentMethods = () => {
    const { amount, hash, transactionId, firstName, lastName, phone, email, payment_option, merchant_id, api_url, req_time } = usePage<any>().props;
    return (
        <div>
            {/* <div className={'text-primary mb-4 text-lg leading-none font-bold'}>
                <p>Choose Payment Method</p>
            </div>
            <button
                onClick={() => setOpenDialog(true)}
                className="bg-background flex w-full cursor-pointer items-center gap-[10px] rounded-[8px] border border-transparent p-[10px] text-start shadow-[0_1px_5px_rgb(0,0,0,0.1)] transition-all duration-300 hover:scale-105 hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:bg-white/20 dark:hover:bg-white/25"
            >
                <img className="size-[50px] rounded-[4px]" src="/assets/ABA_BANK.svg" alt="" />
                <div className="flex w-full items-center justify-between">
                    <div className="flex-1">
                        <p className="text-[16px] font-semibold">ABA KHQR</p>
                        <p className="text-[14px] font-normal text-gray-600 dark:text-gray-200">Scan to pay with any banking app</p>
                    </div>
                    <span className="bg-accent flex cursor-pointer items-center justify-center rounded-[4px] p-1 dark:bg-white/10">
                        <ChevronRight className="stroke-gray-600 dark:stroke-gray-200" />
                    </span>
                </div>
            </button> */}

            {/* Dialog */}
            <div className="container">
                <div>
                    <h2>TOTAL: ${amount}</h2>
                    <form method="POST" target="aba_webservice" action={api_url} id="aba_merchant_request">
                        @csrf
                        <input type="hidden" name="hash" value={hash} id="hash" />
                        <input type="hidden" name="tran_id" value={transactionId} id="tran_id" />
                        <input type="hidden" name="amount" value={amount} id="amount" />
                        <input type="hidden" name="firstname" value={firstName} />
                        <input type="hidden" name="lastname" value={lastName} />
                        <input type="hidden" name="phone" value={phone} />
                        <input type="hidden" name="email" value={email} />
                        <input type="hidden" name="payment_option" value={payment_option} />
                        <input type="hidden" name="merchant_id" value={merchant_id} />
                        <input type="hidden" name="req_time" value={req_time} />
                    </form>
                    <input type="button" id="checkout_button" value="Checkout Now" />
                </div>
            </div>
            <script>
                 <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
                <script src="https://checkout.payway.com.kh/plugins/checkout2-0.js"></script>

    <script>
        $(document).ready(function() {
            $('#checkout_button').click(function() {
                AbaPayway.checkout();
            });
        });
    </script>
            </script>
        </div>
    );
};

export default PaymentMethods;
