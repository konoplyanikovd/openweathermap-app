<template>
    <div class="field">
        <label class="label">Прогноз погоды</label>
        <div class="control has-icons-left has-icons-right">
            <input class="input" ref="input" :class="{ 'is-danger': hasError }" type="text" placeholder="Введите название города"
                :value="cityInputValue" @change="cityChanged(($event.target! as unknown as Record<string, string>).value)" @keydown.enter="cityChanged($event.target.value)" />
            <span class="icon is-small is-left">
                <FontAwesomeIcon v-if="hasError" :icon="faExclamationTriangle" />
            </span>
            <span class="icon is-small is-right">
                <FontAwesomeIcon :icon="faMagnifyingGlass" />
            </span>
        </div>
        <p v-if="hasError" class="help is-danger">{{ errorText }}</p>
    </div>
</template>
<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faMagnifyingGlass, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { InputHTMLAttributes } from 'nuxt/dist/app/compat/capi';

const hasError = ref(false);
const cityInputValue: Ref<string | null> = ref(null);
const defaultErrorText = 'This city name is invalid';
const errorText = ref(defaultErrorText);
const input: InputHTMLAttributes = ref(null);

const emit = defineEmits(['update:search']);

const cityChanged = (cityName: string) => {
    if (new RegExp('[а-я]', 'ig').test(cityName)) {
        hasError.value = true;
        errorText.value = 'Только латиница!'
        setTimeout(() => {
            hasError.value = false;
            errorText.value = defaultErrorText;
        }, 10000);
        input.value.focus();
        return;
    }
    cityInputValue.value = cityName;
    emit('update:search', cityName);
}
</script>