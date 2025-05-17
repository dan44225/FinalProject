<template>
  <div class="dashboard-wrapper">
    <Card title="Monthly Overview" class="dashboard-metrics">
      <Row :gutter="16">
        <Col span="8">
        <Card class="stat-card stat-sales" dis-hover>
          <h3>Total Sales</h3>
          <p class="stat-value">₱ {{ monthlyTotalSales.toLocaleString() }}</p>
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
        { title: 'Customer', key: 'customerName' },
        { title: 'Book Name', key: 'title' },
        // { title: 'Book ID', key: 'bookId' },
        { title: 'Quantity', key: 'quantity' },
        { title: 'Price', key: 'price' },
        {
          title: 'Total',
          render: (h, { row }) => h('span', row.quantity * row.price),
        },
        {
          title: 'Date',
          render: (h, { row }) => h('span', moment(row.created_at).format('MMM DD, YYYY')),
        },
      ],
    }
  },
  methods: {
    async fetchLatestTransactions() {
      const { data, error } = await supabase
        .from('transaction')
        .select(`*, book(title)`)
        .order('created_at', { ascending: false })
        .limit(5)

      if (!error) {
        this.latestTransactions = data.map(txn => ({
          ...txn,
          title: txn.book?.title || '',
        }));
      }
    },
    async fetchMonthlyStats() {
      const startOfMonth = moment().startOf('month').format('YYYY-MM-DD')
      const endOfMonth = moment().endOf('month').format('YYYY-MM-DD')

      const { data, error } = await supabase
        .from('transaction')
        .select('quantity, price')
        .gte('created_at', startOfMonth)
        .lte('created_at', endOfMonth)

      if (!error) {
        this.monthlyTotalSales = data.reduce((acc, curr) => acc + Number(curr.price) * Number(curr.quantity), 0)
        this.monthlyTotalQuantity = data.reduce((acc, curr) => acc + Number(curr.quantity), 0)
        this.monthlyTransactionCount = data.length
      }
    },
  },
  mounted() {
    this.fetchLatestTransactions()
    this.fetchMonthlyStats()
  },
}
</script>

<style scoped>
.stat-card {
  text-align: center;
  padding: 16px;
  border-radius: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin-top: 8px;
}

.stat-sales {
  background-color: #e6f7ff;
  color: #1890ff;
}

.stat-quantity {
  background-color: #f6ffed;
  color: #52c41a;
}

.stat-count {
  background-color: #fff1f0;
  color: #f5222d;
}
</style>
