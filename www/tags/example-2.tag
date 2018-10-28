<example-2 onclick={click}>
    <span>Peekaboo</span>
    <style scoped>
        :scope {
            font-size: 20px;
        }
    </style>
    click() {
        this.root.style.display = "none";
    }
</example-2>