<template>
  <v-card>
    <v-table>
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key" :class="col.class">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row[rowKey]">
          <td v-for="col in columns" :key="col.key">
            <slot :name="col.key" :row="row">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
        <tr v-if="rows.length === 0">
          <td :colspan="columns.length" class="text-center text-gray-400 py-8">
            <slot name="empty">No data found</slot>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true,
    // [{ key: 'title', label: 'Title', class: 'optional-class' }]
  },
  rows:   { type: Array, default: () => [] },
  rowKey: { type: String, default: 'id' },
})
</script>
