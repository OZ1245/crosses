<template>
  <button 
    :type="props.type"
    class="button"
    :class="[
      `button--${props.size}`,
      { 'button--outline': props.outline },
      { 'button--primary': props.primary },
      { 'button--toggler': props.toggler },
      { 'button--boolean': props.toggleType },
      { 'button--on': props.toggleType && props.toggleValue },
      { 'button--off': props.toggleType && !props.toggleValue },
    ]"

    @click="onClick()"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  // Любой тип. Используется, если установлено toggler: true
  // modelValue: {
  //   required: false,
  // },
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
    default: true,
  },
  outline: {
    type: Boolean,
    required: false,
    default: false,
  },
  toggler: {
    type: Boolean,
    required: false,
    default: false,
  },
  toggleType: {
    type: String, // boolean, string
    required: false,
    default: 'boolean',
  },
  toggleValue: {
    required: false,
  }
})

const $emit = defineEmits(['click'])

const onClick = () => {
  $emit('click')
}
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

  &,
  &::after {
    transition: border-color .3s, background-color .3s, color .3s;
  }

  &:hover,
  &:hover::after {
    transition: border-color .15s, background-color .15s, color .15s;
    cursor: pointer;
  }

  // Sizes
  &--md {
    font-size: 16px;
    border-radius: 6px;
  }

  // Toggler settings
  &--boolean::after {
    content: '';

    display: inline-flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 30px;
    height: 12px;
    margin-left: 6px;

    border-width: 1px;
    border-style: solid;
    border-radius: 4px;

    font-size: 10px;
    line-height: 8px;
  }
  &--on::after {
    content: 'вкл';
  }
  &--off::after {
    content: 'выкл';
  }

  // Types
  // PRIMARY
  &--primary {
    border-color: var(--green-light);
    background-color: var(--green-light);
    color: var(--white);

    &.button--on::after {
      border-color: var(--white);
      background-color: var(--white);
    }
    &.button--off::after {
      border-color: var(--white);
      background-color: var(--green-light);
    }

    // OUTLINE
    &.button--outline {
      border-color: var(--green);
      background-color: var(--white);
      color: var(--green);

      &.button--on::after {
        border-color: var(--green);
        background-color: var(--green);
        color: var(--white);
      }
      &.button--off::after {
        border-color: var(--green);
        background-color: var(--white);
        color: var(--gray);
      }

      &:hover {
        border-color: var(--green-light);
        background-color: var(--green-light);
        color: var(--white);
        
        // box-shadow: 0px 0px 8px 0px rgba(var(--gray), 0.2); // FIXME:
        box-shadow: 0px 0px 8px 0px rgba(var(--gray-rgb), 0.2);

        &.button--on::after {
          border-color: var(--white);
          background-color: var(--white);
          color: var(--green-light);
        }
        &.button--off::after {
          border-color: var(--white);
          background-color: var(--white);
          color: var(--gray);
        }
      }
    }
  }
}
</style>
