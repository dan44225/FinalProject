<template>
  <div class="dashboard-wrapper">
    <h1 class="brand-header">✨ BeautyLine Inventory System ✨</h1>

    <Card title="Monthly Overview" class="dashboard-metrics">
      <Row :gutter="16">
        <Col span="8">
          <Card class="stat-card stat-sales" dis-hover>
            <h3>Total Sales</h3>
            <p class="stat-value">
              ₱ {{ monthlyTotalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            </p>
          </Card>
        </Col>
        <Col span="8">
          <Card class="stat-card stat-quantity" dis-hover>
            <h3>Total Quantity Sold</h3>
            <p class="stat-value">{{ monthlyTotalQuantity }}</p>
          </Card>
        </Col>
        <Col span="8">
          <Card class="stat-card stat-count" dis-hover>
            <h3>Transactions</h3>
            <p class="stat-value">{{ monthlyTransactionCount }}</p>
          </Card>
        </Col>
      </Row>
    </Card>

    <Card title="Latest Transactions" class="dashboard-latest">
      <Table :columns="transactionColumns" :data="latestTransactions" border />
    </Card>
  </div>
</template>

<script>
import { supabase } from '@/lib/supabase'
import moment from 'moment'

export default {
  name: 'Dashboard',
  data() {
    return {
      latestTransactions: [],
      monthlyTotalSales: 0,
      monthlyTotalQuantity: 0,
      monthlyTransactionCount: 0,
      transactionColumns: [
        { title: 'Customer', key: 'customer_name' },
        { title: 'Product Name', key: 'title' },   // use 'title' here
        { title: 'Quantity', key: 'quantity' },
        {
          title: 'Price (₱)',
          key: 'price',
          render: (h, { row }) =>
            h('span', Number(row.price).toLocaleString(undefined, { minimumFractionDigits: 2 }))
        },
        {
          title: 'Total (₱)',
          render: (h, { row }) =>
            h('span', (row.quantity * row.price).toLocaleString(undefined, { minimumFractionDigits: 2 }))
        },
        {
          title: 'Date',
          render: (h, { row }) =>
            h('span', moment(row.created_at).format('MMM DD, YYYY'))
        }
      ],
    }
  },
  computed: {
    monthStart() {
      return moment().startOf('month').toISOString()
    },
    monthEnd() {
      return moment().endOf('month').toISOString()
    }
  },
  methods: {
    async fetchLatestTransactions() {
      const { data, error } = await supabase
        .from('transactions')
        .select('*, products(title)')   // plural products as per supabase relationship
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) {
        this.$Message.error('Failed to load latest transactions')
        return
      }

      this.latestTransactions = data.map(txn => ({
        ...txn,
        title: txn.products?.title || '',   // map product title to 'title' for table key
      }))
    },

    async fetchMonthlyStats() {
      const { data, error } = await supabase
        .from('transactions')
        .select('quantity, price')
        .gte('created_at', this.monthStart)
        .lte('created_at', this.monthEnd)

      if (error) {
        this.$Message.error('Failed to load monthly stats')
        return
      }

      this.monthlyTransactionCount = data.length
      this.monthlyTotalQuantity = data.reduce((sum, { quantity }) => sum + Number(quantity), 0)
      this.monthlyTotalSales = data.reduce((sum, { price, quantity }) => sum + Number(price) * Number(quantity), 0)
    }
  },
  mounted() {
    this.fetchLatestTransactions()
    this.fetchMonthlyStats()
  }
}
</script>

<style scoped>
.dashboard-wrapper {
  max-width: 1000px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px 16px;
  background-color: #fff0f6; /* soft pink background */
  min-height: 100vh;
}

.brand-header {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  color: #d63384;
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin-top: 8px;
}

/* Theme-adjusted colors */
.stat-sales {
  background-color: #ffe6f0;
  color: #e83e8c;
}

.stat-quantity {
  background-color: #fff5e6;
  color: #d48806;
}

.stat-count {
  background-color: #f9f0ff;
  color: #9254de;
}
</style>
