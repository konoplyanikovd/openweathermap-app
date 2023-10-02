<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="https://bulma.io">
        <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28">
      </a>

      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start"></div>

      <div class="navbar-end">
        <div v-if="$attrs.user" class="navbar-item">
          <div class="buttons">
            <div class="button is-static">
              {{ $attrs.user.login }}
            </div>
            <a class="button is-primary ml-2" @click="$emit('logout')">
              <strong>Выйти</strong>
            </a>
          </div>
        </div>
        <div v-else class="navbar-item">
          <div class="buttons">
            <a class="button is-primary" @click="$emit('register')">
              <strong>Регистрация</strong>
            </a>
            <a class="button is-light" @click="$emit('login')">
              Авторизация
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>