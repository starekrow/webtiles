<example-1>
    Hi, Dave!
    <span ref=foo> more stuff here</span>
    <example-2></example-2>
    <style scoped>

        .scope {
            font-size: 20px;
            color: #f00;
        }

    </style>
    <script>
        var my = this;

        this.on("mount", () => {
            my.refs.foo.innerHTML = " ahahahaha!";
        })
    </script>
</example-1>