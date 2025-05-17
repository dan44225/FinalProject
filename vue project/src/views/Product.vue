<template>
  <div class="p-4">
    <Card>
      <h2>Product Inventory</h2>
      <Form :model="form" :label-width="100">
        
        <FormItem label="Product ID">
          <Input v-model="form.id" />
        </FormItem>
        <FormItem label="Product Name">
          <Input v-model="form.title" />
        </FormItem>
        <FormItem label="Category">
          <Select v-model="form.category" placeholder="Select Category">
            <Option v-for="g in categorys" :key="g" :value="g">{{ g }}</Option>
          </Select>
        </FormItem>
        <FormItem label="Brand">
          <Input v-model="form.author" />
        </FormItem>
        <FormItem label="Selling Price">
          <Input v-model="form.price" type="number" />
        </FormItem>
        <FormItem label="Stock">
          <Input v-model="form.quantity" type="number" />
        </FormItem>
        <FormItem label="Expiry Date">
          <DatePicker v-model="form.expiry" type="date" placeholder="Select expiry date" style="width: 100%;" />
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
        author: '',
        category: '',
        price: null,
        quantity: null,
        expiry: null
      },
      products: [],
      categorys: ['Skincare','Haircare','Makeup','Fragrance','Bath & Body','Nail Care','Beauty Tools','Oral Care',],
      columns: [
        { title: 'Product ID', key: 'id' },
        { title: 'Product Name', key: 'title' },
        { title: 'Category', key: 'category' },
        { title: 'Brand', key: 'author' },
        { title: 'Selling Price', key: 'price' },
        { title: 'Stock', key: 'quantity' },
        { title: 'Expiry Date', key: 'expiry' },
        {
          title: 'Action',
          slot: 'action',
          width: 180,
          align: 'center'
        }
      ]
    }
  },
  mounted() {
    this.fetchProducts()
  },
  methods: {
    async fetchProducts() {
      const { data, error } = await supabase.from('product').select('*')
      if (!error) this.products = data
    },
    async saveProduct() {
      if (this.form.id) {
        const { error } = await supabase.from('product').update(this.form).eq('id', this.form.id)
        if (!error) {
          this.$Message.success('Product updated successfully')
          this.fetchProducts()
          this.resetForm()
        }
      } else {
        const form = { ...this.form }
        delete form.id
        const { error } = await supabase.from('product').insert([form])
        if (!error) {
          this.$Message.success('Product added successfully')
          this.fetchProducts()
          this.resetForm()
        }
      }
    },
    editProduct(product) {
      this.form = { ...product }
      delete this.form._index
      delete this.form._rowKey
    },
    async deleteProduct(id) {
      const { error } = await supabase.from('product').delete().eq('id', id)
      if (!error) {
        this.$Message.success('Product deleted successfully')
        this.fetchProducts()
      }
    },
    resetForm() {
      this.form = {
        id: null,
        title: '',
        author: '',
        category: '',
        price: null,
        quantity: null,
        expiry: null
      }
    }
  }
}
</script>

<style scoped>
h2 {
  margin-bottom: 20px;
}
</style>
