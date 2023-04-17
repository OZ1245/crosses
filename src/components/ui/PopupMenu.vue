<template>
  <ul
    v-show="props.modelValue" 
    ref="$root"
    class="popup-menu"
  >
    <li
      v-for="(item, i) in props.menuList"
      :key="`popup-menu-item-${i}`" 
      class="popup-menu__item"
      @click="onClick(i)"
    >
      {{ item.title }}
    </li>
  </ul>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const $root = ref(null)

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
    default: false
  },
  menuList: {
    type: Array,
    required: true,
    default: () => ([])
  },
  coords: {
    type: Object,
    required: true,
    default: () => ({
      x: 0,
      y: 0,
    })
  }
})

let x = ref(0) 
let y = ref(0) 
let transitionX = ref(0)
let transitionY = ref(0)
// FIXME: Doesn't work:
// const x = computed(() => `${props.coords.x}px`).value
// const y = computed(() => `${props.coords.y}px`).value
watch(() => props.coords, () => {
  x.value = `${props.coords.x}px`
  y.value = `${props.coords.y}px`

  transitionX.value = $_popupMenu_correctXCoord(props.coords.x) ? '-100%' : '12px'
  transitionY.value = $_popupMenu_correctYCoord(props.coords.y) ? '-100%' : '12px'
})

const emits = defineEmits(['close', 'update:modelValue'])

const onClick = (i) => {
  props.menuList[i].handler()

  emits('close')
  emits('update:modelValue', !props.modelValue)
}

const $_popupMenu_correctXCoord = (x) => {
  const windowWidth = ref(window.innerWidth)
  const destinationXtoRight = windowWidth.value - x
  const popupWidth = $root.value.clientWidth

  if (destinationXtoRight < popupWidth) {
    return true 
  }

  return false
}
const $_popupMenu_correctYCoord = (y) => {
  const windowHeight = ref(window.innerHeight)
  const destinationYtoBottom = windowHeight.value - y
  const popupHeight = $root.value.clientHeight
  
  if (destinationYtoBottom < popupHeight) {
    return true
  }

  return false
}
</script>

<style lang="scss" scoped>
.popup-menu {
  display: block;
  width: auto;
  margin: 0;
  padding: 12px;
  list-style: none;

  background-color: var(--white);
  border: 2px solid var(--green);
  border-radius: 4px;
  box-shadow: 0px 0px 8px 0px rgba(var(--gray-rgb), 0.2);

  position: absolute;
  left: v-bind('x');
  top: v-bind('y');
  z-index: 1;
  transform: translate(v-bind('transitionX'), v-bind('transitionY'));
}

.popup-menu__item {
  cursor: pointer;

  font-size: 16px;
  text-align: left;
  color: var(--green);
  
  &:not(:last-child) {
    margin-bottom: 6px;
  }
  
  &:hover {
    color: var(--green-light);
  }
}
</style>