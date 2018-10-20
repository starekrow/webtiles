<example-1>
    Hi, Dave!
    <span ref=foo> more stuff here</span>
    <style scoped>

    .scope {
        font-size: 20px;
        color: #f00;
    }

    </style>
    var my = this;

    this.on("mount", function() {
        my.refs.foo.innerHTML = " ahahahaha!";
    });

</example-1>