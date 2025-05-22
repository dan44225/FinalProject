<template>
  <div class="dashboard-wrapper">
    <h1 class="brand-header">The Beauty Shelf</h1>

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
  max-width: 900px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 40px 24px;
  background-color: #f8f1ec; /* soft nude beige */
  min-height: 100vh;
  font-family: 'Georgia', serif; /* classy serif font */
  color: #6b5b51; /* warm muted brown text */
}

.brand-header {
  text-align: center;
  font-size: 2.25rem;
  font-weight: 700;
  color: #a67c6d; /* dusty nude rose */
  margin-bottom: 28px;
  letter-spacing: 0.05em;
  font-family: 'Playfair Display', serif; /* elegant heading font */
  text-transform: uppercase;
}

.stat-card {
  flex: 1;
  text-align: center;
  padding: 24px 16px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(107, 91, 81, 0.15);
  background-color: #fff8f3; /* very pale nude */
  transition: box-shadow 0.3s ease;
  cursor: default;
}

.stat-card:hover {
  box-shadow: 0 8px 20px rgba(107, 91, 81, 0.3);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin-top: 12px;
  color: #8c705a;
  font-family: 'Georgia', serif;
}

/* Nude-themed card variations */
.stat-sales {
  background-color: #f2e6df; /* light warm beige */
  color: #ad8a72; /* soft brown */
}

.stat-quantity {
  background-color: #f7f0e8; /* pale cream */
  color: #bfa18a; /* muted taupe */
}

.stat-count {
  background-color: #f9f5f2; /* almost white nude */
  color: #9e8d7f; /* light warm gray */
}
</style>
