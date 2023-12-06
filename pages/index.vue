<template>
    <div class="pt-10 px-5">
        <div class="container mx-auto">
            <h1 class="text-4xl font-bold">Home</h1>
            <p class="text-gray-400 mb-10">Welcome to the home page!</p>

            <h2 class="text-2xl font-bold capitalize mb-5">Buketin Statistic</h2>
            <div class="flex space-x-4">
                <div class="border border-primary-800 rounded-xl px-5 py-5 w-2/6 text-center">
                    <h2 class="text-6xl font-bold"> {{ transaction.length }}
                    </h2>
                    <p class="text-gray-400 capitalize">Total Transaction</p>
                </div>

                <div class="border border-primary-800 rounded-xl py-5 w-4/6">
                    <div class="grid grid-cols-5 items-center divide-x divide-primary-800">
                        <div class="text-center" v-for="item in statistic.statisticData">
                            <h2 class="text-6xl font-bold">{{ item.count }}</h2>
                            <p class="text-gray-400 capitalize">{{ item._id }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <h2 class="text-2xl font-bold capitalize mb-5 mt-10">Buketin Transaction</h2>
            <UTable :rows="transaction" :columns="columns">
                <template #item-data="{ row }">
                    <div>
                        {{ row.item ? row.item.name : row.item }}
                    </div>
                </template>

                <template #greeting_card_id-data="{ row }">
                    <div>
                        {{ row._id }}
                    </div>
                </template>

                <template #actions-data="{ row }">
                    <div class="flex space-x-4">
                        <UButton color="sky" variant="ghost" icon="i-heroicons-chart-bar" label="Update Status"
                            @click="(selectedStatus = row.status, isModalUpdateStatusOpen = true, selectedRow = row._id)" />
                    </div>
                </template>
            </UTable>

            <UModal v-model="isModalUpdateStatusOpen">
                <div class="p-4 h-56 space-y-10">
                    <h2 class="text-2xl font-bold capitalize mb-5">Update Status</h2>
                    <USelect v-model="selectedStatus" :options="statusOptions" placeholder="Update Status" />

                    <UButton class="w-full block" @click="changeStatus(selectedRow)">Update status</UButton>
                </div>
            </UModal>
        </div>
    </div>
</template>

<script setup>
const config = useRuntimeConfig()
const statistic = ref([])
const transaction = ref()
const isModalUpdateStatusOpen = ref(false)

const statusOptions = ['belum dibayar', 'proses card', 'proses gift', 'selesai']
const selectedStatus = ref(statusOptions[0])
const selectedRow = ref("")

const columns = [
    {
        key: '_id',
        label: 'Transaction ID'
    },
    {
        key: 'item',
        label: 'Item'
    },
    {
        key: 'greeting_card_id',
        label: 'Greeting Card ID'
    },
    {
        key: 'total_price',
        label: 'Total Price'
    },
    {
        key: 'buyer_name',
        label: 'Buyer Name'
    },
    {
        key: 'buyer_wa',
        label: 'Buyer WhatsApp'
    },
    {
        key: 'buyer_address',
        label: 'Buyer Address'
    },
    {
        key: 'status',
        label: 'Status'
    },
    {
        key: 'receiver_name',
        label: 'Receiver Name'
    },
    {
        key: 'receiver_wa',
        label: 'Receiver WhatsApp'
    },
    {
        key: 'receiver_address',
        label: 'Receiver Address'
    },
    {
        key: 'actions',
        label: 'Action'
    }
]

const getStatistic = async () => {
    await useFetch('transaction/statistic', {
        baseURL: config.public.API_BASE,
        onResponse({response}) {
            statistic.value = response._data
        }
    })
}
const getTransaction = async () => {
    await useFetch('transaction', {
        baseURL: config.public.API_BASE,
        onResponse({ response }) {
            transaction.value = response._data.transactionData
        }
    })
}

async function changeStatus(id) {
    isModalUpdateStatusOpen.value = true

    await useFetch(`transaction/${id}`, {
        baseURL: config.public.API_BASE,
        method: "PUT",
        query: {
            "status": selectedStatus.value
        },
        onResponse({ request, response, options }) {
            isModalUpdateStatusOpen.value = false
            selectedRow.value = ""
        }
    })

    await getTransaction()
    await getStatistic()
}

await getTransaction()
await getStatistic()

</script>