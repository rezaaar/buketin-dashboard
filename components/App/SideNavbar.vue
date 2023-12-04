<template>
  <div>
    <UVerticalNavigation :links="links">
      <template #default="{ link }" class="mb-2">
        <span class="group-hover:text-primary py-2 relative">{{ link.label }}</span>
      </template>  
    </UVerticalNavigation>
  </div>
</template>

<script lang="ts" setup>
const links = [{
  label: 'Dashboard',
  icon: 'i-heroicons-home',
  to: '/'
}, {
  label: 'Products',
  icon: 'i-heroicons-chart-bar',
  to: '/products'
}, {
  label: 'Categories',
  icon: 'i-heroicons-command-line',
  to: '/categories'
}, {
  label: 'Occasions',
  icon: 'i-heroicons-command-line',
  to: '/occasions'
}]
</script>

<style></style>