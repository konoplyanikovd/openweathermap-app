<template>
    <Modal>
        <div class="container">
            <div class="columns">
                <div class="column is-5">
                    <div class="columns is-flex is-flex-direction-column is-justify-center">
                        <div class="column">
                            <label>Логин</label>
                            <input class="input is-primary" type="text" placeholder="Введите логин" :value="login"
                                @change="login = $event.target.value">
                        </div>
                        <div class="column">
                            <label>Пароль</label>
                            <input class="input is-primary" type="password" placeholder="Введите пароль" :value="password"
                                @change="password = $event.target.value">
                            <label v-if="isRegister" @click="isAgree = !isAgree">
                                <input type="checkbox" :value="isAgree">
                                Я согласен с <a href="#" class="has-text-primary">правилами и положениями</a>
                            </label>
                        </div>
                        <div v-if="!isRegister" class="has-text-centered">
                            <p class="is-size-7"> Нет аккаунта? <a href="#" class="has-text-primary"
                                    @click="isRegister = true">Регистрация</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <template #header>
            <p class="modal-card-title">{{ isRegister ? "Регистрация" : "Авторизация" }}</p>
        </template>
        <template #footer>
            <div class="">
                <button class="button is-primary" :disabled="!login.length" @click="submit">Далее</button>
                <button class="button" @click="emit('modal:close')">Отмена</button>
            </div>
        </template>
    </Modal>
</template>
<script setup>
import Modal from './modal.vue';

const props = defineProps({
    needRegister: { type: Boolean, default: false },
});
const emit = defineEmits(['modal:ok', 'modal:close']);

const login = ref('');
const password = ref('');
const isAgree = ref(false);
const isRegister = ref(props.needRegister);

const submit = () => {
    if (isRegister.value && !isAgree.value) return;

    emit('modal:ok', {
        isRegister: isRegister.value,
        login: login.value,
        password: password.value
    });
}
</script>