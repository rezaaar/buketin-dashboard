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
                    New Occasion
                  </h3>
                  <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                    @click="isModalCreateOpen = false" />
                </div>
              </template>

              <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormGroup label="Occasion name" name="name">
                  <UInput v-model="state.name" />
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
              <UButton color="red" variant="ghost" icon="i-heroicons-trash" label="Delete"
                @click="deleteCategory(row._id)" />
            </div>
          </template>
        </UTable>
      </div>
    </div>
  </div>
</template>

<script setup>
const state = reactive({
  name: undefined,
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
const config = useRuntimeConfig()
const { data: dataOccasion, pending, error, refresh } = await useGetFetch('occasion', {
  onResponse({ request, response, options }) {
    occasion.value = response._data.occasionData
  }
})

const validate = (state) => {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: 'Required' })
  return errors
}

async function onSubmit(event) {
  // Do something with data
  // console.log(event.data)
  const { data, pending, error, refresh } = await useFetch('occasion', {
    baseURL: config.public.API_BASE,
    method: 'POST',
    body: {
      name: state.name
    },
    onResponse({ request, response, options }) {
      occasion.value.push(response._data.newOccasion)
      isModalCreateOpen.value = false
      state = {
        name: undefined,
      }
    }
  })
}

async function deleteCategory(id) {
  const { data, pending, error, refresh } = await useFetch(`occasion/${id}`, {
    baseURL: config.public.API_BASE,
    method: 'DELETE',
    onResponse({ request, response, options }) {
      const deletedIndex = occasion.value.findIndex((el) => {
        return el._id == response._data.deletedOccasion._id
      })
      occasion.value.splice(deletedIndex, 1)
    }
  })
}



</script>

<style></style>