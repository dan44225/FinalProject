<template>
  <div class="inventory-crud">
    <Card shadow>
      <template #title>
        Beauty Inventory Management
        <Button type="primary" size="small" icon="md-add" @click="openForm">Add Product</Button>
      </template>

      <Table :columns="columns" :data="inventory" stripe border />

      <Modal
        v-model="modalVisible"
        :title="isEditing ? 'Edit Product' : 'Add Product'"
        @on-ok="submitForm"
        :loading="formSubmitting"
        ok-text="Save"
      >
        <Form ref="formRef" :model="formData" :rules="rules" label-position="top">
          <FormItem label="Image URL" prop="image_url">
            <Input v-model="formData.image_url" placeholder="Enter image URL" />
          </FormItem>
          <FormItem label="Title" prop="title">
            <Input v-model="formData.title" placeholder="Product title" />
          </FormItem>
          <FormItem label="Brand" prop="brand">
            <Input v-model="formData.brand" placeholder="Brand" />
          </FormItem>
          <FormItem label="Category" prop="category">
            <Input v-model="formData.category" placeholder="Category" />
          </FormItem>
          <FormItem label="Quantity" prop="quantity">
            <InputNumber v-model="formData.quantity" :min="0" style="width: 100%" />
          </FormItem>
        </Form>
      </Modal>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'ProductInventoryCrud',
  data() {
    return {
      inventory: [],
      modalVisible: false,
      isEditing: false,
      editingIndex: null,
      formSubmitting: false,
      formData: {
    image_url: '',
    title: '',
    category: '',
    quantity: 0,
    },
    rules: {
    image_url: [{ required: true, message: 'Image URL is required', trigger: 'blur' }],
    title: [{ required: true, message: 'Title is required', trigger: 'blur' }],
    quantity: [{ type: 'number', required: true, message: 'Quantity required', trigger: 'change' }],
    },

      columns: [
        {
          title: 'Image', key: 'image_url', render: (h, { row }) =>
            h('img', { attrs: { src: row.image_url, alt: row.title }, class: 'thumb' })
        },
        { title: 'Product Name', key: 'title' },
        { title: 'Brand',   key: 'brand' },
        { title: 'Quantity', key: 'quantity' },
        {
          title: 'Actions', key: 'actions', render: (h, { index }) =>
            h('div', [
              h('Button', {
                props: { size: 'small', type: 'primary' },
                style: { marginRight: '8px' },
                on: { click: () => this.openForm(this.inventory[index], index) }
              }, 'Edit'),
              h('Button', {
                props: { size: 'small', type: 'error' },
                on: { click: () => this.deleteItem(index) }
              }, 'Delete')
            ])
        }
      ],
    }
  },
  methods: {
    openForm(item = null, index = null) {
      this.isEditing = !!item;
      this.editingIndex = index;
      this.modalVisible = true;
      this.formData = item ? { ...item } : { image_url: '', title: '', category: '', quantity: 0 };
    },
    submitForm() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.formSubmitting = true;
          setTimeout(() => {
            if (this.isEditing && this.editingIndex !== null) {
              this.inventory.splice(this.editingIndex, 1, { ...this.formData });
              this.$Message.success('Product updated!');
            } else {
              this.inventory.push({ ...this.formData });
              this.$Message.success('Product added!');
            }
            this.formSubmitting = false;
            this.modalVisible = false;
          }, 500);
        }
      });
    },
    deleteItem(index) {
      this.$Modal.confirm({
        title: 'Confirm Delete',
        content: 'Are you sure you want to delete this product?',
        onOk: () => {
          this.inventory.splice(index, 1);
          this.$Message.success('Product deleted');
        }
      });
    }
  }
}
</script>

<style scoped>
.inventory-crud {
  padding: 24px;
}
.ivu-card-head .ivu-btn {
  float: right;
  margin-top: -6px;
}
.thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}
</style>
