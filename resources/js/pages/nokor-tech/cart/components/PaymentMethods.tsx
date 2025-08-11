const PaymentMethods = () => {
    return (
        <div className="bg-muted h-auto rounded-[16px] p-4 shadow-sm w-full lg:w-5/12">
            <h2 className="mb-6 text-xl font-bold">Choose Payment Method</h2>

            <ul>
                <li className="bg-background hover:border-border flex cursor-pointer items-center gap-[12px] rounded-[12px] border border-transparent p-4 transition-all duration-300 dark:bg-white/20">
                    <img className="size-[60px] rounded-[8px]" src="/assets/ABA_BANK.svg" alt="" />
                    <div>
                        <p className="text-[20px] font-semibold">ABA KHQR</p>
                        <p className="text-[16px] font-normal">Scan to pay with any banking app</p>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default PaymentMethods;
