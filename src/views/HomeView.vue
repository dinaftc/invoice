<template>
  <div class="home container">
    <div class="header flex">
      <div class="left flex flex-column">
<h1>Invoices</h1>
<span>There are {{invoiceStore.invoiceData.length}} invoices</span>
      </div>
      <div class="right flex ">
        <div class="filter flex" ref="filter" @click="toggleFilterMenu">
          <span>Filter by status <span v-if="filteredInvoice !== null">: {{filteredInvoice}}</span></span>
          <img src="@/assets/icon-arrow-down.svg" alt="">
          <ul class="filter-menu" v-show="filterMenu">
            <li @click="filteredInvoices('Draft')">Draft</li>
            <li @click="filteredInvoices('Pending')">Pending</li>
            <li @click="filteredInvoices('Paid')">Paid</li>
            <li @click="filteredInvoices('Clear')">Clear</li>
          </ul>
        </div>
    <div class="button flex" @click="menuInvoice">
<div class="inner-button flex">
  <img src="@/assets/icon-plus.svg" alt="">
</div>
<span>New Invoice</span>
    </div> </div>
    </div>
    <div v-if="invoiceStore.invoiceData.length > 0">
      <Invoice v-for="(invoice,index) in  invoiceStore.invoiceData" :key="index" :invoice="invoice"/>
    </div>
    <div class="empty flex flex-column" v-if="invoiceStore.invoiceData.length===0">
      <img src="@/assets/illustration-empty.svg" alt="">
      <h3>nothing here</h3>
      <p>Create a new Invoice by clicking add new invoice button</p>
    </div>
  </div>
 
</template>

<script setup>
import { ref,watch } from 'vue';
import { useInvoiceStore } from '../stores/counter';
import Invoice from '../components/Invoice.vue';
const invoiceStore = useInvoiceStore();
const filteredInvoice = ref(null);
const filterMenu = ref(false);

const getFilteredInvoices = (field) => {
  let filteredInvoices = [];
  if (field === 'Draft') {
    filteredInvoices = invoiceStore.invoiceData.filter(invoice => invoice.invoiceDraft === true && !invoice.invoicePending && !invoice.invoicePaid);
  } else if (field === 'Pending') {
    filteredInvoices = invoiceStore.invoiceData.filter(invoice => invoice.invoicePending === true && !invoice.invoiceDraft && !invoice.invoicePaid);
  } else if (field === 'Paid') {
    filteredInvoices = invoiceStore.invoiceData.filter(invoice => invoice.invoicePaid === true && !invoice.invoiceDraft && !invoice.invoicePending);
  } else {
    filteredInvoices = [...invoiceStore.invoiceData];
  }

  invoiceStore.invoiceData = filteredInvoices; // Update the data with the filtered result
};

const filteredInvoices = (field) => {
  if (field === 'Clear') {
    filteredInvoice.value = null;
  } else {
    filteredInvoice.value = field;
  }
  getFilteredInvoices(field);
};
watch(filteredInvoice, (newFilteredInvoice) => {
  // The watch function now triggers when filteredInvoice changes
  getFilteredInvoices(newFilteredInvoice);
});

const menuInvoice = () => {
  invoiceStore.TOGGLE_INVOICE();
};

const toggleFilterMenu = () => {
  filterMenu.value = !filterMenu.value;
};
</script>
<style lang="scss" scoped>
.home {
  color: #fff;

  .header {
    margin-bottom: 65px;

    .left,
    .right {
      flex: 1;
    }

    .right {
      justify-content: flex-end;
      align-items: center;

      .button,
      .filter {
        align-items: center;

        span {
          font-size: 12px;
        }
      }

      .filter {
        position: relative;
        margin-right: 40px;
        cursor: pointer;

        img {
          margin-left: 12px;
          width: 9px;
          height: 5px;
        }

        .filter-menu {
          width: 120px;
          position: absolute;
          top: 25px;
          list-style: none;
          background-color: #1e2139;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

          li {
            cursor: pointer;
            font-size: 12px;
            padding: 10px 20px;

            &:hover {
              color: #1e2139;
              background-color: #fff;
            }
          }
        }
      }

      .button {
        padding: 8px 10px;
        background-color: #7c5dfa;
        border-radius: 40px;

        .inner-button {
          margin-right: 8px;
          border-radius: 50%;
          padding: 8px;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          img {
            width: 10px;
            height: 10px;
          }
        }
      }
    }
  }

  .empty {
    margin-top: 160px;
    align-items: center;

    img {
      width: 214px;
      height: 200px;
    }

    h3 {
      font-size: 20px;
      margin-top: 40px;
    }

    p {
      text-align: center;
      max-width: 224px;
      font-size: 12px;
      font-weight: 300;
      margin-top: 16px;
    }
  }
}
</style>