<template>
  <div class="p-4">
    <Card>
      <h2>Beauty Product Inventory</h2>
      <Form :model="form" :rules="rules" ref="formRef" label-width="100">
        <FormItem label="Image URL" prop="image_url">
          <Input v-model="form.image_url" placeholder="Enter image URL" />
        </FormItem>
        <FormItem label="Product" prop="title">
          <Input v-model="form.title" placeholder="Product" />
        </FormItem>
        <FormItem label="Brand" prop="brand">
          <Input v-model="form.brand" placeholder="Brand" />
        </FormItem>
        <FormItem label="Category" prop="category">
          <Select v-model="form.category" placeholder="Select Category">
            <Option v-for="c in categories" :key="c" :value="c">{{ c }}</Option>
          </Select>
        </FormItem>
        <FormItem label="Price (₱)" prop="price">
          <Input v-model.number="form.price" type="number" placeholder="0.00" />
        </FormItem>
        <FormItem label="Stock" prop="quantity">
          <Input v-model.number="form.quantity" type="number" placeholder="0" />
        </FormItem>
        <FormItem label="Expiry Date" prop="expiry">
          <DatePicker
            v-model="form.expiry"
            type="date"
            placeholder="Select expiry date"
            style="width: 100%;"
          />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit">{{ form.id ? 'Update' : 'Add' }}</Button>
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
        image_url: '',
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
        {
          title: 'Image',
          key: 'image_url',
          render: (h, { row }) =>
            h('img', {
              attrs: { src: row.image_url, alt: row.title },
              class: 'thumb',
            }),
        },
        { title: 'Title', key: 'title' },
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
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return
        this.saveProduct()
      })
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
      const { _index, _rowKey, ...cleaned } = product
      this.form = { ...cleaned }
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
        image_url: '',
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
