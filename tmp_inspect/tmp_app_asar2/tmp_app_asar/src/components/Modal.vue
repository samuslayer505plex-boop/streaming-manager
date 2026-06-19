<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal">
      <header>
        <slot name="header"></slot>
      </header>
      <section>
        <slot></slot>
      </section>
      <footer>
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  emits: ['close'],
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.4);
}

.modal {
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  padding: 20px;
}
</style>
