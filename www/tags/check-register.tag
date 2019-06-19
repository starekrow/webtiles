<check-register>
    <nav-header>
        <nav-left-icon icon=menu field-trigger=main-menu/>
        <nav-title ref=navTitle />
        <nav-right-icon icon=profile field-trigger=profile-menu/>
    </nav-header>
    <script>
        var f = opts.fields;

        f.startDate = new Date("-31 days")
        f.endDate =   new Date("+40 days");

        f.transactionLoader.bind(app);
        f.transactionLoader.query({
            from: f.startDate,
            to:   f.endDate
        }).bind(f.transactions);
        f.transactionsLoaded.handle(field => {
            
        });
        let months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];
        // TODO: determine starting date from query
        title = months[new Date().getMonth()];


    </script>
</check-register>