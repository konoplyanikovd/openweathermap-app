<template>
  <article class="weather">
    <div class="date">{{ `${date.getDate() < 10 ? '0' : ''}${date.getDate()}.${date.getMonth() < 9 ? '0' : ''
      }${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}` }}</div>
        <div class="weather-info">
          <span class="temperature">{{ Math.round(props.item?.main.temp ?? 0) }}&deg;C</span>
          <span class="weather-icon">
            <i
              :class="`wi wi-${icons[Number.parseInt(props.item?.weather?.[0]?.icon ?? '0') ?? 0]} ${props.item?.weather?.[0]?.icon}`"></i>
          </span>
          <div class="description">{{ props.item?.weather?.[0].description }}</div>
          <div class="pressure">Давление: <span class="has-text-weight-bold">{{ props.item?.main.pressure }}</span> мм рт.
            ст</div>
          <div class="humidity">Влажность: <span class="has-text-weight-bold">{{ props.item?.main.humidity }}</span>%
          </div>
          <div class="wind">Ветер: <span class="has-text-weight-bold">{{ Math.round(props.item?.wind.speed ?? 0) }}</span>
            м/с</div>
        </div>
  </article>
</template>
<script setup lang="ts">
import { PropType } from 'nuxt/dist/app/compat/capi';
import type { ForecastQueryResult } from '~/app.vue';

const props = defineProps({
  item: { type: Object, required: true } as unknown as PropType<ForecastQueryResult['list'][0]>,
});

const icons = ['forecast-io-clear-day', 'forecast-io-clear-day', 'cloudy', 'cloudy', 'cloudy', , , , , , 'rain'];

const date = computed(() => props.item ? new Date(Date.parse(props.item?.dt_txt)) : new Date())
</script>
<style>
@import url(https://fonts.googleapis.com/css?family=Poiret+One);
@import url(https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.9/css/weather-icons.min.css);

.weather-icon {
  font-family: weathericons;
  font-size: 50px;
  margin-left: 30px;
}

.weather {
  filter: opacity(70%);
}

.weather:hover {
  filter: opacity(100%);
  box-shadow: 0px 9px 8px 4px rgba(34, 60, 80, 0.35);
}

.description {
  font-weight: 100;
  font-size: 17px;
}

.weather-info {
  background-color: #080705;
  color: #080705;
  font-size: 14px;
  padding-left: 20px;
  padding-bottom: 15px;
}

.weather:hover .weather-info {
  color: #fff;
}

.temperature {
  font-size: 50px;
}

.date {
  background-color: #70C1B3;
  color: white;
  font-size: 30px;
  font-weight: 800;
  text-align: center;
}</style>