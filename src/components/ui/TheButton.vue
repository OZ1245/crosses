<template>
  <button 
    :type="props.type"
    class="button"
    :class="[
      `button--${props.size}`,
      { 'button--outline': props.outline },
      { 'button--primary': props.primary },
    ]"

    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  // button, submit
  type: {
    type: String,
    required: false,
    default: 'button'
  },
  // sm, md, lg, xl
  size: {
    type: String,
    required: false,
    default: 'md'
  },
  // Тип кнопки по-умолчанию
  primary: {
    type: Boolean,
    required: false,
    default: true
  },
  outline: {
    type: Boolean,
    required: false,
    default: false,
  }
})
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 8px;

  border-width: 2px;
  border-style: solid;
  border-color: transparent;
  background-color: var(--white);

  transition: border-color .3s, background-color .3s, color .3s;

  &:hover {
    transition: border-color .15s, background-color .15s, color .15s;
    cursor: pointer;
  }

  &--md {
    font-size: 16px;
    border-radius: 3px;
  }

  &--primary {
    border-color: var(--green-light);
    background-color: var(--green-light);
    color: var(--white);
  }
  &--outline {
    border-color: var(--green);
    background-color: var(--white);
    color: var(--green);

    &:hover {
      border-color: var(--green-light);
      background-color: var(--green-light);
      color: var(--white);

      box-shadow: 0px 0px 8px 0px rgba(var(--gray), 0.2); // FIXME:
    }
  }
}
</style>
