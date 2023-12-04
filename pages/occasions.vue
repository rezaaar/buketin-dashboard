<template>
  <div class="pt-10 px-5">
    <div class="container mx-auto">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-4xl font-bold">Occasion</h1>
          <p class="text-gray-400">List of occasion</p>
        </div>

        <div>
          <UButton icon="i-heroicons-pencil-square" color="primary" variant="solid" label="Create new category"
            @click="isModalCreateOpen = true" />

          <UModal v-model="isModalCreateOpen" prevent-close>
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                    New Category
                  </h3>
                  <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                    @click="isModalCreateOpen = false" />
                </div>
              </template>

              <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormGroup label="Email" name="email">
                  <UInput v-model="state.email" />
                </UFormGroup>

                <UFormGroup label="Password" name="password">
                  <UInput v-model="state.password" type="password" />
                </UFormGroup>

                <UButton type="submit">
                  Submit
                </UButton>
              </UForm>

            </UCard>
          </UModal>
        </div>
      </div>


      <div class="mt-4">
        <UTable :rows="occasion" :columns="columns">
          <template #actions-data="{ row }">
            <div class="flex space-x-4">
              <UButton color="red" variant="ghost" icon="i-heroicons-trash" label="Delete" />
              <UButton color="sky" variant="ghost" icon="i-heroicons-adjustments-vertical" label="Update" />
            </div>
          </template>
        </UTable>
      </div>
    </div>
  </div>
</template>

<script setup>
const state = reactive({
  email: undefined,
  password: undefined
})
const isModalCreateOpen = ref(false)
const occasion = ref([])
const columns = [
  {
    key: 'name',
    label: 'Category Name',
    class: 'w-full'
  },
  {
    key: 'actions',
    label: 'Action'
  }
]

const { data: dataOccasion, pending, error, refresh } = await useGetFetch('occasion', {})

const validate = (state) => {
  const errors = []
  if (!state.email) errors.push({ path: 'email', message: 'Required' })
  if (!state.password) errors.push({ path: 'password', message: 'Required' })
  return errors
}

async function onSubmit(event) {
  // Do something with data
  // console.log(event.data)
}

occasion.value = dataOccasion.value.occasionData


</script>

<style></style>