<template>
  <div class="p-4">
    <Card>
      <h2>Beauty Product Inventory</h2>
      <Form :model="form" :rules="rules" ref="formRef" label-width="100">
        
        <FormItem label="Product">
          <Input v-model="form.title"/>
        </FormItem>
        <FormItem label="Brand">
          <Input v-model="form.brand"/>
        </FormItem>
        <FormItem label="Category">
          <Select v-model="form.category">
            <Option v-for="c in categories" :key="c" :value="c">{{ c }}</Option>
          </Select>
        </FormItem>
        <FormItem label="Price (₱)">
          <Input v-model.number="form.price" type="number"  />
        </FormItem>
        <FormItem label="Stock">
          <Input v-model.number="form.quantity" type="number" />
        </FormItem>
        <FormItem label="Expiry Date">
          <DatePicker
            v-model="form.expiry"
            type="date"
            style="width: 100%;"
          />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="saveProduct">{{ form.id ? 'Update' : 'Add' }}</Button>
          <Button @click="resetForm" style="margin-left: 8px;">Reset</Button>
        </FormItem>
      </Form>
    </Card>

    <Divider />

    <Table :columns="columns" :data="products" border>
      <template #action="{ row }">
        <Button size="small" type="info" @click="editProduct(row)">Edit</Button>
        <Button size="small" type="error" @click="deleteProduct(row.id)" style="margin-left: 8px;">Delete</Button>
      </template>
    </Table>
  </div>
</template>

<script>
import { supabase } from '@/lib/supabase'

export default {
  name: 'ProductInventory',
  data() {
    return {
      form: {
        id: null,
        title: '',
        brand: '',
        category: '',
        price: null,
        quantity: null,
        expiry: null,
      },
      rules: {
        title: [{ required: true, message: 'Title is required', trigger: 'blur' }],
        brand: [{ required: true, message: 'Brand is required', trigger: 'blur' }],
        price: [{ required: true, type: 'number', message: 'Price is required', trigger: 'blur' }],
        quantity: [{ required: true, type: 'number', message: 'Stock is required', trigger: 'blur' }],
        category: [{ required: true, message: 'Category is required', trigger: 'change' }],
      },
      products: [],
      categories: ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Nails'],
      columns: [

        { title: 'Product', key: 'title' },
        { title: 'Brand', key: 'brand' },
        { title: 'Category', key: 'category' },
        { title: 'Price', key: 'price' },
        { title: 'Stock', key: 'quantity' },
        {
          title: 'Expiry',
          key: 'expiry',
          render: (h, { row }) => h('span', row.expiry ? new Date(row.expiry).toLocaleDateString() : '—'),
        },
        { title: 'Action', slot: 'action', width: 180, align: 'center' },
      ],
    }
  },
  mounted() {
    this.fetchProducts()
  },
  methods: {
    async fetchProducts() {
      const { data, error } = await supabase.from('products').select('*')

      if (!error) this.products = data
      else this.$Message.error('Failed to fetch products')
    },

    async saveProduct() {
      if (this.form.id) {
        const { error } = await supabase
          .from('products')
          .update(this.form)
          .eq('id', this.form.id)
        if (!error) {
          this.$Message.success('Product updated successfully')
          this.fetchProducts()
          this.resetForm()
        } else {
          this.$Message.error('Failed to update product')
        }
      } else {
        const form = { ...this.form }
        delete form.id
        const { error } = await supabase.from('products').insert([form])

        if (!error) {
          this.$Message.success('Product added successfully')
          this.fetchProducts()
          this.resetForm()
        } else {
          this.$Message.error('Failed to add product')
        }
      }
    },
    editProduct(product) {
      console.log(product)
     
      this.form = { ...product}
      delete this.form._index
      delete this.form._rowKey
    },
    async deleteProduct(id) {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (!error) {
        this.$Message.success('Product deleted successfully')
        this.fetchProducts()
      } else {
        this.$Message.error('Failed to delete product')
      }
    },
    resetForm() {
      this.form = {
        id: null,
        title: '',
        brand: '',
        category: '',
        price: null,
        quantity: null,
        expiry: null,
      }
    },
  },
}
</script>

<style scoped>
h2 {
  margin-bottom: 20px;
}
.thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}
</style>
