<template>
    <Teleport to="#teleports-root">
        <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <slot name="header">
                        <p class="modal-card-title">Modal title</p>
                        <button class="delete" aria-label="close" @click="emit('modal:close')"></button>
                    </slot>
                </header>
                <section class="modal-card-body">
                    <slot></slot>
                </section>
                <footer class="modal-card-foot">
                    <slot name="footer">
                        <button class="button is-success" @click="emit('modal:ok')">Ok</button>
                        <button class="button" @click="emit('modal:close')">Cancel</button>
                    </slot>
                </footer>
            </div>
        </div>
    </Teleport>
</template>
<script setup>
const emit = defineEmits(['modal:ok', 'modal:close']);
</script>