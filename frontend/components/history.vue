<template>
    <Modal>
        <div class="container">
            <table v-if="items.length > 0" class="table is-striped is-narrow is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th><abbr title="Number">#</abbr></th>
                        <th>Сущность</th>
                        <th>Значение</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, num) in items" :key="num">
                        <th>{{ num }}</th>
                        <td>{{ item.entity }}</td>
                        <td>{{ item.value }}</td>
                    </tr>
                </tbody>
            </table>
            <article v-else class="message is-danger">
                <div class="message-body">
                    Вы начали с чистого листа!
                </div>
            </article>
        </div>
        <template #header>
            <p class="modal-card-title">История поиска</p>
        </template>
        <template #footer>
            <div class="buttons">
                <button class="button is-danger" :disabled="items.length === 0" @click="emit('modal:ok')">Очистить</button>
                <button class="button" @click="emit('modal:close')">Отмена</button>
            </div>
        </template>
    </Modal>
</template>
<script setup>
import Modal from './modal.vue';

const props = defineProps({
    items: { type: Array, required: true },
});
const emit = defineEmits(['modal:ok', 'modal:close']);

</script>