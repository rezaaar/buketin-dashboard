<template>
  <div class="pt-10 px-5">
    <div class="container mx-auto">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-4xl font-bold">Products</h1>
          <p class="text-gray-400">List of products</p>
        </div>

        <div>
          <UButton icon="i-heroicons-pencil-square" color="primary" variant="solid" label="Create new product"
            @click="isModalCreateOpen = true" />

          <UModal v-model="isModalCreateOpen" prevent-close>
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                    New Product
                  </h3>
                  <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                    @click="isModalCreateOpen = false" />
                </div>
              </template>

              <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormGroup label="Product name" name="name">
                  <UInput v-model="state.name" />
                </UFormGroup>

                <UFormGroup label="Product description" name="description">
                  <UInput v-model="state.description" />
                </UFormGroup>

                <UFormGroup label="Product price" name="price">
                  <UInput v-model="state.price" modelValue="number">
                    <template #trailing>
                      <span class="text-gray-500 dark:text-gray-400 text-xs">IDR</span>
                    </template>
                  </UInput>
                </UFormGroup>

                <UFormGroup label="Product category" name="category">
                  <USelect v-model="state.category" :options="categories" option-attribute="name" value-attribute="_id">
                  </USelect>
                </UFormGroup>

                <UFormGroup label="Product occasion" name="occasion">
                  <div class="grid grid-cols-3 gap-2">
                    <!-- <input type="checkbox"> -->
                    <div class="relative flex items-start" v-for="occasion in occasions">
                      <div class="flex items-center h-5">
                        <input :id="occasion._id" type="checkbox" v-model="selectedOccasion"
                          class="form-checkbox h-4 w-4 dark:checked:bg-current dark:checked:border-transparent dark:indeterminate:bg-current dark:indeterminate:border-transparent disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0 focus:ring-transparent focus:ring-offset-transparent rounded bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 text-primary-500 dark:text-primary-400"
                          :value="occasion._id">
                      </div>
                      <div class="ms-3 flex flex-col">
                        <label :for="occasion._id" class="text-sm font-medium text-gray-700 dark:text-gray-200">{{
                          occasion.name }}</label>
                      </div>
                    </div>
                  </div>
                </UFormGroup>

                <UFormGroup label="Product image" name="image">
                  <!-- <UInput type="file" v-model="state.image" /> -->
                  <input type="file" @change="uploadFile" />
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
        <UTable :rows="products" :columns="columns">

          <template #category-data="{ row }">
            <div>
              {{ row.category ? row.category.name : row.category }}
            </div>
          </template>

          <template #occasion-data="{ row }">
            <div>
              {{ row.occasion.map(el => el.name).toString() }}
            </div>
          </template>

          <template #image-data="{ row }">
            <div>
              <img :src="`${config.public.API_BASE}/images/${row.image}`" alt="" class="w-20 h-20 object-cover rounded-md">
            </div>
          </template>

          <template #actions-data="{ row }">
            <div class="flex space-x-4">
              <UButton color="red" variant="ghost" icon="i-heroicons-trash" label="Delete" @click="deleteProduct(row._id)"/>
            </div>
          </template>
        </UTable>
      </div>
    </div>
  </div>
</template>

<script setup>
const products = ref([])
const categories = ref([])
const occasions = ref([])
const selectedOccasion = ref([])
const uploadedImage = ref(null)
const state = reactive({
  name: undefined,
  price: undefined,
  description: undefined,
  category: undefined,
})

const file = ref(null);
const isModalCreateOpen = ref(false)
const config = useRuntimeConfig()

const columns = [
  {
    key: 'name',
    label: 'Product Name'
  },
  {
    key: 'price',
    label: 'Price'
  },
  {
    key: 'category',
    label: 'Category'
  },
  {
    key: 'occasion',
    label: 'Occasion'
  },
  {
    key: 'image',
    label: 'Image'
  },
  {
    key: 'actions',
    label: 'Action'
  }
]

const { data: dataProduct, pending, error, refresh } = await useGetFetch('product', {
  onResponse({ request, response, options }) {
    products.value = response._data.productData
  }
})

const { data: dataCategory } = await useGetFetch('category', {
  onResponse({ response }) {
    categories.value = response._data.categoryData
  }
})

const { data: dataOccasion } = await useGetFetch('occasion', {
  onResponse({ response }) {
    // console.log(response._data);
    occasions.value = response._data.occasionData
  }
})


const uploadFile = (event) => {
  file.value = event.target.files[0];
  submitFile();
};

const submitFile = async () => {
  const formData = new FormData()
  formData.append("file", file.value)

  // console.log(formData.get(file));
  try {
    const uploadEndpoint = config.public.API_BASE + 'upload/one';
    // const response = await axios.post(endpoint, data);

    const { data: dataImage } = await useFetch(uploadEndpoint, {
      method: 'POST',
      body: formData,

      onResponse({ response }) {
        uploadedImage.value = response._data.filename
        console.log(uploadedImage.value);
      }
    })
  } catch (error) {
    console.error(error);
  }
};


const validate = (state) => {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: 'Required' })
  if (!state.price) errors.push({ path: 'price', message: 'Required' })
  if (!state.description) errors.push({ path: 'description', message: 'Required' })
  if (!state.category) errors.push({ path: 'category', message: 'Required' })
  if (!selectedOccasion.value) errors.push({ path: 'occasion', message: 'Required' })
  if (!uploadedImage.value) errors.push({ path: 'image', message: 'Required' })
  return errors
}

async function onSubmit(event) {
  // Do something with data
  const { data: dataProduct } = useFetch('product', {
    baseURL: config.public.API_BASE,
    method: 'POST',
    body: {
      name: state.name,
      price: parseInt(state.price, 10),
      description: state.description,
      category: state.category,
      occasion: selectedOccasion.value,
      image: uploadedImage.value
    }
  });
}

const deleteProduct = (id) => {
  useFetch(`product/${id}`, {
    baseURL: config.public.API_BASE,
    method: 'DELETE',
  })
}



</script>

<style></style>