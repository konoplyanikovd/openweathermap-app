<template>
    <div id="single-page-application-v1" class="container is-fluid pl-0 pr-0">
        <div id="header" class="container is-fluid">
            <Navbar :user="user" @register="isRegister = true, toggleLoginModal()" @login="toggleLoginModal"
                @logout="logoutHandle" />
        </div>
        <div id="main" class="container is-fluid">
            <div class="tile is-ancestor">
                <div id="content" class="tile is-parent">
                    <div class="tile is-child">
                        <div id="search-widget">
                            <div class="section">
                                <div class="columns">
                                    <div class="column is-1 is-offset-2 mt-2">
                                        <button class="button is-success is-pulled-right mt-5" @click="showHistory">
                                            <div class="icon is-small">
                                                <FontAwesomeIcon :icon="faClockRotateLeft" />
                                            </div>
                                        </button>
                                    </div>
                                    <div class="column is-5">
                                        <Search @update:search="searchChange" />
                                        <div v-if="errorText.length > 0" class="section">
                                            <div class="notification is-danger is-light">
                                                {{ errorText }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="isLoading" class="columns">
                            <div class="column is-6 is-offset-3">
                                <progress class="progress is-small is-primary" max="100"></progress>
                            </div>
                        </div>
                        <div v-else>
                            <div class="buttons">
                                <button v-for="f in favourites" class="button is-success">
                                    <span @click="searchChange(f.name)">{{ f.name }}</span>
                                    <span class="icon is-small" @click="toggleFavourite(f.name, f.favourite)">
                                        <FontAwesomeIcon :icon="faTimes" />
                                    </span>
                                </button>
                            </div>
                            <div id="city" v-if="city" class="notification is-primary is-light">
                                <div class="columns">
                                    <div class="column is-2 is-offset-5 is-size-4">
                                        <div>
                                            <span>Сегодня</span>
                                            <span class="is-pulled-right">{{ currentDate }}</span>
                                        </div>
                                        <div class="is-clickable" @click="toggleFavouriteCurrentHandle">
                                            <span>{{ city.name }}</span>
                                            <span class="is-pulled-right">
                                                <FontAwesomeIcon :icon="isFavouriteCity ? faStar : farStar" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="forecast-widget">
                                <div class="tile is-ancestor">
                                    <div class="tile is-vertical">
                                        <div v-for="dateRow in countRows" :key="dateRow"
                                            class="tile is-parent is-justify-content-center">
                                            <div v-for="item in forecastList.filter(x => x.dt_txt.includes(dateRow))"
                                                :key="item.dt" class="tile is-child p-1" style="max-width:275px">
                                                <Forecast :item="item" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="footer" class="container is-fluid"></div>
        <div id="teleports-root"></div>
        <Login v-if="loginModalVisible" :needRegister="isRegister" @modal:ok="loginHandle"
            @modal:close="toggleLoginModal(), isRegister = false" />
        <History v-if="historyModalVisible" :items="histories" @modal:ok="clearHistory" @modal:close="historyModalVisible = false"/>
    </div>
</template>
<script setup lang="ts">
import Navbar from './components/navbar.vue';
import Search from './components/search.vue';
import Forecast from './components/forecast.vue';
import Login from './components/login.vue';
import History from './components/history.vue';
import { fetchBackend } from './_utils/api.backend'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faStar, faTimes, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import debounce from 'debounce';
//-------------------------------------------------------------------

const HttpStatus = {
    ok: "200"
};
//--------------------------------------------------------------------

const city: Ref<ForecastQueryResult['city'] | null> = ref(null);
const forecastList: Ref<ForecastQueryResult['list']> = ref([]);

const isRegister = ref(false);
const loginModalVisible = ref(false);
const historyModalVisible = ref(false);
const isFavouriteCity = ref(false);
const isLoading = ref(false);
const errorText = ref('');
const currentSearchValue = ref('');
const user: Ref<ProfileQueryResult | null> = ref(null);
const favourites: Ref<CityQueryResult[]> = ref([]);
const histories: Ref<HistoryQueryResult[]> = ref([]);

const countRows = computed(() => new Set(forecastList.value.map(x => (x.dt_txt.split(' ')[0]))));
const currentDate = computed(() => {
    const date = new Date();
    return `${date.getDate() < 10 ? '0' : ''}${date.getDate()}.${date.getMonth() < 9 ? '0' : ''}${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
});

const searchChange = debounce(async (searchValue: string) => {
    isLoading.value = true;
    const result: ForecastQueryResult | string = await fetchBackend(`city/${searchValue ?? 'london'}`);

    if (typeof result === 'string' || result.cod !== HttpStatus.ok) {
        isLoading.value = false;
        errorText.value = typeof result === 'string' ? result : 'Сервер вернул ошибку';
        return setTimeout(() => (errorText.value = ''), 10000);
    }
    forecastList.value = result.list;
    city.value = result.city;
    isFavouriteCity.value = result.city.favourite;
    currentSearchValue.value = searchValue;
    isLoading.value = false;
}, 1500);

const toggleFavourite = (name: string, currentState: boolean) => fetchBackend(`city/${currentState ? 'un' : ''}favourite`, { name }, 'POST');

const toggleFavouriteCurrentHandle = async () => {
    const result: CityQueryResult = await toggleFavourite(currentSearchValue.value, isFavouriteCity.value)
    if (result) isFavouriteCity.value = result.favourite;
};

const toggleLoginModal = () => {
    loginModalVisible.value = !loginModalVisible.value;
};

const loginHandle = async (authData: AuthData) => {
    const authResult: AuthQueryResult = await fetchBackend(`auth/${authData.isRegister ? 'signup' : 'login'}`, authData, 'POST');

    if (!('access_token' in authResult)) return;

    localStorage.setItem('accessToken', authResult.access_token);
    toggleLoginModal();

    const profileQueryResult: ProfileQueryResult = await fetchBackend(`auth/profile`);
    user.value = profileQueryResult;
};

onMounted(async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        const profileQueryResult: ProfileQueryResult = await fetchBackend(`auth/profile`);
        user.value = profileQueryResult;
    }
    const favoritesResult: CityQueryResult[] = await fetchBackend('city/favourites');
    if (favoritesResult) favourites.value = favoritesResult;
});

const logoutHandle = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    await fetchBackend(`auth/logout`);
    localStorage.removeItem('accessToken');
    user.value = null;
}

const showHistory = async() => {
    const result: HistoryQueryResult[] = await fetchBackend(`history/by-user`);
    if (result) histories.value = result;
    historyModalVisible.value = true;
}
const clearHistory = async() => {
    await fetchBackend(`history/by-user/clear`, null, 'DELETE');
    historyModalVisible.value = false;
}
//---------------------------------------------------------------------

export type ForecastQueryResult = {
    "cod": string; // "200",
    "message": number; // 0,
    "cnt": number; // 1,
    "list": {
        "dt": number; // 1696096800,
        "main": {
            "temp": number; // 18.44,
            "feels_like": number; // 18.04,
            "temp_min": number; // 16.69,
            "temp_max": number; // 18.44,
            "pressure": number; // 1022,
            "sea_level": number; // 1022,
            "grnd_level": number; // 1019,
            "humidity": number; // 65,
            "temp_kf": number; // 1.75
        },
        "weather": [
            {
                "id": number; // 802,
                "main": string; //  "Clouds",
                "description": string; //  "переменная облачность",
                "icon": string; //  "03n"
            }
        ],
        "clouds": {
            "all": number; // 50
        },
        "wind": {
            "speed": number; // 4.1,
            "deg": number; // 195,
            "gust": number; // 9.75
        },
        "visibility": number; // 10000,
        "pop": 0,
        "sys": {
            "pod": string; //  "n"
        },
        "dt_txt": string; //  "2023-09-30 18:00:00"
    }[],
    "city": {
        "id": number; // 2643743,
        "name": string; // "Лондон",
        "coord": {
            "lat": number; // 51.5085,
            "lon": number; // -0.1257
        },
        "country": string; // "GB",
        "population": number; // 1000000,
        "timezone": number; // 3600,
        "sunrise": number; // 1696053522,
        "sunset": number; // 1696095746
        "favourite": boolean; // true
        "_id": string; //"6518fe131a352f60e3087302",
    }
};

export type CityQueryResult = {
    "_id": string; //"6518fe131a352f60e3087302",
    "name": string; // "pavlodar",
    "favourite": boolean; // true,
}

export type AuthData = {
    isRegister: boolean; // true,
    login: string; //  "123",
    password: string; //  "321"
}

export type AuthQueryResult = {
    access_token: string; //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiam9obiIsImlhdCI6MTY5NjE3MTc4OSwiZXhwIjoxNjk2MTcxODQ5fQ.sJFZqfI-Ah_soqnfIGrRbIuGjuo6eiCClyRej7jJMtY"
}

export type ProfileQueryResult = {
    login: string; //"john",
};
export type HistoryQueryResult = {
    entity: string;
    value: string;
    owner: string;
};
</script>