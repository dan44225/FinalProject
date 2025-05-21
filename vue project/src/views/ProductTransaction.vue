<template>
  <div class="transaction-wrapper">
    <Card title="Beauty Product Sale Transaction" class="transaction-form">
      <Form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <FormItem>
          <Input
            v-model="search"
            placeholder="Search product..."
            @input="filterProducts"
          />
          <Table
            :columns="productColumns"
            :data="filteredProducts"
            @on-row-click="selectProduct"
            size="small"
            border
            height="200"
            :row-class-name="rowClassName"
          />
        </FormItem>

        <FormItem label="Product Name" prop="product_id">
          <div v-if="form.product_id">
            <div class="selected-product">
              <img
                :src="selectedProduct.image_url"
                alt="product image"
                class="product-image"
              />
              <div class="product-info">
                <p>{{ selectedProduct.title }}</p>
                <p>Available Quantity: {{ selectedProduct.quantity }}</p>
              </div>
            </div>
          </div>
        </FormItem>

        <FormItem label="Customer Name" prop="customer_name">
          <Input
            v-model="form.customer_name"
            placeholder="Enter customer name"
          />
        </FormItem>

        <FormItem label="Note" prop="note">
          <Input
            v-model="form.note"
            type="textarea"
            placeholder="Optional note"
          />
        </FormItem>

        <FormItem label="Quantity" prop="quantity">
          <InputNumber
            v-model="form.quantity"
            :min="1"
            :max="selectedProduct.quantity"
            :disabled="!form.product_id"
          />
        </FormItem>

        <FormItem label="Price">
          <span>₱ {{ form.price.toFixed(2) }}</span>
        </FormItem>

        <FormItem label="Total">
          <b>₱ {{ (form.price * form.quantity).toFixed(2) }}</b>
        </FormItem>

        <FormItem>
          <Button type="primary" @click="submit">Submit</Button>
        </FormItem>
      </Form>
    </Card>

    <Card title="Transaction History" class="transaction-list">
      <Table :columns="transactionColumns" :data="transactions" border />
    </Card>
  </div>
</template>

<script>
import { supabase } from '@/lib/supabase'

export default {
  name: 'ProductTransaction',
  data() {
    return {
      form: {
        product_id: null,
        customer_name: '',
        note: '',
        quantity: 1,
        price: 0,
      },
      rules: {
        product_id: [
          { required: true, message: 'Please select a product', trigger: 'change' }
        ],
        customer_ame: [
          { required: true, message: 'Customer name is required', trigger: 'blur' }
        ],
        quantity: [
          { required: true, type: 'number', min: 1, message: 'Minimum quantity is 1', trigger: 'change' },
          {
            validator(rule, value, callback) {
              if (value > this.selectedProduct.quantity) {
                callback(new Error('Quantity exceeds available quantity'))
              } else {
                callback()
              }
            },
            trigger: 'change',
          },
        ],
      },
      products: [],
      filteredProducts: [],
      selectedProduct: {},
      search: '',
      transactions: [],
      productColumns: [
        {
          title: 'Image',
          key: 'image_url',
          render: (h, { row }) =>
            h('img', {
              attrs: { src: row.image_url, alt: row.title },
              class: 'product-thumb',
            }),
        },
        { title: 'Name', key: 'title' },
        { title: 'Price', key: 'price' },
        { title: 'Available Quantity', key: 'quantity' },
      ],
      transactionColumns: [
        { title: 'Customer', key: 'customer_name' },
        { title: 'Product', key: 'title' },
        { title: 'Note', key: 'note' },
        { title: 'Quantity', key: 'quantity' },
        { title: 'Price', key: 'price' },
        {
          title: 'Total',
          render: (h, { row }) => h('span', `₱ ${row.quantity * row.price}`),
        },
      ],
    }
  },
  methods: {
    async fetchProducts() {
      const { data, error } = await supabase.from('products').select('*').gte('quantity', 1)
      if (!error) {
        this.products = data
        this.filteredProducts = data
      } else {
        this.$Message.error('Failed to fetch products')
      }
    },
    async fetchTransactions() {
      const { data, error } = await supabase
        .from('transactions')
        .select(
          `*, products:product_id (title, image_url)`
        )
        .order('id', { ascending: false })
        .limit(20)

      if (!error) {
        this.transactions = data.map(txn => ({
          ...txn,
          title: txn.products?.title || '',
          image_url: txn.products?.image_url || '',
          customer_name: txn.customer_name,
          quantity: txn.quantity,
          price: txn.price,
          note: txn.note,
        }))
      } else {
        this.$Message.error('Failed to fetch transactions')
      }
    },
    filterProducts() {
      const keyword = this.search.toLowerCase()
      this.filteredProducts = this.products.filter(product =>
        product.title.toLowerCase().includes(keyword)
      )
    },
    selectProduct(row) {
      if (row.quantity <= 0) {
        this.$Message.warning('This product is out of stock')
        return
      }
      this.form.product_id = row.id
      this.form.price = row.price
      this.form.quantity = 1
      this.selectedProduct = row
    },
    rowClassName(row) {
      return row.quantity <= 0 ? 'row-disabled' : ''
    },
    async submit() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        if (this.form.quantity > this.selectedProduct.quantity) {
          this.$Message.error('Not enough stock for this product')
          return
        }

        const { error: insertError } = await supabase.from('transactions').insert([
          {
            product_id: this.form.product_id,
            customer_name: this.form.customer_name,
            note: this.form.note,
            quantity: this.form.quantity,
            price: this.form.price,
          },
        ])

        if (insertError) {
          this.$Message.error('Failed to save transaction')
          return
        }

        const newQty = this.selectedProduct.quantity - this.form.quantity
        const { error: updateError } = await supabase
          .from('products')
          .update({ quantity: newQty })
          .eq('id', this.form.product_id)

        if (updateError) {
          this.$Message.error('Saved transaction, but failed to update product quantity')
        }

        this.$Message.success('Transaction completed!')
        this.resetForm()
        this.fetchProducts()
        this.fetchTransactions()
      })
    },
    resetForm() {
      this.form = {
        product_id: null,
        customer_name: '',
        note: '',
        quantity: 1,
        price: 0,
      }
      this.selectedProduct = {}
      this.search = ''
    },
  },
  mounted() {
    this.fetchProducts()
    this.fetchTransactions()
  },
}
</script>

<style scoped>
.transaction-wrapper {
  max-width: 900px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.transaction-form {
  padding: 20px;
}

.row-disabled {
  background-color: #f5f5f5;
  color: #aaa;
  pointer-events: none;
}

.selected-product {
  display: flex;
  align-items: center;
  gap: 12px;
}
.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.product-thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 3px;
}
</style>
