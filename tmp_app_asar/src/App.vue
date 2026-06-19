<template>
  <div class="app-layout">
    <Sidebar />
    <div class="main">
      <Navbar />
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'
</script>

<style>
.app-layout { display: flex; min-height: 100vh; }
.main { flex: 1; display: flex; flex-direction: column; }
.content { padding: 20px; background: #f8fafc; flex: 1 }

/* make router-view content scrollable without moving sidebar */
body, #app { height: 100%; margin: 0 }
</style>
